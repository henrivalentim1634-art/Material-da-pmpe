# Material PMPE · Raiz de Física

Infoprodutos em HTML para concursos policiais (PMPE / PMAL), prontos para venda na Kiwify.

## Produtos

| Produto | Arquivo final | Página de vendas | Chaves |
|---|---|---|---|
| Minissimulado de **Português** PMPE 2026 | `produto/minissimulado-portugues-pmpe.html` | `vendas/` | `RF-XXXX-XXXX-XXXX` |
| Minissimulado de **Raciocínio Lógico** PMPE 2026 | `produto/minissimulado-rlm-pmpe.html` | `vendas-rlm/` | `RL-XXXX-XXXX-XXXX` |
| Minissimulado de **Informática** PMPE 2026 | `produto/minissimulado-informatica-pmpe.html` | `vendas-info/` | `RI-XXXX-XXXX-XXXX` |
| Minissimulado de **Direitos Humanos** PMPE 2026 | `produto/minissimulado-direitos-humanos-pmpe.html` | `vendas-dh/` | `RD-XXXX-XXXX-XXXX` |
| Minissimulado de **Direito Constitucional** PMPE 2026 | `produto/minissimulado-direito-constitucional-pmpe.html` | `vendas-dc/` | `RC-XXXX-XXXX-XXXX` |

A pasta `vitrine/` tem a página inicial do site com os cinco produtos.

## Minissimulado de Direito Constitucional PMPE 2026

40 questões em 4 fases: 28 questões reais de provas de 2024 (as 10 de Constitucional da prova de Soldado da PMPE, 2 da prova de 2º Tenente da PMPE, 10 do CBMPE e 6 da PCPE), com a fonte indicada em cada uma, e 12 inéditas de nível de elite, com ênfase no art. 5º, na organização do Estado e político-administrativa, na administração pública e nos três Poderes. Traz a **Calculadora de quóruns** (maioria absoluta, maioria simples, 3/5, 2/3 e 1/3, com a regra de arredondamento e onde a Constituição exige cada quórum), a Constituição relâmpago, figuras em HTML e SVG (quadro de competências, hemiciclo do Senado e fluxograma do veto), frações em KaTeX, gabarito comentado, gráfico de pizza, diagnóstico em 8 áreas com desempenho nas questões reais e caminho de estudo.

## Minissimulado de Direitos Humanos PMPE 2026

40 questões inéditas em 4 fases, sobre os itens de Direitos Humanos e Legislação Extravagante do edital, com ênfase nas novidades (Pacto de San José da Costa Rica, com 8 questões, Estatuto da Pessoa Idosa, Estatuto da Juventude e Lei Maria da Penha) e 7 questões de assertivas. Traz a **Calculadora de penas** (frações de aumento e de diminuição e percentuais de progressão, com a conta em anos, meses e dias), o Vade-mécum relâmpago, figuras em HTML e SVG (linha do tempo, pirâmide das normas e sistema interamericano), frações em KaTeX, gabarito comentado, gráfico de pizza, diagnóstico em 8 áreas e caminho de estudo. O Estatuto dos PMs de PE (Lei estadual nº 6.783/1974) não está incluído.

## Minissimulado de Informática PMPE 2026

