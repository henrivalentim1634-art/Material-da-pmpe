// Monta a pasta site/ (e site-netlify.zip) pronta para arrastar no Netlify Drop:
//   site/index.html (vitrine com os produtos)
//   site/<produto>/ (página de vendas, obrigado, termos, privacidade, img/)
//   site/<produto>/acesso/index.html (o simulado criptografado)
// Uso: node montar-site.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { PRODUTOS } from './produtos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(RAIZ, 'site');
rmSync(SITE, { recursive: true, force: true });
mkdirSync(SITE, { recursive: true });
cpSync(join(RAIZ, 'vitrine', 'index.html'), join(SITE, 'index.html'));
const avisos = [], robots = ['User-agent: *'], headers = ['/*', '  X-Content-Type-Options: nosniff', '  Referrer-Policy: strict-origin-when-cross-origin'];
for (const p of Object.values(PRODUTOS)) {
  const prod = join(RAIZ, p.saida), vendas = join(RAIZ, p.vendas);
  if (!existsSync(prod) || !existsSync(vendas)) { avisos.push(`produto "${p.id}" ignorado (rode node build.mjs ${p.id})`); continue; }
  const dest = join(SITE, p.pasta);
  cpSync(vendas, dest, { recursive: true });
  mkdirSync(join(dest, 'acesso'), { recursive: true });
  cpSync(prod, join(dest, 'acesso', 'index.html'));
  robots.push(`Disallow: /${p.pasta}/acesso/`, `Disallow: /${p.pasta}/obrigado.html`);
  headers.push(`/${p.pasta}/acesso/*`, '  X-Robots-Tag: noindex, nofollow, noarchive', '  Cache-Control: no-cache', '  Referrer-Policy: no-referrer');
  const html = readFileSync(join(dest, 'index.html'), 'utf8');
  if (/SEU-CODIGO-AQUI/.test(html)) avisos.push(`troque CHECKOUT_URL em ${p.vendas}/index.html pelo link do checkout Kiwify`);
  if (/\[SEU-EMAIL-DE-SUPORTE\]/.test(html)) avisos.push(`preencha nome, CPF/CNPJ e e-mail de suporte nas páginas de ${p.vendas}/`);
}
writeFileSync(join(SITE, 'robots.txt'), robots.join('\n') + '\n');
writeFileSync(join(SITE, '_headers'), headers.join('\n') + '\n');

// ---------- zip simples (sem dependências) ----------
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function listar(d) { return readdirSync(d).flatMap((f) => { const q = join(d, f); return statSync(q).isDirectory() ? listar(q) : [q]; }); }
const locais = [], central = []; let off = 0, n = 0;
for (const arq of listar(SITE)) {
  const nome = Buffer.from('site/' + relative(SITE, arq).split('\\').join('/'), 'utf8');
  const dados = readFileSync(arq), comp = deflateRawSync(dados, { level: 9 }), crc = crc32(dados);
  const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
  h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(dados.length, 22); h.writeUInt16LE(nome.length, 26);
  locais.push(h, nome, comp);
  const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
  c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(dados.length, 24); c.writeUInt16LE(nome.length, 28); c.writeUInt32LE(off, 42);
  central.push(c, nome);
  off += 30 + nome.length + comp.length; n++;
}
const cd = Buffer.concat(central), fim = Buffer.alloc(22);
fim.writeUInt32LE(0x06054b50, 0); fim.writeUInt16LE(n, 8); fim.writeUInt16LE(n, 10); fim.writeUInt32LE(cd.length, 12); fim.writeUInt32LE(off, 16);
writeFileSync(join(RAIZ, 'site-netlify.zip'), Buffer.concat([...locais, cd, fim]));
for (const a of [...new Set(avisos)]) console.log('ATENÇÃO: ' + a);
console.log(`OK: pasta ${SITE} e arquivo site-netlify.zip (${n} arquivos). Arraste a pasta site/ no Netlify Drop.`);
