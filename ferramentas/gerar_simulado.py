#!/usr/bin/env python3
"""Gera um simulado em HTML (arquivo único, funciona offline) a partir do banco de questões.

Exemplos:
    python3 ferramentas/gerar_simulado.py --validar
    python3 ferramentas/gerar_simulado.py --por-disciplina 3 --semente 1 \
        --titulo "Simulado PMPE 01" --saida simulados/simulado-pmpe-01.html
    python3 ferramentas/gerar_simulado.py --disciplinas "Língua Portuguesa,Informática" \
        --quantidade 8 --tempo 20 --embaralhar --marca "Seu Nome"
"""

import argparse
import base64
import datetime
import html
import json
import pathlib
import random
import re
import sys
import unicodedata

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BANCO_PADRAO = RAIZ / "banco" / "questoes-pmpe.json"
MODELO_PADRAO = RAIZ / "modelo" / "simulado.html"
LETRAS = "ABCDE"
CAMPOS_OBRIGATORIOS = ("id", "disciplina", "assunto", "enunciado", "alternativas", "correta", "comentario")
MINUTOS_POR_QUESTAO = 3


def validar(banco):
    """Retorna a lista de problemas encontrados no banco (vazia se estiver tudo certo)."""
    erros = []
    disciplinas = banco.get("disciplinas", [])
    vistos = set()
    for n, q in enumerate(banco.get("questoes", []), start=1):
        ref = q.get("id") or f"questão nº {n}"
        for campo in CAMPOS_OBRIGATORIOS:
            if not q.get(campo):
                erros.append(f"{ref}: campo obrigatório \"{campo}\" ausente ou vazio")
        if q.get("id") in vistos:
            erros.append(f"{ref}: id repetido")
        vistos.add(q.get("id"))
        alternativas = q.get("alternativas") or []
        if len(alternativas) != 5:
            erros.append(f"{ref}: precisa ter 5 alternativas (tem {len(alternativas)})")
        elif len(set(a.strip().lower() for a in alternativas)) != 5:
            erros.append(f"{ref}: há alternativas repetidas")
        if q.get("correta") not in tuple(LETRAS):
            erros.append(f"{ref}: \"correta\" deve ser uma letra de A a E")
        if disciplinas and q.get("disciplina") not in disciplinas:
            erros.append(f"{ref}: disciplina \"{q.get('disciplina')}\" não está na lista \"disciplinas\" do banco")
    if not banco.get("questoes"):
        erros.append("o banco não tem nenhuma questão")
    return erros


def selecionar(banco, args, rng):
    ordem = banco.get("disciplinas") or sorted({q["disciplina"] for q in banco["questoes"]})
    if args.disciplinas:
        pedidas = [d.strip() for d in args.disciplinas.split(",") if d.strip()]
        desconhecidas = [d for d in pedidas if d not in ordem]
        if desconhecidas:
            sys.exit(f"Disciplina(s) não encontrada(s) no banco: {', '.join(desconhecidas)}\n"
                     f"Disponíveis: {', '.join(ordem)}")
        ordem = [d for d in ordem if d in pedidas]

    por_disc = {d: [q for q in banco["questoes"] if q["disciplina"] == d] for d in ordem}

    if args.por_disciplina:
        escolhidas = []
        for d in ordem:
            if len(por_disc[d]) < args.por_disciplina:
                sys.exit(f"\"{d}\" tem só {len(por_disc[d])} questão(ões) no banco; "
                         f"não dá para sortear {args.por_disciplina}.")
            escolhidas += rng.sample(por_disc[d], args.por_disciplina)
    elif args.quantidade:
        todas = [q for d in ordem for q in por_disc[d]]
        if len(todas) < args.quantidade:
            sys.exit(f"O banco tem só {len(todas)} questões para os filtros escolhidos.")
        escolhidas = rng.sample(todas, args.quantidade)
    else:
        escolhidas = [q for d in ordem for q in por_disc[d]]

    # Mantém as questões agrupadas por disciplina, como na prova real, e na ordem do banco.
    posicao = {q["id"]: i for i, q in enumerate(banco["questoes"])}
    return sorted(escolhidas, key=lambda q: (ordem.index(q["disciplina"]), posicao[q["id"]]))


def slug(texto):
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", texto.lower()).strip("-") or "simulado"


