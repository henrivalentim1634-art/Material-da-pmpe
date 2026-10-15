// Exporta cada peça <section class="art"> do HTML de criativos em PNG (tamanho exato) e a og:image da página de vendas.
// Uso: node gerar-criativos.cjs          (Português: kiwify/criativos/)
//      node gerar-criativos.cjs rlm      (RLM: kiwify/rlm/criativos/)
const { chromium } = require('playwright');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const ID = process.argv[2] || 'portugues';
const CFG = {
  portugues: { fonte: 'kiwify/criativos/fonte/criativos.html', out: 'kiwify/criativos', og: 'vendas/img/og-imagem.jpg' },
  rlm: { fonte: 'kiwify/rlm/criativos/fonte/criativos-rlm.html', out: 'kiwify/rlm/criativos', og: 'vendas-rlm/img/og-imagem.jpg' }
}[ID];
if (!CFG) throw new Error('Produto desconhecido: ' + ID);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2100, height: 1400 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(RAIZ, CFG.fonte));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const ids = await page.$$eval('section.art', (els) => els.map((e) => e.id));
  for (const id of ids) {
    await page.locator('#' + id).screenshot({ path: path.join(RAIZ, CFG.out, id + '.png') });
    if (id.startsWith('og-imagem')) await page.locator('#' + id).screenshot({ path: path.join(RAIZ, CFG.og), type: 'jpeg', quality: 85 });
    console.log('ok', id);
  }
  await browser.close();
})();
