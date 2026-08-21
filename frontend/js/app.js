const formConta = document.getElementById("form-conta");
const formLancamento = document.getElementById("form-lancamento");
const selectContaLancamento = document.getElementById("lancamento-conta");

async function atualizarContas() {
  const { contas } = await Api.listarContas();
  UI.preencherSelectContas(contas, "lancamento-conta");
  return contas;
}

async function atualizarLancamentosEsaldo() {
  const contaId = selectContaLancamento.value;
  if (!contaId) {
    UI.renderizarLancamentos([]);
    return;
  }

  const { lancamentos } = await Api.listarLancamentos(contaId);
  UI.renderizarLancamentos(lancamentos);

  const saldo = await Api.buscarSaldo(contaId);
  UI.renderizarSaldo(saldo);
}

formConta.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  UI.limparFeedback("conta-feedback");

  const nome = document.getElementById("conta-nome").value;
  const saldoInicial = document.getElementById("conta-saldo-inicial").value;

  try {
    await Api.cadastrarConta({ nome, saldoInicial: saldoInicial || 0 });
    UI.mostrarFeedback("conta-feedback", "Conta cadastrada com sucesso!", "sucesso");
    formConta.reset();
    await atualizarContas();
  } catch (erro) {
    UI.mostrarFeedback("conta-feedback", erro.message, "erro");
  }
});

formLancamento.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  UI.limparFeedback("lancamento-feedback");

  const dados = {
    contaId: document.getElementById("lancamento-conta").value,
    descricao: document.getElementById("lancamento-descricao").value,
    valor: document.getElementById("lancamento-valor").value,
    tipo: document.getElementById("lancamento-tipo").value,
    data: document.getElementById("lancamento-data").value,
  };

  try {
    await Api.registrarLancamento(dados);
    UI.mostrarFeedback("lancamento-feedback", "Lançamento registrado com sucesso!", "sucesso");
    formLancamento.reset();
    await atualizarLancamentosEsaldo();
  } catch (erro) {
    UI.mostrarFeedback("lancamento-feedback", erro.message, "erro");
  }
});

selectContaLancamento.addEventListener("change", atualizarLancamentosEsaldo);

(async function inicializar() {
  await atualizarContas();
  await atualizarLancamentosEsaldo();
})();
