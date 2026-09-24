# Material da PMPE

Banco de questões e gerador de simulados em HTML para o concurso de **Soldado da PMPE**.

Cada simulado é **um único arquivo `.html`**: abre no computador ou no celular, funciona sem internet e não precisa de instalação.

## O que tem aqui

| Pasta | Conteúdo |
|---|---|
| `banco/questoes-pmpe.json` | Banco de questões inéditas, com gabarito e comentário (hoje: 28 questões, 4 por disciplina) |
| `modelo/simulado.html` | Visual e funcionamento do simulado (o "molde") |
| `ferramentas/gerar_simulado.py` | Script que junta banco + molde e gera o simulado pronto |
| `simulados/` | Simulados prontos para entregar ao aluno |

Disciplinas: Língua Portuguesa, Raciocínio Lógico, Informática, Direito Constitucional, Direitos Humanos, História de Pernambuco e Legislação Especial.

## O que o simulado faz

- Cronômetro com correção automática quando o tempo acaba
- Questão por questão, com mapa de navegação e "marcar para revisão"
- Atalhos de teclado (A a E para responder, setas para navegar)
- Salva o progresso no navegador (o aluno pode fechar e continuar depois)
- Nota geral e por disciplina, com indicação das matérias para priorizar
- Gabarito comentado com filtros (erradas, em branco, acertos)
- Tema claro e escuro, com layout para celular
- Botão para imprimir ou salvar em PDF

## Como gerar simulados

É preciso ter o Python 3 instalado. Rode os comandos na pasta do projeto:

```bash
# Conferir se o banco de questões está sem erros
python3 ferramentas/gerar_simulado.py --validar

# 3 questões de cada disciplina (a semente fixa o sorteio: mesma semente = mesmo simulado)
python3 ferramentas/gerar_simulado.py --por-disciplina 3 --semente 1 \
  --titulo "Simulado PMPE 01 — Soldado" --marca "Seu Nome" \
  --saida simulados/simulado-pmpe-01.html

# Só algumas disciplinas, 20 minutos, com questões e alternativas embaralhadas a cada tentativa
python3 ferramentas/gerar_simulado.py --disciplinas "Língua Portuguesa,Informática" \
  --quantidade 8 --tempo 20 --embaralhar --saida simulados/treino-portugues-informatica.html
```

Opções: `--titulo`, `--subtitulo`, `--marca` (seu nome ou marca no topo e no rodapé), `--disciplinas`, `--por-disciplina` ou `--quantidade`, `--tempo` (em minutos; o padrão é 3 minutos por questão), `--semente` e `--embaralhar`.

## Como adicionar questões

Acrescente um item na lista `questoes` de `banco/questoes-pmpe.json`:

```json
{
  "id": "POR-005",
  "disciplina": "Língua Portuguesa",
  "assunto": "Regência verbal",
  "dificuldade": "média",
  "texto_base": "(opcional) texto de apoio da questão",
  "enunciado": "Assinale a alternativa correta...",
  "alternativas": ["texto A", "texto B", "texto C", "texto D", "texto E"],
  "correta": "B",
  "comentario": "Por que a B está certa e por que as outras estão erradas.",
  "base_legal": "(opcional) CF/88, art. 5º",
  "conferir": "(opcional) lembrete interno; não aparece para o aluno",
  "fonte": "Inédita"
}
```

Depois rode `--validar`: ele avisa se faltar algum campo, se o `id` estiver repetido ou se a questão não tiver exatamente 5 alternativas.

## Antes de vender

- **Revise todas as questões.** Elas foram elaboradas para estudo e precisam ser conferidas com a legislação vigente. As questões com o campo `conferir` (LEG-001 e LEG-004) citam a Lei estadual nº 6.783/1974 e precisam ser comparadas com o texto atualizado no Portal ALEPE Legis.
- **Confira o edital de 2026 quando for publicado** (a banca definida é o Instituto AOCP). Se o conteúdo programático mudar, ajuste as disciplinas no banco.
- **Não use o brasão nem diga que o material é oficial.** O rodapé do simulado já informa que o material é independente e sem vínculo com a PMPE ou a banca.
- **Proteção:** o gabarito vai codificado no arquivo, o que impede a leitura num simples "exibir código-fonte", mas não é uma proteção real. Qualquer arquivo HTML entregue ao aluno pode ser copiado. Proteção de verdade exige uma área de membros com login.
