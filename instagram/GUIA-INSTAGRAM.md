# Guia de vendas pelo Instagram · Minissimulados PMPE 2026

Produtos: Português, Raciocínio Lógico, Informática, Direito Constitucional, Direitos Humanos e Legislação Extravagante · **R$ 10,80 cada** · marca **Raiz de Física**

A partir de agora, nenhum material fica em site. A venda acontece no Instagram e nas redes sociais, e o cliente recebe **o arquivo do simulado e uma chave pessoal**. Este guia reúne tudo o que você precisa para postar, responder e entregar.

---

## 0. O fluxo de venda

```
Post, Reels ou Stories → comentário ("LEI", "DC"...) ou direct
  → você responde com os detalhes e o link de pagamento (ou a chave Pix)
  → pagamento confirmado
  → você envia o arquivo .html + a chave pelo WhatsApp ou por e-mail
  → o aluno abre o arquivo e digita nome, e-mail e chave
```

| Produto | Arquivo que você envia (pasta `produto/`) | Chave | Planilha de controle | Palavra para comentar |
|---|---|---|---|---|
| Português | `minissimulado-portugues-pmpe.html` | `RF-…` | `privado/licencas.csv` | **PORT** |
| Raciocínio Lógico | `minissimulado-rlm-pmpe.html` | `RL-…` | `privado/licencas-rlm.csv` | **RLM** |
| Informática | `minissimulado-informatica-pmpe.html` | `RI-…` | `privado/licencas-info.csv` | **INFO** |
| Direitos Humanos | `minissimulado-direitos-humanos-pmpe.html` | `RD-…` | `privado/licencas-dh.csv` | **DH** |
| Direito Constitucional | `minissimulado-direito-constitucional-pmpe.html` | `RC-…` | `privado/licencas-dc.csv` | **DC** |
| Legislação Extravagante | `minissimulado-legislacao-extravagante-pmpe.html` | `RE-…` | `privado/licencas-lee.csv` | **LEI** |

> A chave de um produto não abre os outros. A licença `0000` (status `AUTOR`) de cada planilha é a sua chave de teste: nunca a envie a clientes.

> **Por que WhatsApp ou e-mail, e não o direct?** O direct do Instagram não envia arquivos `.html`; ele aceita só fotos, vídeos e áudios. Use o direct para conversar e o WhatsApp (como **Documento**) ou o e-mail para entregar.

---

## 1. Antes do primeiro post (faça uma vez)

### 1.1 Teste os arquivos nos aparelhos

1. **Computador:** clique com o botão direito no arquivo → *Abrir com* → Chrome, Edge, Firefox ou Safari. Digite a chave de autor e confira se o simulado abre.
2. **Android:** mande o arquivo para você mesmo pelo WhatsApp (como Documento). Toque nele; se o celular perguntar com qual aplicativo abrir, escolha o **Chrome**. Se abrir só um texto de instruções, salve o arquivo e abra pelo Chrome → ⋮ → *Downloads*.
3. **iPhone:** veja a seção 8 antes de vender para quem usa iPhone.

### 1.2 Monte a planilha de controle

Importe cada CSV numa aba do Google Planilhas (separador: ponto e vírgula). As colunas são `numero`, `chave`, `status`, `email_comprador`, `nome_comprador`, `data_envio` e `observacao`. Os status são: `LIVRE` (disponível), `ENVIADA` (entregue) e `REVOGADA` (bloqueada).

### 1.3 Prepare o perfil

- **Conta profissional** (Criador de conteúdo ou Empresa): é a que libera estatísticas, botão de contato e anúncios. Fica em *Configurações → Tipo de conta e ferramentas*.
- **Nome no perfil** (aparece na busca): `Raiz de Física · Simulados PMPE`
- **Bio** (até 150 caracteres):

```
📚 Minissimulados PMPE 2026 · banca AOCP
✅ 40 questões comentadas + diagnóstico
📲 Celular ou computador · R$ 10,80
👇 Compre pelo WhatsApp
```

- **Link na bio:** sem site, use um destes:
  - link direto para o seu WhatsApp com mensagem pronta: `https://wa.me/55DDDNUMERO?text=Quero%20um%20minissimulado%20PMPE` (troque `DDDNUMERO` pelo seu número, só algarismos);
  - ou o link de pagamento do seu meio de pagamento (Mercado Pago, PagBank, InfinitePay, Kiwify etc.). O checkout é página do meio de pagamento, não um site seu.

  O Instagram aceita até 5 links na bio: dá para pôr o WhatsApp primeiro e um link de pagamento por produto depois.
