// Monta o produto final: produto/minissimulado-portugues-pmpe.html
// - criptografa o conteúdo (questões, gabarito e comentários) com uma chave de conteúdo aleatória;
// - "embrulha" essa chave para cada licença válida (privado/licencas.csv), exceto as revogadas;
// - embute fontes, logo, CSS e JS (minificado) em um único arquivo que abre offline.
// Uso: node build.mjs
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { minify } from 'terser';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...a) => join(RAIZ, ...a);
const PROD = 'RFPT1', ITER = 15000; // deve ser igual ao ITER de src/app.js
const sha = (b) => createHash('sha256').update(b).digest();

function normKey(s) {
  s = String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length === 14 && s.startsWith('RF')) s = s.slice(2);
  return s.replace(/O/g, '0').replace(/[IL]/g, '1');
}
function esticar(k) { let h = sha(`${PROD}|kdf|${k}`); for (let i = 0; i < ITER; i++) h = sha(h); return h; }
const derivar = (s, rot) => sha(Buffer.concat([Buffer.from(rot, 'utf8'), s]));
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

// ---------- conteúdo ----------
const { CONTEUDO } = await import(pathToFileURL(P('privado', 'conteudo', 'index.mjs')).href);
const Q = CONTEUDO.questoes;
const cont = { A: 0, B: 0, C: 0, D: 0, E: 0 };
Q.forEach((q, i) => {
  if (q.n !== i + 1) throw new Error('Numeração fora de ordem na questão ' + q.n);
  if (q.alts.length !== 5) throw new Error('Questão ' + q.n + ' sem 5 alternativas');
  cont[q.resp]++;
});
if (Q.length !== 40) throw new Error('O simulado precisa ter 40 questões (tem ' + Q.length + ')');

// ---------- licenças ----------
const csv = readFileSync(P('privado', 'licencas.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
const revog = existsSync(P('privado', 'revogadas.txt'))
  ? new Set(readFileSync(P('privado', 'revogadas.txt'), 'utf8').split(/\r?\n/).map((l) => normKey(l.split('#')[0])).filter(Boolean))
  : new Set();
const ck = randomBytes(32), nonce = randomBytes(16);
const entradas = [];
let ativas = 0, revogadas = 0;
for (const linha of csv) {
  const [num, chave, status] = linha.split(';');
  const k = normKey(chave);
  if (k.length !== 12) continue;
  if (revog.has(k) || /REVOGADA/i.test(status || '')) { revogadas++; continue; }
  const s = esticar(k);
  const id = derivar(s, `${PROD}|id|`).toString('hex').slice(0, 16);
  const wk = derivar(s, `${PROD}|wrap|`), wr = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) wr[i] = ck[i] ^ wk[i];
  entradas.push(`${id}:${parseInt(num, 10)}:${wr.toString('hex')}`);
  ativas++;
}
for (let i = entradas.length - 1; i > 0; i--) { const j = randomBytes(4).readUInt32BE(0) % (i + 1); [entradas[i], entradas[j]] = [entradas[j], entradas[i]]; }

// ---------- criptografia do conteúdo ----------
const claro = Buffer.from('RFOK' + JSON.stringify(CONTEUDO), 'utf8');
const payload = nonce.toString('base64') + '.' + fluxo(ck, nonce, claro).toString('base64');

// ---------- montagem ----------
const app = readFileSync(P('src', 'app.js'), 'utf8');
if (!new RegExp(`ITER = ${ITER}\\b`).test(app)) throw new Error('ITER diferente entre build.mjs e src/app.js');
const min = await minify(app, { compress: { passes: 2 }, mangle: { toplevel: true }, format: { comments: false } });
if (!min.code) throw new Error('Falha ao minificar o app.js');
const logo = 'data:image/png;base64,' + readFileSync(P('src', 'marca', 'logo.png')).toString('base64');
let html = readFileSync(P('src', 'minissimulado.template.html'), 'utf8');
html = substituir(html, '/*__FONTES__*/', readFileSync(P('src', 'marca', 'fontes.css'), 'utf8').trim());
html = substituir(html, '/*__ESTILO__*/', readFileSync(P('src', 'estilo.css'), 'utf8').trim());
html = substituir(html, '/*__APP__*/', min.code);
html = substituir(html, '__LOGO__', logo);
html = substituir(html, '__PAYLOAD__', payload);
html = substituir(html, '__LICENCAS__', entradas.join('|'));
if (/<\/script/i.test(min.code)) throw new Error('O JS contém "</script", o que quebraria o HTML');

mkdirSync(P('produto'), { recursive: true });
const saida = P('produto', 'minissimulado-portugues-pmpe.html');
writeFileSync(saida, html, 'utf8');
console.log('Gabarito por letra:', cont);
console.log(`Licenças ativas: ${ativas} · revogadas: ${revogadas}`);
console.log(`OK: ${saida} (${(html.length / 1024).toFixed(0)} KB)`);
