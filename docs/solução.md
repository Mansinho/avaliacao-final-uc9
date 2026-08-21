# Solução — Falha na Conversão do Saldo Inicial da Conta

> Complementa `docs/incidente-cadastro-conta.md` (diagnóstico). Este
> documento registra a correção aplicada, por que ela resolve a causa
> raiz, e as evidências de validação.

## 1. Correção aplicada

### `backend/src/service/contaService.js`

Foi criada a função `converterSaldoInicial`, que **checa o tipo da
entrada antes de qualquer conversão**, em vez de assumir que
`saldoInicial` sempre chega como `string`:

- `undefined` / `null` / `""` → retorna `0` (saldo padrão, caso
  válido e esperado quando o campo fica em branco);
- `number` → usado diretamente, sem chamar `.replace`;
- `string` → normalizado (vírgula vira ponto) antes da conversão;
- qualquer outro tipo → rejeitado com `ErroValidacao` (HTTP 400),
  nunca com uma exceção não tratada.

Depois da conversão, o valor passa por `Number.isNaN` e
`Number.isFinite`, garantindo que só números válidos e finitos cheguem
a ser persistidos.

### `backend/src/controller/contaController.js`

A rota `cadastrar` voltou a usar o wrapper `asyncHandler`, garantindo
que qualquer erro lançado dentro dela seja encaminhado ao
`errorHandler` central via `next(err)` — em vez de virar uma
*unhandled promise rejection* que deixa a requisição sem resposta.

### `backend/server.js` (mantido da etapa anterior)

Os handlers `process.on('uncaughtException' | 'unhandledRejection')`
permanecem como rede de segurança de última instância, registrando em
log qualquer erro verdadeiramente inesperado que escape do
`errorHandler` — defesa em profundidade, não a correção principal.

## 2. Por que isso resolve a causa raiz

O incidente original tinha duas causas combinadas (ver
`incidente-cadastro-conta.md`, seção 7):

1. Conversão sem checagem de tipo → **resolvido** pela checagem
   explícita de `typeof` em `converterSaldoInicial`.
2. Rota assíncrona sem proteção → **resolvido** pela reintrodução do
   `asyncHandler`.

Como as duas causas foram corrigidas na origem, a rede de segurança do
`server.js` deixa de ser necessária para este caso específico — ela
continua no lugar apenas como proteção geral contra erros futuros e
imprevistos, não como remendo para este bug.

## 3. Evidências de validação

Testes executados manualmente via HTTP (curl), com o servidor rodando
continuamente entre as chamadas:

| # | Entrada | Resultado esperado | Resultado obtido |
|---|---|---|---|
| 1 | `saldoInicial: 0` (number) — **a entrada exata do incidente original** | `201`, saldo `0` | `201`, saldo `0`, resposta em `~0.03s` (antes: sem resposta / timeout de 6s) |
| 2 | Campo `saldoInicial` ausente (`undefined`) | `201`, saldo `0` | `201`, saldo `0` |
| 3 | `saldoInicial: "250,75"` (string com vírgula) | `201`, saldo `250.75` | `201`, saldo `250.75` |
| 4 | `saldoInicial: "abc"` (texto inválido) | `400`, mensagem clara | `400`, `"O saldo inicial \"abc\" não é um número válido."` |

Após os 4 testes:

- **Servidor permaneceu no ar** durante e após todos os cenários (`ps` confirmou o processo vivo).
- **`GET /api/contas`** lista as 3 contas válidas criadas corretamente.
- **`logs/incidentes.log`** registra apenas o teste 4 (entrada inválida), como `WARN`, com o corpo da requisição rejeitada — nenhuma entrada de nível `ERROR`, confirmando que nenhum erro inesperado ocorreu.

## 4. Checklist da Etapa 4 (requisitos do enunciado)

- [x] Impede encerramento inesperado / requisição sem resposta.
- [x] Valida entradas (tipo + valor numérico).
- [x] Apresenta mensagem adequada (`400` com `erro` e `campo`).
- [x] Registra o incidente em log (entradas inválidas como `WARN`;
      erros inesperados como `ERROR`, via rede de segurança do `server.js`).
- [x] Continua permitindo operações válidas (testes 1–3, incluindo a
      entrada exata do incidente original).