- **Botões de contato:** ative *WhatsApp* e *E-mail* em *Editar perfil → Opções de contato*.

### 1.4 Destaques (stories fixos)

Use as capas `ig-destaque-*.png` (o Instagram recorta o círculo do centro).

| Capa | Nome do destaque | O que guardar nele |
|---|---|---|
| `ig-destaque-1-simulados` | Simulados | O story de oferta de cada produto (um por matéria) |
| `ig-destaque-2-comprar` | Comprar | `ig-geral-story-como-comprar` + prints (com permissão) de clientes que compraram |
| `ig-destaque-3-abrir` | Abrir | `ig-geral-story-como-abrir` + um vídeo curto seu abrindo o arquivo no Android |
| `ig-destaque-4-leis-2026` | Leis 2026 | Os stories do teste rápido e a resposta (`ig-lee-story-1` e `ig-lee-story-2`) |
| `ig-destaque-5-dicas` | Dicas | Os quizzes de cada matéria e as respostas |
| `ig-destaque-6-duvidas` | Dúvidas | Perguntas frequentes (seção 6.4) em stories de texto |

---

## 2. As peças prontas

Todas em PNG, no tamanho exato do Instagram, na pasta `instagram/criativos/`:

| Arquivo | Formato | Uso |
|---|---|---|
| `ig-lee-carrossel-1-capa` a `ig-lee-carrossel-7-oferta` | Carrossel 4:5 (7 lâminas) | “Mudou em 2026”: 5 mudanças nas leis penais + oferta |
| `ig-lee-story-1-teste` | Story 9:16 | Pergunta com espaço para a figurinha de Teste |
| `ig-lee-story-2-resposta` | Story 9:16 | Resposta (70%) e a tabela da progressão |
| `ig-lee-story-3-oferta` | Story 9:16 | Oferta com espaço para a figurinha de Link |
| `ig-lee-reels-capa` | Capa de Reels 9:16 | Capa do Reels “A lei mudou em 2026” |
| `ig-geral-6-simulados` | Post 4:5 | Os seis minissimulados de uma vez |
| `ig-geral-bloco-3` | Post 4:5 | Direito Constitucional + Direitos Humanos + Legislação Extravagante |
| `ig-geral-story-como-comprar` | Story 9:16 | Passo a passo da compra |
| `ig-geral-story-como-abrir` | Story 9:16 | Como abrir no computador, no Android e no iPhone |
| `ig-destaque-1` a `ig-destaque-6` | Capas de destaque | Ver 1.4 |

Também servem no Instagram as peças de cada produto em `kiwify/*/criativos/`: `anuncio-*-feed-1`, `anuncio-*-feed-2` e `anuncio-*-feed-3` (posts) e `anuncio-*-stories-1` (story). Os textos de cada uma estão nos arquivos `anuncios-*.md` da mesma pasta. Os stories de anúncio terminam com “Toque em Saiba mais”: use-os **só como anúncio pago** (o botão *Saiba mais* só existe em anúncio). No story comum, use a figurinha de Link.

Para mudar uma peça, edite `instagram/criativos/fonte/instagram.html` e rode, na pasta `ferramentas`: `node gerar-criativos.cjs instagram`.

---

## 3. Legendas prontas

### 3.1 Carrossel “Mudou em 2026” (Legislação Extravagante)

```
A legislação penal especial mudou MUITO em 2026, e muita apostila ainda ensina a regra antiga. 📚

Arraste e confira 5 mudanças que podem cair na PMPE:
1️⃣ Crime hediondo, réu primário: a progressão de regime subiu de 40% para 70% da pena
2️⃣ Nova tortura doméstica contra a mulher (art. 1º, III, da Lei de Tortura)
3️⃣ O delegado pode mandar pôr a tornozeleira no agressor quando o Município não é sede de comarca (art. 12-D da Lei Maria da Penha)
4️⃣ Prazo de 12 meses para a queixa ou a representação na violência doméstica (art. 16-A)
5️⃣ Tráfico de integrante de milícia ou de organização criminosa ultraviolenta: pena em dobro (art. 40-A da Lei de Drogas)

Quer treinar com questões? O Minissimulado de Legislação Extravagante tem 40 questões comentadas, 33 delas de provas policiais reais, já conferidas com as leis de 2026, e uma calculadora de progressão de regime.

💬 Comente LEI que eu te mando os detalhes no direct
💰 R$ 10,80 · link na bio

Salve para revisar e mande para quem vai fazer a prova 👊

#PMPE #PMPE2026 #LegislacaoExtravagante #LegislacaoPenalEspecial #LeiMariaDaPenha #LeiDeDrogas #CrimesHediondos #ConcursoPolicial #Concurseiro #AOCP
```

