// Protección de ruta
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const BALANCE_KEY = "balance";
const TX_KEY = "transactions";
const CONTACTS_KEY = "contacts";

function formatCLP(value) {
  return new Intl.NumberFormat("es-CL").format(value);
}

function nowISO() {
  return new Date().toISOString();
}

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

function loadContacts() {
  const raw = localStorage.getItem(CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveContacts(contacts) {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

// --- UI refs (jQuery) ---
const $balanceText = $("#balanceText");
const $toEmail = $("#toEmail");
const $amount = $("#amount");
const $msg = $("#msg");

const $toggleAddContact = $("#toggleAddContact");
const $addContactBox = $("#addContactBox");
const $contactName = $("#contactName");
const $contactEmail = $("#contactEmail");
const $addContactBtn = $("#addContactBtn");
const $contactMsg = $("#contactMsg");

const $contactList = $("#contactList");
const $emptyContacts = $("#emptyContacts");

const $suggestions = $("#suggestions");

// --- Render saldo ---
function renderBalance() {
  $balanceText.text(`$${formatCLP(getBalance())}`);
}

// --- Render contactos ---
function renderContacts() {
  const contacts = loadContacts();
  $contactList.empty();

  if (contacts.length === 0) {
    $emptyContacts.text("Aún no tienes contactos. Agrega uno para autocompletar.");
    return;
  }

  $emptyContacts.text("");

  for (const c of contacts) {
    const item = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-semibold">${c.name}</div>
          <div class="text-muted small">${c.email}</div>
        </div>
        <button class="btn btn-outline-danger btn-sm">Eliminar</button>
      </li>
    `);

    // Click en el contacto: lo coloca en el input (jQuery UX)
    item.find("div").first().on("click", () => {
      $toEmail.val(c.email).focus();
    });

    // Eliminar contacto
    item.find("button").on("click", () => {
      const updated = loadContacts().filter(x => x.email !== c.email);
      saveContacts(updated);
      renderContacts();
    });

    $contactList.append(item);
  }
}

// --- Autocompletar (jQuery) ---
function showSuggestions(matches) {
  $suggestions.empty();

  if (matches.length === 0) {
    $suggestions.hide();
    return;
  }

  for (const c of matches) {
    const opt = $(`
      <button type="button" class="list-group-item list-group-item-action">
        <div class="fw-semibold">${c.name}</div>
        <div class="small text-muted">${c.email}</div>
      </button>
    `);

    opt.on("click", () => {
      $toEmail.val(c.email);
      $suggestions.hide();
      $amount.focus();
    });

    $suggestions.append(opt);
  }

  $suggestions.show();
}

// Filtrado en vivo
$toEmail.on("input", function () {
  const q = $(this).val().trim().toLowerCase();
  if (q.length < 2) {
    $suggestions.hide();
    return;
  }

  const contacts = loadContacts();
  const matches = contacts.filter(c =>
    c.email.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  ).slice(0, 6);

  showSuggestions(matches);
});

// Ocultar sugerencias si click fuera
$(document).on("click", function (e) {
  const clickedInside = $(e.target).closest("#toEmail, #suggestions").length > 0;
  if (!clickedInside) $suggestions.hide();
});

// --- Mostrar/ocultar formulario agregar contacto (jQuery effect) ---
$toggleAddContact.on("click", () => {
  $contactMsg.text("");
  $addContactBox.stop(true, true).slideToggle(180);
});

// --- Agregar contacto ---
$addContactBtn.on("click", () => {
  const name = $contactName.val().trim();
  const email = $contactEmail.val().trim().toLowerCase();

  if (!name || !email) {
    $contactMsg.removeClass("text-success").addClass("text-danger")
      .text("Completa nombre y correo 🙏");
    return;
  }

  // Validación simple correo
  if (!email.includes("@") || !email.includes(".")) {
    $contactMsg.removeClass("text-success").addClass("text-danger")
      .text("Ingresa un correo válido.");
    return;
  }

  const contacts = loadContacts();

  if (contacts.some(c => c.email === email)) {
    $contactMsg.removeClass("text-success").addClass("text-danger")
      .text("Ese correo ya está en tus contactos.");
    return;
  }

  contacts.unshift({ name, email });
  saveContacts(contacts);

  $contactMsg.removeClass("text-danger").addClass("text-success")
    .text("Contacto guardado ✅");

  $contactName.val("");
  $contactEmail.val("");
  renderContacts();
});

// --- Enviar dinero ---
$("#sendBtn").on("click", () => {
  const to = $toEmail.val().trim().toLowerCase();
  const amount = Number($amount.val());

  if (!to) {
    $msg.removeClass("text-success").addClass("text-danger")
      .text("Ingresa un destinatario.");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    $msg.removeClass("text-success").addClass("text-danger")
      .text("Ingresa un monto válido.");
    return;
  }

  const current = getBalance();
  if (amount > current) {
    $msg.removeClass("text-success").addClass("text-danger")
      .text("Saldo insuficiente 😭");
    return;
  }

  // Actualiza saldo
  setBalance(current - amount);
  renderBalance();

  // Guarda transacción
  const txs = loadTransactions();
  txs.unshift({
    type: "ENVÍO",
    amount: amount,
    date: nowISO(),
    detail: `Envío a ${to}`
  });
  saveTransactions(txs);

  $msg.removeClass("text-danger").addClass("text-success")
    .text("Transferencia realizada ✅");

  // Limpia inputs
  $toEmail.val("");
  $amount.val("");
  $suggestions.hide();
});
  
// Init
renderBalance();
renderContacts();