def main():
    p = argparse.ArgumentParser(description="Gera um simulado HTML a partir do banco de questões.")
    p.add_argument("--banco", type=pathlib.Path, default=BANCO_PADRAO, help="arquivo JSON do banco de questões")
    p.add_argument("--modelo", type=pathlib.Path, default=MODELO_PADRAO, help="modelo HTML do simulado")
    p.add_argument("--saida", type=pathlib.Path, help="arquivo HTML a gerar (padrão: simulados/<titulo>.html)")
    p.add_argument("--titulo", default="Simulado PMPE — Soldado")
    p.add_argument("--subtitulo", default="Questões inéditas com gabarito comentado")
    p.add_argument("--marca", default="", help="seu nome ou marca, exibido no topo e no rodapé")
    p.add_argument("--disciplinas", help="lista separada por vírgulas (padrão: todas)")
    grupo = p.add_mutually_exclusive_group()
    grupo.add_argument("--por-disciplina", type=int, help="sorteia N questões de cada disciplina")
    grupo.add_argument("--quantidade", type=int, help="sorteia N questões no total")
    p.add_argument("--tempo", type=int, help=f"duração em minutos (padrão: {MINUTOS_POR_QUESTAO} min por questão)")
    p.add_argument("--semente", type=int, help="número que fixa o sorteio (mesma semente = mesmo simulado)")
    p.add_argument("--embaralhar", action="store_true",
                   help="embaralha a ordem das questões (dentro de cada disciplina) e das alternativas a cada tentativa")
    p.add_argument("--validar", action="store_true", help="apenas confere o banco de questões e sai")
    args = p.parse_args()

    banco = json.loads(args.banco.read_text(encoding="utf-8"))
    erros = validar(banco)
    if erros:
        print(f"Encontrei {len(erros)} problema(s) em {args.banco}:", file=sys.stderr)
        for e in erros:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    if args.validar:
        contagem = {}
        for q in banco["questoes"]:
            contagem[q["disciplina"]] = contagem.get(q["disciplina"], 0) + 1
        print(f"Banco OK: {len(banco['questoes'])} questões.")
        for d, n in contagem.items():
            print(f"  {d}: {n}")
        a_conferir = [q["id"] for q in banco["questoes"] if q.get("conferir")]
        if a_conferir:
            print(f"Questões marcadas para conferir na lei: {', '.join(a_conferir)}")
        return

    questoes = selecionar(banco, args, random.Random(args.semente))
    tempo = args.tempo or len(questoes) * MINUTOS_POR_QUESTAO
    saida = args.saida or RAIZ / "simulados" / f"{slug(args.titulo)}.html"
    gerado_em = datetime.datetime.now().isoformat(timespec="seconds")

    campos_aluno = ("id", "disciplina", "assunto", "texto_base", "enunciado",
                    "alternativas", "correta", "comentario", "base_legal")
    dados = {
        "id": slug(saida.stem),
        "titulo": args.titulo,
        "subtitulo": args.subtitulo,
        "marca": args.marca,
        "tempoMin": tempo,
        "embaralharQuestoes": args.embaralhar,
        "embaralharAlternativas": args.embaralhar,
        "geradoEm": gerado_em,
        "questoes": [{k: q[k] for k in campos_aluno if q.get(k)} for q in questoes],
    }
    # Codificado em base64 para o gabarito não ficar legível num "exibir código-fonte" rápido.
    # Não é proteção de verdade: quem souber programar consegue decodificar.
    pacote = base64.b64encode(json.dumps(dados, ensure_ascii=False).encode("utf-8")).decode("ascii")

    modelo = args.modelo.read_text(encoding="utf-8")
    pagina = modelo.replace("__TITULO__", html.escape(args.titulo)).replace("__DADOS__", pacote)
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(pagina, encoding="utf-8")

    disciplinas = sorted({q["disciplina"] for q in questoes}, key=[q["disciplina"] for q in questoes].index)
    try:
        exibir = saida.resolve().relative_to(pathlib.Path.cwd())
    except ValueError:
        exibir = saida
    print(f"Simulado gerado: {exibir}")
    print(f"  {len(questoes)} questões · {len(disciplinas)} disciplinas · {tempo} min"
          f"{' · embaralhado a cada tentativa' if args.embaralhar else ''}")


if __name__ == "__main__":
    main()