### 3.2 Post “6 minissimulados”

```
Seis matérias da PMPE 2026, seis minissimulados de 40 questões cada. 🎯

📘 Bloco I: Português
📗 Bloco II: Raciocínio Lógico e Informática
📕 Bloco III: Direito Constitucional, Direitos Humanos e Legislação Extravagante

Em todos você tem:
✅ gabarito comentado de todas as alternativas
✅ tesoura para eliminar alternativas e cartão-resposta em cores
✅ gráfico de pizza, pontos fortes, pontos fracos e caminho de estudo
✅ abre no celular ou no computador, com chave pessoal

R$ 10,80 cada. Comente o nome da matéria (PORT, RLM, INFO, DC, DH ou LEI) que eu te chamo no direct. 📩

#PMPE #PMPE2026 #ConcursoPMPE #SoldadoPMPE #SimuladoPMPE #ConcursoPolicial #AOCP #QuestoesDeConcurso #Concurseiro #Pernambuco
```

### 3.3 Post “Feche o Bloco III”

```
O Bloco III da PMPE junta Direito Constitucional, Direitos Humanos e Legislação Extravagante, e é nele que muita gente perde a vaga. ⚖️

São 120 questões comentadas nas 3 matérias do bloco:
🔹 Direito Constitucional: 28 questões das provas de 2024 + calculadora de quóruns
🔹 Direitos Humanos: tratados, Pacto de San José e calculadora de penas
🔹 Legislação Extravagante: 33 questões de provas policiais reais, já com as leis de 2026

R$ 10,80 cada. Comente BLOCO que eu te mando as opções no direct. 📩

#PMPE #PMPE2026 #DireitoConstitucional #DireitosHumanos #LegislacaoExtravagante #ConcursoPolicial #AOCP #Concurseiro
```

### 3.4 Peças de cada produto (`kiwify/*/criativos/`)

Use o **Texto principal** de cada variação em `anuncios-*.md` como legenda e troque o final por:

```
💬 Comente [PALAVRA] que eu te mando os detalhes no direct
💰 R$ 10,80 · link na bio
```

Nos posts de teste (`feed-3`), publique e, depois de 1 dia, **fixe nos comentários** a resposta que está em “Primeiro comentário” no `anuncios-*.md` do produto. A demora gera comentários e leva o post a mais gente.

### 3.5 Hashtags por matéria (use 5 a 10 por post)

| Matéria | Hashtags |
|---|---|
| Todas | `#PMPE #PMPE2026 #ConcursoPMPE #SoldadoPMPE #ConcursoPolicial #AOCP #Concurseiro #QuestoesDeConcurso` |
| Português | `#LinguaPortuguesa #PortuguesParaConcursos #Gramatica` |
| Raciocínio Lógico | `#RaciocinioLogico #RLM #MatematicaParaConcursos` |
| Informática | `#InformaticaParaConcursos #Excel #Windows` |
| Direito Constitucional | `#DireitoConstitucional #Constituicao #CF88` |
| Direitos Humanos | `#DireitosHumanos #PactoDeSanJose` |
| Legislação Extravagante | `#LegislacaoExtravagante #LegislacaoPenalEspecial #LeiMariaDaPenha #LeiDeDrogas #CrimesHediondos #ECA` |

---

## 4. Stories

### 4.1 Sequência “Teste rápido” (Legislação Extravagante)

1. **`ig-lee-story-1-teste`:** cole a figurinha **Teste** no espaço vazio, com a pergunta “Quanto ele cumpre?” e as opções `1/6`, `40%`, `70%` (correta) e `85%`.
2. **No dia seguinte, `ig-lee-story-2-resposta`:** “Quem marcou 40% caiu na regra antiga 👀”.
3. **Logo depois, `ig-lee-story-3-oferta`:** cole a figurinha **Link** sobre “Toque no link 👇”, apontando para o WhatsApp ou para o link de pagamento.
4. Guarde os três no destaque **Leis 2026**.

Para as outras matérias, repita o modelo com o quiz do `feed-3` de cada produto.

### 4.2 Rotina diária (5 minutos)

