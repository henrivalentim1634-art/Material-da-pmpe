// Gera capturas reais do produto para a página de vendas e os anúncios (vendas/img/).
// Uso: node capturas-marketing.cjs   (precisa do Playwright/Chromium e da pasta privado/)
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const RAIZ = path.join(__dirname, '..');
const URL = 'file://' + path.join(RAIZ, 'produto', 'minissimulado-portugues-pmpe.html');
const OUT = path.join(RAIZ, 'vendas', 'img');
const KEY = fs.readFileSync(path.join(RAIZ, 'privado', 'licencas.csv'), 'utf8').split('\n')[1].split(';')[1];
(async () => {
  const { CONTEUDO } = await import(path.join(RAIZ, 'privado', 'conteudo', 'index.mjs'));
  const gab = {}; CONTEUDO.questoes.forEach(q => { gab[q.n] = q.resp; });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.fill('#g-nome', 'Seu Nome Aqui'); await page.fill('#g-email', 'seuemail@dominio.com');
  await page.fill('#g-chave', KEY); await page.check('#g-termos'); await page.click('#g-btn');
  await page.waitForSelector('#app:not([hidden])');
  await page.addStyleTag({ content: '#wm-badge{display:none!important} .toast{display:none!important} html{scroll-behavior:auto!important}' });
  const shot = async (nome, sel, offset = 0) => {
    if (sel) { await page.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70 + o); }, [sel, offset]); }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, nome + '.jpg'), type: 'jpeg', quality: 80 });
  };
  await shot('tela-capa', '#capa', -20);
  await shot('tela-tirinha', '#q31', 0);
  // tesoura + marcação na Q14
  await page.click('#q14 .cut[data-l="A"]'); await page.click('#q14 .cut[data-l="C"]'); await page.click('#q14 .cut[data-l="E"]');
  await page.click('#q14 .alt-main[data-l="B"]');
  await shot('tela-tesoura', '#q14', 0);
  await shot('tela-infografico', '#q35', 0);
  // resultado de exemplo: 31 acertos, 7 erros, 2 em branco
  const errar = [8, 15, 26, 32, 36, 38, 40], branco = [22, 33];
  for (let n = 1; n <= 40; n++) {
    if (branco.includes(n) || n === 14) continue;
    let L = gab[n];
    if (errar.includes(n)) L = 'ABCDE'[('ABCDE'.indexOf(gab[n]) + 2) % 5];
    await page.click(`#q${n} .alt-main[data-l="${L}"]`);
  }
  await page.click('[data-act="finalizar"]'); await page.click('#modal [data-mb="1"]');
  await page.waitForTimeout(600);
  await shot('tela-resultado', '#resultado', 0);
  await shot('tela-diagnostico', '.diag', -10);
  await shot('tela-caminho', '.caminho', -60);
  await page.click('.tb-btn[data-act="cartao"]'); await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, 'tela-cartao.jpg'), type: 'jpeg', quality: 80 });
  await page.click('#sh-cartao [data-act="fechar"]');
  await page.click('#q32 [data-act="com"]');
  await shot('tela-comentario', '#q32 .coment', -40);
  await browser.close();
  console.log('Capturas salvas em', OUT, fs.readdirSync(OUT));
})();
