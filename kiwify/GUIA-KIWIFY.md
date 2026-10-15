# Guia completo: do arquivo à primeira venda na Kiwify

Produto: **Minissimulado de Português PMPE 2026** · preço: **R$ 10,80** · marca: **Raiz de Física**

Este guia segue a ordem em que você vai trabalhar. Os nomes de menus da Kiwify mudam de vez em quando; se algum botão estiver com outro nome, procure pela função descrita.

---

## 0. O que você tem nas mãos

| Pasta / arquivo | Para que serve | Vai para onde |
|---|---|---|
| `produto/minissimulado-portugues-pmpe.html` | O simulado (40 questões, gabarito, diagnóstico), criptografado | Hospedagem (Netlify) → link na área de membros |
| `vendas/` | Página de vendas, página de obrigado, termos e privacidade | Hospedagem (Netlify) → link nos anúncios e na Kiwify |
| `kiwify/criativos/*.png` | Capa do produto, banner do checkout, anúncios, capas da área de membros | Kiwify e Gerenciador de Anúncios |
| `kiwify/textos-prontos.md` | Descrição do produto, textos do checkout, aulas da área de membros, e-mails | Copiar e colar na Kiwify |
| `kiwify/automacao-chaves.md` | Entrega automática das chaves de acesso | Make ou Zapier |
| `kiwify/anuncios.md` | Textos de anúncio, roteiros, público e orçamento | Meta Ads / TikTok / orgânico |
| `privado/licencas.csv` (**enviado só para você, fora do GitHub**) | As 1.001 chaves de acesso | Sua planilha de controle (Google Planilhas) |
| `privado/conteudo/` (**enviado só para você**) | Questões e gabarito em texto aberto | Guarde em local seguro (necessário para atualizar o material) |

### Como o cliente recebe (fluxo)

```
Anúncio → Página de vendas → Checkout Kiwify (Pix/cartão)
        → Kiwify libera a área de membros (e-mail automático)
        → Aula "Acessar o simulado": link + instruções da chave
        → Cliente recebe a chave (e-mail automático, manual ou chave de turma)
        → Abre o link no navegador → nome + e-mail + chave → simulado liberado
```

> **Importante sobre o repositório no GitHub:** ele está **público** e com licença **GPL-3.0** (a licença permite que qualquer pessoa copie e redistribua o que está lá). Por isso, as questões em texto aberto e as chaves **não foram enviadas** ao GitHub. Recomendo: em *Settings → General → Danger Zone → Change visibility*, deixar o repositório **privado**, e trocar a licença por "Todos os direitos reservados" (apague o arquivo `LICENSE`). O HTML do produto que está no GitHub é criptografado e só abre com chave, mas a página de vendas e os criativos estão visíveis.

---

## 1. Conta na Kiwify

1. Crie a conta em kiwify.com.br com o e-mail que você vai usar no negócio.
2. Complete o cadastro e a **verificação de identidade** (documento e selfie) e cadastre a **conta bancária** para saques. Sem isso, as vendas ficam retidas.
3. Ative a verificação em duas etapas no perfil.
4. Custos: a Kiwify não cobra mensalidade; cobra uma taxa por venda (em 2025 era **8,99% + R$ 2,49**; confira o valor atual no painel). Com esse valor, de cada venda de R$ 10,80 sobram cerca de **R$ 7,34**. Esse é o seu limite de custo por venda nos anúncios.

---

## 2. Hospedar o simulado e a página de vendas (Netlify, grátis)

O simulado **precisa** ser aberto por um link (`https://...`). Arquivo `.html` baixado e aberto pelo app Arquivos do iPhone ou pela pré-visualização do WhatsApp/Drive **não executa** o simulado: era isso que mostrava o código em vez do conteúdo. Com o link, funciona em qualquer aparelho.

### 2.1. Montar a pasta do site

No computador com Node.js instalado, dentro da pasta `ferramentas`:

```bash
npm install
node montar-site.mjs
```

Isso cria a pasta `site/` (e o arquivo `site-netlify.zip`) com:

