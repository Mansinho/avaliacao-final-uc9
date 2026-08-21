const API_BASE_URL = "/api";

async function requisitar(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const mensagem = corpo?.erro || `Erro HTTP ${resposta.status}`;
    throw new Error(mensagem);
  }

  return corpo;
}

const Api = {
  cadastrarConta(dados) {
    return requisitar("/contas", { method: "POST", body: JSON.stringify(dados) });
  },
  listarContas() {
    return requisitar("/contas");
  },
  registrarLancamento(dados) {
    return requisitar("/lancamentos", { method: "POST", body: JSON.stringify(dados) });
  },
  listarLancamentos(contaId) {
    const query = contaId ? `?contaId=${encodeURIComponent(contaId)}` : "";
    return requisitar(`/lancamentos${query}`);
  },
  buscarSaldo(contaId) {
    return requisitar(`/lancamentos/saldo/${encodeURIComponent(contaId)}`);
  },
};
