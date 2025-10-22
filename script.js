document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".registrar-btn");
  botoes.forEach(btn => {
    btn.addEventListener("click", () => {
      const produto = btn.getAttribute("data-produto") || "Produto sem nome";
      const preco = btn.getAttribute("data-preco") || "IN$1";
      const quantidade = prompt("Digite a quantidade:");

      if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
        alert("Quantidade inválida.");
        return;
      }

      // id mais seguro
      const id = "P-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const dataHora = new Date().toLocaleString();

      const registro = { id, produto, preco, quantidade, dataHora };

      const registros = JSON.parse(localStorage.getItem("registros")) || [];
      registros.push(registro);
      localStorage.setItem("registros", JSON.stringify(registros));

      // se estiver na página da planilha, adiciona a linha nova na tabela já carregada
      const tabela = document.getElementById("tabela-registros");
      if (tabela) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${registro.id}</td>
          <td>${registro.produto}</td>
          <td>${registro.preco}</td>
          <td>${registro.quantidade}</td>
          <td>${registro.dataHora}</td>
          <td><button class="eliminar-btn" data-id="${registro.id}">Eliminar</button></td>
        `;
        tabela.appendChild(linha);
      }

      alert("Compra registrada com sucesso!");
    });
  });

  // Função reutilizável para (re)renderizar a tabela de registros
  function renderTable() {
    const tabela = document.getElementById("tabela-registros");
    if (!tabela) return;
    tabela.innerHTML = "";
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.forEach(r => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${r.id}</td>
        <td>${r.produto}</td>
        <td>${r.preco}</td>
        <td>${r.quantidade}</td>
        <td>${r.dataHora}</td>
        <td><button class="eliminar-btn" data-id="${r.id}">Eliminar</button></td>
      `;
      tabela.appendChild(linha);
    });

    // Delegação de evento para botões eliminar (garante listener após re-render)
    tabela.addEventListener('click', (e) => {
      const btn = e.target.closest('.eliminar-btn');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      if (!id) return;
      if (!confirm('Deseja eliminar este registro?')) return;

      // remove do localStorage
      const registrosAtuais = JSON.parse(localStorage.getItem('registros')) || [];
      const restantes = registrosAtuais.filter(r => r.id !== id);
      localStorage.setItem('registros', JSON.stringify(restantes));

      // remove a linha da tabela (ou re-render)
      renderTable();
    });
  }

  // Mostrar registros inicialmente na planilha (se estivermos nela)
  if (document.title === "Planilha" || document.body.classList.contains("planilha-page")) {
    renderTable();
  }

  // Atualiza automaticamente quando outro tab/janela altera 'registros'
  window.addEventListener('storage', (e) => {
    if (e.key === 'registros') {
      renderTable();
    }
  });
});
