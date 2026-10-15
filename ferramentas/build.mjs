// Monta os produtos finais (produto/*.html) a partir de ferramentas/produtos.mjs:
// - renderiza as fórmulas LaTeX com KaTeX (produtos com katex: true), sem depender de internet no aparelho;
// - criptografa o conteúdo (questões, gabarito e comentários) com uma chave de conteúdo aleatória;
// - "embrulha" essa chave para cada licença válida (privado/licencas*.csv), exceto as revogadas;
// - embute fontes, logo, CSS e JS (minificado) em um único arquivo que abre offline.
// Uso: node build.mjs            (todos os produtos)
//      node build.mjs rlm        (só um produto: portugues | rlm)
import { createHash, randomBytes } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { minify } from 'terser';
import katex from 'katex';
import { PRODUTOS, produto } from './produtos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...a) => join(RAIZ, ...a);
const ITER = 15000; // deve ser igual ao ITER de src/app.js
const sha = (b) => createHash('sha256').update(b).digest();

function normKey(s) {
  s = String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length === 14 && /^[A-Z]{2}/.test(s)) s = s.slice(2);
  return s.replace(/O/g, '0').replace(/[IL]/g, '1');
}
function fluxo(ck, nonce, data) {
  const out = Buffer.alloc(data.length), inb = Buffer.alloc(32 + nonce.length + 4);
  ck.copy(inb, 0); nonce.copy(inb, 32);
  for (let i = 0, blk = 0; i < data.length; i += 32, blk++) {
    inb.writeUInt32BE(blk, 32 + nonce.length);
    const ks = sha(inb);
    for (let j = 0; j < 32 && i + j < data.length; j++) out[i + j] = data[i + j] ^ ks[j];
  }
  return out;
}
function substituir(txt, marca, valor) {
  if (!txt.includes(marca)) throw new Error('Marcador ausente no template: ' + marca);
  return txt.split(marca).join(valor);
}

