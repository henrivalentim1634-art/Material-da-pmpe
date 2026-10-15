# Material PMPE · Raiz de Física

Infoprodutos em HTML para concursos policiais (PMPE / PMAL), prontos para venda na Kiwify.

## Minissimulado de Português PMPE 2026

40 questões inéditas em 4 fases de dificuldade, no padrão das bancas Instituto AOCP, Cebraspe e IAUPE, com gabarito comentado de todas as alternativas, tesoura de eliminação, cartão-resposta em cores, Modo Prova/Treino, gráfico de pizza, diagnóstico (pontos fortes, fracos e a melhorar) e caminho de estudo de 14 dias. Abre no celular (inclusive iPhone), tablet e computador.

| Pasta | Conteúdo |
|---|---|
| `produto/` | `minissimulado-portugues-pmpe.html`: o produto final (arquivo único, conteúdo **criptografado**; só abre com chave de licença) |
| `vendas/` | Página de vendas, página de obrigado, termos de uso e política de privacidade |
| `kiwify/` | **[Guia passo a passo](kiwify/GUIA-KIWIFY.md)**, textos prontos, automação das chaves, kit de anúncios e criativos em PNG |
| `src/` | Motor do simulado (HTML, CSS e JS) e identidade visual |
| `ferramentas/` | Scripts de build: gerar chaves, criptografar e montar o produto, capturas, criativos e pasta do site |
| `privado/` | **Não versionada.** Questões em texto aberto e chaves de licença (ficam só com o autor) |

## Como gerar o produto

Requer Node.js 18+ e a pasta `privado/` (entregue separadamente ao autor).

```bash
cd ferramentas
npm install
node gerar-chaves.mjs 500   # (opcional) gera chaves novas em privado/licencas.csv
node build.mjs              # criptografa o conteúdo e gera produto/minissimulado-portugues-pmpe.html
node montar-site.mjs        # monta site/ e site-netlify.zip para publicar no Netlify
```

Para revogar uma chave, escreva-a em `privado/revogadas.txt` e rode `node build.mjs` de novo.

## Proteção do material

- Questões, gabarito e comentários ficam criptografados no HTML; a chave de conteúdo só é recuperada com uma chave de licença válida (com alongamento de 15.000 rodadas de SHA-256 contra força bruta).
- Marca d’água com nome, e-mail, número de licença e data, que volta se for removida.
- Cópia, seleção, menu de contexto, impressão e atalhos de código-fonte bloqueados; a tela é coberta ao trocar de janela ou usar atalhos de captura.
- Nenhum site consegue impedir o print do celular ou a gravação de tela do sistema: por isso a marca d’água identifica a licença de origem.

© Raiz de Física. Os arquivos do produto, da página de vendas e dos criativos são de uso exclusivo do autor; todos os direitos reservados.
