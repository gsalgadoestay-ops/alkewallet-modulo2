if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const TX_KEY = "transactions";

function loadTransactions() {
  const raw = localStorage.getItem(TX_KEY);
  return raw ? JSON.parse(raw) : [];
}

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL").format(value);
}

const txs = loadTransactions();
const list = document.getElementById("txList");
const emptyMsg = document.getElementById("emptyTx");

if (txs.length === 0) {
  emptyMsg.textContent = "No hay transacciones aún.";
} else {
  txs.forEach(tx => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <div class="fw-semibold">${tx.type}</div>
        <div class="small text-muted">${new Date(tx.date).toLocaleString()}</div>
        <div class="small">${tx.detail}</div>
      </div>
      <span class="fw-bold">$${formatCLP(tx.amount)}</span>
    `;

    list.appendChild(li);
  });
}