// ---------- KaTeX: \( ... \) e \[ ... \] → HTML pronto ----------
function renderTex(str, onde) {
  return str
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => renderUm(t, true, onde))
    // a pontuação logo após a fórmula entra no último bloco dela: não cai sozinha na linha de baixo
    // e a fórmula continua podendo quebrar nos operadores
    .replace(/\\\(([\s\S]+?)\\\)([.,;:!?)\]”]+)?/g, (_, t, pont) => {
      const h = renderUm(t, false, onde), fim = '</span></span></span>';
      if (!pont) return h;
      if (!h.endsWith(fim)) return h + pont;
      return h.slice(0, -fim.length) + `<span class="kpt">${pont}</span>` + fim;
    });
}
function renderUm(t, display, onde) {
  // til da negação (~p) como símbolo comum, sem o espaçamento de relação que o \sim tem no TeX
  t = t.replace(/\\sim(?![a-zA-Z])/g, '{\\sim}');
  try {
    return katex.renderToString(t, { displayMode: display, throwOnError: true, output: 'htmlAndMathml', strict: 'ignore', trust: false });
  } catch (e) {
    throw new Error(`LaTeX inválido em ${onde}: ${t}\n  ${e.message}`);
  }
}
function percorrer(obj, onde, fn) {
  if (typeof obj === 'string') return fn(obj, onde);
  if (Array.isArray(obj)) return obj.map((v, i) => percorrer(v, `${onde}[${i}]`, fn));
  if (obj && typeof obj === 'object') { const o = {}; for (const k of Object.keys(obj)) o[k] = percorrer(obj[k], `${onde}.${k}`, fn); return o; }
  return obj;
}
function katexCss() {
  const dir = P('ferramentas', 'node_modules', 'katex', 'dist');
  let css = readFileSync(join(dir, 'katex.min.css'), 'utf8');
  const usadas = ['AMS-Regular', 'Main-Bold', 'Main-Italic', 'Main-Regular', 'Math-Italic', 'Math-BoldItalic', 'Main-BoldItalic', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular', 'Size4-Regular'];
  css = css.replace(/@font-face\{font-family:(KaTeX_[A-Za-z]+);src:url\(fonts\/(KaTeX_[A-Za-z0-9-]+)\.woff2\)[^}]*?;(font-style:[a-z]+;font-weight:[0-9a-z]+)\}/g, (m, fam, arq, resto) => {
    const nome = arq.replace('KaTeX_', '');
    if (!usadas.includes(nome)) return '';
    const b64 = readFileSync(join(dir, 'fonts', arq + '.woff2')).toString('base64');
    return `@font-face{font-family:${fam};src:url(data:font/woff2;base64,${b64}) format("woff2");${resto};font-display:swap}`;
  });
  if (/url\(fonts\//.test(css)) css = css.replace(/@font-face\{[^}]*url\(fonts\/[^}]*\}/g, '');
  return css;
}

function validar(C, id) {
  const Q = C.questoes, cont = { A: 0, B: 0, C: 0, D: 0, E: 0 }, erros = [];
  if (Q.length !== 40) erros.push(`O simulado precisa ter 40 questões (tem ${Q.length})`);
  let seq = '';
  Q.forEach((q, i) => {
    if (q.n !== i + 1) erros.push('Numeração fora de ordem na questão ' + q.n);
    if (!q.alts || q.alts.length !== 5) erros.push('Questão ' + q.n + ' sem 5 alternativas');
    if (!'ABCDE'.includes(q.resp)) erros.push('Questão ' + q.n + ' com gabarito inválido');
    if (!C.areas[q.area]) erros.push('Questão ' + q.n + ' com área desconhecida: ' + q.area);
    if (q.img && !C.ilustracoes[q.img]) erros.push('Questão ' + q.n + ' cita figura inexistente: ' + q.img);
    for (const L of 'ABCDE') if (!q.coment || !q.coment[L]) erros.push(`Questão ${q.n} sem comentário da alternativa ${L}`);
    cont[q.resp]++; seq += q.resp;
  });
  let run = 1, maxRun = 1; for (let i = 1; i < seq.length; i++) { run = seq[i] === seq[i - 1] ? run + 1 : 1; maxRun = Math.max(maxRun, run); }
  if (erros.length) throw new Error(`[${id}] ` + erros.join(' | '));
  return { cont, maxRun };
}

async function construir(id) {
  const cfg = produto(id);
  const { CONTEUDO } = await import(pathToFileURL(P(cfg.conteudo)).href);
  const { cont, maxRun } = validar(CONTEUDO, id);
  const conteudo = cfg.katex ? percorrer(CONTEUDO, id, renderTex) : CONTEUDO;

  // licenças
  const csv = readFileSync(P(cfg.licencas), 'utf8').trim().split(/\r?\n/).slice(1);
  const revog = existsSync(P(cfg.revogadas))
    ? new Set(readFileSync(P(cfg.revogadas), 'utf8').split(/\r?\n/).map((l) => normKey(l.split('#')[0])).filter(Boolean))
    : new Set();
  const ck = randomBytes(32), nonce = randomBytes(16), entradas = [];
  let ativas = 0, revogadas = 0;
  const esticar = (k) => { let h = sha(`${cfg.prod}|kdf|${k}`); for (let i = 0; i < ITER; i++) h = sha(h); return h; };
  const derivar = (s, rot) => sha(Buffer.concat([Buffer.from(rot, 'utf8'), s]));
  for (const linha of csv) {
    const [num, chave, status] = linha.split(';');
    const k = normKey(chave);
    if (k.length !== 12) continue;
    if (revog.has(k) || /REVOGADA/i.test(status || '')) { revogadas++; continue; }
    const s = esticar(k);
    const lid = derivar(s, `${cfg.prod}|id|`).toString('hex').slice(0, 16);
    const wk = derivar(s, `${cfg.prod}|wrap|`), wr = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) wr[i] = ck[i] ^ wk[i];
    entradas.push(`${lid}:${parseInt(num, 10)}:${wr.toString('hex')}`);
    ativas++;
  }
  for (let i = entradas.length - 1; i > 0; i--) { const j = randomBytes(4).readUInt32BE(0) % (i + 1); [entradas[i], entradas[j]] = [entradas[j], entradas[i]]; }

  // criptografia do conteúdo
  const claro = Buffer.from('RFOK' + JSON.stringify(conteudo), 'utf8');
  const comprimido = deflateRawSync(claro, { level: 9 });
  const payload = nonce.toString('base64') + '.' + fluxo(ck, nonce, comprimido).toString('base64') + '.' + claro.length;

  // montagem
  const tiny = readFileSync(P('ferramentas', 'node_modules', 'tiny-inflate', 'index.js'), 'utf8').replace('module.exports = tinf_uncompress;', 'return tinf_uncompress;');
  const app = substituir(readFileSync(P('src', 'app.js'), 'utf8'), '/*__INFLATE__*/', `INFLATE = (function () {\n${tiny}\n})();`);
  if (!new RegExp(`ITER = ${ITER}\\b`).test(app)) throw new Error('ITER diferente entre build.mjs e src/app.js');
  const min = await minify(app, { compress: { passes: 2 }, mangle: { toplevel: true }, format: { comments: false } });
  if (!min.code) throw new Error('Falha ao minificar o app.js');
  if (/<\/script/i.test(min.code)) throw new Error('O JS contém "</script", o que quebraria o HTML');
  const logo = 'data:image/png;base64,' + readFileSync(P('src', 'marca', 'logo.png')).toString('base64');
  let extraCss = '';
  if (cfg.banner) {
    const b64 = readFileSync(P(cfg.banner)).toString('base64');
    extraCss = `.hero::before{content:"";display:block;aspect-ratio:2000/1115;margin:-10px -6px 16px;border-radius:12px;border:1px solid rgba(63,239,255,.25);` +
      `background:url(data:image/jpeg;base64,${b64}) center/cover no-repeat;box-shadow:0 18px 40px -18px #000}`;
  }
  const navExtra = cfg.navExtra.map(([a, t, s]) => `<a href="#${a}" data-act="ir">${t} <small>${s}</small></a>`).join('\n    ');
  const pub = { prod: cfg.prod, storage: cfg.storage, chaveEx: `${cfg.prefixo}-XXXX-XXXX-XXXX` };
  let html = readFileSync(P('src', 'minissimulado.template.html'), 'utf8');
  html = substituir(html, '/*__FONTES__*/', readFileSync(P('src', 'marca', 'fontes.css'), 'utf8').trim());
  html = substituir(html, '/*__ESTILO__*/', readFileSync(P('src', 'estilo.css'), 'utf8').trim());
  html = substituir(html, '/*__KATEX__*/', cfg.katex ? katexCss() : '');
  html = substituir(html, '/*__EXTRA_CSS__*/', extraCss);
  html = substituir(html, '/*__APP__*/', min.code);
  html = substituir(html, '__TITULO__', cfg.titulo);
  html = substituir(html, '__NOJS_TITULO__', cfg.nojs);
  html = substituir(html, '__GATE_TITULO__', cfg.gate);
  html = substituir(html, '__GATE_SUB__', cfg.gateSub);
  html = substituir(html, '__CHAVE_EX__', pub.chaveEx);
  html = substituir(html, '__MARCA__', cfg.marca);
  html = substituir(html, '__NAV_EXTRA__', navExtra);
  html = substituir(html, '__CFG__', JSON.stringify(pub));
  html = substituir(html, '__LOGO__', logo);
  html = substituir(html, '__PAYLOAD__', payload);
  html = substituir(html, '__LICENCAS__', entradas.join('|'));

  mkdirSync(dirname(P(cfg.saida)), { recursive: true });
  writeFileSync(P(cfg.saida), html, 'utf8');
  console.log(`[${id}] gabarito por letra: ${JSON.stringify(cont)} · maior sequência repetida: ${maxRun}`);
  console.log(`[${id}] licenças ativas: ${ativas} · revogadas: ${revogadas}`);
  console.log(`[${id}] conteúdo: ${(claro.length / 1024).toFixed(0)} KB → comprimido ${(comprimido.length / 1024).toFixed(0)} KB`);
  console.log(`[${id}] OK: ${cfg.saida} (${(html.length / 1024).toFixed(0)} KB)`);
}

const alvo = process.argv[2];
const ids = alvo ? [alvo] : Object.keys(PRODUTOS).filter((id) => existsSync(P(PRODUTOS[id].conteudo)));
for (const id of ids) await construir(id);