```
site/
├── index.html          ← página de vendas
├── obrigado.html       ← página pós-compra
├── termos.html  privacidade.html
├── img/  fontes.css  _base.css
├── acesso/index.html   ← o simulado (link que vai na área de membros)
├── _headers            ← regras de segurança do Netlify
└── robots.txt          ← impede o Google de indexar o simulado
```

> Se você não quiser instalar nada, use o `site-netlify.zip` que eu enviei: é a mesma pasta, já montada.

### 2.2. Publicar no Netlify

1. Crie uma conta grátis em netlify.com.
2. Vá em **Sites → Add new site → Deploy manually** (ou acesse app.netlify.com/drop).
3. **Arraste a pasta `site/`** (descompactada) para a área indicada. Em segundos sai um endereço como `https://nome-aleatorio.netlify.app`.
4. Em **Site configuration → Change site name**, troque para algo como `raizdefisica-pmpe` → `https://raizdefisica-pmpe.netlify.app`.
5. Teste no celular:
   - Página de vendas: `https://raizdefisica-pmpe.netlify.app/`
   - Simulado: `https://raizdefisica-pmpe.netlify.app/acesso/`
   - Entre no simulado com a **chave do autor** (licença nº 0000, primeira linha de `licencas.csv`).
6. Para atualizar depois: **Deploys → arraste a nova pasta `site/`**. O endereço continua o mesmo.

**Domínio próprio (opcional):** em *Domain management → Add a domain*, aponte algo como `simulado.raizdefisica.com.br`. Passa mais confiança nos anúncios.

**Alternativas:** Cloudflare Pages (mesmo processo de arrastar a pasta) ou GitHub Pages (exige repositório público para o plano grátis; não recomendo neste caso).

### 2.3. Antes de publicar a página de vendas

Abra `vendas/index.html` (ou `site/index.html`) e troque:

- `CHECKOUT_URL` (no fim do arquivo) pelo link do seu checkout Kiwify (passo 4).
- `[SEU NOME OU RAZÃO SOCIAL]`, `[CPF/CNPJ]` e `[SEU-EMAIL-DE-SUPORTE]` no rodapé, também em `obrigado.html`, `termos.html` e `privacidade.html`.
- Se usar pixel da Meta, cole o código do pixel no `<head>` (há um comentário indicando o lugar). O botão de compra já dispara o evento `InitiateCheckout`.

Depois rode `node montar-site.mjs` de novo e reenvie a pasta ao Netlify.

---

## 3. Cadastrar o produto

Em **Produtos → Criar produto**:

| Campo | O que colocar |
|---|---|
| Tipo | Produto digital com entrega pela **Área de Membros da Kiwify** |
| Nome | `Minissimulado de Português PMPE 2026 · 40 questões comentadas` |
| Descrição | Copie de `textos-prontos.md` → seção 1 |
| Categoria | Educação / Concursos |
| Imagem do produto | `kiwify/criativos/capa-produto-1080x1080.png` |
| Preço | **R$ 10,80** (pagamento único) |
| Garantia | **7 dias** (prazo legal do art. 49 do CDC) |
| Página de vendas | `https://raizdefisica-pmpe.netlify.app/` |
| E-mail de suporte | o seu e-mail de atendimento |

Salve e copie o **link do checkout** (algo como `https://pay.kiwify.com.br/xxxxxx`). Ele vai em `CHECKOUT_URL` na página de vendas.

---

## 4. Configurar o checkout

Em **Produto → Checkout (personalizar)**:

