// Gera capturas reais do produto para a página de vendas e os anúncios.
// Uso: node capturas-marketing.cjs            (Português → vendas/img/)
//      node capturas-marketing.cjs rlm        (RLM → vendas-rlm/img/)
//      node capturas-marketing.cjs info       (Informática → vendas-info/img/)
// Precisa do Playwright/Chromium e da pasta privado/.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..');
const ID = process.argv[2] || 'portugues';
const CFG = {
  portugues: { html: 'produto/minissimulado-portugues-pmpe.html', csv: 'privado/licencas.csv', conteudo: 'privado/conteudo/index.mjs', out: 'vendas/img',
    tesoura: 14, cortes: ['A', 'C', 'E'], marca: 'B', errar: [8, 15, 26, 32, 36, 38, 40], branco: [22, 33], comentario: 32,
    telas: [['tela-capa', '#capa', -20], ['tela-tirinha', '#q31', 0], ['tela-infografico', '#q35', 0]] },
  info: { html: 'produto/minissimulado-informatica-pmpe.html', csv: 'privado/licencas-info.csv', conteudo: 'privado/info/index.mjs', out: 'vendas-info/img',
    tesoura: 15, cortes: ['B', 'D', 'E'], marca: 'A', errar: [11, 17, 22, 26, 31, 34, 37], branco: [35, 40], comentario: 31,
    telas: [['tela-capa', '#capa', -20], ['tela-guia', '#guia', -10], ['tela-laboratorio', '#laboratorio', -10], ['tela-planilha', '#q17', 0], ['tela-phishing', '#q28', 0], ['tela-placa', '#q24', 0], ['tela-prompt', '#q33', 0]] },
  rlm: { html: 'produto/minissimulado-rlm-pmpe.html', csv: 'privado/licencas-rlm.csv', conteudo: 'privado/rlm/index.mjs', out: 'vendas-rlm/img',
    tesoura: 13, cortes: ['B', 'D', 'E'], marca: 'A', errar: [12, 19, 27, 33, 35, 37, 40], branco: [29, 38], comentario: 32,
    telas: [['tela-capa', '#capa', -20], ['tela-formulario', '#formulario', -10], ['tela-laboratorio', '#laboratorio', -10], ['tela-tabela', '#q11', 0], ['tela-grade', '#q26', 0]] }
}[ID];
if (!CFG) throw new Error('Produto desconhecido: ' + ID);
const URL = 'file://' + path.join(RAIZ, CFG.html);
const OUT = path.join(RAIZ, CFG.out);
const KEY = fs.readFileSync(path.join(RAIZ, CFG.csv), 'utf8').split('\n')[1].split(';')[1];
(async () => {
  const { CONTEUDO } = await import(path.join(RAIZ, CFG.conteudo));
  const gab = {}; CONTEUDO.questoes.forEach(q => { gab[q.n] = q.resp; });
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.fill('#g-nome', 'Seu Nome Aqui'); await page.fill('#g-email', 'seuemail@dominio.com');
  await page.fill('#g-chave', KEY); await page.check('#g-termos'); await page.click('#g-btn');
  await page.waitForSelector('#app:not([hidden])', { timeout: 20000 });
  await page.addStyleTag({ content: '#wm-badge{display:none!important} .toast{display:none!important} html{scroll-behavior:auto!important}' });
  const shot = async (nome, sel, offset = 0) => {
    if (sel) await page.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70 + o); }, [sel, offset]);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, nome + '.jpg'), type: 'jpeg', quality: 80 });
  };
  for (const [nome, sel, off] of CFG.telas) await shot(nome, sel, off);
  for (const L of CFG.cortes) await page.click(`#q${CFG.tesoura} .cut[data-l="${L}"]`);
  await page.click(`#q${CFG.tesoura} .alt-main[data-l="${CFG.marca}"]`);
  await shot('tela-tesoura', '#q' + CFG.tesoura, 0);
  for (let n = 1; n <= 40; n++) {
    if (CFG.branco.includes(n) || n === CFG.tesoura) continue;
    let L = gab[n];
    if (CFG.errar.includes(n)) L = 'ABCDE'[('ABCDE'.indexOf(gab[n]) + 2) % 5];
    await page.click(`#q${n} .alt-main[data-l="${L}"]`);
  }
  await page.click('[data-act="finalizar"]'); await page.click('#modal [data-mb="1"]');
  await page.waitForTimeout(600);
  await shot('tela-resultado', '#resultado', 0);
  await shot('tela-diagnostico', '.diag', -40);
  await shot('tela-caminho', '.caminho', -60);
  await page.click('.tb-btn[data-act="cartao"]'); await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, 'tela-cartao.jpg'), type: 'jpeg', quality: 80 });
  await page.click('#sh-cartao [data-act="fechar"]');
  await page.click(`#q${CFG.comentario} [data-act="com"]`);
  await shot('tela-comentario', `#q${CFG.comentario} .coment`, -40);
  await browser.close();
  console.log('Capturas salvas em', OUT);
})();