- **1 story de conteúdo:** um quiz, uma enquete (“Já estudou a Lei de Drogas?”) ou um print de questão comentada.
- **1 story de bastidor:** você estudando, montando o material, uma mensagem de cliente (sempre com permissão e sem mostrar o número).
- **1 story de oferta, a cada 2 dias:** o story de oferta do produto da semana, com a figurinha de Link.

---

## 5. Reels (roteiros de 20 a 30 segundos)

Grave com o celular na vertical, com legenda na tela (o app *Edits* ou o próprio Instagram geram legendas automáticas). Para mostrar o simulado, use as **capturas prontas** `vendas-*/img/tela-*.jpg` em vez de gravar a tela: assim não aparece a marca-d'água com o seu nome e a sua licença.

### Reels 1 · “A lei mudou em 2026” (capa: `ig-lee-reels-capa`)

| Tempo | Imagem | Fala e texto na tela |
|---|---|---|
| 0–2 s | Você para a câmera | “Se a sua apostila de legislação é de 2025, ela já está desatualizada.” |
| 2–7 s | Você + texto “40% → 70%” | “Crime hediondo, réu primário: a progressão de regime subiu de 40% para 70% da pena.” |
| 7–12 s | Texto “tortura doméstica · 2 a 8 anos” | “Surgiu a tortura doméstica contra a mulher, com pena de 2 a 8 anos.” |
| 12–18 s | Texto “art. 12-D” | “E o delegado já pode mandar pôr a tornozeleira no agressor quando o Município não é sede de comarca.” |
| 18–25 s | `tela-real.jpg` e `tela-laboratorio.jpg` | “Montei um simulado com 40 questões, 33 de provas policiais reais, já atualizado com essas leis.” |
| 25–28 s | Você | “Comenta LEI que eu te mando.” |

### Reels 2 · “40% ou 70%?” (teste)

| Tempo | Imagem | Fala e texto na tela |
|---|---|---|
| 0–3 s | Texto grande “40% ou 70%?” | “Réu primário, crime hediondo de 2026. Quanto da pena ele cumpre para progredir?” |
| 3–6 s | Contagem 3, 2, 1 | “Pensa aí…” |
| 6–12 s | Texto “70%” | “70%. A Lei nº 15.358 de 2026 mudou a regra; antes eram 40%.” |
| 12–20 s | `tela-laboratorio.jpg` | “No simulado tem uma calculadora que faz essa conta para qualquer pena, com a regra antiga e a nova.” |
| 20–23 s | Você | “Comenta LEI.” |

### Reels 3 · “Por dentro do minissimulado” (serve para os seis)

| Tempo | Imagem | Fala e texto na tela |
|---|---|---|
| 0–3 s | `tela-capa.jpg` | “Olha como é o minissimulado que eu uso para treinar para a PMPE.” |
| 3–8 s | `tela-tesoura.jpg` | “Tem tesoura para eliminar alternativa, igual na prova.” |
| 8–13 s | `tela-comentario.jpg` | “Gabarito comentado de todas as alternativas, não só da certa.” |
| 13–20 s | `tela-resultado.jpg` e `tela-diagnostico.jpg` | “No final, gráfico, pontos fortes, pontos fracos e o que estudar primeiro.” |
| 20–25 s | `ig-geral-6-simulados.png` | “São seis matérias, R$ 10,80 cada. Comenta a matéria que eu te mando.” |

Os outros produtos têm roteiro próprio na seção 2 do `anuncios-*.md` de cada um.

---

## 6. Direct e WhatsApp: mensagens prontas

### 6.1 Resposta ao comentário

No comentário: `Te chamei no direct! 📩`

No direct:

```
Oi, {nome}! Tudo bem? 😊 Aqui estão os detalhes do Minissimulado de Legislação Extravagante PMPE 2026:

✅ 40 questões no nível da prova (33 de provas policiais reais, com a fonte)
✅ Já atualizado com as leis de 2026
✅ Gabarito comentado de todas as alternativas
✅ Calculadora de progressão de regime, gráfico de desempenho e plano de estudo

É um arquivo interativo que você abre no celular ou no computador, com uma chave pessoal de acesso.
Valor: R$ 10,80, pagamento único.

Você vai usar no celular Android, no iPhone ou no computador?
```

> A pergunta do aparelho é importante: veja a seção 8 antes de vender para quem usa iPhone.

Para as outras matérias, troque o nome e os três primeiros itens pelos da **Lista de benefícios** em `textos-prontos-*.md` (seção 2) do produto.

### 6.2 Fechamento