1. **Banner do topo:** `kiwify/criativos/banner-checkout-1200x400.png`. Se o painel pedir outra proporção, ajuste o tamanho no editor de imagem ou me peça uma versão nova.
2. **Cores:** fundo escuro, destaque `#16C2D2` (ciano da marca), botão `#3FEFFF` com texto escuro.
3. **Títulos e textos de confiança:** copie de `textos-prontos.md` → seção 2.
4. **Formas de pagamento:** **Pix** e **cartão de crédito**. Em ticket de R$ 10,80, o boleto costuma atrasar a liberação e cancelar mais; deixe desligado. Parcelamento não faz sentido nesse valor.
5. **Campos do comprador:** nome, e-mail (com confirmação de e-mail) e CPF, se a Kiwify exigir para Pix. Celular é opcional; pedir menos campos aumenta a conversão.
6. **Order bump (aumenta o lucro por venda):** se você vende o **Raio-X PMPE**, ofereça-o como order bump com desconto. Texto em `textos-prontos.md` → seção 3.
7. **Página de obrigado:** redirecione para `https://raizdefisica-pmpe.netlify.app/obrigado.html`.
8. **Pixels:** em *Pixels/Integrações de rastreamento*, conecte o pixel da Meta (e o token da API de Conversões, se tiver) e/ou TikTok. Assim, a Kiwify envia o evento **Purchase** sozinha. Não dispare Purchase também na página de obrigado, senão a venda conta duas vezes.
9. **Cronômetro de escassez e notificações de “alguém comprou”:** use só se forem verdadeiros. Contadores falsos ferem o Código de Defesa do Consumidor e as políticas de anúncio.
10. **Cupons (opcional):** crie um cupom de lançamento (ex.: `PMPE10`) apenas se o preço cheio ainda fizer sentido depois do desconto e da taxa.

---

## 5. Área de membros

Em **Área de membros → Criar curso** (ou na aba de conteúdo do produto):

**Capa do curso:** `area-membros-capa-vertical-1080x1620.png` · **Banner:** `area-membros-banner-1920x1080.png`

| Módulo | Aula | Conteúdo (texto pronto em `textos-prontos.md` → seção 4) | Miniatura |
|---|---|---|---|
| 1 · Comece aqui | 1. Boas-vindas e como funciona | Texto de boas-vindas e passo a passo | `aula-1-comece-aqui-1280x720.png` |
| | 2. Acessar o simulado | **Botão/link** para `.../acesso/` + instruções da chave + dicas de iPhone | `aula-2-acessar-simulado-1280x720.png` |
| | 3. Depois do resultado | Como usar o diagnóstico e o caminho de estudo | `aula-3-plano-de-estudo-1280x720.png` |
| 2 · Suporte | 4. Dúvidas e suporte | FAQ, e-mail, prazos, reembolso | — |

**Regras de configuração recomendadas:**

- **Liberação:** imediata após a compra aprovada (sem liberação gradual).
- **Prazo de acesso:** 12 meses (cobre a prova de 21/02/2027 com folga) ou vitalício. Coloque o mesmo prazo na descrição do produto.
- **Comentários nas aulas:** desligados (ou ligados com moderação, se quiser usar como canal de dúvidas).
- **Downloads:** não anexe o arquivo HTML. O acesso pelo link é o que funciona em todos os aparelhos, e evita a circulação do arquivo.
- **Certificado:** desligado (não se aplica).
- **Acesso por dispositivo / login simultâneo:** se o painel oferecer limite de sessões, ative.
- **E-mail de boas-vindas da Kiwify:** personalize com o texto da seção 5 de `textos-prontos.md`.

---

## 6. Entregar as chaves de acesso

Cada chave (`RF-XXXX-XXXX-XXXX`) abre o simulado e aparece como **número de licença** na marca d’água. Escolha uma forma de entrega:

| Opção | Rastreabilidade | Trabalho | Entrega |
|---|---|---|---|
| **A · Automática (Make/Zapier)**, recomendada | Máxima: 1 chave por comprador | Configura 1 vez (30–40 min) | Em segundos, por e-mail |
| **B · Manual** | Máxima | Alguns minutos por venda | Quando você enviar (avise o prazo na aula 2) |
| **C · Chave de turma** | Por turma (mês) | Quase zero | Imediata (a chave fica escrita na aula 2) |

O passo a passo das três está em **`automacao-chaves.md`**. Para começar a vender hoje, use a **C** e migre para a **A** quando a automação estiver pronta.

**Planilha de controle:** importe `privado/licencas.csv` no Google Planilhas (*Arquivo → Importar → separador ponto e vírgula*). Colunas: `numero; chave; status; email_comprador; nome_comprador; data_envio; observacao`. Status: `AUTOR`, `LIVRE`, `ENVIADA`, `TURMA`, `REVOGADA`.

