// Cadastro dos produtos (configuração pública, sem segredos).
// Cada produto tem o próprio conteúdo, as próprias chaves e o próprio arquivo final.
export const PRODUTOS = {
  portugues: {
    id: 'portugues',
    prod: 'RFPT1',                       // não mude: muda a derivação das chaves já vendidas
    prefixo: 'RF',                       // chaves RF-XXXX-XXXX-XXXX
    storage: 'rf_pt_pmpe',
    conteudo: 'privado/conteudo/index.mjs',
    licencas: 'privado/licencas.csv',
    revogadas: 'privado/revogadas.txt',
    saida: 'produto/minissimulado-portugues-pmpe.html',
    titulo: 'Minissimulado de Português · PMPE · Raiz de Física',
    nojs: 'Minissimulado de Português · PMPE',
    gate: 'MINISSIMULADO<br>DE PORTUGUÊS',
    gateSub: 'PMPE 2026 · Acesso do aluno',
    marca: 'MINISSIMULADO · PORTUGUÊS',
    katex: false,
    banner: null,
    navExtra: [],
    vendas: 'vendas',                    // pasta da página de vendas
    pasta: 'portugues'                   // caminho no site: /portugues/ e /portugues/acesso/
  },
  rlm: {
    id: 'rlm',
    prod: 'RFRLM1',
    prefixo: 'RL',                       // chaves RL-XXXX-XXXX-XXXX
    storage: 'rf_rlm_pmpe',
    conteudo: 'privado/rlm/index.mjs',
    licencas: 'privado/licencas-rlm.csv',
    revogadas: 'privado/revogadas-rlm.txt',
    saida: 'produto/minissimulado-rlm-pmpe.html',
    titulo: 'Minissimulado de Raciocínio Lógico · PMPE · Raiz de Física',
    nojs: 'Minissimulado de Raciocínio Lógico · PMPE',
    gate: 'MINISSIMULADO<br>RACIOCÍNIO LÓGICO',
    gateSub: 'PMPE 2026 · Acesso do aluno',
    marca: 'MINISSIMULADO · RLM',
    katex: true,
    banner: 'src/marca/banner-matematica.jpg',
    navExtra: [['formulario', 'Formulário-relâmpago', 'fórmulas'], ['laboratorio', 'Laboratório de tabela-verdade', 'interativo']],
    vendas: 'vendas-rlm',
    pasta: 'rlm'
  },
  info: {
    id: 'info',
    prod: 'RFINF1',
    prefixo: 'RI',                       // chaves RI-XXXX-XXXX-XXXX
    storage: 'rf_info_pmpe',
    conteudo: 'privado/info/index.mjs',
    licencas: 'privado/licencas-info.csv',
    revogadas: 'privado/revogadas-info.txt',
    saida: 'produto/minissimulado-informatica-pmpe.html',
    titulo: 'Minissimulado de Informática · PMPE · Raiz de Física',
    nojs: 'Minissimulado de Informática · PMPE',
    gate: 'MINISSIMULADO<br>DE INFORMÁTICA',
    gateSub: 'PMPE 2026 · Acesso do aluno',
    marca: 'MINISSIMULADO · INFORMÁTICA',
    katex: true,
    banner: 'src/marca/banner-informatica.jpg',
    navExtra: [['guia', 'Guia-relâmpago', 'atalhos'], ['laboratorio', 'Laboratório de fórmulas', 'interativo']],
    vendas: 'vendas-info',
    pasta: 'informatica'
  }
};

export function produto(id) {
  const p = PRODUTOS[id];
  if (!p) throw new Error(`Produto desconhecido: "${id}". Use: ${Object.keys(PRODUTOS).join(', ')}`);
  return p;
}
