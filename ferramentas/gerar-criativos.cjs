// Exporta cada peça de kiwify/criativos/fonte/criativos.html em PNG (tamanho exato) e a og:image da página de vendas.
// Uso: node gerar-criativos.cjs
const { chromium } = require('playwright');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const FONTE = 'file://' + path.join(RAIZ, 'kiwify', 'criativos', 'fonte', 'criativos.html');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2100, height: 1400 }, deviceScaleFactor: 1 });
  await page.goto(FONTE);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const ids = await page.$$eval('section.art', (els) => els.map((e) => e.id));
  for (const id of ids) {
    await page.locator('#' + id).screenshot({ path: path.join(RAIZ, 'kiwify', 'criativos', id + '.png') });
    if (id.startsWith('og-imagem')) await page.locator('#' + id).screenshot({ path: path.join(RAIZ, 'vendas', 'img', 'og-imagem.jpg'), type: 'jpeg', quality: 85 });
    console.log('ok', id);
  }
  await browser.close();
})();
