// Protección: si no hay sesión, vuelve al login
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const balanceText = document.getElementById("balanceText");
const userText = document.getElementById("userText");
const logoutBtn = document.getElementById("logoutBtn");

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL").format(value);
}

const balance = Number(localStorage.getItem("balance")) || 0;
balanceText.textContent = `$${formatCLP(balance)}`;

const userEmail = localStorage.getItem("userEmail") || "user@alkewallet.com";
userText.textContent = userEmail;

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
});