**A licença 0000 é sua (teste). Nunca a envie a clientes.**

---

## 7. Teste a compra de ponta a ponta

1. Compre o produto você mesmo (Pix), com outro e-mail.
2. Confira: e-mail da Kiwify → área de membros → aula 2 → link abre no celular → chave chega (opção escolhida) → simulado libera → marca d’água mostra nome, e-mail e licença.
3. Peça o reembolso pela Kiwify e confirme que tudo funciona no fluxo de reembolso (opção A revoga a chave).
4. Teste também no **iPhone (Safari)**, em um **Android (Chrome)** e no **computador**.

---

## 8. Anúncios

Tudo em **`anuncios.md`**: textos de feed e stories, roteiros de Reels/TikTok, público, orçamento inicial, UTMs e metas de custo. Criativos prontos em `kiwify/criativos/`.

Regras que evitam reprovação e problemas: não use o brasão nem o nome “PMPE oficial”, não prometa aprovação, não diga que as questões “vão cair” e mantenha o aviso “material independente” na página.

---

## 9. Manutenção

| Tarefa | Como fazer |
|---|---|
| **Gerar mais chaves** | `node gerar-chaves.mjs 500` → `node build.mjs` → `node montar-site.mjs` → reenviar `site/` ao Netlify → importar as novas linhas na planilha |
| **Bloquear uma chave vazada ou reembolsada** | Escreva a chave em `privado/revogadas.txt` (uma por linha) ou marque `REVOGADA` no CSV → `node build.mjs` → `node montar-site.mjs` → reenviar ao Netlify |
| **Corrigir ou trocar uma questão** | Edite `privado/conteudo/questoes-*.mjs` → `node build.mjs` → reenviar. O progresso dos alunos continua salvo |
| **Atualizar as capturas e os criativos** | `node capturas-marketing.cjs` e `node gerar-criativos.cjs` |

Guarde **duas cópias** da pasta `privado/` (por exemplo, no Google Drive e em um pendrive). Sem ela, não dá para gerar chaves novas nem editar as questões.

---

## 10. O que a proteção faz (e o que nenhuma proteção web faz)

**Faz:**
- O conteúdo (questões, gabarito e comentários) fica **criptografado** dentro do HTML; quem abre o código-fonte não lê as questões.
- Só abre com uma **chave válida**; chaves podem ser **revogadas**.
- **Marca d’água** com nome, e-mail, licença e data em toda a tela, mais um selo que muda de lugar a cada 15 s. Se alguém apagar a marca, ela volta.
- Bloqueia **copiar, selecionar, clicar com o botão direito, imprimir, salvar a página e ver o código** pelos atalhos.
- Ao apertar **Print Screen** ou os atalhos de captura do Mac, ou ao trocar de janela/app, a tela é coberta.

**Não faz (limite de qualquer site):** nenhuma página da web consegue impedir o print do celular, a gravação de tela do sistema ou uma foto de outro aparelho. Por isso a marca d’água identifica o comprador: se um print vazar, você sabe de qual licença saiu e pode revogá-la e tomar as medidas legais (Lei nº 9.610/1998).

---

## 11. Checklist final

- [ ] Repositório do GitHub privado e licença GPL removida
- [ ] Pasta `privado/` guardada em dois lugares
- [ ] Conta Kiwify verificada e conta bancária cadastrada
- [ ] Produto criado a R$ 10,80, garantia de 7 dias, imagem de capa
- [ ] Checkout com banner, Pix + cartão, página de obrigado e pixel
- [ ] `CHECKOUT_URL` e dados do rodapé trocados na página de vendas
- [ ] Site publicado no Netlify e testado no iPhone, Android e computador
- [ ] Área de membros com 4 aulas e o link do simulado na aula 2
- [ ] Planilha de licenças no Google Planilhas
- [ ] Entrega das chaves configurada (A, B ou C) e testada com uma compra real
- [ ] Anúncios criados com UTMs e orçamento inicial
