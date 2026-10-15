/* Minissimulado de Português · PMPE — Raiz de Física
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

/* ============================ licenças ============================ */
var PROD = 'RFPT1', ITER = 15000;   /* alongamento da chave: encarece ataques de força bruta (igual ao build.mjs) */
var LIC = {};
(function () {
  var raw = ($('#lic') || {}).textContent || '';
  raw.trim().split('|').forEach(function (e) { var p = e.split(':'); if (p.length === 3) LIC[p[0]] = [parseInt(p[1], 10), p[2]]; });
})();
function normKey(s) {
  s = String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length === 14 && s.slice(0, 2) === 'RF') s = s.slice(2);
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
  try { txt = deutf8(fluxo(ck, unb64(pl[0]), unb64(pl[1]))); } catch (err) { return null; }
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
  t += '<span class="tag est">Inédita · estilo ' + esc(q.estilo) + '</span>';
  var tb = q.texto ? '<button class="btn ghost sm q-txtbtn" data-act="texto" data-t="' + q.texto + '">' + IC.livro + ' ' + esc(C.textos[q.texto].rotulo) + '</button>' : '';
  var h = '<article class="q" id="q' + q.n + '" data-n="' + q.n + '">' +
    '<div class="q-h"><span class="q-num">' + pad(q.n) + '</span><div class="q-tags">' + t + '</div>' + tb + '<span id="qr' + q.n + '"></span></div>';
  if (q.intro) h += '<div class="q-en">' + tex(q.intro) + '</div>';
  if (q.img) h += '<div class="q-ilu">' + tex(C.ilustracoes[q.img]) + '</div>';
  h += '<div class="q-en">' + tex(q.enunciado) + '</div>';
  if (q.assertivas) h += '<ol class="ass">' + q.assertivas.map(function (a, i) { return '<li><span class="rn">' + ROM[i] + '.</span><span>' + tex(a) + '</span></li>'; }).join('') + '</ol>';
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
  var m = C.meta, A = C.areas, nAss = QS.filter(function (q) { return q.tipo === 'assertivas'; }).length, nImg = QS.filter(function (q) { return q.img; }).length;
  var h = '';
  /* capa */
  h += '<section class="hero" id="capa"><div class="hero-top"><img class="hero-emb" src="' + LOGO + '" alt="Raiz de Física"><div><h1>MINISSIMULADO<br><em>PORTUGUÊS</em></h1>' +
    '<div class="sub">' + esc(m.sub) + '</div></div></div>' +
    '<p class="ola">Olá, <b>' + esc(SESS.n.split(' ')[0]) + '</b>! São 40 questões em 4 fases de dificuldade crescente, montadas sobre os 18 itens de Português do edital PMPE 2026 e o levantamento dos assuntos que mais caem. Ao final, você recebe gráfico de desempenho, diagnóstico e o caminho de estudo.</p>' +
    '<div class="facts"><div class="fact"><div class="l">Questões</div><div class="v">40</div></div><div class="fact"><div class="l">Fases</div><div class="v">4</div></div>' +
    '<div class="fact"><div class="l">Assertivas</div><div class="v">' + nAss + '</div></div><div class="fact"><div class="l">Com imagem</div><div class="v">' + nImg + '</div></div>' +
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
    passo(IC.livro, 'Textos de apoio', 'Questões ligadas a um texto têm o botão “Texto I” ou “Texto II”, que abre o texto sem perder o lugar.') +
    passo(IC.check, 'Finalize', 'No fim, toque em “Finalizar e ver resultado”: gráfico de pizza, pontos fortes e fracos e o caminho de estudo.') +
    passo(IC.escudo, 'Material licenciado', 'Seus dados aparecem como marca d’água. Não compartilhe: cada licença é rastreável.') + '</div></section>';
  /* raio-x */
  var maxA = 0; C.raiox.assuntos.forEach(function (a) { maxA = Math.max(maxA, a[1]); });
  h += '<section class="blk" id="raiox"><p class="eyebrow">Raio-X da matéria</p><h2 class="st">Onde este simulado mira</h2>' +
    '<p class="lead">As 40 questões seguem o peso de cada área na prova da PMPE (edital 2026, banca Instituto AOCP), com ênfase em sintaxe.</p><div class="grid2"><div class="card hud"><h3 class="eyebrow" style="margin-bottom:8px">Peso provável na prova × questões aqui</h3>' +
    Object.keys(A).map(function (k) {
      var nq = QS.filter(function (q) { return q.area === k; }).length;
      return '<div class="hb"><span class="t"><b>' + esc(A[k].nome) + '</b><small>' + nq + ' questões neste simulado</small></span><span class="tr"><span class="bt"><i style="width:' + Math.round(A[k].peso / 0.25 * 100) + '%"></i></span><span>' + pct(A[k].peso) + '</span></span></div>';
    }).join('') + '</div><div class="card hud"><h3 class="eyebrow" style="margin-bottom:8px">Assuntos mais cobrados · ' + C.raiox.total.toLocaleString('pt-BR') + ' questões</h3>' +
    C.raiox.assuntos.slice(0, 12).map(function (a) {
      return '<div class="hb"><span class="t"><b>' + esc(a[0]) + '</b></span><span class="tr"><span class="bt"><i style="width:' + Math.round(a[1] / maxA * 100) + '%"></i></span><span>' + a[1] + '</span></span></div>';
    }).join('') + '</div></div></section>';
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
  $('#foot').innerHTML = 'Licença nº <b>' + pad4(NUM) + '</b> · ' + esc(SESS.n) + ' · ' + esc(SESS.e) + '<br>Minissimulado de Português · PMPE · Raiz de Física · v' + esc(m.versao) +
    '<br>Base teórica: Fernando Pestana, <i>A Gramática para Concursos Públicos</i>. Questões inéditas, elaboradas no padrão das bancas Instituto AOCP, Cebraspe e IAUPE; textos e ilustrações criados para fins didáticos.' +
    '<br>Material protegido pela Lei nº 9.610/1998. Reproduzir, compartilhar ou revender sem autorização é crime (art. 184 do Código Penal). <a href="#" data-act="sair">Sair desta licença</a>';
  QS.forEach(function (q) { atualizarQ(q.n); });
  aplicarSub();
  montarCartao();
  atualizarTudo();
}
function pad4(n) { return ('000' + n).slice(-4); }
function passo(ic, t, d) { return '<div class="passo"><span class="pi">' + ic + '</span><div><b>' + t + '</b><span>' + d + '</span></div></div>'; }
function tocHTML() {
  var it = [['capa', '◆', 'Capa e modos', 'Prova ou treino'], ['como-usar', '?', 'Como usar', 'Tesoura, cartão e textos'], ['raiox', 'RX', 'Raio-X da matéria', 'Pesos e assuntos']];
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
  var at = ativas(), R = { tot: at.length, ok: 0, no: 0, bl: 0, areas: {}, fases: {}, fmt: { ass: [0, 0], img: [0, 0], txt: [0, 0], iso: [0, 0] }, err: [] };
  Object.keys(C.areas).forEach(function (k) { R.areas[k] = { ok: 0, tot: 0, err: [] }; });
  at.forEach(function (q) {
    var s = statusQ(q), a = R.areas[q.area], acerto = s === 'ok' ? 1 : 0;
    R[s]++; a.tot++; a.ok += acerto;
    if (!acerto) { a.err.push(q); R.err.push(q); }
    var f = R.fases[q.fase] || (R.fases[q.fase] = [0, 0]); f[0] += acerto; f[1]++;
    var fm = q.tipo === 'assertivas' ? 'ass' : q.img ? 'img' : q.texto ? 'txt' : 'iso';
    R.fmt[fm][0] += acerto; R.fmt[fm][1]++;
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
    kpi('Projeção na PMPE', Math.round(R.acc * 10) + '<small>/10</small>', 'questões de Português da prova') +
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
  [['ass', 'Assertivas (I, II, III...)'], ['img', 'Com imagem (charge, tirinha, gráfico)'], ['txt', 'Ligadas a texto'], ['iso', 'Gramática isolada']].forEach(function (x) { var v = R.fmt[x[0]]; if (v[1]) h += barra(x[1], v[0], v[1]); });
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
  if (R.fmt.img[1] && R.fmt.img[0] / R.fmt.img[1] < 0.6) dicas.push('<b>Questões com imagem</b> (' + R.fmt.img[0] + '/' + R.fmt.img[1] + '): descreva em uma frase a relação entre imagem e texto antes de ler as alternativas.');
  var f4 = R.fases[4], f1 = R.fases[1];
  if (f4 && f1 && f1[1] && f4[1] && f1[0] / f1[1] - f4[0] / f4[1] >= 0.3) dicas.push('<b>Queda nas questões difíceis</b>: você foi bem na Fase 1 e caiu na Fase 4. O próximo nível é sintaxe do período composto e funções do “que” e do “se”.');
  if (R.bl) dicas.push('<b>' + R.bl + ' questão(ões) em branco</b>: na prova da AOCP, a questão em branco vale zero. Elimine o que puder e marque a melhor opção restante.');
  if (ST.modo === 'prova' && ST.acc > C.meta.tempoSugerido * 60000 * (R.tot / 40) * 1.15) dicas.push('<b>Ritmo</b>: você passou do tempo sugerido (3 min por questão). Faça primeiro as questões de gramática isolada e deixe as de texto longo para o fim.');
  if (!dicas.length) dicas.push('Nada crítico a ajustar além dos pontos fracos. Mantenha a revisão dos comentários das questões que errou.');
  h += '<div class="dg melhorar"><h3>' + IC.alvo + ' Pontos a melhorar</h3><ul>' + dicas.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul></div></div>';
  /* caminho */
  var prio = ks.filter(function (k) { return acc(k) < 1; }).sort(function (a, b) { return (1 - acc(b)) * A[b].peso - (1 - acc(a)) * A[a].peso; }).slice(0, 3);
  h += '<h2 class="st" style="margin-top:22px">O seu caminho de estudo</h2><p class="lead">Ordem calculada pelo seu erro em cada área multiplicado pelo peso dela na prova da PMPE: primeiro o que mais rende pontos.</p><ol class="caminho">';
  if (R.err.length) h += '<li><div><b>Hoje: refaça as ' + R.err.length + ' questões que errou ou deixou em branco</b><span>Use o Modo Treino e leia o comentário de todas as alternativas, inclusive as erradas: é ali que a banca esconde as pegadinhas.</span><div style="margin-top:8px"><button class="btn sm" data-act="refazer-erradas">Refazer só as que errei</button></div></div></li>';
  var dias = [['Dias 1 a 4', 4], ['Dias 5 a 8', 4], ['Dias 9 a 11', 3]];
  prio.forEach(function (k, i) {
    h += '<li><div><b>' + dias[i][0] + ' · Prioridade ' + (i + 1) + ': ' + esc(A[k].nome) + '</b><span>Você acertou ' + R.areas[k].ok + ' de ' + R.areas[k].tot + '; a área vale cerca de ' + pct(A[k].peso) + ' da prova.</span><ul>' +
      A[k].plano.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '<li>No livro do Fernando Pestana: ' + esc(A[k].pestana) + '.</li></ul></div></li>';
  });
  if (prio.indexOf('INT') < 0) h += '<li><div><b>Todos os dias · 10 questões de interpretação</b><span>Interpretação e tipologia somam cerca de ' + pct(A.INT.peso) + ' da prova de Português: é a área que mais pesa e precisa de treino diário, mesmo quando você vai bem.</span></div></li>';
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
      '<span class="ga">' + esc(ITEM[q.item]) + ' · nível ' + q.nivel + '</span></summary>' + comentHTML(q) +
      '<p style="margin:8px 0 0"><a href="#q' + q.n + '" data-act="ir">Ir para a questão ' + q.n + '</a></p></details>';
  }).join('');
  el.innerHTML = h;
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
        { t: 'Cancelar', c: 'ghost' }, { t: 'Sair', c: 'danger', f: function () { lsDel('rf_pt_pmpe_sess'); location.reload(); } }]);
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
function iniciarApp(r, nome, email, chave) {
  C = r.dados; NUM = r.num; QS = C.questoes; QBY = {}; QS.forEach(function (q) { QBY[q.n] = q; });
  SESS = { n: nome, e: email, k: chave };
  lsSet('rf_pt_pmpe_sess', JSON.stringify({ n: nome, e: email, k: chave, a: Date.now() }));
  STKEY = 'rf_pt_pmpe_st_' + pad4(NUM);
  ST = carregar();
  WMURL = gerarMarca(); garantirMarca(); moverSelo();
  $('#gate').hidden = true; $('#app').hidden = false;
  $('#tb-lic').textContent = 'Licença nº ' + pad4(NUM) + ' · ' + nome.split(' ')[0];
  montar();
  DOC.addEventListener('click', onClick);
  DOC.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharPainel(); });
  $('#scrim').addEventListener('click', fecharPainel);
  setInterval(tick, 1000);
}
function validarEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
function gate() {
  LOGO = ($('.g-logo') || {}).src || '';
  var f = $('#g-form'), err = $('#g-err'), falhas = +(lsGet('rf_pt_pmpe_f') || 0), bloqAte = +(lsGet('rf_pt_pmpe_b') || 0);
  function erro(m) { err.innerHTML = m; err.hidden = false; }
  var s = null; try { s = JSON.parse(lsGet('rf_pt_pmpe_sess') || 'null'); } catch (e) { s = null; }
  if (s && s.k) {
    var r0 = abrir(normKey(s.k));
    if (r0) { iniciarApp(r0, s.n, s.e, s.k); return; }
    lsDel('rf_pt_pmpe_sess');
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
    if (k.length !== 12) { erro('A chave tem o formato <b>RF-XXXX-XXXX-XXXX</b>. Confira se copiou todos os caracteres.'); return; }
    if (!$('#g-termos').checked) { erro('Para continuar, aceite os termos de uso.'); return; }
    var bt = $('#g-btn'); bt.disabled = true; bt.textContent = 'Verificando…';
    setTimeout(function () {
      var r = abrir(k);
      bt.disabled = false; bt.textContent = 'Acessar o simulado';
      if (!r) {
        falhas++; lsSet('rf_pt_pmpe_f', String(falhas));
        if (falhas % 5 === 0) { bloqAte = Date.now() + 60000; lsSet('rf_pt_pmpe_b', String(bloqAte)); }
        erro('Chave inválida. Confira o e-mail que você recebeu após a compra (veja também a caixa de spam) ou a área de membros.');
        return;
      }
      lsSet('rf_pt_pmpe_f', '0');
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
