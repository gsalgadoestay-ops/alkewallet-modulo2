alert("JS cargado ✅");


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // credenciales simuladas
    const USER_EMAIL = "user@alkewallet.com";
    const USER_PASS = "1234";

    if (email === USER_EMAIL && password === USER_PASS) {
      errorMsg.textContent = "";
      // guardamos una "sesión" simple
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("balance", "50000");

      // redirigir al menú (lo creamos después)
      window.location.href = "menu.html";
    } else {
      errorMsg.textContent = "Credenciales incorrectas 😶‍🌫️";
    }
  });
});
