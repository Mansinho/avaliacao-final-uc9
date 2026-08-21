# Relatório de Incidente — Falha na Conversão do Saldo Inicial da Conta

## 1. Resumo

Ao cadastrar uma conta deixando o campo **"Saldo inicial" vazio** (comportamento
normal, já que o campo é opcional), a aplicação lança uma exceção não
tratada. A requisição fica sem resposta até estourar o tempo limite do
cliente, e o incidente não fica registrado em nenhum lugar. Severidade:
**Alta** — funcionalidade core (cadastro de conta) fica indisponível
para o caso de uso mais comum (usuário não preenche saldo inicial).

## 2. Entrada utilizada para reprodução

**Via navegador**, o mais simples de reproduzir:

1. Abrir `http://localhost:3000`.
2. No formulário "Cadastrar conta", preencher apenas o campo **Nome**
   (ex: "Conta B") e deixar **"Saldo inicial" em branco**.
3. Clicar em "Cadastrar conta".

**O que acontece nos bastidores:** o frontend (`frontend/js/app.js`)
lê o campo com `document.getElementById("conta-saldo-inicial").value`,
que retorna uma string vazia (`""`) quando o campo não é preenchido.
Em seguida, o código faz `saldoInicial: saldoInicial || 0` — como
string vazia é um valor "falsy" em JavaScript, essa expressão resolve
para o **número** `0` (não a string `"0"`). O JSON enviado à API fica:

```json
{
  "nome": "Conta B",
  "saldoInicial": 0
}
```

Ou seja: exatamente o cenário em que um campo **opcional e comumente
deixado em branco** produz, sem o usuário perceber, um tipo de dado
(`number`) diferente do que o restante do sistema assume (`string`).

## 3. Resultado esperado

HTTP `201 Created`, com a conta criada e `saldoInicial: 0`.

## 4. Resultado obtido

A requisição não recebe resposta alguma — fica pendente até o cliente
(navegador ou curl) desistir por timeout. Nenhuma mensagem de erro é
exibida ao usuário no formulário (o `catch` do frontend nunca é
acionado, porque a Promise do `fetch` nunca chega a resolver ou
rejeitar dentro do tempo esperado).

## 5. Mensagem de erro / stack trace

Capturado no terminal onde o `npm start` está rodando:

```
backend/src/service/contaService.js:15
    const saldoNormalizado = saldoInicial.replace(",", ".");
                                          ^

TypeError: saldoInicial.replace is not a function
    at Object.cadastrarConta (backend/src/service/contaService.js:15:43)
    at cadastrar (backend/src/controller/contaController.js:7:30)
    at Layer.handle [as handle_request] (.../express/lib/router/layer.js:95:5)
    at next (.../express/lib/router/route.js:149:13)
    at Route.dispatch (.../express/lib/router/route.js:119:3)
    ...
```

## 6. Componente afetado

- **Arquivo principal:** `backend/src/service/contaService.js`, função
  `cadastrarConta`.
- **Agravante:** `backend/src/controller/contaController.js`, função
  `cadastrar` — registrada como uma função `async` "solta" (sem o
  wrapper `asyncHandler` usado no restante do projeto), então a
  exceção não chega ao `errorHandler` central.

## 7. Causa raiz

Duas causas combinadas:

1. **Conversão sem checagem de tipo.** `contaService.cadastrarConta`
   chama `saldoInicial.replace(",", ".")` diretamente, partindo da
   premissa de que `saldoInicial` sempre chega como `string`. Isso é
   verdade quando o usuário digita algo no campo — mas quando o campo
   fica vazio, o próprio frontend (`saldoInicial || 0`) já envia um
   `number`, que não possui o método `.replace`.
2. **Ausência de proteção na rota assíncrona.** Como `cadastrar` não
   está protegido por `asyncHandler` nem por um `try/catch` manual, o
   erro não é encaminhado ao middleware central de tratamento de erros
   via `next(err)`. A exceção se propaga como uma *unhandled promise
   rejection*, e a requisição nunca recebe resposta.

## 8. Análise técnica

Esse é um exemplo típico de bug que **passa despercebido em testes
manuais superficiais**: se o desenvolvedor sempre testa preenchendo
todos os campos do formulário, nunca aciona o caminho problemático.
O bug só aparece quando alguém usa o campo exatamente como ele foi
projetado para ser usado — como opcional, deixando-o em branco.

O problema fica mais sério porque o próprio "contrato" implícito entre
frontend e backend nunca foi documentado ou validado: o frontend decidiu,
silenciosamente, que "campo vazio" vira o número `0` (uma escolha razoável
de JavaScript, mas não óbvia), e o backend nunca verificou se essa
suposição era garantida.

A ausência de tratamento de erro na rota (falta do `asyncHandler`)
transforma o que poderia ser um `400 Bad Request` perfeitamente normal
em uma falha silenciosa: a requisição trava sem qualquer feedback para
quem está usando o sistema, e — até a introdução de uma rede de
segurança global (`process.on('unhandledRejection')`) — o incidente
também não deixava nenhum rastro em log.

## 9. Impacto

- Qualquer tentativa de cadastro de conta sem preencher explicitamente
  o saldo inicial falha silenciosamente.
- Sem uma rede de segurança no nível do processo, cada ocorrência
  também derruba o servidor Node por completo, afetando todos os
  usuários conectados naquele momento, não apenas quem disparou o erro.