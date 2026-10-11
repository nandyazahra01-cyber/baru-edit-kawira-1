(() => {
  "use strict";
  // Sesuaikan URL ini dengan alamat backend KAWIRA.
  const API_BASE_URL = window.KAWIRA_API_BASE_URL || "http://localhost:4000/api";
  const TOKEN_KEY = "kawira_token", USER_KEY = "kawira_user";
  const ROLE_HOME = { mentor: "mentor-workspace.html", admin: "admin-dashboard.html" };
  const form = document.getElementById("login-form"), emailInput = document.getElementById("email"), passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember"), togglePassword = document.getElementById("toggle-password");
  const submitButton = document.getElementById("submit-button"), submitLabel = document.getElementById("submit-label");
  const statusMessage = document.getElementById("status-message"), emailError = document.getElementById("email-error"), passwordError = document.getElementById("password-error");
  const tabs = [...document.querySelectorAll(".role-tab")];
  let selectedRole = "mentor";
  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  function showStatus(message, type = "info") { statusMessage.textContent = message; statusMessage.className = `status-message ${type}`; statusMessage.hidden = false; }
  function clearStatus() { statusMessage.textContent = ""; statusMessage.hidden = true; statusMessage.className = "status-message"; }
  function clearErrors() { emailError.textContent = ""; passwordError.textContent = ""; emailInput.removeAttribute("aria-invalid"); passwordInput.removeAttribute("aria-invalid"); }
  function setRole(role) {
    if (!Object.hasOwn(ROLE_HOME, role)) return;
    selectedRole = role;
    tabs.forEach(tab => { const active = tab.dataset.role === role; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1; });
    submitLabel.textContent = role === "mentor" ? "Masuk ke Workspace Mentor" : "Masuk ke Portal Admin";
    clearStatus(); clearErrors();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setRole(tab.dataset.role));
    tab.addEventListener("keydown", event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      setRole(next.dataset.role); next.focus();
    });
  });
  togglePassword.addEventListener("click", () => {
    const show = passwordInput.type === "password"; passwordInput.type = show ? "text" : "password";
    togglePassword.textContent = show ? "Sembunyikan" : "Tampilkan";
    togglePassword.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    togglePassword.setAttribute("aria-pressed", String(show));
  });
  function validate() {
    clearErrors(); let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { emailError.textContent = "Masukkan alamat email yang valid."; emailInput.setAttribute("aria-invalid", "true"); valid = false; }
    if (!passwordInput.value) { passwordError.textContent = "Kata sandi wajib diisi."; passwordInput.setAttribute("aria-invalid", "true"); valid = false; }
    return valid;
  }
  function clearSavedAuth() { [localStorage, sessionStorage].forEach(store => { store.removeItem(TOKEN_KEY); store.removeItem(USER_KEY); }); }
  function saveAuth(token, user) {
    clearSavedAuth(); const store = rememberInput.checked ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, token); store.setItem(USER_KEY, JSON.stringify(user));
  }
  async function readJson(response) { return response.json().catch(() => ({})); }
  function redirectForRole(role) { if (ROLE_HOME[role]) window.location.replace(new URL(ROLE_HOME[role], window.location.href).href); }

  async function verifyExistingSession() {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      // Verifikasi token di server; jangan hanya percaya data role dari browser storage.
      const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) { clearSavedAuth(); return; }
      const body = await readJson(response), user = body.user;
      if (!user || !ROLE_HOME[user.role]) { clearSavedAuth(); return; }
      const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
      store.setItem(USER_KEY, JSON.stringify(user)); redirectForRole(user.role);
    } catch { showStatus("Server autentikasi belum dapat dihubungi. Coba lagi beberapa saat.", "error"); }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault(); clearStatus(); if (!validate()) return;
    submitButton.disabled = true; submitLabel.textContent = "Memverifikasi akses...";
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emailInput.value.trim(), password: passwordInput.value }) });
      const body = await readJson(response);
      if (!response.ok) {
        const message = response.status === 401 ? "Email atau password salah, atau akun belum aktif." : response.status === 429 ? "Terlalu banyak percobaan. Silakan tunggu sebelum mencoba lagi." : "Login belum berhasil. Periksa koneksi atau coba kembali.";
        showStatus(body.message || message, "error"); return;
      }
      const { token, user } = body;
      if (!token || !user || !ROLE_HOME[user.role]) { showStatus("Respons autentikasi server tidak valid.", "error"); return; }
      // Validasi role dilakukan sebelum menyimpan sesi di browser.
      if (user.role !== selectedRole) {
        showStatus(selectedRole === "mentor" ? "Akun Anda tidak memiliki hak akses sebagai Mentor." : "Akun Anda tidak memiliki hak akses sebagai Admin.", "error"); return;
      }
      saveAuth(token, user); showStatus("Akses berhasil, mengalihkan...", "success");
      window.setTimeout(() => redirectForRole(user.role), 500);
    } catch { showStatus("Tidak dapat terhubung ke server. Pastikan backend KAWIRA sedang berjalan.", "error"); }
    finally { submitButton.disabled = false; submitLabel.textContent = selectedRole === "mentor" ? "Masuk ke Workspace Mentor" : "Masuk ke Portal Admin"; }
  });
  emailInput.addEventListener("input", () => { emailError.textContent = ""; emailInput.removeAttribute("aria-invalid"); });
  passwordInput.addEventListener("input", () => { passwordError.textContent = ""; passwordInput.removeAttribute("aria-invalid"); });
  setRole("mentor"); verifyExistingSession();
})();
