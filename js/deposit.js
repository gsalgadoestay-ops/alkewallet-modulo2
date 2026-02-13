if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const BALANCE_KEY = "balance";
const TX_KEY = "transactions";

function getBalance() {
  return Number(localStorage.getItem(BALANCE_KEY)) || 0;
}

function setBalance(value) {
  localStorage.setItem(BALANCE_KEY, String(value));
}

function loadTransactions() {
  const raw = localStorage.getItem(TX_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTransactions(txs) {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
}

document.getElementById("depositBtn").addEventListener("click", function () {
  const amount = Number(document.getElementById("depositAmount").value);
  const msg = document.getElementById("depositMsg");

  if (!Number.isFinite(amount) || amount <= 0) {
    msg.className = "mt-3 fw-semibold text-danger";
    msg.textContent = "Ingresa un monto válido.";
    return;
  }

  const newBalance = getBalance() + amount;
  setBalance(newBalance);

  const txs = loadTransactions();
  txs.unshift({
    type: "DEPÓSITO",
    amount: amount,
    date: new Date().toISOString(),
    detail: "Depósito realizado"
  });

  saveTransactions(txs);

  msg.className = "mt-3 fw-semibold text-success";
  msg.textContent = "Depósito exitoso ✅";

  document.getElementById("depositAmount").value = "";
});
