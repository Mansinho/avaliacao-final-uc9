const UI = {
  mostrarFeedback(elementoId, mensagem, tipo) {
    const el = document.getElementById(elementoId);
    el.textContent = mensagem;
    el.className = `feedback ${tipo}`;
  },

  limparFeedback(elementoId) {
    const el = document.getElementById(elementoId);
    el.textContent = "";
    el.className = "feedback";
  },

  preencherSelectContas(contas, selectId) {
    const select = document.getElementById(selectId);
    const valorAtual = select.value;
    select.innerHTML = "";

    if (contas.length === 0) {
      const option = document.createElement("option");
      option.textContent = "Nenhuma conta cadastrada";
      option.value = "";
      select.appendChild(option);
      return;
    }

    contas.forEach((conta) => {
      const option = document.createElement("option");
      option.value = conta.id;
      option.textContent = conta.nome;
      select.appendChild(option);
    });

    if ([...select.options].some((o) => o.value === valorAtual)) {
      select.value = valorAtual;
    }
  },

  renderizarLancamentos(lancamentos) {
    const tbody = document.querySelector("#tabela-lancamentos tbody");
    tbody.innerHTML = "";

    if (lancamentos.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="4" style="color:#94a3b8">Nenhum lançamento ainda.</td>`;
      tbody.appendChild(tr);
      return;
    }

    lancamentos
      .slice()
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .forEach((lancamento) => {
        const tr = document.createElement("tr");
        const classeValor = lancamento.tipo === "RECEITA" ? "valor-receita" : "valor-despesa";
        const sinal = lancamento.tipo === "RECEITA" ? "+" : "-";

        tr.innerHTML = `
          <td>${new Date(lancamento.data).toLocaleDateString("pt-BR")}</td>
          <td>${lancamento.descricao}</td>
          <td>${lancamento.tipo}</td>
          <td class="${classeValor}">${sinal} R$ ${lancamento.valor.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
  },

  renderizarSaldo(resultado) {
    const el = document.getElementById("saldo-display");
    el.textContent = `Saldo de "${resultado.nomeConta}": R$ ${resultado.saldoAtual.toFixed(2)}`;
  },
};