```
Perfeito! O pagamento é por Pix ou cartão neste link: [LINK DE PAGAMENTO]
(ou Pix direto: [SUA CHAVE PIX], no valor de R$ 10,80)

Depois de pagar, me mande o comprovante e também:
• seu nome completo
• seu e-mail
• seu WhatsApp (é por lá que eu envio o arquivo, porque o direct não envia esse tipo de arquivo)
```

**Combo (opcional, você decide o preço):** “Levando os 3 do Bloco III, fica R$ [27,90].”

### 6.3 Entrega (WhatsApp ou e-mail)

1. Confira o pagamento.
2. Na planilha do produto, pegue a primeira chave `LIVRE`, preencha `email_comprador`, `nome_comprador` e `data_envio` e mude o status para `ENVIADA`.
3. Envie o arquivo da pasta `produto/`: no WhatsApp, use o clipe → **Documento**; no e-mail, use anexo.
4. Logo depois, mande a mensagem abaixo.

```
Olá, {nome}! Pagamento confirmado ✅

Acima está o seu Minissimulado de {matéria} PMPE 2026. Esta é a sua chave pessoal:

{chave}

COMO ABRIR
💻 Computador: salve o arquivo, clique nele com o botão direito → Abrir com → Chrome, Edge, Firefox ou Safari.
🤖 Android: toque no arquivo e, se o celular perguntar com qual aplicativo abrir, escolha o Chrome. Se aparecer só um texto de instruções, salve o arquivo e abra pelo Chrome → ⋮ → Downloads.
🍎 iPhone/iPad: [a instrução que você testou, seção 8]

Na tela de acesso, digite seu nome completo, este e-mail ({email}) e a chave acima.

A chave é pessoal e intransferível: seu nome, e-mail e número de licença aparecem como marca-d'água no material.

Bons estudos! Qualquer dúvida, é só me chamar aqui. 👊
```

### 6.4 Perguntas frequentes

- **“É PDF?”** Não. É um arquivo interativo: você marca as respostas, elimina alternativas com a tesoura, vê o gabarito comentado e, no final, o gráfico e o plano de estudo. Abre no navegador do celular ou do computador.
- **“Precisa de internet?”** Não para resolver: o arquivo funciona sem internet depois de baixado.
- **“Posso imprimir ou passar para um amigo?”** Não. A impressão é bloqueada e a chave é pessoal: o nome e o e-mail do comprador aparecem como marca-d'água.
- **“A chave deu inválida.”** Peça um print. Confira se a pessoa abriu o arquivo do produto certo (chave `RE-` só abre Legislação Extravagante, e assim por diante) e se digitou letras e números sem espaço. Se ainda falhar, teste a mesma chave você mesmo.
- **“Abriu só um texto de instruções.”** É a pré-visualização do WhatsApp, do e-mail ou do aplicativo de arquivos. Mande o story `ig-geral-story-como-abrir` ou o passo a passo da mensagem de entrega.
- **“Tem garantia?”** Defina a sua política e diga sempre a mesma coisa (ex.: “se não conseguir abrir, eu devolvo o valor”).
- **“As questões são da banca?”** São 33 de provas policiais reais, com a fonte em cada uma, e 7 inéditas sobre as leis de 2026. Nunca diga que o material é “oficial” ou da PMPE.

### 6.5 Responder no automático (opcional)

O Instagram não manda direct sozinho quando alguém comenta. Se o volume crescer, ferramentas parceiras da Meta (como o ManyChat) enviam a mensagem 6.1 automaticamente para quem comentar a palavra-chave. Comece respondendo à mão: é grátis e a conversa vende mais.

---

## 7. Calendário de 4 semanas

| Semana | Foco | Feed (3 posts) | Reels (2) | Stories |
|---|---|---|---|---|
| 1 | Lançamento de Legislação Extravagante | Seg: carrossel “Mudou em 2026” · Qua: `anuncio-lee-feed-1-tortura` · Sex: `anuncio-lee-feed-3-progressao` (fixe a resposta no sábado) | Reels 1 e Reels 2 | Sequência 4.1 + rotina diária |
| 2 | Bloco III | Seg: `ig-geral-bloco-3` · Qua: `anuncio-dc-feed-3-quorum` · Sex: `anuncio-dh-feed-3-pena` | Reels 3 + roteiro de DC ou DH | Quiz de DC e de DH + oferta do Bloco III |
| 3 | Bloco II | Seg: `anuncio-rlm-feed-1-negacao` · Qua: `anuncio-info-feed-3-atalho` · Sex: `anuncio-rlm-feed-3-dado` | Roteiros de RLM e de Informática | Quiz de RLM e de Informática |
| 4 | Bloco I + vitrine | Seg: `anuncio-feed-1-tirinha` (Português) · Qua: `anuncio-feed-3-quiz` · Sex: `ig-geral-6-simulados` | Reels 3 + roteiro de Português | Quiz de Português + “Como comprar” |

