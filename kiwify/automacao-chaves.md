# Entrega das chaves de acesso

Cada chave tem o formato `RF-XXXX-XXXX-XXXX` (12 caracteres sem I, L, O e U, para não confundir na digitação) e um **número de licença**, que aparece na marca d’água do aluno. As chaves estão em `privado/licencas.csv`, que só você recebeu.

> A **licença 0000** é a chave do autor, para testes. Nunca a envie.

---

## Preparar a planilha de controle (para todas as opções)

1. No Google Planilhas: **Arquivo → Importar → Upload** → `licencas.csv` → *Tipo de separador: personalizado* `;`.
2. Renomeie a aba para `Licenças`. As colunas são:

| numero | chave | status | email_comprador | nome_comprador | data_envio | observacao |
|---|---|---|---|---|---|---|
| 0000 | RF-…  | AUTOR | | | | Chave do autor |
| 0001 | RF-…  | LIVRE | | | | |

3. Status possíveis: `LIVRE` (disponível), `ENVIADA` (entregue a um comprador), `TURMA` (publicada na área de membros), `REVOGADA` (bloqueada).
4. Compartilhe a planilha só com você. Quem tiver a planilha tem todas as chaves.

---

## Opção A · Entrega automática com o Make (recomendada)

O Make (make.com) tem plano gratuito com cenários de várias etapas. Tempo de configuração: cerca de 30 minutos.

### Cenário 1 · Compra aprovada → envia a chave

1. **Make → Create a new scenario → módulo “Webhooks → Custom webhook”** → *Add* → copie a URL gerada.
2. **Kiwify → Apps (ou Integrações) → Webhooks → Criar webhook**:
   - URL: a do Make;
   - Produto: Minissimulado de Português PMPE;
   - Evento: **Compra aprovada**.
3. No Make, clique em **Run once** e faça uma compra de teste (ou use o botão de teste da Kiwify, se houver). O Make aprende os campos que a Kiwify envia (nome, e-mail, id do pedido).
4. **Módulo “Google Sheets → Search Rows”**:
   - Planilha: a de controle · Aba: `Licenças`;
   - Filtro: `status` **igual a** `LIVRE`;
   - Ordenar por `numero`, crescente · **Limite: 1**.
5. **Módulo “Google Sheets → Update a Row”**:
   - Row number: o número da linha encontrada no passo 4;
   - `status` = `ENVIADA` · `email_comprador` = e-mail do comprador (do webhook) · `nome_comprador` = nome · `data_envio` = `{{now}}` · `observacao` = id do pedido.
6. **Módulo “Gmail → Send an email”** (ou “Email → Send an email” com SMTP):
   - Para: e-mail do comprador · Assunto e corpo: modelo abaixo, com a `chave` encontrada no passo 4.
7. **Filtro de segurança** entre o webhook e o passo 4: só continua se o status do pedido for pago/aprovado (o nome do campo aparece no passo 3).
8. Ative o cenário (**Scheduling: Immediately**). Faça uma compra real de teste e confira a planilha e o e-mail.

### Cenário 2 · Reembolso ou chargeback → marca a chave para revogar

1. Novo webhook no Make; na Kiwify, crie outro webhook com os eventos **Reembolso** e **Chargeback**.
2. **Google Sheets → Search Rows** com `email_comprador` igual ao e-mail do webhook.
3. **Update a Row**: `status` = `REVOGADA`.
4. Uma vez por semana, copie as chaves `REVOGADA` para `privado/revogadas.txt`, rode `node build.mjs` e `node montar-site.mjs` e reenvie a pasta ao Netlify. A partir daí, essas chaves deixam de abrir o simulado.

### Alternativa com Zapier

A Kiwify tem app oficial no Zapier. Monte: **Kiwify (novo pedido pago) → Google Sheets (Lookup Spreadsheet Row: status = LIVRE) → Google Sheets (Update Spreadsheet Row) → Gmail (Send Email)**. Atenção: Zaps com mais de duas etapas podem exigir plano pago do Zapier.

---

## Opção B · Entrega manual

1. Ative as notificações de venda no app da Kiwify.
2. A cada venda: abra a planilha, pegue a primeira chave `LIVRE`, preencha e-mail, nome e data e mude para `ENVIADA`.
3. Envie o e-mail com o modelo abaixo.
4. Na aula 2 da área de membros, informe o prazo (ex.: “em até 2 horas, das 8h às 22h”).

---

## Opção C · Chave de turma (para começar hoje)

1. Escolha uma chave `LIVRE`, mude o status para `TURMA` e escreva na observação o mês (ex.: `Turma 10/2026`).
2. Publique essa chave na **aula 2** da área de membros. Só quem comprou vê.
3. Todo mês (ou se a chave aparecer em algum grupo), troque: marque a antiga como `REVOGADA`, publique uma nova, rode `node build.mjs` e reenvie o site. Os alunos que já usavam a chave antiga entram de novo com a nova, que está na área de membros.
4. Limite: todos da turma compartilham o mesmo número de licença na marca d’água; o nome e o e-mail digitados ainda aparecem. Para rastreabilidade individual, migre para a opção A.

---

## Modelo de e-mail com a chave

**Assunto:** `Sua chave do Minissimulado de Português PMPE`

```
Olá, {nome}!

Sua compra foi aprovada. Esta é a sua chave pessoal de acesso:

    {chave}

Como entrar:
1. Abra https://raizdefisica-pmpe.netlify.app/acesso/ no Safari ou no Chrome.
2. Digite seu nome completo, este e-mail ({email}) e a chave acima.
3. Escolha o Modo Prova ou o Modo Treino e bons estudos!

A chave é pessoal e intransferível: seu nome, e-mail e número de licença
aparecem como marca d'água no material.

O link também está na sua área de membros da Kiwify, na aula "Acessar o simulado".

Dúvidas? Responda este e-mail.
Equipe Raiz de Física
```

---

## Perguntas frequentes da operação

- **Acabaram as chaves `LIVRE`?** Rode `node gerar-chaves.mjs 500`, depois `node build.mjs` e `node montar-site.mjs`, reenvie o site e importe as novas linhas na planilha. As chaves antigas continuam valendo.
- **Um aluno perdeu a chave?** Procure o e-mail dele na planilha e reenvie a mesma chave.
- **Uma chave apareceu em um grupo?** Marque como `REVOGADA`, adicione em `revogadas.txt`, rode o build e reenvie o site. Se for de um comprador identificado, use a resposta “Suspeita de compartilhamento” de `textos-prontos.md`.
