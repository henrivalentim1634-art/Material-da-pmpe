/* Minissimulados PMPE — Raiz de Física
   Motor do material: acesso por chave, conteúdo criptografado, marca d'água, simulado interativo e diagnóstico.
   O conteúdo (questões, gabarito e comentários) só existe criptografado neste arquivo; ele é aberto
   apenas com uma chave de licença válida. */
(function () {
'use strict';
var DOC = document, HTML = DOC.documentElement, WIN = window;
HTML.className += ' js';

/* ============================ utilitários ============================ */
function $(s, r) { return (r || DOC).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || DOC).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function pct(x) { return Math.round(x * 100) + '%'; }
function lsGet(k) { try { return WIN.localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { WIN.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function lsDel(k) { try { WIN.localStorage.removeItem(k); } catch (e) { } }
function fmtTempo(ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h + ':' + pad(m) + ':' + pad(s % 60); }
function fmtMin(ms) { var m = Math.round(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + pad(m % 60) + ' min'; }
function dataBR(t) { var d = new Date(t); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
var toastT = null;
function toast(msg) { var t = $('#toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2800); }

/* ============================ SHA-256 (puro, sem dependências) ============================ */
var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
var W256 = new Uint32Array(64);
function sha256(m) {
  var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  var l = m.length, n = ((l + 9 + 63) >> 6) << 6, b = new Uint8Array(n), W = W256, i, j;
  b.set(m); b[l] = 0x80;
  var bits = l * 8, hi = Math.floor(bits / 4294967296), lo = bits >>> 0;
  b[n - 8] = hi >>> 24; b[n - 7] = (hi >>> 16) & 255; b[n - 6] = (hi >>> 8) & 255; b[n - 5] = hi & 255;
  b[n - 4] = lo >>> 24; b[n - 3] = (lo >>> 16) & 255; b[n - 2] = (lo >>> 8) & 255; b[n - 1] = lo & 255;
  for (i = 0; i < n; i += 64) {
    for (j = 0; j < 16; j++) W[j] = (b[i + 4 * j] << 24) | (b[i + 4 * j + 1] << 16) | (b[i + 4 * j + 2] << 8) | b[i + 4 * j + 3];
    for (j = 16; j < 64; j++) {
      var x = W[j - 15], y = W[j - 2];
      var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
      var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
      W[j] = (W[j - 16] + s0 + W[j - 7] + s1) | 0;
    }
    var a = H[0], c1 = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (j = 0; j < 64; j++) {
      var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      var t1 = (h + S1 + ((e & f) ^ (~e & g)) + K256[j] + W[j]) | 0;
      var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      var t2 = (S0 + ((a & c1) ^ (a & c) ^ (c1 & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = c1; c1 = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + c1) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  var out = new Uint8Array(32);
  for (i = 0; i < 8; i++) { out[4 * i] = H[i] >>> 24; out[4 * i + 1] = (H[i] >>> 16) & 255; out[4 * i + 2] = (H[i] >>> 8) & 255; out[4 * i + 3] = H[i] & 255; }
  return out;
}
function utf8(s) {
  if (WIN.TextEncoder) return new TextEncoder().encode(s);
  var b = unescape(encodeURIComponent(s)), u = new Uint8Array(b.length);
  for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return u;
}
function deutf8(u) {
  if (WIN.TextDecoder) return new TextDecoder('utf-8').decode(u);
  var s = '', CH = 8192;
  for (var i = 0; i < u.length; i += CH) s += String.fromCharCode.apply(null, u.subarray(i, i + CH));
  return decodeURIComponent(escape(s));
}
function hex(u) { var s = ''; for (var i = 0; i < u.length; i++) s += (u[i] < 16 ? '0' : '') + u[i].toString(16); return s; }
function unhex(h) { var u = new Uint8Array(h.length / 2); for (var i = 0; i < u.length; i++) u[i] = parseInt(h.substr(i * 2, 2), 16); return u; }
function unb64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
function fluxo(ck, nonce, ct) {
  var out = new Uint8Array(ct.length), inb = new Uint8Array(32 + nonce.length + 4), p = 32 + nonce.length;
  inb.set(ck, 0); inb.set(nonce, 32);
  for (var i = 0, blk = 0; i < ct.length; i += 32, blk++) {
    inb[p] = blk >>> 24; inb[p + 1] = (blk >>> 16) & 255; inb[p + 2] = (blk >>> 8) & 255; inb[p + 3] = blk & 255;
    var ks = sha256(inb);
    for (var j = 0; j < 32 && i + j < ct.length; j++) out[i + j] = ct[i + j] ^ ks[j];
  }
  return out;
}

/* ============================ descompressão (tiny-inflate, MIT, embutida pelo build) ============================ */
var INFLATE = null;
/*__INFLATE__*/

/* ============================ licenças ============================ */
var CFG = {};
try { CFG = JSON.parse(($('#cfg') || {}).textContent || '{}'); } catch (e) { CFG = {}; }
var PROD = CFG.prod || 'RFPT1', ITER = 15000;   /* alongamento da chave: encarece ataques de força bruta (igual ao build.mjs) */
var SK = CFG.storage || 'rf_pt_pmpe';           /* prefixo do armazenamento local, um por produto */
var LIC = {};
(function () {
  var raw = ($('#lic') || {}).textContent || '';
  raw.trim().split('|').forEach(function (e) { var p = e.split(':'); if (p.length === 3) LIC[p[0]] = [parseInt(p[1], 10), p[2]]; });
})();
function normKey(s) {
  s = String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length === 14 && /^[A-Z]{2}/.test(s)) s = s.slice(2);
  return s.replace(/O/g, '0').replace(/[IL]/g, '1');
}
function esticar(k) {
  var h = sha256(utf8(PROD + '|kdf|' + k));
  for (var i = 0; i < ITER; i++) h = sha256(h);
  return h;
}
function derivar(s, rot) { var r = utf8(rot), u = new Uint8Array(r.length + 32); u.set(r); u.set(s, r.length); return sha256(u); }
function abrir(k) {
  if (k.length !== 12) return null;
  var s = esticar(k), id = hex(derivar(s, PROD + '|id|')).slice(0, 16), e = LIC[id];
  if (!e) return null;
  var wk = derivar(s, PROD + '|wrap|'), wr = unhex(e[1]), ck = new Uint8Array(32);
  for (var i = 0; i < 32; i++) ck[i] = wr[i] ^ wk[i];
  var pl = $('#payload').textContent.trim().split('.');
  var txt;
  try {
    var bruto = fluxo(ck, unb64(pl[0]), unb64(pl[1]));
    if (pl[2]) { var cheio = new Uint8Array(+pl[2]); bruto = INFLATE(bruto, cheio); } /* conteúdo comprimido (deflate) antes de criptografar */
    txt = deutf8(bruto);
  } catch (err) { return null; }
  if (txt.slice(0, 4) !== 'RFOK') return null;
  try { return { num: e[0], dados: JSON.parse(txt.slice(4)) }; } catch (err2) { return null; }
}

/* ============================ ícones ============================ */
var IC = {
  tesoura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  grade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
  livro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/></svg>',
  alvo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6"/></svg>',
  fechar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
  escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/></svg>'
};
Object.keys(IC).forEach(function (k) { IC[k] = IC[k].replace('<svg ', '<svg class="ic" '); });

/* ============================ notação LaTeX (\frac) → fração tipográfica ============================ */
function texInner(m) {
  var out = '', i = 0;
  function grp() {
    while (m.charAt(i) === ' ') i++;
    if (m.charAt(i) !== '{') return m.charAt(i++);
    var d = 0, st = ++i;
    while (i < m.length) { var ch = m.charAt(i); if (ch === '{') d++; else if (ch === '}') { if (d === 0) break; d--; } i++; }
    var g = m.slice(st, i); i++; return g;
  }
  while (i < m.length) {
    if (m.substr(i, 5) === '\\frac') { i += 5; var a = grp(), b = grp(); out += '<span class="frac"><span class="fn">' + texInner(a) + '</span><span class="fd">' + texInner(b) + '</span></span>'; }
    else if (m.substr(i, 6) === '\\times') { out += ' × '; i += 6; }
    else if (m.substr(i, 4) === '\\div') { out += ' ÷ '; i += 4; }
    else if (m.substr(i, 5) === '\\cdot') { out += ' · '; i += 5; }
    else if (m.charAt(i) === '\\') { var mm = /^\\[a-zA-Z]+/.exec(m.slice(i)); i += mm ? mm[0].length : 1; }
    else { out += esc(m.charAt(i)); i++; }
  }
  return out;
}
function tex(s) { return String(s).replace(/\\\(([\s\S]+?)\\\)/g, function (_, m) { return '<span class="math">' + texInner(m) + '</span>'; }); }

/* ============================ dados públicos do edital ============================ */
var ITEM = ['', 'Interpretação de textos', 'Tipologias e gêneros', 'Figuras de linguagem', 'Relações semânticas', 'Ortografia', 'Acentuação gráfica',
  'Classes de palavras', 'Crase', 'Sintaxe da oração e do período', 'Funções do “que” e do “se”', 'Coesão textual', 'Pontuação', 'Concordância',
  'Regência', 'Colocação pronominal', 'Formação de palavras', 'Significação das palavras', 'Variação linguística'];
var LETRAS = ['A', 'B', 'C', 'D', 'E'], ROM = ['I', 'II', 'III', 'IV', 'V'];

/* ============================ estado ============================ */
var C = null, QS = [], QBY = {}, NUM = 0, SESS = null, ST = null, STKEY = '';
function novoEstado() { return { v: 1, modo: 'prova', ini: 0, acc: 0, resp: {}, cort: {}, conf: {}, fim: 0, sub: null, gabLib: false, verCom: {}, hist: [] }; }
function carregar() {
  var raw = lsGet(STKEY), s = null;
  try { s = raw ? JSON.parse(raw) : null; } catch (e) { s = null; }
  var o = novoEstado();
  if (s && typeof s === 'object') {
    o.modo = s.modo === 'treino' ? 'treino' : 'prova';
    o.ini = +s.ini || 0; o.acc = +s.acc || 0; o.fim = +s.fim || 0; o.gabLib = !!s.gabLib;
    ['resp', 'cort', 'conf', 'verCom'].forEach(function (k) { if (s[k] && typeof s[k] === 'object') o[k] = s[k]; });
    if (Array.isArray(s.sub)) o.sub = s.sub.filter(function (n) { return QBY[n]; });
    if (Array.isArray(s.hist)) o.hist = s.hist.slice(-30);
  }
  return o;
}
function salvar() { lsSet(STKEY, JSON.stringify(ST)); }
function ativas() { return ST.sub && ST.sub.length ? QS.filter(function (q) { return ST.sub.indexOf(q.n) >= 0; }) : QS; }
function corrigida(n) { return !!ST.fim || (ST.modo === 'treino' && !!ST.conf[n]); }

/* ============================ montagem da página ============================ */
function dots(n) { var o = '<span class="dots" aria-hidden="true">'; for (var i = 1; i <= 5; i++) o += '<i' + (i <= n ? ' class="on"' : '') + '></i>'; return o + '</span>'; }
function textoHTML(t) {
  return '<div class="texto"><h3>' + esc(t.rotulo) + ' · ' + esc(t.titulo) + '</h3><div class="tx-meta">' + esc(t.genero) + '</div>' +
    t.paragrafos.map(function (p, i) { return '<p><span class="pn">§' + (i + 1) + '</span><span>' + p + '</span></p>'; }).join('') +
    '<div class="tx-fonte">' + esc(t.fonte) + '</div></div>';
}
function qHTML(q) {
  var t = '';
  t += '<span class="tag area">Item ' + q.item + ' · ' + esc(ITEM[q.item]) + '</span>';
  t += '<span class="tag" title="Nível de dificuldade">Nível ' + dots(q.nivel) + '</span>';
  if (q.tipo === 'assertivas') t += '<span class="tag ass">Assertivas</span>';
  if (q.img) t += '<span class="tag img">Imagem</span>';
  t += q.fonte ? '<span class="tag real" title="Questão de prova aplicada">Prova real · ' + esc(q.fonte) + '</span>' : '<span class="tag est">Inédita · estilo ' + esc(q.estilo) + '</span>';
  var tb = q.texto ? '<button class="btn ghost sm q-txtbtn" data-act="texto" data-t="' + q.texto + '">' + IC.livro + ' ' + esc(C.textos[q.texto].rotulo) + '</button>' : '';
  var h = '<article class="q" id="q' + q.n + '" data-n="' + q.n + '">' +
    '<div class="q-h"><span class="q-num">' + pad(q.n) + '</span><div class="q-tags">' + t + '</div>' + tb + '<span id="qr' + q.n + '"></span></div>';
  if (q.intro) h += '<div class="q-en">' + tex(q.intro) + '</div>';
  if (q.img) h += '<div class="q-ilu">' + tex(C.ilustracoes[q.img]) + '</div>';
  h += '<div class="q-en">' + tex(q.enunciado) + '</div>';
  if (q.assertivas) h += '<ol class="ass">' + q.assertivas.map(function (a, i) { return '<li><span class="rn">' + ROM[i] + '.</span><span>' + tex(a) + '</span></li>'; }).join('') + '</ol>';
  if (q.comando) h += '<div class="q-en">' + tex(q.comando) + '</div>'; /* comando que vem depois dos itens, como na prova original */
  h += '<div class="q-dyn" id="qd' + q.n + '"></div></article>';
  return h;
}
function qDyn(q) {
  var n = q.n, r = ST.resp[n], cort = ST.cort[n] || [], corr = corrigida(n);
  var h = '<ul class="alts">';
  q.alts.forEach(function (a, i) {
    var L = LETRAS[i], cls = 'alt', mk = '';
    if (cort.indexOf(L) >= 0 && !corr) cls += ' cortada';
    if (corr) {
      if (L === q.resp) { cls += ' certa'; mk = r === L ? 'sua resposta · correta' : 'gabarito'; }
      else if (L === r) { cls += ' errada'; mk = 'sua resposta'; }
    }
    h += '<li class="' + cls + '"><button class="alt-main" data-act="alt" data-n="' + n + '" data-l="' + L + '" aria-pressed="' + (r === L) + '">' +
      '<span class="lt">' + L + '</span><span class="tx">' + tex(a) + (mk ? '<span class="mk">· ' + mk + '</span>' : '') + '</span></button>' +
      '<button class="cut" data-act="cut" data-n="' + n + '" data-l="' + L + '" aria-label="Eliminar a alternativa ' + L + '" title="Tesoura: eliminar ' + L + '">' + IC.tesoura + '</button></li>';
  });
  h += '</ul><div class="q-ft">';
  if (!corr) {
    if (ST.modo === 'treino') h += '<button class="btn sm" data-act="conf" data-n="' + n + '"' + (r ? '' : ' disabled') + '>' + IC.check + ' Confirmar resposta</button>';
    h += '<span class="hint">' + (r ? 'Marcada: ' + r + (ST.modo === 'prova' ? ' · toque de novo para desmarcar' : '') : 'Use a tesoura para eliminar alternativas.') + '</span>';
  } else {
    var aberto = !!ST.verCom[n];
    h += '<button class="btn ghost sm" data-act="com" data-n="' + n + '">' + (aberto ? 'Ocultar comentário' : 'Ver comentário') + '</button>';
    if (aberto) h += '</div>' + comentHTML(q) + '<div>';
  }
  h += '</div>';
  return h;
}
function comentHTML(q) {
  var c = q.coment, h = '<div class="coment"><h4>Gabarito: ' + q.resp + '</h4><p>' + tex(c.geral) + '</p>';
  if (q.assertivas) h += '<ul>' + q.assertivas.map(function (_, i) { return '<li class="as"><span class="cl">' + ROM[i] + '</span><span>' + tex(c[ROM[i]] || '') + '</span></li>'; }).join('') + '</ul>';
  h += '<ul>' + LETRAS.map(function (L) { return '<li class="' + (L === q.resp ? 'ok' : '') + '"><span class="cl">' + L + '</span><span>' + tex(c[L]) + '</span></li>'; }).join('') + '</ul>';
  if (q.dica) h += '<div class="dica"><b>Dica de prova:</b> ' + tex(q.dica) + '</div>';
  return h + '</div>';
}
function statusQ(q) { var r = ST.resp[q.n]; return !r ? 'bl' : (r === q.resp ? 'ok' : 'no'); }
function atualizarQ(n) {
  var q = QBY[n], d = $('#qd' + n); if (!q || !d) return;
  d.innerHTML = qDyn(q);
  var art = $('#q' + n), b = $('#qr' + n), corr = corrigida(n);
  art.classList.remove('ok', 'no', 'bl', 'corr');
  if (corr) {
    var s = statusQ(q); art.classList.add(s, 'corr');
    b.className = 'q-res ' + s; b.textContent = s === 'ok' ? 'Acertou' : s === 'no' ? 'Errou' : 'Em branco';
  } else { b.className = ''; b.textContent = ''; }
  atualizarCel(n);
}

function montar() {
  var m = C.meta, A = C.areas, nAss = QS.filter(function (q) { return q.tipo === 'assertivas'; }).length, nImg = QS.filter(function (q) { return q.img; }).length, nReal = QS.filter(function (q) { return q.fonte; }).length;
  var h = '';
  /* capa */
  h += '<section class="hero" id="capa"><div class="hero-top"><img class="hero-emb" src="' + LOGO + '" alt="Raiz de Física"><div><h1>' + esc(m.heroL1 || 'MINISSIMULADO') + '<br><em>' + esc(m.heroL2 || '') + '</em></h1>' +
    '<div class="sub">' + esc(m.sub) + '</div></div></div>' +
    '<p class="ola">Olá, <b>' + esc(SESS.n.split(' ')[0]) + '</b>! ' + m.heroTexto + '</p>' +
    '<div class="facts"><div class="fact"><div class="l">Questões</div><div class="v">40</div></div><div class="fact"><div class="l">Fases</div><div class="v">4</div></div>' +
    '<div class="fact"><div class="l">Assertivas</div><div class="v">' + nAss + '</div></div><div class="fact"><div class="l">Com imagem</div><div class="v">' + nImg + '</div></div>' +
    (nReal ? '<div class="fact"><div class="l">Reais de prova</div><div class="v">' + nReal + '</div></div>' : '') +
    '<div class="fact"><div class="l">Tempo sugerido</div><div class="v">' + Math.floor(m.tempoSugerido / 60) + 'h' + pad(m.tempoSugerido % 60) + '</div></div></div>' +
    '<div class="modos" role="group" aria-label="Modo de resolução">' +
    '<button class="modo" data-act="modo" data-m="prova" aria-pressed="' + (ST.modo === 'prova') + '"><b>Modo Prova</b><span>Correção só no final, como no dia da prova. Pode trocar a resposta até finalizar.</span></button>' +
    '<button class="modo" data-act="modo" data-m="treino" aria-pressed="' + (ST.modo === 'treino') + '"><b>Modo Treino</b><span>Você confirma cada questão e vê na hora o gabarito em cores e o comentário.</span></button></div>' +
    '<div class="hero-cta"><button class="btn" data-act="iniciar">' + IC.alvo + ' <span id="lbl-ini">Iniciar simulado</span></button><a class="btn ghost" href="#sumario">Ver sumário</a></div></section>';
  /* sumário */
  h += '<section class="blk" id="sumario"><p class="eyebrow">Navegação</p><h2 class="st">Sumário</h2><nav class="toc" aria-label="Sumário">' + tocHTML() + '</nav></section>';
  /* como usar */
  h += '<section class="blk" id="como-usar"><p class="eyebrow">Antes de começar</p><h2 class="st">Como usar o simulado</h2><div class="passos">' +
    passo(IC.alvo, 'Marque a resposta', 'Toque na alternativa. No Modo Prova, toque de novo para desmarcar.') +
    passo(IC.tesoura, 'Use a tesoura', 'Elimine alternativas pelo ícone de tesoura e resolva por eliminação. Toque de novo para restaurar.') +
    passo(IC.grade, 'Cartão-resposta', 'O botão “Cartão” mostra as 40 questões; toque no número para ir até ela. Depois da correção, ele vira o gabarito em cores.') +
    passo(IC.livro, (m.passo4 || [])[0] || 'Textos de apoio', (m.passo4 || [])[1] || 'Questões ligadas a um texto têm o botão “Texto I” ou “Texto II”, que abre o texto sem perder o lugar.') +
    passo(IC.check, 'Finalize', 'No fim, toque em “Finalizar e ver resultado”: gráfico de pizza, pontos fortes e fracos e o caminho de estudo.') +
    passo(IC.escudo, 'Material licenciado', 'Seus dados aparecem como marca d’água. Não compartilhe: cada licença é rastreável.') + '</div></section>';
  /* raio-x */
  var maxA = 0, maxP = 0; C.raiox.assuntos.forEach(function (a) { maxA = Math.max(maxA, a[1]); });
  Object.keys(A).forEach(function (k) { maxP = Math.max(maxP, A[k].peso); });
  h += '<section class="blk" id="raiox"><p class="eyebrow">Raio-X da matéria</p><h2 class="st">Onde este simulado mira</h2>' +
    '<p class="lead">' + m.raioxLead + '</p><div class="grid2"><div class="card hud"><h3 class="eyebrow" style="margin-bottom:8px">Peso provável na prova × questões aqui</h3>' +
    Object.keys(A).map(function (k) {
      var nq = QS.filter(function (q) { return q.area === k; }).length;
      return '<div class="hb"><span class="t"><b>' + esc(A[k].nome) + '</b><small>' + nq + ' questões neste simulado</small></span><span class="tr"><span class="bt"><i style="width:' + Math.round(A[k].peso / maxP * 100) + '%"></i></span><span>' + pct(A[k].peso) + '</span></span></div>';
    }).join('') + '</div><div class="card hud"><h3 class="eyebrow" style="margin-bottom:8px">Assuntos mais cobrados · ' + C.raiox.total.toLocaleString('pt-BR') + ' questões</h3>' +
    C.raiox.assuntos.slice(0, 12).map(function (a) {
      return '<div class="hb"><span class="t"><b>' + esc(a[0]) + '</b></span><span class="tr"><span class="bt"><i style="width:' + Math.round(a[1] / maxA * 100) + '%"></i></span><span>' + a[1] + '</span></span></div>';
    }).join('') + '</div></div></section>';
  /* seções extras (formulário etc.) e laboratório de tabela-verdade */
  (C.secoes || []).forEach(function (sx) {
    h += '<section class="blk" id="' + sx.id + '"><p class="eyebrow">' + esc(sx.eyebrow) + '</p><h2 class="st">' + esc(sx.titulo) + '</h2>' + (sx.lead ? '<p class="lead">' + sx.lead + '</p>' : '') + sx.html + '</section>';
  });
  var FER = ferramenta();
  if (FER) h += '<section class="blk" id="laboratorio"><p class="eyebrow">Ferramenta interativa</p><h2 class="st">' + esc(FER.titulo) + '</h2>' +
    '<p class="lead">' + FER.lead + '</p><div class="card hud" id="lab-ferr"></div></section>';
  /* fases */
  var usados = {};
  C.fases.forEach(function (f) {
    h += '<div class="fase-h" id="fase-' + f.n + '"><span class="fn">' + f.n + '</span><div><b>' + esc(f.nome) + '</b><span>' + esc(f.desc) + ' Questões ' + f.de + ' a ' + f.ate + '.</span></div></div>';
    QS.filter(function (q) { return q.fase === f.n; }).forEach(function (q) {
      if (q.texto && !usados[q.texto]) { usados[q.texto] = 1; h += '<div class="blk" id="texto-' + q.texto + '">' + textoHTML(C.textos[q.texto]) + '</div>'; }
      h += qHTML(q);
    });
  });
  /* finalizar, resultado e gabarito */
  h += '<section class="fim" id="finalizar"><p class="eyebrow">Fim do simulado</p><h2 class="st">Finalizar</h2><div id="fim-info"></div></section>';
  h += '<section class="blk" id="resultado" style="margin-top:28px"></section>';
  h += '<section class="blk" id="gabarito" style="margin-top:28px"></section>';
  $('#main').innerHTML = h;
  $('#foot').innerHTML = 'Licença nº <b>' + pad4(NUM) + '</b> · ' + esc(SESS.n) + ' · ' + esc(SESS.e) + '<br>' + esc(m.titulo || 'Minissimulado') + ' · PMPE · Raiz de Física · v' + esc(m.versao) +
    '<br>' + m.rodape +
    '<br>Material protegido pela Lei nº 9.610/1998. Reproduzir, compartilhar ou revender sem autorização é crime (art. 184 do Código Penal). <a href="#" data-act="sair">Sair desta licença</a>';
  QS.forEach(function (q) { atualizarQ(q.n); });
  if (FER) (FER.tipo === 'regime' ? calculadoraRegime : FER.tipo === 'quorum' ? calculadoraQuorum : FER.tipo === 'pena' ? calculadoraPena : FER.tipo === 'xl' ? laboratorioXL : laboratorioTV)($('#lab-ferr'), FER);
  aplicarSub();
  montarCartao();
  atualizarTudo();
}
/* ferramenta interativa do produto: tabela-verdade (RLM) ou fórmulas de planilha (Informática) */
function ferramenta() {
  var m = C.meta, f = m.ferramenta || (m.ferramentaTV ? { tipo: 'tv' } : null);
  if (!f) return null;
  var base = f.tipo === 'regime'
    ? { titulo: 'Calculadora de progressão de regime', sigla: '%', sub: 'Art. 112 da LEP, redação de 2026',
        lead: 'Informe a pena e a situação do condenado e veja o tempo mínimo para progredir de regime pelo art. 112 da Lei de Execução Penal, já com as mudanças de 2026 (crimes hediondos, feminicídio, organização criminosa e milícia), a conta passo a passo e a comparação com a regra antiga. Use para conferir as suas resoluções.' }
    : f.tipo === 'quorum'
    ? { titulo: 'Calculadora de quóruns', sigla: '⅗', sub: 'Maioria absoluta, 3/5, 2/3 e 1/3',
        lead: 'Escolha a Casa legislativa e o quórum e veja o número mínimo de votos, com a conta passo a passo, a regra de arredondamento e onde a Constituição exige cada quórum. Use para conferir as suas resoluções.' }
    : f.tipo === 'pena'
    ? { titulo: 'Calculadora de frações de pena', sigla: '⅔', sub: 'Aumentos, diminuições e progressão',
        lead: 'Aplique frações de aumento ou de diminuição (tráfico privilegiado, majorantes da tortura) e percentuais de progressão de regime à pena-base e veja a conta passo a passo, em anos, meses e dias. Use para conferir as suas resoluções.' }
    : f.tipo === 'xl'
    ? { titulo: 'Laboratório de fórmulas', sigla: 'fx', sub: 'Teste fórmulas do Excel e do Calc',
        lead: 'Digite fórmulas do Excel 2019 e do LibreOffice Calc, em português, sobre a planilha de exemplo e veja o resultado, os erros (como #DIV/0! e #N/D) e o que acontece com as referências ao copiar a fórmula para outra célula. Use para conferir as suas resoluções.' }
    : { titulo: 'Laboratório de tabela-verdade', sigla: 'V/F', sub: 'Monte e classifique proposições',
        lead: 'Monte qualquer proposição com até 5 letras e veja a tabela-verdade completa, coluna por coluna, com a classificação automática (tautologia, contradição ou contingência). Use para conferir as suas resoluções.' };
  for (var k in f) base[k] = f[k];
  return base;
}
function pad4(n) { return ('000' + n).slice(-4); }
function passo(ic, t, d) { return '<div class="passo"><span class="pi">' + ic + '</span><div><b>' + t + '</b><span>' + d + '</span></div></div>'; }
function tocHTML() {
  var it = [['capa', '◆', 'Capa e modos', 'Prova ou treino'], ['como-usar', '?', 'Como usar', 'Tesoura, cartão e textos'], ['raiox', 'RX', 'Raio-X da matéria', 'Pesos e assuntos']];
  (C.secoes || []).forEach(function (sx) { it.push([sx.id, sx.sigla || '§', sx.titulo, sx.sub || '']); });
  var FER = ferramenta();
  if (FER) it.push(['laboratorio', FER.sigla, FER.titulo, FER.sub]);
  C.fases.forEach(function (f) { it.push(['fase-' + f.n, f.n, f.nome, 'Questões ' + f.de + ' a ' + f.ate]); });
  it.push(['finalizar', '✓', 'Finalizar', 'Conferir e corrigir'], ['resultado', '%', 'Resultado e diagnóstico', 'Pizza, pontos fortes e caminho'], ['gabarito', 'G', 'Gabarito comentado', 'Comentário de cada alternativa']);
  return it.map(function (x) { return '<a href="#' + x[0] + '" data-act="ir"><span class="n">' + x[1] + '</span><span><b>' + esc(x[2]) + '</b><small>' + esc(x[3]) + '</small></span></a>'; }).join('');
}
function aplicarSub() {
  var at = ativas(), set = {};
  at.forEach(function (q) { set[q.n] = 1; });
  QS.forEach(function (q) { $('#q' + q.n).hidden = !set[q.n]; });
}

/* ============================ cartão-resposta ============================ */
function montarCartao() {
  $('#cartao').innerHTML = QS.map(function (q) { return '<button class="cel" id="cel' + q.n + '" data-act="go" data-n="' + q.n + '"><b>' + pad(q.n) + '</b><span>–</span><small></small></button>'; }).join('');
  QS.forEach(function (q) { atualizarCel(q.n); });
}
function atualizarCel(n) {
  var c = $('#cel' + n), q = QBY[n]; if (!c) return;
  var r = ST.resp[n], at = ativas().indexOf(q) >= 0, corr = corrigida(n);
  c.className = 'cel' + (!at ? ' off' : corr ? ' ' + statusQ(q) : (r ? ' marc' : ''));
  c.querySelector('span').textContent = r || '–';
  c.querySelector('small').textContent = corr ? 'gab. ' + q.resp : '';
  c.setAttribute('aria-label', 'Questão ' + n + (r ? ', marcada ' + r : ', sem resposta') + (corr ? ', gabarito ' + q.resp : ''));
}

/* ============================ progresso, cronômetro e finalização ============================ */
function atualizarTudo() {
  var at = ativas(), resp = at.filter(function (q) { return ST.resp[q.n]; }).length;
  $('#prog i').style.width = (resp / at.length * 100) + '%';
  $('#tb-cont').textContent = resp + '/' + at.length;
  $('#lbl-ini').textContent = ST.fim ? 'Ver resultado' : (ST.ini ? 'Continuar de onde parei' : 'Iniciar simulado');
  $$('.modo').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-m') === ST.modo)); });
  var fi = $('#fim-info'), bl = at.length - resp;
  if (ST.fim) {
    fi.innerHTML = '<p class="lead">Simulado finalizado em ' + dataBR(ST.fim) + '. Confira o resultado e o gabarito comentado abaixo.</p><div class="row">' +
      '<a class="btn" href="#resultado">Ver resultado</a><button class="btn ghost" data-act="refazer-erradas">Refazer só as que errei</button><button class="btn danger" data-act="refazer">Refazer simulado completo</button></div>';
  } else {
    fi.innerHTML = '<p class="lead">Você respondeu <b>' + resp + '</b> de <b>' + at.length + '</b> questões' + (bl ? ' (' + bl + ' em branco)' : '') + '. Tempo: <b>' + fmtTempo(ST.acc) + '</b>.</p>' +
      '<div class="row"><button class="btn" data-act="finalizar">' + IC.check + ' Finalizar e ver resultado</button><button class="btn ghost" data-act="cartao">Abrir cartão-resposta</button></div>';
  }
  renderResultado();
  renderGabarito();
}
function tick() {
  if (ST && ST.ini && !ST.fim && !DOC.hidden) { ST.acc += 1000; if ((ST.acc / 1000) % 15 === 0) salvar(); }
  var t = $('#tb-tempo'); if (t && ST) t.textContent = fmtTempo(ST.acc);
}
function iniciar() {
  if (!ST.ini) { ST.ini = Date.now(); salvar(); toast('Cronômetro iniciado. Bom simulado!'); }
  if (ST.fim) { ir('resultado'); return; }
  var at = ativas(), prox = at.filter(function (q) { return !ST.resp[q.n]; })[0] || at[0];
  ir('q' + prox.n);
  atualizarTudo();
}
function ir(id) { var el = DOC.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function finalizar() {
  var at = ativas(), bl = at.filter(function (q) { return !ST.resp[q.n]; });
  var msg = bl.length ? '<p>Você deixou <b>' + bl.length + '</b> questão(ões) em branco: ' + bl.map(function (q) { return q.n; }).join(', ') + '. Na prova da AOCP, questão em branco vale zero: vale mais chutar entre as alternativas que sobraram da tesoura.</p>' : '<p>Todas as questões foram respondidas.</p>';
  modal('Finalizar o simulado?', msg + '<p>Depois de finalizar, as respostas são corrigidas e não podem mais ser alteradas.</p>', [
    { t: 'Voltar e revisar', c: 'ghost' },
    { t: 'Finalizar agora', c: '', f: function () {
      ST.fim = Date.now();
      var R = calcular();
      ST.hist.push({ d: ST.fim, m: ST.modo, ok: R.ok, tot: R.tot, t: ST.acc, sub: !!(ST.sub && ST.sub.length) });
      salvar();
      QS.forEach(function (q) { atualizarQ(q.n); });
      atualizarTudo();
      setTimeout(function () { ir('resultado'); }, 60);
    } }
  ]);
}
function refazer(soErradas) {
  var alvo = null;
  if (soErradas) {
    alvo = ativas().filter(function (q) { return statusQ(q) !== 'ok'; }).map(function (q) { return q.n; });
    if (!alvo.length) { toast('Você não errou nenhuma questão. Parabéns!'); return; }
  }
  modal(soErradas ? 'Refazer só as que você errou?' : 'Refazer o simulado completo?',
    '<p>' + (soErradas ? 'Serão reabertas ' + alvo.length + ' questões (erradas e em branco). As demais ficam ocultas até você refazer o simulado completo.' : 'Todas as respostas atuais serão apagadas. O resultado fica guardado no histórico.') + '</p>', [
    { t: 'Cancelar', c: 'ghost' },
    { t: 'Refazer', c: '', f: function () {
      var h = ST.hist, modo = ST.modo;
      ST = novoEstado(); ST.hist = h; ST.modo = modo; ST.sub = alvo;
      salvar(); montar(); ir('capa');
      toast(soErradas ? 'Questões reabertas. Escolha o modo e comece.' : 'Simulado reiniciado.');
    } }
  ]);
}

/* ============================ resultado e diagnóstico ============================ */
function calcular() {
  var at = ativas(), R = { tot: at.length, ok: 0, no: 0, bl: 0, areas: {}, fases: {}, fmt: { ass: [0, 0], img: [0, 0], txt: [0, 0], iso: [0, 0] }, real: [0, 0], err: [] };
  Object.keys(C.areas).forEach(function (k) { R.areas[k] = { ok: 0, tot: 0, err: [] }; });
  at.forEach(function (q) {
    var s = statusQ(q), a = R.areas[q.area], acerto = s === 'ok' ? 1 : 0;
    R[s]++; a.tot++; a.ok += acerto;
    if (!acerto) { a.err.push(q); R.err.push(q); }
    var f = R.fases[q.fase] || (R.fases[q.fase] = [0, 0]); f[0] += acerto; f[1]++;
    var fm = q.tipo === 'assertivas' ? 'ass' : q.img ? 'img' : q.texto ? 'txt' : 'iso';
    R.fmt[fm][0] += acerto; R.fmt[fm][1]++;
    if (q.fonte) { R.real[0] += acerto; R.real[1]++; }
  });
  R.acc = R.tot ? R.ok / R.tot : 0;
  return R;
}
function pcts100(vals) {
  var tot = 0; vals.forEach(function (v) { tot += v; });
  if (!tot) return vals.map(function () { return 0; });
  var base = vals.map(function (v) { return Math.floor(v / tot * 100); }), resto = 100 - base.reduce(function (a, b) { return a + b; }, 0);
  vals.map(function (v, i) { return [v / tot * 100 - base[i], i]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, resto).forEach(function (x) { base[x[1]]++; });
  return base;
}
function pizza(segs) {
  var S = 240, cx = 120, cy = 120, r = 108, tot = 0, ang = -Math.PI / 2, out = '';
  var P = pcts100(segs.map(function (s) { return s.v; }));
  segs.forEach(function (s, i) { tot += s.v; s.p = P[i]; });
  var vis = segs.filter(function (s) { return s.v > 0; });
  out += '<svg viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Gráfico de pizza: ' + segs.map(function (s) { return s.l + ' ' + s.p + '%'; }).join(', ') + '">';
  if (vis.length === 1) {
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + vis[0].c + '"/>';
    out += '<text x="' + cx + '" y="' + (cy + 9) + '" text-anchor="middle" font-size="26" fill="#03140b">100%</text>';
  } else {
    vis.forEach(function (s) {
      var fr = s.v / tot, a2 = ang + fr * 2 * Math.PI, big = fr > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      out += '<path d="M' + cx + ' ' + cy + ' L' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + r + ' ' + r + ' 0 ' + big + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2) + ' Z" fill="' + s.c + '" stroke="#0a161b" stroke-width="2"/>';
      if (fr >= 0.06) {
        var am = (ang + a2) / 2, lx = cx + r * 0.62 * Math.cos(am), ly = cy + r * 0.62 * Math.sin(am);
        out += '<text x="' + lx.toFixed(1) + '" y="' + (ly + 6).toFixed(1) + '" text-anchor="middle" font-size="17" fill="' + s.tc + '">' + s.p + '%</text>';
      }
      ang = a2;
    });
  }
  return out + '</svg>';
}
function nivelGeral(acc) {
  if (acc >= 0.85) return ['NÍVEL ELITE', 'Desempenho de quem disputa as primeiras colocações. Mantenha o ritmo com simulados semanais.'];
  if (acc >= 0.7) return ['NÍVEL COMPETITIVO', 'Você está na faixa de aprovação. O salto agora vem de corrigir os pontos fracos abaixo.'];
  if (acc >= 0.5) return ['EM CONSTRUÇÃO', 'Boa base, mas ainda há perda de pontos em assuntos de peso. Siga o caminho de estudo abaixo.'];
  return ['BASE EM FORMAÇÃO', 'Este simulado foi feito em nível de prova e acima dele. Comece pelas prioridades abaixo, com teoria + questões.'];
}
function stArea(a) { if (!a.tot) return null; var x = a.ok / a.tot; return x >= 0.75 ? 'ok' : x >= 0.5 ? 'mid' : 'no'; }
function renderResultado() {
  var el = $('#resultado'); if (!el) return;
  if (!ST.fim) {
    el.innerHTML = '<p class="eyebrow">Resultado</p><h2 class="st">Resultado e diagnóstico</h2><div class="lockbox">O gráfico de desempenho, os pontos fortes e fracos e o caminho de estudo aparecem aqui assim que você finalizar o simulado.</div>';
    return;
  }
  var R = calcular(), A = C.areas, ng = nivelGeral(R.acc), h = '', P3 = pcts100([R.ok, R.no, R.bl]);
  h += '<p class="eyebrow">Resultado' + (ST.sub && ST.sub.length ? ' · revisão das questões erradas' : '') + '</p><h2 class="st">Seu desempenho</h2>';
  h += '<div class="card hud"><div class="pie-wrap">' + pizza([
    { l: 'Acertos', v: R.ok, c: '#34e07e', tc: '#03210f' }, { l: 'Erros', v: R.no, c: '#ff5a6e', tc: '#2a0309' }, { l: 'Em branco', v: R.bl, c: '#7d8f94', tc: '#0b1417' }]) +
    '<div class="pleg"><span class="selo">' + IC.alvo + ' ' + ng[0] + '</span>' +
    '<div class="pl"><i style="background:#34e07e"></i><span>Acertos</span><b>' + R.ok + '</b><small>' + P3[0] + '%</small></div>' +
    '<div class="pl"><i style="background:#ff5a6e"></i><span>Erros</span><b>' + R.no + '</b><small>' + P3[1] + '%</small></div>' +
    '<div class="pl"><i style="background:#7d8f94"></i><span>Em branco</span><b>' + R.bl + '</b><small>' + P3[2] + '%</small></div>' +
    '<p class="lead" style="margin:4px 0 0">' + ng[1] + '</p></div></div></div>';
  var ritmo = R.tot ? ST.acc / R.tot : 0, meta = C.meta.tempoSugerido * 60000 / 40;
  h += '<div class="kpis" style="margin-top:12px">' +
    kpi('Aproveitamento', pct(R.acc), R.ok + ' de ' + R.tot + ' questões') +
    kpi('Projeção na PMPE', Math.round(R.acc * C.meta.projecao.total) + '<small>/' + C.meta.projecao.total + '</small>', C.meta.projecao.rotulo) +
    kpi('Tempo total', fmtMin(ST.acc), 'ritmo de ' + Math.round(ritmo / 1000 / 6) / 10 + ' min por questão') +
    kpi('Modo', ST.modo === 'prova' ? 'Prova' : 'Treino', 'finalizado em ' + dataBR(ST.fim)) + '</div>';
  /* por área */
  h += '<div class="card" style="margin-top:12px"><h3 class="eyebrow" style="margin-bottom:6px">Desempenho por área</h3>';
  Object.keys(A).forEach(function (k) {
    var a = R.areas[k]; if (!a.tot) return;
    var x = a.ok / a.tot, s = stArea(a), cor = s === 'ok' ? '#34e07e' : s === 'mid' ? '#ffcf5c' : '#ff5a6e';
    h += '<div class="ab"><span class="t">' + esc(A[k].nome) + '<span class="st ' + s + '">' + (s === 'ok' ? 'forte' : s === 'mid' ? 'atenção' : 'fraco') + '</span><small>peso na prova: ' + pct(A[k].peso) + (a.tot <= 2 ? ' · amostra pequena' : '') + '</small></span>' +
      '<span class="tr"><span class="bt"><i style="width:' + Math.max(2, Math.round(x * 100)) + '%;background:' + cor + '"></i></span><span>' + a.ok + '/' + a.tot + ' · ' + pct(x) + '</span></span></div>';
  });
  h += '</div>';
  /* por fase e formato */
  h += '<div class="grid2" style="margin-top:12px"><div class="card"><h3 class="eyebrow" style="margin-bottom:6px">Curva de dificuldade (por fase)</h3>';
  C.fases.forEach(function (f) { var v = R.fases[f.n]; if (!v) return; h += barra(f.nome, v[0], v[1]); });
  h += '</div><div class="card"><h3 class="eyebrow" style="margin-bottom:6px">Por formato de questão</h3>';
  [['ass', 'Assertivas (I, II, III...)'], ['img', C.meta.rotuloImg || 'Com imagem'], ['txt', 'Ligadas a texto'], ['iso', C.meta.rotuloIso || 'Gramática isolada']].forEach(function (x) { var v = R.fmt[x[0]]; if (v[1]) h += barra(x[1], v[0], v[1]); });
  if (R.real[1]) h += barra(C.meta.rotuloReal || 'Questões reais de prova', R.real[0], R.real[1]);
  h += '</div></div>';
  /* diagnóstico */
  var ks = Object.keys(A).filter(function (k) { return R.areas[k].tot; });
  var fortes = ks.filter(function (k) { return stArea(R.areas[k]) === 'ok'; });
  var fracos = ks.filter(function (k) { return stArea(R.areas[k]) === 'no'; });
  var medios = ks.filter(function (k) { return stArea(R.areas[k]) === 'mid'; });
  var acc = function (k) { return R.areas[k].ok / R.areas[k].tot; };
  h += '<h2 class="st" style="margin-top:22px">Diagnóstico</h2><div class="diag">';
  h += '<div class="dg forte"><h3>' + IC.check + ' Pontos fortes</h3><ul>' + (fortes.length ? fortes.map(function (k) { return '<li><b>' + esc(A[k].nome) + '</b> (' + R.areas[k].ok + '/' + R.areas[k].tot + '): ' + esc(A[k].forte) + '</li>'; }).join('') :
    '<li>Nenhuma área chegou a 75% ainda, o que é comum neste nível de exigência. Seus melhores resultados foram em <b>' + ks.slice().sort(function (a, b) { return acc(b) - acc(a); }).slice(0, 2).map(function (k) { return esc(A[k].nome); }).join('</b> e <b>') + '</b>: use essas áreas para ganhar tempo na prova.</li>') + '</ul></div>';
  h += '<div class="dg fraco"><h3>' + IC.fechar + ' Pontos fracos</h3><ul>' + (fracos.length ? fracos.map(function (k) {
    return '<li><b>' + esc(A[k].nome) + '</b> (' + R.areas[k].ok + '/' + R.areas[k].tot + '). Revise ' + porItem(R.areas[k].err) + '.</li>';
  }).join('') : '<li>Nenhuma área abaixo de 50% de acertos. Ótimo sinal de base sólida.</li>') + '</ul></div>';
  var dicas = [];
  medios.forEach(function (k) { dicas.push('<b>' + esc(A[k].nome) + '</b> (' + R.areas[k].ok + '/' + R.areas[k].tot + '): falta pouco. Refaça ' + R.areas[k].err.map(function (q) { return '<a href="#q' + q.n + '" data-act="ir">Q' + q.n + '</a>'; }).join(', ') + ' e leia o comentário de cada alternativa.'); });
  if (R.fmt.ass[1] && R.fmt.ass[0] / R.fmt.ass[1] < 0.6) dicas.push('<b>Questões de assertivas</b> (' + R.fmt.ass[0] + '/' + R.fmt.ass[1] + '): julgue primeiro a assertiva de que você tem mais certeza e corte com a tesoura as alternativas incompatíveis.');
  if (R.fmt.img[1] && R.fmt.img[0] / R.fmt.img[1] < 0.6) dicas.push('<b>' + (C.meta.rotuloImg || 'Questões com imagem') + '</b> (' + R.fmt.img[0] + '/' + R.fmt.img[1] + '): ' + C.meta.dicaImagem);
  var f4 = R.fases[4], f1 = R.fases[1];
  if (f4 && f1 && f1[1] && f4[1] && f1[0] / f1[1] - f4[0] / f4[1] >= 0.3) dicas.push('<b>Queda nas questões difíceis</b>: você foi bem na Fase 1 e caiu na Fase 4. ' + C.meta.dicaQueda);
  if (R.bl) dicas.push('<b>' + R.bl + ' questão(ões) em branco</b>: na prova da AOCP, a questão em branco vale zero. Elimine o que puder e marque a melhor opção restante.');
  if (ST.modo === 'prova' && ST.acc > C.meta.tempoSugerido * 60000 * (R.tot / 40) * 1.15) dicas.push('<b>Ritmo</b>: você passou do tempo sugerido (3 min por questão). ' + (C.meta.dicaRitmo || 'Faça primeiro as questões de gramática isolada e deixe as de texto longo para o fim.'));
  if (!dicas.length) dicas.push('Nada crítico a ajustar além dos pontos fracos. Mantenha a revisão dos comentários das questões que errou.');
  h += '<div class="dg melhorar"><h3>' + IC.alvo + ' Pontos a melhorar</h3><ul>' + dicas.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul></div></div>';
  /* caminho */
  var prio = ks.filter(function (k) { return acc(k) < 1; }).sort(function (a, b) { return (1 - acc(b)) * A[b].peso - (1 - acc(a)) * A[a].peso; }).slice(0, 3);
  h += '<h2 class="st" style="margin-top:22px">O seu caminho de estudo</h2><p class="lead">Ordem calculada pelo seu erro em cada área multiplicado pelo peso dela na prova da PMPE: primeiro o que mais rende pontos.</p><ol class="caminho">';
  if (R.err.length) h += '<li><div><b>Hoje: refaça as ' + R.err.length + ' questões que errou ou deixou em branco</b><span>Use o Modo Treino e leia o comentário de todas as alternativas, inclusive as erradas: é ali que a banca esconde as pegadinhas.</span><div style="margin-top:8px"><button class="btn sm" data-act="refazer-erradas">Refazer só as que errei</button></div></div></li>';
  var dias = [['Dias 1 a 4', 4], ['Dias 5 a 8', 4], ['Dias 9 a 11', 3]];
  prio.forEach(function (k, i) {
    h += '<li><div><b>' + dias[i][0] + ' · Prioridade ' + (i + 1) + ': ' + esc(A[k].nome) + '</b><span>Você acertou ' + R.areas[k].ok + ' de ' + R.areas[k].tot + '; a área vale cerca de ' + pct(A[k].peso) + ' da prova.</span><ul>' +
      A[k].plano.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '<li>' + esc(C.meta.refRotulo) + ' ' + esc(A[k].ref || A[k].pestana) + '.</li></ul></div></li>';
  });
  var dd = C.meta.diario;
  if (dd && A[dd.area] && prio.indexOf(dd.area) < 0) h += '<li><div><b>' + esc(dd.titulo) + '</b><span>' + dd.texto.replace('{peso}', pct(A[dd.area].peso)) + '</span></div></li>';
  h += '<li><div><b>Dia 12 · Revisão espaçada</b><span>Releia os comentários das questões erradas 1 dia, 7 dias e 30 dias depois. Anote as pegadinhas em um caderno de erros.</span></div></li>';
  h += '<li><div><b>Dias 13 e 14 · Novo teste</b><span>Refaça este simulado no Modo Prova, com cronômetro, e compare no histórico abaixo. Meta: subir pelo menos 10 pontos percentuais.</span></div></li></ol>';
  /* histórico */
  if (ST.hist.length) {
    h += '<div class="card" style="margin-top:14px"><h3 class="eyebrow" style="margin-bottom:6px">Histórico de tentativas</h3><div class="tblwrap"><table class="hist"><thead><tr><th>Data</th><th>Tipo</th><th>Acertos</th><th>%</th><th>Tempo</th></tr></thead><tbody>' +
      ST.hist.slice().reverse().map(function (x) { return '<tr><td>' + dataBR(x.d) + '</td><td>' + (x.sub ? 'Revisão' : 'Completo') + ' · ' + (x.m === 'prova' ? 'Prova' : 'Treino') + '</td><td>' + x.ok + '/' + x.tot + '</td><td>' + pct(x.ok / x.tot) + '</td><td>' + fmtMin(x.t) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  }
  h += '<div class="row" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a class="btn" href="#gabarito" data-act="ir">Ver gabarito comentado</a><button class="btn ghost" data-act="refazer-erradas">Refazer só as que errei</button><button class="btn danger" data-act="refazer">Refazer completo</button></div>';
  el.innerHTML = h;
}
function porItem(lista) {
  var g = {}, ordem = [];
  lista.forEach(function (q) { if (!g[q.item]) { g[q.item] = []; ordem.push(q.item); } g[q.item].push(q); });
  return ordem.map(function (it) { return '<i>' + esc(ITEM[it]) + '</i>: ' + g[it].map(function (q) { return '<a href="#q' + q.n + '" data-act="ir">Q' + q.n + '</a>'; }).join(', '); }).join('; ');
}
function kpi(l, v, s) { return '<div class="kpi"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="s">' + s + '</div></div>'; }
function barra(t, ok, tot) {
  var x = ok / tot, cor = x >= 0.75 ? '#34e07e' : x >= 0.5 ? '#ffcf5c' : '#ff5a6e';
  return '<div class="ab"><span class="t">' + esc(t) + '</span><span class="tr"><span class="bt"><i style="width:' + Math.max(2, Math.round(x * 100)) + '%;background:' + cor + '"></i></span><span>' + ok + '/' + tot + ' · ' + pct(x) + '</span></span></div>';
}

/* ============================ gabarito comentado ============================ */
function renderGabarito() {
  var el = $('#gabarito'); if (!el) return;
  var h = '<p class="eyebrow">Respostas</p><h2 class="st">Gabarito comentado</h2>';
  if (!ST.fim && !ST.gabLib) {
    el.innerHTML = h + '<div class="lockbox"><p>O gabarito comentado fica bloqueado até você finalizar, para não estragar o simulado.</p><button class="btn ghost" data-act="liberar">Liberar mesmo assim</button></div>';
    return;
  }
  var at = ativas();
  h += '<p class="lead">Toque no número para ir até a questão. Verde: você acertou · vermelho: errou · cinza: em branco' + (ST.fim ? '' : ' (o simulado ainda não foi finalizado)') + '.</p>';
  h += '<div class="cartao" style="margin-bottom:14px">' + at.map(function (q) {
    var s = ST.fim ? statusQ(q) : '';
    return '<a class="cel ' + s + '" href="#gab' + q.n + '" data-act="ir" style="text-decoration:none"><b>' + pad(q.n) + '</b><span>' + q.resp + '</span><small>' + (ST.resp[q.n] ? 'você: ' + ST.resp[q.n] : 'sem resp.') + '</small></a>';
  }).join('') + '</div>';
  h += at.map(function (q) {
    var s = statusQ(q), r = ST.resp[q.n];
    return '<details class="gab-item" id="gab' + q.n + '"><summary><span class="gn">Q' + pad(q.n) + '</span><span class="gl">Gabarito ' + q.resp + '</span>' +
      (ST.fim ? '<span class="q-res ' + s + '">' + (s === 'ok' ? 'Acertou' : s === 'no' ? 'Errou (' + r + ')' : 'Em branco') + '</span>' : '') +
      '<span class="ga">' + esc(ITEM[q.item]) + ' · nível ' + q.nivel + (q.fonte ? ' · prova real' : '') + '</span></summary>' + comentHTML(q) +
      '<p style="margin:8px 0 0"><a href="#q' + q.n + '" data-act="ir">Ir para a questão ' + q.n + '</a></p></details>';
  }).join('');
  el.innerHTML = h;
}

/* ============================ laboratório de tabela-verdade ============================ */
/* Precedência usual nos livros de concurso: ~ (mais forte), ∧, ∨ e ⊻, →, ↔ (mais fraco); → associa à direita. */
function tvTokens(src) {
  var t = [], i = 0, s = String(src);
  while (i < s.length) {
    var c = s.charAt(i), r = s.slice(i);
    if (/\s/.test(c)) { i++; continue; }
    if (r.charAt(0) === '↔' || r.charAt(0) === '⇔') { t.push('↔'); i++; continue; }
    if (/^(<->|<=>)/.test(r)) { t.push('↔'); i += 3; continue; }
    if (r.charAt(0) === '→' || r.charAt(0) === '⇒') { t.push('→'); i++; continue; }
    if (/^(->|=>)/.test(r)) { t.push('→'); i += 2; continue; }
    if ('~¬!'.indexOf(c) >= 0) { t.push('~'); i++; continue; }
    if ('∧^&'.indexOf(c) >= 0) { t.push('∧'); i++; continue; }
    if ('∨|v'.indexOf(c) >= 0) { t.push('∨'); i++; continue; }
    if (c === '⊻') { t.push('⊻'); i++; continue; }
    if ('([{'.indexOf(c) >= 0) { t.push('('); i++; continue; }
    if (')]}'.indexOf(c) >= 0) { t.push(')'); i++; continue; }
    if (/[a-uw-z]/.test(c)) { t.push(c); i++; continue; }
    throw new Error('Símbolo não reconhecido: “' + c + '”.');
  }
  if (!t.length) throw new Error('Digite uma proposição.');
  return t;
}
function tvParse(tk) {
  var i = 0;
  function iff() { var a = imp(); while (tk[i] === '↔') { i++; a = { op: '↔', a: a, b: imp() }; } return a; }
  function imp() { var a = ou(); if (tk[i] === '→') { i++; return { op: '→', a: a, b: imp() }; } return a; }
  function ou() { var a = e(); while (tk[i] === '∨' || tk[i] === '⊻') { var o = tk[i++]; a = { op: o, a: a, b: e() }; } return a; }
  function e() { var a = nao(); while (tk[i] === '∧') { i++; a = { op: '∧', a: a, b: nao() }; } return a; }
  function nao() { if (tk[i] === '~') { i++; return { op: '~', a: nao() }; } return atomo(); }
  function atomo() {
    var c = tk[i];
    if (c === undefined) throw new Error('A expressão terminou antes do esperado (falta uma letra depois do operador).');
    if (c === '(') { i++; var x = iff(); if (tk[i] !== ')') throw new Error('Falta fechar um parêntese.'); i++; return x; }
    if (/^[a-z]$/.test(c)) { i++; return { op: 'var', v: c }; }
    throw new Error('Esperava uma letra ou “(”, mas encontrei “' + c + '”.');
  }
  var raiz = iff();
  if (i < tk.length) throw new Error(tk[i] === ')' ? 'Há um parêntese fechando sem ter sido aberto.' : 'Falta um operador antes de “' + tk[i] + '”.');
  return raiz;
}
function tvStr(n, topo) {
  if (n.op === 'var') return n.v;
  if (n.op === '~') { var x = tvStr(n.a, false); return '~' + x; }
  var s = tvStr(n.a, false) + ' ' + n.op + ' ' + tvStr(n.b, false);
  return topo ? s : '(' + s + ')';
}
function tvEval(n, env) {
  switch (n.op) {
    case 'var': return env[n.v];
    case '~': return !tvEval(n.a, env);
    case '∧': return tvEval(n.a, env) && tvEval(n.b, env);
    case '∨': return tvEval(n.a, env) || tvEval(n.b, env);
    case '⊻': return tvEval(n.a, env) !== tvEval(n.b, env);
    case '→': return !tvEval(n.a, env) || tvEval(n.b, env);
    default: return tvEval(n.a, env) === tvEval(n.b, env);
  }
}
function tvColunas(n, lista, vistos) {
  if (n.op === 'var') return;
  tvColunas(n.a, lista, vistos); if (n.b) tvColunas(n.b, lista, vistos);
  var k = tvStr(n, true);
  if (!vistos[k]) { vistos[k] = 1; lista.push(n); }
}
function tvLetras(n, set) { if (n.op === 'var') set[n.v] = 1; else { tvLetras(n.a, set); if (n.b) tvLetras(n.b, set); } }
function tvTabela(src) {
  var raiz = tvParse(tvTokens(src)), set = {};
  tvLetras(raiz, set);
  var vars = Object.keys(set).sort(), nv = vars.length;
  if (nv > 5) throw new Error('Use no máximo 5 letras diferentes (32 linhas).');
  var cols = []; tvColunas(raiz, cols, {});
  var linhas = [], nV = 0;
  for (var i = 0; i < (1 << nv); i++) {
    var env = {};
    vars.forEach(function (v, j) { env[v] = !((i >> (nv - 1 - j)) & 1); });
    var vals = vars.map(function (v) { return env[v]; }).concat(cols.map(function (c) { return tvEval(c, env); }));
    if (tvEval(raiz, env)) nV++;
    linhas.push(vals);
  }
  var tot = 1 << nv;
  return { vars: vars, cols: cols.map(function (c) { return tvStr(c, true); }), linhas: linhas, nV: nV, tot: tot,
    tipo: nV === tot ? 'Tautologia' : nV === 0 ? 'Contradição' : 'Contingência', raiz: tvStr(raiz, true) };
}
function laboratorioTV(el) {
  if (!el) return;
  var teclas = ['p', 'q', 'r', 's', '~', '∧', '∨', '⊻', '→', '↔', '(', ')'];
  var EX = ['(p → q) ↔ (~q → ~p)', 'p ∧ ~p', '((p → q) ∧ (q → r)) → (p → r)', '((p → q) ∧ q) → p', '~(p ∧ q) ↔ (~p ∨ ~q)'];
  el.innerHTML = '<label class="fld" for="tvl-in"><span class="tvl-lb">Proposição</span></label>' +
    '<input class="in tvl-campo" id="tvl-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text" placeholder="Ex.: (p → q) ↔ (~q → ~p)">' +
    '<div class="tvl-keys">' + teclas.map(function (k) { return '<button type="button" class="tvl-k" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('') +
    '<button type="button" class="tvl-k" data-k="apagar" aria-label="Apagar o último símbolo">⌫</button><button type="button" class="tvl-k tvl-w" data-k="limpar">Limpar</button></div>' +
    '<div class="tvl-ex"><span>Exemplos:</span>' + EX.map(function (x) { return '<button type="button" class="tvl-chip" data-ex="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
    '<p class="tvl-help">Também pode digitar: <code>-&gt;</code> para →, <code>&lt;-&gt;</code> para ↔, <code>^</code> para ∧, <code>v</code> para ∨, <code>!</code> para ~ e colchetes no lugar de parênteses. Ordem de prioridade: ~, ∧, ∨ e ⊻, →, ↔.</p>' +
    '<div class="tvl-out" aria-live="polite"></div>';
  var inp = el.querySelector('#tvl-in'), out = el.querySelector('.tvl-out');
  function desenhar() {
    var v = inp.value;
    if (!v.trim()) { out.innerHTML = '<p class="tvl-vazio">A tabela aparece aqui.</p>'; return; }
    var t;
    try { t = tvTabela(v); } catch (err) { out.innerHTML = '<p class="tvl-erro">' + esc(err.message) + '</p>'; return; }
    var cls = t.tipo === 'Tautologia' ? 'ok' : t.tipo === 'Contradição' ? 'no' : 'mid';
    var cab = t.vars.concat(t.cols);
    out.innerHTML = '<p class="tvl-res"><span class="st ' + cls + '">' + t.tipo + '</span> ' + t.tot + ' linhas · ' + t.nV + ' verdadeira' + (t.nV === 1 ? '' : 's') + ' · ' + (t.tot - t.nV) + ' falsa' + (t.tot - t.nV === 1 ? '' : 's') + '</p>' +
      '<div class="tblwrap"><table class="tv tvl-tab"><thead><tr>' + cab.map(function (c, j) { return '<th class="' + (j === cab.length - 1 ? 'fim' : j < t.vars.length ? 'var' : '') + '">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.linhas.map(function (l) { return '<tr>' + l.map(function (x, j) { return '<td class="' + (x ? 'v' : 'f') + (j === l.length - 1 ? ' fim' : '') + '">' + (x ? 'V' : 'F') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function inserir(txt) {
    var a = inp.selectionStart == null ? inp.value.length : inp.selectionStart, b = inp.selectionEnd == null ? a : inp.selectionEnd;
    var pre = inp.value.slice(0, a), pos = inp.value.slice(b);
    var sep = /[∧∨⊻→↔]/.test(txt) ? ' ' : '';
    var novo = (sep && pre && !/\s$/.test(pre) ? pre + ' ' : pre) + txt + sep;
    inp.value = novo + pos; inp.setSelectionRange(novo.length, novo.length); desenhar();
  }
  el.addEventListener('click', function (ev) {
    var k = ev.target.closest('[data-k]'), x = ev.target.closest('[data-ex]');
    if (x) { inp.value = x.getAttribute('data-ex'); desenhar(); return; }
    if (!k) return;
    var v = k.getAttribute('data-k');
    if (v === 'limpar') { inp.value = ''; desenhar(); return; }
    if (v === 'apagar') { inp.value = inp.value.replace(/\s+$/, '').slice(0, -1); desenhar(); return; }
    inserir(v);
  });
  inp.addEventListener('input', desenhar);
  inp.value = EX[0]; desenhar();
}

/* ============================ laboratório de fórmulas (Excel 2019 e LibreOffice Calc, em português) ============================ */
/* Precedência do Excel: negação (-), %, ^ (da esquerda para a direita), * e /, + e -, &, comparações. Por isso =-2^2 resulta em 4. */
var XL_ERRO = { '#DIV/0!': 'divisão por zero.', '#NOME?': 'nome de função ou de referência que o programa não reconhece.', '#VALOR!': 'tipo de dado errado (por exemplo, texto numa conta).',
  '#REF!': 'referência a uma célula que não existe.', '#N/D': 'valor não encontrado (comum no PROCV com correspondência exata).', '#NÚM!': 'número inválido para a função (por exemplo, raiz de número negativo).' };
function xlE(c) { return { erro: c }; }
function xlEhErro(v) { return v !== null && typeof v === 'object' && !!v.erro; }
function xlCol(s) { var n = 0; s = s.toUpperCase(); for (var i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64); return n; }
function xlColL(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); } return s; }
function xlRef(s) {
  var m = /^(\$?)([A-Za-z]{1,3})(\$?)(\d+)$/.exec(s);
  return m ? { ac: !!m[1], c: xlCol(m[2]), al: !!m[3], l: +m[4] } : null;
}
function xlRefStr(r) { return (r.ac ? '$' : '') + xlColL(r.c) + (r.al ? '$' : '') + r.l; }
function xlTokens(src) {
  var t = [], i = 0, s = String(src);
  while (i < s.length) {
    var c = s.charAt(i), r = s.slice(i), m;
    if (/\s/.test(c)) { i++; continue; }
    if (c === '"') {
      var j = i + 1, v = '';
      for (;;) {
        if (j >= s.length) throw new Error('Faltou fechar as aspas de um texto.');
        if (s.charAt(j) === '"') { if (s.charAt(j + 1) === '"') { v += '"'; j += 2; continue; } break; }
        v += s.charAt(j++);
      }
      t.push({ t: 'str', v: v, i: i, s: s.slice(i, j + 1) }); i = j + 1; continue;
    }
    if ((m = /^(\d+(,\d*)?|,\d+)/.exec(r))) { t.push({ t: 'num', v: parseFloat(m[0].replace(',', '.')), i: i, s: m[0] }); i += m[0].length; continue; }
    if ((m = /^(\$?[A-Za-z]{1,3}\$?\d+)(:(\$?[A-Za-z]{1,3}\$?\d+))?(?![A-Za-z0-9_.(À-ÿ])/.exec(r))) {
      var a = xlRef(m[1]), b = m[3] ? xlRef(m[3]) : null;
      if (a && (!m[3] || b)) { t.push({ t: b ? 'rng' : 'ref', a: a, b: b, i: i, s: m[0] }); i += m[0].length; continue; }
    }
    if ((m = /^[A-Za-zÀ-ÿ_][A-Za-zÀ-ÿ0-9_.]*/.exec(r))) {
      var nome = m[0].toUpperCase(), depois = s.slice(i + m[0].length).replace(/^\s+/, '');
      if (depois.charAt(0) === '(') t.push({ t: 'fn', v: nome, i: i, s: m[0] });
      else if (nome === 'VERDADEIRO' || nome === 'FALSO') t.push({ t: 'bool', v: nome === 'VERDADEIRO', i: i, s: m[0] });
      else t.push({ t: 'nome', v: m[0], i: i, s: m[0] });
      i += m[0].length; continue;
    }
    if ((m = /^(<>|<=|>=)/.exec(r))) { t.push({ t: 'op', v: m[0], i: i, s: m[0] }); i += 2; continue; }
    if ('=<>+-*/^&%();:'.indexOf(c) >= 0) { t.push({ t: 'op', v: c, i: i, s: c }); i++; continue; }
    if (c === ',') throw new Error('Use ponto e vírgula (;) para separar os argumentos; a vírgula é o separador decimal.');
    throw new Error('Caractere não reconhecido: “' + c + '”.');
  }
  return t;
}
function xlParse(src) {
  var s = String(src).replace(/^\s+/, '');
  if (s.charAt(0) !== '=') throw new Error('Toda fórmula começa com o sinal de igual (=).');
  var tk = xlTokens(s.slice(1)), i = 0;
  function ve(v) { return tk[i] && tk[i].t === 'op' && tk[i].v === v; }
  function cmp() { var a = cat(); while (tk[i] && tk[i].t === 'op' && /^(=|<>|<|>|<=|>=)$/.test(tk[i].v)) { var o = tk[i++].v; a = { k: 'bin', o: o, a: a, b: cat() }; } return a; }
  function cat() { var a = add(); while (ve('&')) { i++; a = { k: 'bin', o: '&', a: a, b: add() }; } return a; }
  function add() { var a = mul(); while (ve('+') || ve('-')) { var o = tk[i++].v; a = { k: 'bin', o: o, a: a, b: mul() }; } return a; }
  function mul() { var a = pot(); while (ve('*') || ve('/')) { var o = tk[i++].v; a = { k: 'bin', o: o, a: a, b: pot() }; } return a; }
  function pot() { var a = pct(); while (ve('^')) { i++; a = { k: 'bin', o: '^', a: a, b: pct() }; } return a; }
  function pct() { var a = un(); while (ve('%')) { i++; a = { k: 'pct', a: a }; } return a; }
  function un() { if (ve('-')) { i++; return { k: 'neg', a: un() }; } if (ve('+')) { i++; return un(); } return prim(); }
  function prim() {
    var x = tk[i];
    if (!x) throw new Error('A fórmula terminou antes do esperado.');
    if (x.t === 'num' || x.t === 'str' || x.t === 'bool') { i++; return { k: 'lit', v: x.v }; }
    if (x.t === 'ref') { i++; return { k: 'ref', r: x.a }; }
    if (x.t === 'rng') { i++; return { k: 'rng', a: x.a, b: x.b }; }
    if (x.t === 'nome') { i++; return { k: 'lit', v: xlE('#NOME?') }; }
    if (x.t === 'fn') {
      i++; i++; // nome e "("
      var args = [];
      if (ve(')')) { i++; return { k: 'fn', f: x.v, args: args }; }
      for (;;) {
        if (ve(';') || ve(')')) args.push({ k: 'vazio' }); else args.push(cmp());
        if (ve(';')) { i++; continue; }
        if (ve(')')) { i++; break; }
        throw new Error(tk[i] ? 'Esperava “;” ou “)” depois de um argumento de ' + x.v + '.' : 'Faltou fechar o parêntese de ' + x.v + '.');
      }
      return { k: 'fn', f: x.v, args: args };
    }
    if (ve('(')) { i++; var e = cmp(); if (!ve(')')) throw new Error('Falta fechar um parêntese.'); i++; return e; }
    throw new Error('Não esperava “' + x.s + '” nesta posição.');
  }
  if (!tk.length) throw new Error('Digite a fórmula depois do sinal de igual.');
  var raiz = cmp();
  if (i < tk.length) throw new Error(ve(')') ? 'Há um parêntese fechando sem ter sido aberto.' : 'Falta um operador antes de “' + tk[i].s + '”.');
  return raiz;
}
/* ---------- conversões ---------- */
function xlNumTexto(t) { var x = String(t).trim(); return /^-?(\d+(,\d+)?|,\d+)$/.test(x) ? parseFloat(x.replace(',', '.')) : null; }
function xlNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (xlEhErro(v)) return v;
  var n = xlNumTexto(v); return n === null ? xlE('#VALOR!') : n;
}
function xlFmt(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
  if (xlEhErro(v)) return v.erro;
  if (typeof v === 'number') { var x = Number(v.toPrecision(12)); if (Object.is(x, -0)) x = 0; return String(x).replace('.', ','); }
  return String(v);
}
function xlTexto(v) { return xlEhErro(v) ? v : xlFmt(v); }
function xlBool(v) {
  if (xlEhErro(v)) return v;
  if (typeof v === 'boolean') return v;
  if (v === null || v === undefined || v === '') return false;
  if (typeof v === 'number') return v !== 0;
  var u = String(v).toUpperCase(); if (u === 'VERDADEIRO') return true; if (u === 'FALSO') return false;
  return xlE('#VALOR!');
}
function xlTipo(v) { return v === null || v === undefined ? 0 : typeof v === 'number' ? 1 : typeof v === 'string' ? 2 : 3; }
function xlComparar(a, b) { /* -1, 0, 1 com as regras do Excel: números < textos < lógicos; texto sem diferenciar maiúsculas */
  if (a === null || a === undefined) a = typeof b === 'string' ? '' : typeof b === 'boolean' ? false : 0;
  if (b === null || b === undefined) b = typeof a === 'string' ? '' : typeof a === 'boolean' ? false : 0;
  var ta = xlTipo(a), tb = xlTipo(b);
  if (ta !== tb) return ta < tb ? -1 : 1;
  if (ta === 2) { a = a.toUpperCase(); b = b.toUpperCase(); }
  if (ta === 3) { a = a ? 1 : 0; b = b ? 1 : 0; }
  return a < b ? -1 : a > b ? 1 : 0;
}
function xlArred(x, d, modo) { /* modo: 'arred' (metade para longe do zero), 'cima' (longe do zero), 'baixo' (em direção ao zero) */
  var f = Math.pow(10, d), y = Math.abs(x) * f, s = x < 0 ? -1 : 1;
  y = Number(y.toPrecision(15));
  var r = modo === 'arred' ? Math.floor(y + 0.5) : modo === 'cima' ? Math.ceil(y) : Math.floor(y);
  return s * r / f;
}
/* ---------- avaliação ---------- */
function xlAvaliar(no, cel) {
  switch (no.k) {
    case 'lit': return no.v;
    case 'vazio': return null;
    case 'ref': return cel(no.r.c, no.r.l);
    case 'rng': return xlE('#VALOR!');
    case 'neg': var a = xlNum(xlAvaliar(no.a, cel)); return xlEhErro(a) ? a : -a;
    case 'pct': var p = xlNum(xlAvaliar(no.a, cel)); return xlEhErro(p) ? p : p / 100;
    case 'fn': return xlFuncao(no.f, no.args, cel);
  }
  var x = xlAvaliar(no.a, cel), y = xlAvaliar(no.b, cel);
  if (no.o === '&') { x = xlTexto(x); y = xlTexto(y); if (xlEhErro(x)) return x; if (xlEhErro(y)) return y; return x + y; }
  if (/^(=|<>|<|>|<=|>=)$/.test(no.o)) {
    if (xlEhErro(x)) return x; if (xlEhErro(y)) return y;
    var c = xlComparar(x, y);
    return no.o === '=' ? c === 0 : no.o === '<>' ? c !== 0 : no.o === '<' ? c < 0 : no.o === '>' ? c > 0 : no.o === '<=' ? c <= 0 : c >= 0;
  }
  x = xlNum(x); if (xlEhErro(x)) return x;
  y = xlNum(y); if (xlEhErro(y)) return y;
  if (no.o === '+') return x + y;
  if (no.o === '-') return x - y;
  if (no.o === '*') return x * y;
  if (no.o === '/') return y === 0 ? xlE('#DIV/0!') : x / y;
  if (x === 0 && y === 0) return xlE('#NÚM!');
  if (x < 0 && Math.floor(y) !== y) return xlE('#NÚM!');
  if (x === 0 && y < 0) return xlE('#DIV/0!');
  return Math.pow(x, y);
}
function xlMatriz(no, cel) { /* intervalo → matriz de valores; célula única → matriz 1×1 */
  if (no.k === 'rng') {
    var c1 = Math.min(no.a.c, no.b.c), c2 = Math.max(no.a.c, no.b.c), l1 = Math.min(no.a.l, no.b.l), l2 = Math.max(no.a.l, no.b.l), m = [];
    for (var l = l1; l <= l2; l++) { var lin = []; for (var c = c1; c <= c2; c++) lin.push(cel(c, l)); m.push(lin); }
    return m;
  }
  if (no.k === 'ref') return [[cel(no.r.c, no.r.l)]];
  return null;
}
function xlValores(args, cel) { /* lista {v, dir}: dir = argumento digitado diretamente (não veio de intervalo nem de referência) */
  var out = [];
  args.forEach(function (a) {
    var m = xlMatriz(a, cel);
    if (m) m.forEach(function (lin) { lin.forEach(function (v) { out.push({ v: v, dir: false }); }); });
    else out.push({ v: xlAvaliar(a, cel), dir: true });
  });
  return out;
}
function xlNumeros(args, cel) { /* números para SOMA, MÉDIA, MÁXIMO etc.: no intervalo, ignora textos, lógicos e vazias */
  var ns = [], vs = xlValores(args, cel);
  for (var i = 0; i < vs.length; i++) {
    var x = vs[i];
    if (xlEhErro(x.v)) return x.v;
    if (typeof x.v === 'number') ns.push(x.v);
    else if (x.dir && x.v !== null) { var n = xlNum(x.v); if (xlEhErro(n)) return n; ns.push(n); }
  }
  return ns;
}
function xlCriterio(cr) { /* critério de CONT.SE, SOMASE e MÉDIASE */
  if (xlEhErro(cr)) return function () { return false; };
  if (typeof cr === 'number' || typeof cr === 'boolean') return function (v) { return v !== null && xlComparar(v, cr) === 0; };
  var s = cr === null ? '' : String(cr), m = /^(<>|<=|>=|=|<|>)?([\s\S]*)$/.exec(s), op = m[1] || '=', alvo = m[2], n = xlNumTexto(alvo);
  if (n !== null) return function (v) {
    var x = typeof v === 'number' ? v : typeof v === 'string' ? xlNumTexto(v) : null;
    if (x === null) return op === '<>';
    var c = x < n ? -1 : x > n ? 1 : 0;
    return op === '=' ? c === 0 : op === '<>' ? c !== 0 : op === '<' ? c < 0 : op === '>' ? c > 0 : op === '<=' ? c <= 0 : c >= 0;
  };
  if (alvo === '') return op === '<>' ? function (v) { return v !== null && v !== ''; } : function (v) { return v === null || v === ''; };
  if (op === '=' || op === '<>') {
    var re = new RegExp('^' + alvo.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[\\s\\S]*').replace(/\?/g, '[\\s\\S]') + '$', 'i');
    return function (v) { var ok = typeof v === 'string' && re.test(v); return op === '=' ? ok : !ok; };
  }
  return function (v) { if (typeof v !== 'string') return false; var c = xlComparar(v, alvo); return op === '<' ? c < 0 : op === '>' ? c > 0 : op === '<=' ? c <= 0 : c >= 0; };
}
function xlProcurar(valor, chaves, exato) { /* índice na lista de chaves (PROCV, PROCH, CORRESP) ou -1 */
  if (exato) {
    for (var i = 0; i < chaves.length; i++) {
      var k = chaves[i];
      if (typeof valor === 'string' && typeof k === 'string') { if (xlCriterio(valor)(k)) return i; }
      else if (k !== null && xlComparar(k, valor) === 0) return i;
    }
    return -1;
  }
  var achou = -1; /* correspondência aproximada: maior valor menor ou igual (lista em ordem crescente) */
  for (var j = 0; j < chaves.length; j++) {
    if (chaves[j] === null || xlTipo(chaves[j]) !== xlTipo(valor)) continue;
    if (xlComparar(chaves[j], valor) <= 0) achou = j; else break;
  }
  return achou;
}
var XL_FUNCOES = 'SOMA MÉDIA MÁXIMO MÍNIMO CONT.NÚM CONT.VALORES CONTAR.VAZIO CONT.SE SOMASE MÉDIASE SE E OU NÃO SEERRO ARRED ARREDONDAR.PARA.CIMA ARREDONDAR.PARA.BAIXO TRUNCAR INT ABS MOD POTÊNCIA RAIZ MAIOR MENOR MED CONCATENAR CONCAT MAIÚSCULA MINÚSCULA PRI.MAIÚSCULA ESQUERDA DIREITA EXT.TEXTO NÚM.CARACT ARRUMAR PROCV PROCH ÍNDICE CORRESP'.split(' ');
function xlFuncao(f, args, cel) {
  var A = function (i) { return args[i] ? xlAvaliar(args[i], cel) : null; };
  var N = function (i) { return xlNum(A(i)); };
  var tem = function (i) { return args.length > i && args[i].k !== 'vazio'; };
  var faixa = function (min, max) { if (args.length < min || args.length > max) throw new Error(f + ' recebeu ' + args.length + ' argumento' + (args.length === 1 ? '' : 's') + '; esperava ' + (min === max ? min : min + ' a ' + max) + '.'); };
  var ns, x, d, m, i;
  switch (f) {
    case 'VERDADEIRO': faixa(0, 0); return true;
    case 'FALSO': faixa(0, 0); return false;
    case 'SOMA': faixa(1, 255); ns = xlNumeros(args, cel); return xlEhErro(ns) ? ns : ns.reduce(function (s, v) { return s + v; }, 0);
    case 'MÉDIA': faixa(1, 255); ns = xlNumeros(args, cel); if (xlEhErro(ns)) return ns; return ns.length ? ns.reduce(function (s, v) { return s + v; }, 0) / ns.length : xlE('#DIV/0!');
    case 'MÁXIMO': faixa(1, 255); ns = xlNumeros(args, cel); return xlEhErro(ns) ? ns : ns.length ? Math.max.apply(null, ns) : 0;
    case 'MÍNIMO': faixa(1, 255); ns = xlNumeros(args, cel); return xlEhErro(ns) ? ns : ns.length ? Math.min.apply(null, ns) : 0;
    case 'MED': faixa(1, 255); ns = xlNumeros(args, cel); if (xlEhErro(ns)) return ns; if (!ns.length) return xlE('#NÚM!');
      ns.sort(function (a, b) { return a - b; }); m = ns.length >> 1; return ns.length % 2 ? ns[m] : (ns[m - 1] + ns[m]) / 2;
    case 'CONT.NÚM': faixa(1, 255); return xlValores(args, cel).filter(function (x) { return typeof x.v === 'number' || (x.dir && (typeof x.v === 'boolean' || (typeof x.v === 'string' && xlNumTexto(x.v) !== null))); }).length;
    case 'CONT.VALORES': faixa(1, 255); return xlValores(args, cel).filter(function (x) { return x.v !== null && !(x.dir === false && x.v === undefined); }).length;
    case 'CONTAR.VAZIO': faixa(1, 1); m = xlMatriz(args[0], cel); if (!m) return xlE('#VALOR!');
      return [].concat.apply([], m).filter(function (v) { return v === null || v === ''; }).length;
    case 'CONT.SE': case 'SOMASE': case 'MÉDIASE':
      faixa(2, f === 'CONT.SE' ? 2 : 3);
      m = xlMatriz(args[0], cel); if (!m) return xlE('#VALOR!');
      var crit = xlCriterio(A(1)), alvo = tem(2) ? xlMatriz(args[2], cel) : m;
      if (!alvo) return xlE('#VALOR!');
      var cont = 0, soma = 0;
      m.forEach(function (lin, li) { lin.forEach(function (v, ci) {
        if (!crit(v)) return; cont++;
        var w = alvo[li] && alvo[li][ci] !== undefined ? alvo[li][ci] : null; /* intervalo de soma do mesmo tamanho (alinhado pelo canto) */
        if (typeof w === 'number') soma += w;
      }); });
      if (f === 'CONT.SE') return cont;
      if (f === 'SOMASE') return soma;
      var nums = 0; m.forEach(function (lin, li) { lin.forEach(function (v, ci) { if (crit(v) && alvo[li] && typeof alvo[li][ci] === 'number') nums++; }); });
      return nums ? soma / nums : xlE('#DIV/0!');
    case 'SE':
      faixa(1, 3); x = xlBool(A(0)); if (xlEhErro(x)) return x;
      if (x) return tem(1) ? A(1) : 0;
      return args.length > 2 ? (tem(2) ? A(2) : 0) : false;
    case 'E': case 'OU':
      faixa(1, 255); var bs = [];
      for (i = 0; i < args.length; i++) {
        var mm = xlMatriz(args[i], cel);
        if (mm && args[i].k === 'rng') { [].concat.apply([], mm).forEach(function (v) { if (typeof v === 'boolean' || typeof v === 'number') bs.push(xlBool(v)); else if (xlEhErro(v)) bs.push(v); }); continue; }
        var b = xlBool(A(i)); if (xlEhErro(b)) return b; bs.push(b);
      }
      for (i = 0; i < bs.length; i++) if (xlEhErro(bs[i])) return bs[i];
      if (!bs.length) return xlE('#VALOR!');
      return f === 'E' ? bs.every(Boolean) : bs.some(Boolean);
    case 'NÃO': faixa(1, 1); x = xlBool(A(0)); return xlEhErro(x) ? x : !x;
    case 'SEERRO': faixa(2, 2); x = A(0); return xlEhErro(x) ? A(1) : x;
    case 'ARRED': case 'ARREDONDAR.PARA.CIMA': case 'ARREDONDAR.PARA.BAIXO':
      faixa(2, 2); x = N(0); d = N(1); if (xlEhErro(x)) return x; if (xlEhErro(d)) return d;
      return xlArred(x, Math.trunc(d), f === 'ARRED' ? 'arred' : f === 'ARREDONDAR.PARA.CIMA' ? 'cima' : 'baixo');
    case 'TRUNCAR': faixa(1, 2); x = N(0); d = tem(1) ? N(1) : 0; if (xlEhErro(x)) return x; if (xlEhErro(d)) return d; return xlArred(x, Math.trunc(d), 'baixo');
    case 'INT': faixa(1, 1); x = N(0); return xlEhErro(x) ? x : Math.floor(Number(x.toPrecision(15)));
    case 'ABS': faixa(1, 1); x = N(0); return xlEhErro(x) ? x : Math.abs(x);
    case 'MOD': faixa(2, 2); x = N(0); d = N(1); if (xlEhErro(x)) return x; if (xlEhErro(d)) return d; if (d === 0) return xlE('#DIV/0!');
      return Number((x - d * Math.floor(x / d)).toPrecision(15));
    case 'POTÊNCIA': faixa(2, 2); return xlAvaliar({ k: 'bin', o: '^', a: args[0], b: args[1] }, cel);
    case 'RAIZ': faixa(1, 1); x = N(0); if (xlEhErro(x)) return x; return x < 0 ? xlE('#NÚM!') : Math.sqrt(x);
    case 'MAIOR': case 'MENOR':
      faixa(2, 2); ns = xlNumeros([args[0]], cel); if (xlEhErro(ns)) return ns; d = N(1); if (xlEhErro(d)) return d; d = Math.ceil(d);
      if (d < 1 || d > ns.length) return xlE('#NÚM!');
      ns.sort(function (a, b) { return f === 'MAIOR' ? b - a : a - b; }); return ns[d - 1];
    case 'CONCATENAR': case 'CONCAT':
      faixa(1, 255); var txt = '';
      for (i = 0; i < args.length; i++) {
        if (args[i].k === 'rng') {
          if (f === 'CONCATENAR') return xlE('#VALOR!');
          var mt = xlMatriz(args[i], cel), er = null;
          [].concat.apply([], mt).forEach(function (v) { if (xlEhErro(v)) er = er || v; else txt += xlFmt(v); });
          if (er) return er; continue;
        }
        x = xlTexto(A(i)); if (xlEhErro(x)) return x; txt += x;
      }
      return txt;
    case 'MAIÚSCULA': case 'MINÚSCULA': case 'PRI.MAIÚSCULA': case 'ARRUMAR': case 'NÚM.CARACT':
      faixa(1, 1); x = xlTexto(A(0)); if (xlEhErro(x)) return x;
      if (f === 'MAIÚSCULA') return x.toUpperCase();
      if (f === 'MINÚSCULA') return x.toLowerCase();
      if (f === 'ARRUMAR') return x.replace(/ +/g, ' ').trim();
      if (f === 'NÚM.CARACT') return x.length;
      return x.toLowerCase().replace(/(^|[^A-Za-zÀ-ÿ])([a-zà-ÿ])/g, function (_, a, b) { return a + b.toUpperCase(); });
    case 'ESQUERDA': case 'DIREITA':
      faixa(1, 2); x = xlTexto(A(0)); if (xlEhErro(x)) return x; d = tem(1) ? N(1) : 1; if (xlEhErro(d)) return d;
      if (d < 0) return xlE('#VALOR!'); d = Math.floor(d);
      return f === 'ESQUERDA' ? x.slice(0, d) : (d === 0 ? '' : x.slice(-d));
    case 'EXT.TEXTO':
      faixa(3, 3); x = xlTexto(A(0)); if (xlEhErro(x)) return x; var ini = N(1), qt = N(2);
      if (xlEhErro(ini)) return ini; if (xlEhErro(qt)) return qt; if (ini < 1 || qt < 0) return xlE('#VALOR!');
      return x.substr(Math.floor(ini) - 1, Math.floor(qt));
    case 'PROCV': case 'PROCH':
      faixa(3, 4); var val = A(0); if (xlEhErro(val)) return val;
      m = xlMatriz(args[1], cel); if (!m) return xlE('#VALOR!');
      var col = N(2); if (xlEhErro(col)) return col; col = Math.floor(col);
      var aprox = tem(3) ? xlBool(A(3)) : true; if (xlEhErro(aprox)) return aprox;
      var vert = f === 'PROCV', largura = vert ? m[0].length : m.length;
      if (col < 1) return xlE('#VALOR!'); if (col > largura) return xlE('#REF!');
      var chaves = vert ? m.map(function (l) { return l[0]; }) : m[0];
      var k = xlProcurar(val, chaves, !aprox);
      if (k < 0) return xlE('#N/D');
      var res = vert ? m[k][col - 1] : m[col - 1][k];
      return res === null ? 0 : res;
    case 'ÍNDICE':
      faixa(2, 3); m = xlMatriz(args[0], cel); if (!m) return xlE('#VALOR!');
      var li = N(1), ci = tem(2) ? N(2) : 1; if (xlEhErro(li)) return li; if (xlEhErro(ci)) return ci;
      if (m.length === 1 && !tem(2)) { ci = li; li = 1; }
      if (li < 1 || ci < 1 || li > m.length || ci > m[0].length) return xlE('#REF!');
      return m[li - 1][ci - 1] === null ? 0 : m[li - 1][ci - 1];
    case 'CORRESP':
      faixa(2, 3); val = A(0); if (xlEhErro(val)) return val; m = xlMatriz(args[1], cel); if (!m) return xlE('#VALOR!');
      var tipo = tem(2) ? N(2) : 1; if (xlEhErro(tipo)) return tipo;
      var lista = m.length === 1 ? m[0] : m.map(function (l) { return l[0]; });
      if (tipo === -1) return xlE('#N/D');
      k = xlProcurar(val, lista, tipo === 0);
      return k < 0 ? xlE('#N/D') : k + 1;
  }
  return xlE('#NOME?');
}
/* ---------- copiar e colar: ajusta as referências relativas ---------- */
function xlCopiar(formula, de, para) {
  var o = xlRef(de), p = xlRef(para);
  if (!o || !p) throw new Error('Use endereços de célula como B2 ou F5.');
  var dc = p.c - o.c, dl = p.l - o.l, s = String(formula).replace(/^\s+/, '');
  if (s.charAt(0) !== '=') throw new Error('Toda fórmula começa com o sinal de igual (=).');
  var corpo = s.slice(1), tk = xlTokens(corpo), out = '', pos = 0;
  function mover(r) {
    var n = { ac: r.ac, c: r.ac ? r.c : r.c + dc, al: r.al, l: r.al ? r.l : r.l + dl };
    return n.c < 1 || n.l < 1 || n.c > 16384 || n.l > 1048576 ? null : n;
  }
  tk.forEach(function (t) {
    if (t.t !== 'ref' && t.t !== 'rng') return;
    out += corpo.slice(pos, t.i);
    var a = mover(t.a), b = t.b ? mover(t.b) : null;
    out += !a || (t.b && !b) ? '#REF!' : xlRefStr(a) + (t.b ? ':' + xlRefStr(b) : '');
    pos = t.i + t.s.length;
  });
  return '=' + out + corpo.slice(pos);
}
function xlCalcular(formula, grade, alvo) {
  /* grade: { 'A1': valor, ... }; alvo: célula onde a fórmula está (para detectar referência circular) */
  var raiz = xlParse(formula), a = alvo ? xlRef(alvo) : null, circ = false;
  function cel(c, l) {
    if (a && c === a.c && l === a.l) { circ = true; return 0; }
    var v = grade[xlColL(c) + l]; return v === undefined ? null : v;
  }
  var v = xlAvaliar(raiz, cel);
  if (circ) throw new Error('Referência circular: a fórmula usa a própria célula ' + alvo.toUpperCase().replace(/\$/g, '') + '.');
  return v;
}
function laboratorioXL(el, conf) {
  if (!el) return;
  conf = conf || {};
  var G = conf.grade || {}, NC = conf.colunas || 8, NL = conf.linhas || 10;
  var EX = conf.exemplos || ['=SOMA(C2:C7)', '=MÉDIA(D2:D7)', '=-2^2', '=2+3*4^2', '=SE(C2>=7;"Apto";"Inapto")', '=CONT.SE(C2:C7;">=7")', '=SOMASE(B2:B7;"A";D2:D7)', '=PROCV("Diego";A2:E7;4;0)', '=ARRED(MÉDIA(C2:C7);1)', '=$C2*D$1'];
  var teclas = ['=', ';', ':', '$', '(', ')', '"', '&', '<', '>', '%', '^'];
  el.innerHTML =
    '<div class="xll-barra"><label class="xll-cel"><span class="tvl-lb">Célula</span><input class="in" id="xl-alvo" value="' + esc(conf.alvo || 'G2') + '" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Célula onde a fórmula é digitada"></label>' +
    '<label class="xll-fx"><span class="tvl-lb">Fórmula <i>fx</i></span><input class="in tvl-campo" id="xl-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="=SOMA(C2:C7)"></label></div>' +
    '<div class="tvl-keys xll-keys">' + teclas.map(function (k) { return '<button type="button" class="tvl-k" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('') +
    '<button type="button" class="tvl-k" data-k="apagar" aria-label="Apagar o último caractere">⌫</button><button type="button" class="tvl-k tvl-w" data-k="limpar">Limpar</button></div>' +
    '<div class="tvl-ex"><span>Exemplos:</span>' + EX.map(function (x) { return '<button type="button" class="tvl-chip" data-ex="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>' +
    '<div class="xll-out" aria-live="polite"></div>' +
    '<div class="xll-copia"><label><span class="tvl-lb">Copiar e colar em</span><input class="in" id="xl-dest" value="' + esc(conf.destino || 'G3') + '" maxlength="7" autocomplete="off" autocapitalize="characters" spellcheck="false"></label><div class="xll-cres"></div></div>' +
    '<p class="tvl-help">Toque numa célula da planilha para inserir o endereço dela na fórmula. Como no Excel 2019 e no LibreOffice Calc em português: funções em português, argumentos separados por <code>;</code>, decimais com vírgula e <code>$</code> para travar coluna ou linha. Funções disponíveis: ' + XL_FUNCOES.join(', ') + '.</p>' +
    '<div class="tblwrap"><table class="xl xll-grade"></table></div>';
  var inp = el.querySelector('#xl-in'), alvo = el.querySelector('#xl-alvo'), dest = el.querySelector('#xl-dest');
  var out = el.querySelector('.xll-out'), cres = el.querySelector('.xll-cres'), tab = el.querySelector('.xll-grade');
  function norm(s) { return String(s || '').replace(/\s|\$/g, '').toUpperCase(); }
  function valida(s) { var r = xlRef(norm(s)); return r && r.c <= NC && r.l <= NL ? xlColL(r.c) + r.l : null; }
  function explica(v) { return xlEhErro(v) ? ' <span class="xll-err">' + esc(v.erro) + ': ' + esc(XL_ERRO[v.erro] || '') + '</span>' : ''; }
  function mostra(v) { return typeof v === 'string' ? '“' + esc(v) + '” <small>(texto)</small>' : typeof v === 'boolean' ? esc(xlFmt(v)) + ' <small>(lógico)</small>' : esc(xlFmt(v)); }
  function desenhar() {
    var a = valida(alvo.value), d = valida(dest.value), f = inp.value.trim(), extra = {}, msg = '', cmsg = '';
    if (!a) msg = '<p class="tvl-erro">Célula inválida. Use um endereço entre A1 e ' + xlColL(NC) + NL + '.</p>';
    else if (G[a] !== undefined) msg = '<p class="tvl-erro">A célula ' + a + ' já tem dados. Escolha uma célula vazia (por exemplo, nas colunas F a ' + xlColL(NC) + ').</p>';
    else if (!f) msg = '<p class="tvl-vazio">Digite uma fórmula que comece com =.</p>';
    else {
      try {
        var v = xlCalcular(f, G, a); extra[a] = v;
        msg = '<p class="tvl-res"><span class="st ' + (xlEhErro(v) ? 'no' : 'ok') + '">' + a + '</span> ' + mostra(v) + explica(v) + '</p>';
        if (!d) cmsg = '<p class="tvl-erro">Destino inválido. Use um endereço entre A1 e ' + xlColL(NC) + NL + '.</p>';
        else if (d === a) cmsg = '<p class="tvl-vazio">Escolha um destino diferente de ' + a + '.</p>';
        else if (G[d] !== undefined) cmsg = '<p class="tvl-vazio">' + d + ' já tem dados; escolha uma célula vazia como destino.</p>';
        else {
          var f2 = xlCopiar(f, a, d), v2;
          try { v2 = /#REF!/.test(f2) ? xlE('#REF!') : xlCalcular(f2, G, d); extra[d] = v2; cmsg = '<p class="tvl-res"><code>' + esc(f2) + '</code> → ' + mostra(v2) + explica(v2) + '</p>'; }
          catch (e2) { cmsg = '<p class="tvl-res"><code>' + esc(f2) + '</code></p><p class="tvl-erro">' + esc(e2.message) + '</p>'; }
        }
      } catch (err) { msg = '<p class="tvl-erro">' + esc(err.message) + '</p>'; }
    }
    out.innerHTML = msg; cres.innerHTML = cmsg;
    var h = '<thead><tr><th></th>';
    for (var c = 1; c <= NC; c++) h += '<th>' + xlColL(c) + '</th>';
    h += '</tr></thead><tbody>';
    for (var l = 1; l <= NL; l++) {
      h += '<tr><th>' + l + '</th>';
      for (c = 1; c <= NC; c++) {
        var k = xlColL(c) + l, val = G[k] !== undefined ? G[k] : extra[k], cls = [];
        if (k === a) cls.push('sel'); if (k === d) cls.push('dst');
        if (typeof val === 'number' || xlEhErro(val) || typeof val === 'boolean') cls.push('n');
        if (l === 1 && G[k] !== undefined && typeof G[k] === 'string') cls.push('cab');
        h += '<td data-ref="' + k + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + esc(val === undefined || val === null ? '' : xlFmt(val)) + '</td>';
      }
      h += '</tr>';
    }
    tab.innerHTML = h + '</tbody>';
  }
  var cursor = null; /* posição do cursor depois de inserir por botão ou célula: restaurada quando o campo recebe o foco */
  function inserir(txt) {
    var a = cursor !== null ? cursor : inp.selectionStart == null ? inp.value.length : inp.selectionStart, b = cursor !== null ? cursor : inp.selectionEnd == null ? a : inp.selectionEnd;
    var novo = inp.value.slice(0, a) + txt; inp.value = novo + inp.value.slice(b);
    cursor = novo.length;
    try { inp.setSelectionRange(cursor, cursor); } catch (e) { }
    desenhar();
  }
  inp.addEventListener('focus', function () { if (cursor !== null) { try { inp.setSelectionRange(cursor, cursor); } catch (e) { } } });
  inp.addEventListener('keydown', function () { cursor = null; });
  inp.addEventListener('mousedown', function () { cursor = null; });
  inp.addEventListener('touchstart', function () { cursor = null; }, { passive: true });
  el.addEventListener('click', function (ev) {
    var k = ev.target.closest('[data-k]'), x = ev.target.closest('[data-ex]'), td = ev.target.closest('td[data-ref]');
    if (x) { inp.value = x.getAttribute('data-ex'); cursor = inp.value.length; desenhar(); return; }
    if (td) { if (!inp.value) { inp.value = '='; cursor = 1; } inserir(td.getAttribute('data-ref')); return; }
    if (!k) return;
    var v = k.getAttribute('data-k');
    if (v === 'limpar') { inp.value = ''; cursor = 0; desenhar(); return; }
    if (v === 'apagar') { inp.value = inp.value.slice(0, -1); cursor = inp.value.length; desenhar(); return; }
    inserir(v);
  });
  [inp, alvo, dest].forEach(function (e) { e.addEventListener('input', desenhar); });
  inp.value = conf.inicial || EX[0]; desenhar();
}

/* ============================ calculadora de frações de pena ============================ */
/* Convenção usada em provas e na prática forense: ano de 12 meses e mês de 30 dias (ano = 360 dias); frações de dia são desprezadas (art. 11 do Código Penal). */
function penaDias(a, m, d) { return (+a || 0) * 360 + (+m || 0) * 30 + (+d || 0); }
function penaTexto(dias) {
  dias = Math.floor(dias + 1e-9);
  if (dias <= 0) return '0 dia';
  var a = Math.floor(dias / 360), m = Math.floor((dias % 360) / 30), d = dias % 30, p = [];
  if (a) p.push(a + (a === 1 ? ' ano' : ' anos'));
  if (m) p.push(m + (m === 1 ? ' mês' : ' meses'));
  if (d) p.push(d + (d === 1 ? ' dia' : ' dias'));
  return p.length === 1 ? p[0] : p.slice(0, -1).join(', ') + ' e ' + p[p.length - 1];
}
function penaCalcular(base, op, n, den) {
  /* base em dias; op: 'diminuir' | 'aumentar' | 'fracao'; fração n/den */
  if (!(den > 0) || !(n >= 0)) throw new Error('Informe uma fração válida (denominador maior que zero).');
  if (!(base > 0)) throw new Error('Informe a pena-base (anos, meses e/ou dias).');
  var parte = base * n / den, res = op === 'aumentar' ? base + parte : op === 'diminuir' ? base - parte : parte;
  if (res < 0) throw new Error('A diminuição é maior que a própria pena.');
  return { parte: Math.floor(parte + 1e-9), res: Math.floor(res + 1e-9) };
}
function calculadoraPena(el, conf) {
  if (!el) return;
  conf = conf || {};
  var FR = conf.fracoes || [['1/6', 1, 6], ['1/5', 1, 5], ['1/4', 1, 4], ['1/3', 1, 3], ['2/5', 2, 5], ['1/2', 1, 2], ['3/5', 3, 5], ['2/3', 2, 3], ['20%', 20, 100], ['25%', 25, 100], ['30%', 30, 100], ['70%', 70, 100], ['75%', 75, 100], ['80%', 80, 100], ['85%', 85, 100]];
  var EX = conf.exemplos || [];
  el.innerHTML =
    '<div class="pn-grid"><label><span class="tvl-lb">Anos</span><input class="in" id="pn-a" type="number" min="0" inputmode="numeric" value="' + (conf.anos != null ? conf.anos : 5) + '"></label>' +
    '<label><span class="tvl-lb">Meses</span><input class="in" id="pn-m" type="number" min="0" inputmode="numeric" value="0"></label>' +
    '<label><span class="tvl-lb">Dias</span><input class="in" id="pn-d" type="number" min="0" inputmode="numeric" value="0"></label></div>' +
    '<div class="pn-ops" role="group" aria-label="Operação"><button type="button" class="tvl-k tvl-w" data-op="diminuir" aria-pressed="true">Diminuir</button><button type="button" class="tvl-k tvl-w" data-op="aumentar" aria-pressed="false">Aumentar</button><button type="button" class="tvl-k tvl-w" data-op="fracao" aria-pressed="false">Só a fração</button></div>' +
    '<div class="pn-frac"><span class="tvl-lb">Fração</span><input class="in" id="pn-n" type="number" min="0" inputmode="numeric" value="2" aria-label="Numerador"><span class="pn-bar">/</span><input class="in" id="pn-q" type="number" min="1" inputmode="numeric" value="3" aria-label="Denominador"></div>' +
    '<div class="tvl-ex"><span>Frações:</span>' + FR.map(function (f) { return '<button type="button" class="tvl-chip" data-n="' + f[1] + '" data-q="' + f[2] + '">' + esc(f[0]) + '</button>'; }).join('') + '</div>' +
    (EX.length ? '<div class="tvl-ex"><span>Situações:</span>' + EX.map(function (x, i) { return '<button type="button" class="tvl-chip" data-x="' + i + '">' + esc(x[0]) + '</button>'; }).join('') + '</div>' : '') +
    '<div class="pn-out" aria-live="polite"></div>' +
    '<p class="tvl-help">Convenção das provas e da prática forense: ano de 12 meses e mês de 30 dias; frações de dia são desprezadas (art. 11 do Código Penal). Percentuais (como os do art. 112 da Lei de Execução Penal) funcionam como frações de denominador 100.</p>';
  var $i = function (id) { return el.querySelector('#' + id); }, op = 'diminuir', out = el.querySelector('.pn-out');
  function desenhar() {
    var base = penaDias($i('pn-a').value, $i('pn-m').value, $i('pn-d').value), n = +$i('pn-n').value, q = +$i('pn-q').value, r;
    try { r = penaCalcular(base, op, n, q); } catch (err) { out.innerHTML = '<p class="tvl-erro">' + esc(err.message) + '</p>'; return; }
    var fr = n + '/' + q, nome = op === 'aumentar' ? 'Aumento de ' + fr : op === 'diminuir' ? 'Diminuição de ' + fr : fr + ' da pena';
    out.innerHTML = '<p class="tvl-res"><span class="st ok">' + esc(nome) + '</span> ' + esc(penaTexto(r.res)) + '</p>' +
      '<ol class="pn-passos"><li>Pena-base: <b>' + esc(penaTexto(base)) + '</b> = ' + base.toLocaleString('pt-BR') + ' dias.</li>' +
      '<li>' + esc(fr) + ' de ' + base.toLocaleString('pt-BR') + ' dias = <b>' + r.parte.toLocaleString('pt-BR') + ' dias</b> (' + esc(penaTexto(r.parte)) + ').</li>' +
      (op === 'fracao' ? '' : '<li>' + base.toLocaleString('pt-BR') + (op === 'aumentar' ? ' + ' : ' − ') + r.parte.toLocaleString('pt-BR') + ' = <b>' + r.res.toLocaleString('pt-BR') + ' dias</b> = ' + esc(penaTexto(r.res)) + '.</li>') + '</ol>';
  }
  el.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-op]'), c = ev.target.closest('[data-n]'), x = ev.target.closest('[data-x]');
    if (b) { op = b.getAttribute('data-op'); Array.prototype.forEach.call(el.querySelectorAll('[data-op]'), function (k) { k.setAttribute('aria-pressed', String(k === b)); }); desenhar(); }
    if (c) { $i('pn-n').value = c.getAttribute('data-n'); $i('pn-q').value = c.getAttribute('data-q'); desenhar(); }
    if (x) {
      var e = EX[+x.getAttribute('data-x')]; $i('pn-a').value = e[1]; $i('pn-m').value = e[2]; $i('pn-d').value = 0; $i('pn-n').value = e[4]; $i('pn-q').value = e[5];
      op = e[3]; Array.prototype.forEach.call(el.querySelectorAll('[data-op]'), function (k) { k.setAttribute('aria-pressed', String(k.getAttribute('data-op') === op)); }); desenhar();
    }
  });
  ['pn-a', 'pn-m', 'pn-d', 'pn-n', 'pn-q'].forEach(function (id) { $i(id).addEventListener('input', desenhar); });
  desenhar();
}

/* ============================ calculadora de quóruns ============================ */
/* Quórum é número MÍNIMO de votos: frações arredondam para cima; maioria absoluta = primeiro inteiro acima da metade dos membros. */
var QUORUNS = {
  ma: { nome: 'Maioria absoluta', usos: 'lei complementar (art. 69); rejeição de veto, em sessão conjunta (art. 66, § 4º); aprovação do estado de defesa e autorização do estado de sítio (arts. 136, § 4º, e 137, parágrafo único); aprovação de Ministro do STF pelo Senado (art. 101, parágrafo único); perda de mandato de parlamentar (art. 55, § 2º); quórum de presença para deliberar (art. 47)' },
  ms: { nome: 'Maioria simples (dos presentes)', usos: 'regra geral das deliberações, presente a maioria absoluta dos membros (art. 47): leis ordinárias, decretos legislativos e resoluções, salvo exigência constitucional diversa' },
  f35: { n: 3, d: 5, nome: 'Três quintos', usos: 'emenda à Constituição, em cada Casa e em dois turnos (art. 60, § 2º); tratados de direitos humanos com força de emenda (art. 5º, § 3º)' },
  f23: { n: 2, d: 3, nome: 'Dois terços', usos: 'autorização da Câmara para processo contra o Presidente da República (arts. 51, I, e 86); condenação pelo Senado nos crimes de responsabilidade (art. 52, parágrafo único); aprovação de lei orgânica municipal, em dois turnos (art. 29)' },
  f13: { n: 1, d: 3, nome: 'Um terço', usos: 'requerimento de criação de CPI (art. 58, § 3º); proposta de emenda à Constituição por parlamentares (art. 60, I)' },
  fr: { nome: 'Outra fração', usos: 'fração escolhida por você' }
};
function quorumCalcular(membros, tipo, n, d, presentes) {
  membros = Math.floor(+membros);
  if (!(membros > 0)) throw new Error('Informe o número de membros da Casa.');
  var Q = QUORUNS[tipo] || QUORUNS.ma, metade = membros / 2, ma = Math.floor(membros / 2) + 1, r = { tipo: tipo, nome: Q.nome, usos: Q.usos, membros: membros, ma: ma, passos: [] };
  var fmt = function (x) { return (Math.round(x * 100) / 100).toLocaleString('pt-BR'); };
  if (tipo === 'ma') {
    r.votos = ma;
    r.passos.push('Metade de ' + membros + ' = ' + fmt(metade) + '.');
    r.passos.push('Maioria absoluta é o primeiro número inteiro acima da metade dos membros: <b>' + ma + '</b> votos, ainda que nem todos estejam presentes.');
    return r;
  }
  if (tipo === 'ms') {
    presentes = Math.floor(+presentes);
    if (!(presentes > 0)) throw new Error('Informe quantos membros estão presentes.');
    if (presentes > membros) throw new Error('Os presentes não podem passar do total de membros.');
    r.passos.push('Quórum de presença (art. 47): maioria absoluta dos membros, ou seja, ' + ma + ' presentes.');
    if (presentes < ma) { r.votos = null; r.semQuorum = true; r.passos.push('Com ' + presentes + ' presentes, a Casa <b>não pode deliberar</b>: faltam ' + (ma - presentes) + ' membros.'); return r; }
    r.votos = Math.floor(presentes / 2) + 1;
    r.passos.push('Com ' + presentes + ' presentes, a maioria dos presentes é o primeiro inteiro acima de ' + fmt(presentes / 2) + ': <b>' + r.votos + '</b> votos (se todos votarem).');
    return r;
  }
  if (tipo === 'fr') { n = Math.floor(+n); d = Math.floor(+d); } else { n = Q.n; d = Q.d; }
  if (!(d > 0) || !(n > 0) || n > d) throw new Error('Informe uma fração entre 0 e 1 (numerador menor ou igual ao denominador).');
  var exato = membros * n / d, votos = Math.ceil(exato - 1e-9);
  r.n = n; r.d = d; r.votos = votos;
  r.passos.push(n + '/' + d + ' de ' + membros + ' = ' + membros + ' × ' + n + ' ÷ ' + d + ' = ' + fmt(exato) + '.');
  r.passos.push(Math.abs(exato - Math.round(exato)) < 1e-9 ? 'O resultado é exato: <b>' + votos + '</b> votos.' : 'Não existe fração de voto e o quórum é o mínimo exigido: arredonda-se para cima, <b>' + votos + '</b> votos (com ' + (votos - 1) + ' votos não se alcança ' + n + '/' + d + ').');
  return r;
}
function calculadoraQuorum(el, conf) {
  if (!el) return;
  conf = conf || {};
  var CASAS = conf.casas || [['Câmara dos Deputados', 513], ['Senado Federal', 81], ['Assembleia Legislativa de PE', 49]];
  var tipo = QUORUNS[conf.quorum] ? conf.quorum : 'f35';
  el.innerHTML =
    '<div class="tvl-ex"><span>Casa:</span>' + CASAS.map(function (c, i) { return '<button type="button" class="tvl-chip" data-casa="' + i + '">' + esc(c[0]) + ' (' + c[1] + ')</button>'; }).join('') + '</div>' +
    '<div class="pn-grid qr-grid"><label><span class="tvl-lb">Membros</span><input class="in" id="qr-m" type="number" min="1" inputmode="numeric" value="' + (conf.membros || CASAS[0][1]) + '"></label>' +
    '<label><span class="tvl-lb">Presentes</span><input class="in" id="qr-p" type="number" min="1" inputmode="numeric" value="' + (conf.presentes || 300) + '"></label>' +
    '</div><div class="pn-frac"><span class="tvl-lb">Outra fração</span><input class="in" id="qr-n" type="number" min="1" inputmode="numeric" value="1" aria-label="Numerador"><span class="pn-bar">/</span><input class="in" id="qr-d" type="number" min="1" inputmode="numeric" value="5" aria-label="Denominador"></div>' +
    '<div class="qr-tipos" role="group" aria-label="Quórum">' + Object.keys(QUORUNS).map(function (k) { return '<button type="button" class="tvl-k tvl-w" data-qt="' + k + '" aria-pressed="' + (k === tipo) + '">' + esc(QUORUNS[k].nome) + '</button>'; }).join('') + '</div>' +
    '<div class="pn-out" aria-live="polite"></div>' +
    '<p class="tvl-help">Use “Presentes” só na maioria simples e “Fração” só em “Outra fração”. Na Câmara (513) e no Senado (81), os números valem para cada Casa; em sessão conjunta, cada Casa vota e é contada separadamente.</p>';
  var $i = function (id) { return el.querySelector('#' + id); }, out = el.querySelector('.pn-out');
  function frac(n, d) { return '<span class="qf"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function desenhar() {
    var r;
    try { r = quorumCalcular($i('qr-m').value, tipo, $i('qr-n').value, $i('qr-d').value, $i('qr-p').value); } catch (err) { out.innerHTML = '<p class="tvl-erro">' + esc(err.message) + '</p>'; return; }
    var rot = r.n ? frac(r.n, r.d) + ' de ' + r.membros : esc(r.nome);
    out.innerHTML = '<p class="tvl-res"><span class="st ' + (r.semQuorum ? 'no' : 'ok') + '">' + rot + '</span> ' + (r.semQuorum ? 'sem quórum para deliberar' : r.votos + ' votos no mínimo') + '</p>' +
      '<ol class="pn-passos">' + r.passos.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>' +
      '<p class="qr-usos"><b>Onde a CF exige:</b> ' + esc(r.usos) + '.</p>';
  }
  el.addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-casa]'), b = ev.target.closest('[data-qt]');
    if (c) { $i('qr-m').value = CASAS[+c.getAttribute('data-casa')][1]; desenhar(); }
    if (b) { tipo = b.getAttribute('data-qt'); Array.prototype.forEach.call(el.querySelectorAll('[data-qt]'), function (k) { k.setAttribute('aria-pressed', String(k === b)); }); desenhar(); }
  });
  ['qr-m', 'qr-p', 'qr-n', 'qr-d'].forEach(function (id) { $i(id).addEventListener('input', desenhar); });
  desenhar();
}

/* ============================ calculadora de progressão de regime ============================ */
/* Lei de Execução Penal, art. 112, na redação das Leis nº 15.358/2026 e 15.402/2026. "antes" = redação da Lei nº 13.964/2019 (e da Lei nº 14.994/2024 no feminicídio). */
var REGIMES = {
  geral: { n: 1, d: 6, nome: 'Regra geral', base: 'caput', quem: 'primário, crime sem violência ou grave ameaça', antes: [16, 100] },
  viol1: { n: 25, d: 100, nome: 'Primário · violência', base: 'inciso I', quem: 'primário, crime com violência ou grave ameaça (salvo os crimes contra o Estado Democrático de Direito, Título XII do Código Penal)', antes: [25, 100] },
  reinc: { n: 20, d: 100, nome: 'Reincidente · sem violência', base: 'inciso III', quem: 'reincidente em crime sem violência ou grave ameaça', antes: [20, 100] },
  viol2: { n: 30, d: 100, nome: 'Reincidente · violência', base: 'incisos II e IV', quem: 'reincidente, crime com violência ou grave ameaça', antes: [30, 100] },
  hed1: { n: 70, d: 100, nome: 'Hediondo · primário', base: 'inciso V', quem: 'primário, crime hediondo ou equiparado (tortura, tráfico e terrorismo)', antes: [40, 100] },
  hed2: { n: 75, d: 100, nome: 'Hediondo com morte · primário', base: 'inciso VI, a', quem: 'primário, crime hediondo ou equiparado com resultado morte', antes: [50, 100], semLC: true },
  orcrim: { n: 75, d: 100, nome: 'Comando de organização criminosa', base: 'inciso VI, b', quem: 'comando, individual ou coletivo, de organização criminosa ultraviolenta estruturada para a prática de crime hediondo ou equiparado', antes: [50, 100], semLC: true },
  milicia: { n: 75, d: 100, nome: 'Milícia privada', base: 'inciso VI, c', quem: 'condenado pelo crime de constituição de milícia privada', antes: [50, 100] },
  femin: { n: 75, d: 100, nome: 'Feminicídio · primário', base: 'inciso VI, d', quem: 'primário, condenado por feminicídio', antes: [55, 100], semLC: true },
  hed3: { n: 80, d: 100, nome: 'Hediondo · reincidente', base: 'inciso VII', quem: 'reincidente na prática de crime hediondo ou equiparado', antes: [60, 100] },
  hed4: { n: 85, d: 100, nome: 'Hediondo com morte · reincidente', base: 'inciso VIII', quem: 'reincidente em crime hediondo ou equiparado com resultado morte', antes: [70, 100], semLC: true },
  mae: { n: 1, d: 8, nome: 'Gestante ou mãe (§ 3º)', base: '§ 3º', quem: 'gestante, mãe ou responsável por criança ou pessoa com deficiência que cumpra todos os requisitos do § 3º (crime sem violência, não contra o filho, primária, bom comportamento, sem integrar organização criminosa)', antes: [1, 8] }
};
function regimeCalcular(base, chave) {
  var R = REGIMES[chave];
  if (!R) throw new Error('Escolha a situação do condenado.');
  if (!(base > 0)) throw new Error('Informe a pena (anos, meses e/ou dias).');
  var dias = Math.floor(base * R.n / R.d + 1e-9), antes = Math.floor(base * R.antes[0] / R.antes[1] + 1e-9);
  return { R: R, dias: dias, antes: antes, mudou: R.antes[0] / R.antes[1] !== R.n / R.d };
}
function calculadoraRegime(el, conf) {
  if (!el) return;
  conf = conf || {};
  var chave = REGIMES[conf.regime] ? conf.regime : 'hed1', EX = conf.exemplos || [];
  el.innerHTML =
    '<div class="pn-grid"><label><span class="tvl-lb">Anos</span><input class="in" id="rg-a" type="number" min="0" inputmode="numeric" value="' + (conf.anos != null ? conf.anos : 6) + '"></label>' +
    '<label><span class="tvl-lb">Meses</span><input class="in" id="rg-m" type="number" min="0" inputmode="numeric" value="0"></label>' +
    '<label><span class="tvl-lb">Dias</span><input class="in" id="rg-d" type="number" min="0" inputmode="numeric" value="0"></label></div>' +
    '<div class="qr-tipos rg-tipos" role="group" aria-label="Situação do condenado">' + Object.keys(REGIMES).map(function (k) { return '<button type="button" class="tvl-k tvl-w" data-rg="' + k + '" aria-pressed="' + (k === chave) + '">' + esc(REGIMES[k].nome) + '</button>'; }).join('') + '</div>' +
    (EX.length ? '<div class="tvl-ex"><span>Situações:</span>' + EX.map(function (x, i) { return '<button type="button" class="tvl-chip" data-x="' + i + '">' + esc(x[0]) + '</button>'; }).join('') + '</div>' : '') +
    '<div class="pn-out" aria-live="polite"></div>' +
    '<p class="tvl-help">Requisito objetivo (tempo) do art. 112 da Lei de Execução Penal, na redação de 2026. A progressão também exige boa conduta carcerária e exame criminológico (§ 1º). O tráfico privilegiado (art. 33, § 4º, da Lei de Drogas) não é hediondo para este fim (§ 5º). Convenção das provas: ano de 12 meses e mês de 30 dias; frações de dia são desprezadas.</p>';
  var $i = function (id) { return el.querySelector('#' + id); }, out = el.querySelector('.pn-out');
  function frac(n, d) { return d === 100 ? n + '%' : '<span class="qf"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function desenhar() {
    var base = penaDias($i('rg-a').value, $i('rg-m').value, $i('rg-d').value), r;
    try { r = regimeCalcular(base, chave); } catch (err) { out.innerHTML = '<p class="tvl-erro">' + esc(err.message) + '</p>'; return; }
    var R = r.R;
    out.innerHTML = '<p class="tvl-res"><span class="st ok">' + frac(R.n, R.d) + ' da pena</span> ' + esc(penaTexto(r.dias)) + ' para progredir</p>' +
      '<ol class="pn-passos"><li>Situação: <b>' + esc(R.quem) + '</b> (art. 112, ' + esc(R.base) + ', da Lei de Execução Penal).</li>' +
      '<li>Pena: <b>' + esc(penaTexto(base)) + '</b> = ' + base.toLocaleString('pt-BR') + ' dias.</li>' +
      '<li>' + (R.d === 100 ? R.n + '% de ' + base.toLocaleString('pt-BR') + ' = ' + base.toLocaleString('pt-BR') + ' × ' + R.n + ' ÷ 100' : R.n + '/' + R.d + ' de ' + base.toLocaleString('pt-BR') + ' = ' + base.toLocaleString('pt-BR') + ' ÷ ' + R.d) + ' = <b>' + r.dias.toLocaleString('pt-BR') + ' dias</b> = ' + esc(penaTexto(r.dias)) + '.</li>' +
      (R.semLC ? '<li>Nesta hipótese, a lei <b>veda o livramento condicional</b>.</li>' : '') + '</ol>' +
      '<p class="qr-usos">' + (r.mudou ? '<b>O que mudou:</b> antes das leis de 2026, eram ' + frac(R.antes[0], R.antes[1]) + ' (' + esc(penaTexto(r.antes)) + ' nesta pena). Questões de provas anteriores usam a regra antiga.' : '<b>Sem mudança:</b> a fração já era ' + frac(R.antes[0], R.antes[1]) + ' antes de 2026.') + '</p>';
  }
  el.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-rg]'), x = ev.target.closest('[data-x]');
    if (x) { var e = EX[+x.getAttribute('data-x')]; $i('rg-a').value = e[1]; $i('rg-m').value = e[2]; $i('rg-d').value = 0; b = el.querySelector('[data-rg="' + e[3] + '"]'); }
    if (b) { chave = b.getAttribute('data-rg'); Array.prototype.forEach.call(el.querySelectorAll('[data-rg]'), function (k) { k.setAttribute('aria-pressed', String(k === b)); }); }
    if (b || x) desenhar();
  });
  ['rg-a', 'rg-m', 'rg-d'].forEach(function (id) { $i(id).addEventListener('input', desenhar); });
  desenhar();
}

/* ============================ painéis e modal ============================ */
var aberto = null;
function abrirPainel(id) {
  fecharPainel();
  $('#scrim').hidden = false; $('#' + id).hidden = false; aberto = id;
  var f = $('#' + id + ' button, #' + id + ' a'); if (f) f.focus({ preventScroll: true });
}
function fecharPainel() {
  if (!aberto) return;
  $('#' + aberto).hidden = true; $('#scrim').hidden = true;
  if (aberto === 'modal') $('#modal').innerHTML = '';
  aberto = null;
}
function modal(titulo, corpo, botoes) {
  var m = $('#modal');
  m.innerHTML = '<div class="mh"><b>' + esc(titulo) + '</b><button class="tb-btn" data-act="fechar" aria-label="Fechar">' + IC.fechar + '</button></div><div>' + corpo + '</div>' +
    (botoes ? '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;justify-content:flex-end">' + botoes.map(function (b, i) { return '<button class="btn ' + (b.c || '') + '" data-mb="' + i + '">' + esc(b.t) + '</button>'; }).join('') + '</div>' : '');
  m._botoes = botoes || [];
  abrirPainel('modal');
}

/* ============================ eventos ============================ */
function onClick(ev) {
  var t = ev.target.closest('[data-act],[data-mb]'); if (!t) return;
  if (t.hasAttribute('data-mb')) { var bs = $('#modal')._botoes, b = bs[+t.getAttribute('data-mb')]; fecharPainel(); if (b && b.f) b.f(); return; }
  var act = t.getAttribute('data-act'), n = +t.getAttribute('data-n'), L = t.getAttribute('data-l');
  switch (act) {
    case 'alt': {
      if (corrigida(n)) return;
      if (!ST.ini) { ST.ini = Date.now(); toast('Cronômetro iniciado.'); }
      if (ST.resp[n] === L && ST.modo === 'prova') delete ST.resp[n]; else ST.resp[n] = L;
      salvar(); atualizarQ(n); atualizarTudo();
      break;
    }
    case 'cut': {
      if (corrigida(n)) return;
      var c = ST.cort[n] || (ST.cort[n] = []), i = c.indexOf(L);
      if (i >= 0) c.splice(i, 1); else { c.push(L); if (ST.resp[n] === L) delete ST.resp[n]; }
      if (c.length >= 5) { c.length = 0; toast('Você eliminou todas — restaurei as alternativas.'); }
      salvar(); atualizarQ(n); atualizarTudo();
      break;
    }
    case 'conf': { if (!ST.resp[n]) return; ST.conf[n] = true; ST.verCom[n] = true; salvar(); atualizarQ(n); atualizarTudo(); break; }
    case 'com': { ST.verCom[n] = !ST.verCom[n]; salvar(); atualizarQ(n); break; }
    case 'texto': {
      var tx = C.textos[t.getAttribute('data-t')];
      modal(tx.rotulo + ' · ' + tx.titulo, textoHTML(tx));
      break;
    }
    case 'modo': {
      var m = t.getAttribute('data-m');
      if (m === ST.modo) return;
      var tem = Object.keys(ST.resp).length > 0 || ST.fim;
      if (tem) { toast('Para trocar de modo, refaça o simulado (botão no fim da página).'); return; }
      ST.modo = m; salvar(); QS.forEach(function (q) { atualizarQ(q.n); }); atualizarTudo();
      toast(m === 'prova' ? 'Modo Prova: correção só no final.' : 'Modo Treino: correção a cada questão.');
      break;
    }
    case 'iniciar': iniciar(); break;
    case 'finalizar': finalizar(); break;
    case 'refazer': refazer(false); break;
    case 'refazer-erradas': refazer(true); break;
    case 'liberar':
      modal('Liberar o gabarito comentado?', '<p>Você verá todas as respostas antes de terminar. Se a ideia é medir seu nível real, finalize o simulado primeiro.</p>', [
        { t: 'Cancelar', c: 'ghost' }, { t: 'Liberar', c: 'danger', f: function () { ST.gabLib = true; salvar(); renderGabarito(); } }]);
      break;
    case 'cartao': abrirPainel('sh-cartao'); break;
    case 'nav': abrirPainel('sh-nav'); break;
    case 'fechar': fecharPainel(); break;
    case 'go': fecharPainel(); ir('q' + n); break;
    case 'ir': {
      ev.preventDefault();
      var id = (t.getAttribute('href') || '').replace('#', ''); fecharPainel();
      var alvo = DOC.getElementById(id);
      if (alvo && alvo.tagName === 'DETAILS') alvo.open = true;
      ir(id); break;
    }
    case 'sair':
      ev.preventDefault();
      modal('Sair desta licença?', '<p>Seu progresso fica salvo neste aparelho. Para entrar de novo, use o mesmo e-mail e a mesma chave.</p>', [
        { t: 'Cancelar', c: 'ghost' }, { t: 'Sair', c: 'danger', f: function () { lsDel(SK + '_sess'); location.reload(); } }]);
      break;
  }
}

/* ============================ marca d'água e proteções ============================ */
var WMURL = '', tamper = 0;
function gerarMarca() {
  var cv = DOC.createElement('canvas'), w = 440, h = 250, dpr = Math.min(2, WIN.devicePixelRatio || 1);
  cv.width = w * dpr; cv.height = h * dpr;
  var x = cv.getContext('2d'); if (!x) return '';
  x.scale(dpr, dpr); x.translate(w / 2, h / 2); x.rotate(-0.42);
  var l1 = SESS.n.toUpperCase(), l2 = SESS.e, l3 = 'LICENÇA Nº ' + pad4(NUM) + ' · ' + dataBR(Date.now()).slice(0, 10);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  [[1, 1, 'rgba(0,0,0,0.10)'], [0, 0, 'rgba(160,240,250,0.085)']].forEach(function (p) {
    x.fillStyle = p[2];
    x.font = '700 15px Arial, sans-serif'; x.fillText(l1, p[0], -20 + p[1]);
    x.font = '600 13px Arial, sans-serif'; x.fillText(l2, p[0], 0 + p[1]);
    x.font = '600 11px Arial, sans-serif'; x.fillText(l3, p[0], 18 + p[1]);
  });
  return cv.toDataURL('image/png');
}
function garantirMarca() {
  if (!SESS || !WMURL) return;
  var wm = $('#wm');
  if (!wm || wm.parentNode !== DOC.body) { tamper++; wm = DOC.createElement('div'); wm.id = 'wm'; DOC.body.appendChild(wm); }
  var cs = WIN.getComputedStyle(wm);
  if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.9 || wm.style.backgroundImage.indexOf('data:image') < 0) {
    if (wm.style.backgroundImage) tamper++;
    wm.removeAttribute('style'); wm.removeAttribute('class'); wm.hidden = false;
    wm.style.backgroundImage = 'url(' + WMURL + ')'; wm.style.backgroundSize = '440px 250px';
  }
  var bd = $('#wm-badge');
  if (!bd) { bd = DOC.createElement('div'); bd.id = 'wm-badge'; DOC.body.appendChild(bd); }
  bd.textContent = SESS.e + ' · nº ' + pad4(NUM);
  if (tamper > 4) { var app = $('#app'); if (app) app.innerHTML = '<div class="lockbox" style="margin:40px 16px">Proteção do material alterada. Recarregue a página.</div>'; }
}
function moverSelo() {
  var bd = $('#wm-badge'); if (!bd) return;
  bd.style.left = Math.round(8 + Math.random() * Math.max(10, WIN.innerWidth - 260)) + 'px';
  bd.style.top = Math.round(70 + Math.random() * Math.max(10, WIN.innerHeight - 120)) + 'px';
}
var shieldT = null;
function escudo(on, ms) {
  var s = $('#shield');
  if (on) { s.hidden = false; DOC.body.classList.add('blurred'); clearTimeout(shieldT); if (ms) shieldT = setTimeout(function () { escudo(false); }, ms); }
  else { s.hidden = true; DOC.body.classList.remove('blurred'); }
}
function protecoes() {
  function campo(e) { return e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName); }
  ['contextmenu', 'dragstart', 'selectstart'].forEach(function (ev) { DOC.addEventListener(ev, function (e) { if (!campo(e)) e.preventDefault(); }); });
  ['copy', 'cut'].forEach(function (ev) { DOC.addEventListener(ev, function (e) { if (campo(e)) return; e.preventDefault(); try { e.clipboardData.setData('text/plain', 'Conteúdo protegido · Raiz de Física'); } catch (x) { } toast('Cópia desativada neste material.'); }); });
  DOC.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === 'f12' || (mod && e.shiftKey && /^[ijck]$/.test(k)) || (mod && /^[supc]$/.test(k) && !campo(e)) || (mod && e.altKey && /^[ij]$/.test(k))) {
      e.preventDefault(); toast('Função desativada neste material.'); return;
    }
    if (e.metaKey && e.shiftKey) escudo(true, 1500);
    if (k === 'printscreen') { escudo(true, 2500); }
  }, true);
  DOC.addEventListener('keyup', function (e) {
    if ((e.key || '').toLowerCase() === 'printscreen') {
      escudo(true, 2500);
      try { navigator.clipboard.writeText('Conteúdo protegido · Raiz de Física'); } catch (x) { }
      toast('Captura de tela bloqueada. Seus dados estão na marca d’água.');
    }
  }, true);
  WIN.addEventListener('blur', function () { escudo(true); });
  WIN.addEventListener('focus', function () { escudo(false); });
  DOC.addEventListener('visibilitychange', function () { if (DOC.hidden) { escudo(true); if (ST) salvar(); } else escudo(false); });
  $('#shield').addEventListener('click', function () { escudo(false); });
  WIN.addEventListener('beforeprint', function () { escudo(true, 3000); });
  WIN.addEventListener('pagehide', function () { if (ST) salvar(); });
  if (WIN.MutationObserver) new MutationObserver(function () { garantirMarca(); }).observe(DOC.body, { childList: true, attributes: true, subtree: false });
  setInterval(garantirMarca, 1500);
  setInterval(moverSelo, 15000);
}

/* ============================ acesso ============================ */
var LOGO = '';
/* fórmula em destaque mais larga que a tela (celular estreito): reduz a fonte até caber, no mínimo 62%; se ainda assim não couber, ela rola de lado */
var formT = 0;
function agendarFormulas() { clearTimeout(formT); formT = setTimeout(ajustarFormulas, 120); }
function ajustarFormulas() {
  var ds = DOC.querySelectorAll('.katex-display');
  for (var i = 0; i < ds.length; i++) {
    var d = ds[i];
    if (!d.offsetWidth) continue;
    d.style.fontSize = '';
    if (d.scrollWidth > d.clientWidth + 1) d.style.fontSize = Math.max(62, Math.floor(100 * d.clientWidth / d.scrollWidth)) + '%';
  }
}
function iniciarApp(r, nome, email, chave) {
  C = r.dados; NUM = r.num; QS = C.questoes; QBY = {}; QS.forEach(function (q) { QBY[q.n] = q; });
  if (C.itens) ITEM = C.itens;
  SESS = { n: nome, e: email, k: chave };
  lsSet(SK + '_sess', JSON.stringify({ n: nome, e: email, k: chave, a: Date.now() }));
  STKEY = SK + '_st_' + pad4(NUM);
  ST = carregar();
  WMURL = gerarMarca(); garantirMarca(); moverSelo();
  $('#gate').hidden = true; $('#app').hidden = false;
  $('#tb-lic').textContent = 'Licença nº ' + pad4(NUM) + ' · ' + nome.split(' ')[0];
  montar();
  ajustarFormulas();
  if (WIN.MutationObserver) new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) {
      var n = ms[i].addedNodes[j];
      if (n.nodeType === 1 && (n.classList.contains('katex-display') || n.querySelector('.katex-display'))) { agendarFormulas(); return; }
    }
  }).observe($('#app'), { childList: true, subtree: true });
  WIN.addEventListener('resize', agendarFormulas);
  DOC.addEventListener('toggle', agendarFormulas, true);
  DOC.addEventListener('click', onClick);
  DOC.addEventListener('click', agendarFormulas);
  DOC.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharPainel(); });
  $('#scrim').addEventListener('click', fecharPainel);
  setInterval(tick, 1000);
}
function validarEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
function gate() {
  LOGO = ($('.g-logo') || {}).src || '';
  var f = $('#g-form'), err = $('#g-err'), falhas = +(lsGet(SK + '_f') || 0), bloqAte = +(lsGet(SK + '_b') || 0);
  function erro(m) { err.innerHTML = m; err.hidden = false; }
  var s = null; try { s = JSON.parse(lsGet(SK + '_sess') || 'null'); } catch (e) { s = null; }
  if (s && s.k) {
    var r0 = abrir(normKey(s.k));
    if (r0) { iniciarApp(r0, s.n, s.e, s.k); return; }
    lsDel(SK + '_sess');
    erro('Esta chave não é mais válida. Se você comprou o material, fale com o suporte informando o e-mail da compra.');
  }
  if (s) { $('#g-nome').value = s.n || ''; $('#g-email').value = s.e || ''; }
  f.addEventListener('submit', function (ev) {
    ev.preventDefault(); err.hidden = true;
    var agora = Date.now();
    if (bloqAte > agora) { erro('Muitas tentativas. Aguarde ' + Math.ceil((bloqAte - agora) / 1000) + ' segundos.'); return; }
    var nome = $('#g-nome').value.trim().replace(/\s+/g, ' '), email = $('#g-email').value.trim().toLowerCase(), k = normKey($('#g-chave').value);
    if (nome.length < 5 || nome.indexOf(' ') < 0) { erro('Digite seu <b>nome completo</b> (nome e sobrenome).'); return; }
    if (!validarEmail(email)) { erro('Digite um <b>e-mail válido</b> (o mesmo da compra).'); return; }
    if (k.length !== 12) { erro('A chave tem o formato <b>' + esc(CFG.chaveEx || 'RF-XXXX-XXXX-XXXX') + '</b>. Confira se copiou todos os caracteres.'); return; }
    if (!$('#g-termos').checked) { erro('Para continuar, aceite os termos de uso.'); return; }
    var bt = $('#g-btn'); bt.disabled = true; bt.textContent = 'Verificando…';
    setTimeout(function () {
      var r = abrir(k);
      bt.disabled = false; bt.textContent = 'Acessar o simulado';
      if (!r) {
        falhas++; lsSet(SK + '_f', String(falhas));
        if (falhas % 5 === 0) { bloqAte = Date.now() + 60000; lsSet(SK + '_b', String(bloqAte)); }
        erro('Chave inválida. Confira a chave que veio junto com o arquivo, na mensagem ou no e-mail da compra (veja também a caixa de spam).');
        return;
      }
      lsSet(SK + '_f', '0');
      iniciarApp(r, nome, email, k);
    }, 350);
  });
}

/* ============================ início ============================ */
function boot() {
  $('#nojs') && ($('#nojs').hidden = true);
  $('#gate').hidden = false;
  protecoes();
  gate();
}
if (DOC.readyState === 'loading') DOC.addEventListener('DOMContentLoaded', boot); else boot();
})();