Depois do primeiro mês, repita o ciclo e dê mais espaço ao produto que mais vendeu.

**Melhores horários para começar:** das 12h às 13h e das 19h às 21h. Depois de 2 semanas, confira em *Painel profissional → Estatísticas → Público* os horários do seu público.

---

## 8. iPhone e iPad: teste antes de vender

O simulado roda dentro do navegador e precisa de JavaScript. No computador e no Android ele abre normalmente pelo navegador. No iPhone, a pré-visualização do app **Arquivos**, do WhatsApp, do Instagram e do e-mail **não executa JavaScript**: o cliente vê só o texto de instruções. Por isso o iPhone precisa de um aplicativo que abra arquivos HTML com JavaScript.

Eu não consegui testar num iPhone. Antes de vender para quem usa iPhone, faça este teste num aparelho seu ou de um amigo:

1. Envie o arquivo para o iPhone pelo WhatsApp (como Documento) e salve em *Arquivos*.
2. Instale um aplicativo leitor de HTML que diga rodar JavaScript. Um candidato é o **HTMLViewer Pro+**, que anuncia suporte completo a JavaScript na App Store; teste também outros gerenciadores de arquivos com navegador próprio.
3. Abra o arquivo pelo aplicativo. Se aparecer a tela da chave e o simulado funcionar, escreva o passo a passo na mensagem de entrega (6.3).
4. Se nenhum aplicativo funcionar, avise o cliente de iPhone **antes do pagamento**: o simulado abre no computador ou num Android.

A única forma garantida de abrir no iPhone sem aplicativo extra é um link privado, usado só para abrir o arquivo. Isso é decisão sua; o restante deste guia funciona sem nenhum site.

Referências: [leancrew.com](https://leancrew.com/all-this/2008/11/local-html-and-javascript-on-the-iphone/) · [mundobytes.com](https://mundobytes.com/pt/como-posso-abrir-um-documento-html-no-meu-iphone/) · [yomotherboard.com](https://yomotherboard.com/question/how-can-i-run-a-local-html-and-javascript-page-on-an-iphone-2/) · [HTMLViewer Pro+ na App Store](https://apps.apple.com/qa/app/htmlviewer-pro/id6746694144?l=en-GB)

---

## 9. Impulsionar (anúncio pago) sem site

1. **O que impulsionar:** o post orgânico que teve mais salvamentos e comentários na semana. O carrossel “Mudou em 2026” e os testes (`feed-3`) costumam ir melhor.
2. **Objetivo:** *Mais mensagens* (botão *Turbinar* do Instagram) ou, no Gerenciador de Anúncios, *Engajamento → Apps de mensagens* (WhatsApp ou direct). Sem site, a venda acontece na conversa.
3. **Público:** Pernambuco (ou um raio de 50 a 100 km das cidades maiores), 18 a 35 anos, interesses em concursos públicos, polícia militar e concursos policiais.
4. **Orçamento de teste:** R$ 10 a R$ 15 por dia, por 5 a 7 dias, um produto por vez.
5. **Conta que importa:** cada venda rende cerca de R$ 10 (menos a taxa do meio de pagamento). Anote, por campanha, o **custo por conversa** e quantas conversas viram compra. Se o custo por venda passar de R$ 6 ou 7, pause e troque a peça ou o público.

---

## 10. Regras para não ter post derrubado nem problema

- Não use brasões, fardas, viaturas ou símbolos da PMPE, do Governo de Pernambuco, do Instituto AOCP ou de outras bancas, e não diga que o material é “oficial”.
- Não prometa aprovação (“passe na PMPE garantido”). Prefira “treine”, “descubra onde você erra” e “revise as mudanças”.
- Questões reais podem ser citadas como “de provas policiais reais”, com a fonte, como no material.
- Depoimentos e prints de clientes só com autorização, sem mostrar telefone ou e-mail.
- A legislação continua mudando: antes de repostar uma peça de leis, confira se não surgiu lei nova. Este kit foi conferido com o texto das leis atualizado até outubro de 2026.
