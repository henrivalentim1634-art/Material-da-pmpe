# Material PMPE · Raiz de Física

Infoprodutos em HTML para concursos policiais (PMPE / PMAL), prontos para venda na Kiwify.

## Produtos

| Produto | Arquivo final | Página de vendas | Chaves |
|---|---|---|---|
| Minissimulado de **Português** PMPE 2026 | `produto/minissimulado-portugues-pmpe.html` | `vendas/` | `RF-XXXX-XXXX-XXXX` |
| Minissimulado de **Raciocínio Lógico** PMPE 2026 | `produto/minissimulado-rlm-pmpe.html` | `vendas-rlm/` | `RL-XXXX-XXXX-XXXX` |

A pasta `vitrine/` tem a página inicial do site com os dois produtos.

## Minissimulado de Raciocínio Lógico PMPE 2026

40 questões inéditas em 4 fases (estilo AOCP, Cebraspe, IAUPE, Vunesp, FGV e IDECAN), com ênfase em tabela-verdade, conectivos, tautologias, argumentos válidos, análise combinatória e probabilidade. Fórmulas em LaTeX renderizadas com KaTeX no build (aparecem nítidas e offline no celular), Formulário-relâmpago, **Laboratório de tabela-verdade** interativo (monta e classifica qualquer proposição com até 5 letras), figuras em SVG (Venn, grade de ruas, urna, mesa redonda), gabarito comentado com todas as contas, gráfico de pizza, diagnóstico em 8 áreas e caminho de estudo.

## Minissimulado de Português PMPE 2026

40 questões inéditas em 4 fases de dificuldade, no padrão das bancas Instituto AOCP, Cebraspe e IAUPE, com gabarito comentado de todas as alternativas, tesoura de eliminação, cartão-resposta em cores, Modo Prova/Treino, gráfico de pizza, diagnóstico (pontos fortes, fracos e a melhorar) e caminho de estudo de 14 dias. Abre no celular (inclusive iPhone), tablet e computador.

| Pasta | Conteúdo |
|---|---|
| `produto/` | Os produtos finais (arquivo único cada, conteúdo **criptografado**; só abrem com chave de licença) |
| `vendas/` · `vendas-rlm/` · `vitrine/` | Páginas de vendas, obrigado, termos de uso, privacidade e a vitrine |
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
node build.mjs                   # criptografa o conteúdo e gera os produtos em produto/
node build.mjs rlm               # (ou só um produto)
node montar-site.mjs             # monta site/ e site-netlify.zip para publicar no Netlify
```

Para revogar uma chave, escreva-a em `privado/revogadas.txt` (Português) ou `privado/revogadas-rlm.txt` (RLM) e rode `node build.mjs` de novo.

## Proteção do material

- Questões, gabarito e comentários ficam criptografados no HTML; a chave de conteúdo só é recuperada com uma chave de licença válida (com alongamento de 15.000 rodadas de SHA-256 contra força bruta).
- Marca d’água com nome, e-mail, número de licença e data, que volta se for removida.
- Cópia, seleção, menu de contexto, impressão e atalhos de código-fonte bloqueados; a tela é coberta ao trocar de janela ou usar atalhos de captura.
- Nenhum site consegue impedir o print do celular ou a gravação de tela do sistema: por isso a marca d’água identifica a licença de origem.

© Raiz de Física. Os arquivos do produto, da página de vendas e dos criativos são de uso exclusivo do autor; todos os direitos reservados.
