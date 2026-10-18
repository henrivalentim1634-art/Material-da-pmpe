// Gera chaves de licença novas e acrescenta no CSV do produto (ver ferramentas/produtos.mjs).
// Uso:  node gerar-chaves.mjs 500            (Português: privado/licencas.csv, chaves RF-)
//       node gerar-chaves.mjs 500 rlm        (RLM: privado/licencas-rlm.csv, chaves RL-)
//       node gerar-chaves.mjs 500 dc         (Direito Constitucional: privado/licencas-dc.csv, chaves RC-)
//       node gerar-chaves.mjs 500 lee        (Legislação Extravagante: privado/licencas-lee.csv, chaves RE-)
// A licença nº 0000 é a CHAVE DO AUTOR, para testes. Nunca a envie para clientes.
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { produto } from './produtos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRODUTO = produto(process.argv[3] || 'portugues');
const ARQ = join(RAIZ, PRODUTO.licencas);
const ALFA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // base32 de Crockford: sem I, L, O, U (evita confusão ao digitar)
const CAB = 'numero;chave;status;email_comprador;nome_comprador;data_envio;observacao';

function novaChave() {
  const b = randomBytes(8); // 64 bits; usamos 60 (12 caracteres de 5 bits)
  let n = b.readBigUInt64BE(0), s = '';
  for (let i = 0; i < 12; i++) { s += ALFA[Number(n & 31n)]; n >>= 5n; }
  return `${PRODUTO.prefixo}-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

const qtd = Math.max(1, parseInt(process.argv[2] || '1000', 10));
mkdirSync(dirname(ARQ), { recursive: true });
let linhas = existsSync(ARQ) ? readFileSync(ARQ, 'utf8').trim().split(/\r?\n/) : [CAB];
if (linhas[0] !== CAB) linhas.unshift(CAB);
const usadas = new Set(linhas.slice(1).map((l) => l.split(';')[1]));
let ultimo = linhas.length > 1 ? Math.max(...linhas.slice(1).map((l) => parseInt(l.split(';')[0], 10))) : -1;

if (ultimo < 0) {
  let k; do { k = novaChave(); } while (usadas.has(k));
  usadas.add(k); ultimo = 0;
  linhas.push(`0000;${k};AUTOR;;;;Chave do autor para testes - NAO ENVIAR`);
}
for (let i = 0; i < qtd; i++) {
  let k; do { k = novaChave(); } while (usadas.has(k));
  usadas.add(k); ultimo++;
  linhas.push(`${String(ultimo).padStart(4, '0')};${k};LIVRE;;;;`);
}
writeFileSync(ARQ, linhas.join('\n') + '\n', 'utf8');
console.log(`OK: ${qtd} chaves novas. Total de licenças: ${linhas.length - 1}. Arquivo: ${ARQ}`);
console.log(`Lembre-se de rodar "node build.mjs ${PRODUTO.id}" para que as chaves novas passem a funcionar no HTML.`);