40 questões inéditas em 4 fases, sobre os 7 itens de Informática do edital (Windows 11 e Prompt de Comando, Office 2019 e LibreOffice 7, internet, segurança, backup e hardware), com ênfase em hardware, Excel, Windows 11, internet e segurança. Traz o **Laboratório de fórmulas** (avaliador de fórmulas do Excel e do Calc em português, com a precedência do Excel, erros como #DIV/0! e #N/D e o ajuste de referências ao copiar), o Guia-relâmpago de atalhos e comandos, figuras em HTML e SVG (planilhas, Explorador de Arquivos, Prompt, placa-mãe, e-mail de phishing e linha do tempo de backup), gabarito comentado, gráfico de pizza, diagnóstico em 8 áreas e caminho de estudo.

## Minissimulado de Raciocínio Lógico PMPE 2026

40 questões inéditas em 4 fases (estilo AOCP, Cebraspe, IAUPE, Vunesp, FGV e IDECAN), com ênfase em tabela-verdade, conectivos, tautologias, argumentos válidos, análise combinatória e probabilidade. Fórmulas em LaTeX renderizadas com KaTeX no build (aparecem nítidas e offline no celular), Formulário-relâmpago, **Laboratório de tabela-verdade** interativo (monta e classifica qualquer proposição com até 5 letras), figuras em SVG (Venn, grade de ruas, urna, mesa redonda), gabarito comentado com todas as contas, gráfico de pizza, diagnóstico em 8 áreas e caminho de estudo.

## Minissimulado de Português PMPE 2026

40 questões inéditas em 4 fases de dificuldade, no padrão das bancas Instituto AOCP, Cebraspe e IAUPE, com gabarito comentado de todas as alternativas, tesoura de eliminação, cartão-resposta em cores, Modo Prova/Treino, gráfico de pizza, diagnóstico (pontos fortes, fracos e a melhorar) e caminho de estudo de 14 dias. Abre no celular (inclusive iPhone), tablet e computador.

| Pasta | Conteúdo |
|---|---|
| `produto/` | Os produtos finais (arquivo único cada, conteúdo **criptografado**; só abrem com chave de licença) |
| `vendas/` · `vendas-rlm/` · `vendas-info/` · `vendas-dh/` · `vendas-dc/` · `vitrine/` | Páginas de vendas, obrigado, termos de uso, privacidade e a vitrine |
| `kiwify/` | **[Guia passo a passo](kiwify/GUIA-KIWIFY.md)**, textos prontos, automação das chaves, kit de anúncios e criativos em PNG |
| `src/` | Motor do simulado (HTML, CSS e JS) e identidade visual |
| `ferramentas/` | Scripts de build: gerar chaves, criptografar e montar o produto, capturas, criativos e pasta do site |
| `privado/` | **Não versionada.** Questões em texto aberto e chaves de licença (ficam só com o autor) |

## Como gerar o produto

Requer Node.js 18+ e a pasta `privado/` (entregue separadamente ao autor).

```bash
cd ferramentas
npm install
node gerar-chaves.mjs 500        # (opcional) chaves novas de Português (privado/licencas.csv)
node gerar-chaves.mjs 500 rlm    # (opcional) chaves novas de RLM (privado/licencas-rlm.csv)
node gerar-chaves.mjs 500 info   # (opcional) chaves novas de Informática (privado/licencas-info.csv)
node gerar-chaves.mjs 500 dh     # (opcional) chaves novas de Direitos Humanos (privado/licencas-dh.csv)
node gerar-chaves.mjs 500 dc     # (opcional) chaves novas de Direito Constitucional (privado/licencas-dc.csv)
node build.mjs                   # criptografa o conteúdo e gera os produtos em produto/
node build.mjs rlm               # (ou só um produto: portugues, rlm ou info)
node montar-site.mjs             # monta site/ e site-netlify.zip para publicar no Netlify
```

Para revogar uma chave, escreva-a em `privado/revogadas.txt` (Português) `privado/revogadas-rlm.txt` (RLM), `privado/revogadas-info.txt` (Informática) `privado/revogadas-dh.txt` (Direitos Humanos) ou `privado/revogadas-dc.txt` (Direito Constitucional) e rode `node build.mjs` de novo.

## Proteção do material

- Questões, gabarito e comentários ficam criptografados no HTML; a chave de conteúdo só é recuperada com uma chave de licença válida (com alongamento de 15.000 rodadas de SHA-256 contra força bruta).
- Marca d’água com nome, e-mail, número de licença e data, que volta se for removida.
- Cópia, seleção, menu de contexto, impressão e atalhos de código-fonte bloqueados; a tela é coberta ao trocar de janela ou usar atalhos de captura.
- Nenhum site consegue impedir o print do celular ou a gravação de tela do sistema: por isso a marca d’água identifica a licença de origem.

© Raiz de Física. Os arquivos do produto, da página de vendas e dos criativos são de uso exclusivo do autor; todos os direitos reservados.
