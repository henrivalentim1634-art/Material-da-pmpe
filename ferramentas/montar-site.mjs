// Monta a pasta site/ (e site-netlify.zip) pronta para arrastar no Netlify Drop:
//   site/index.html (vendas) · obrigado · termos · privacidade · img/ · acesso/index.html (simulado)
// Uso: node montar-site.mjs
import { cpSync, mkdirSync, rmSync, writeFileSync, readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(RAIZ, 'site');
const PROD = join(RAIZ, 'produto', 'minissimulado-portugues-pmpe.html');
if (!existsSync(PROD)) throw new Error('Rode antes: node build.mjs');

rmSync(SITE, { recursive: true, force: true });
cpSync(join(RAIZ, 'vendas'), SITE, { recursive: true });
mkdirSync(join(SITE, 'acesso'), { recursive: true });
cpSync(PROD, join(SITE, 'acesso', 'index.html'));
writeFileSync(join(SITE, 'robots.txt'), 'User-agent: *\nDisallow: /acesso/\nDisallow: /obrigado.html\n');
writeFileSync(join(SITE, '_headers'), [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '/acesso/*',
  '  X-Robots-Tag: noindex, nofollow, noarchive',
  '  Cache-Control: no-cache',
  '  Referrer-Policy: no-referrer',
  ''
].join('\n'));

// ---------- zip simples (sem dependências) ----------
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function listar(d) { return readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? listar(p) : [p]; }); }
const locais = [], central = []; let off = 0;
for (const arq of listar(SITE)) {
  const nome = Buffer.from('site/' + relative(SITE, arq).split('\\').join('/'), 'utf8');
  const dados = readFileSync(arq), comp = deflateRawSync(dados, { level: 9 }), crc = crc32(dados);
  const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
  h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(dados.length, 22); h.writeUInt16LE(nome.length, 26);
  locais.push(h, nome, comp);
  const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
  c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(dados.length, 24); c.writeUInt16LE(nome.length, 28); c.writeUInt32LE(off, 42);
  central.push(c, nome);
  off += 30 + nome.length + comp.length;
}
const cd = Buffer.concat(central), fim = Buffer.alloc(22);
fim.writeUInt32LE(0x06054b50, 0); fim.writeUInt16LE(central.length / 2, 8); fim.writeUInt16LE(central.length / 2, 10); fim.writeUInt32LE(cd.length, 12); fim.writeUInt32LE(off, 16);
writeFileSync(join(RAIZ, 'site-netlify.zip'), Buffer.concat([...locais, cd, fim]));

const html = readFileSync(join(SITE, 'index.html'), 'utf8');
if (/SEU-CODIGO-AQUI/.test(html)) console.log('ATENÇÃO: troque CHECKOUT_URL em vendas/index.html pelo link do seu checkout Kiwify.');
if (/\[SEU-EMAIL-DE-SUPORTE\]/.test(html)) console.log('ATENÇÃO: preencha nome, CPF/CNPJ e e-mail de suporte no rodapé das páginas.');
console.log(`OK: pasta ${SITE} e arquivo site-netlify.zip (${central.length / 2} arquivos). Arraste a pasta site/ no Netlify Drop.`);
