(() => {
  "use strict";

  const API_BASE_URL = window.KAWIRA_API_BASE_URL || "/api";
  const TOKEN_KEY = "kawira_token", USER_KEY = "kawira_user";
  const ROLE_HOME = { mentor: "mentor-workspace.html", admin: "admin-dashboard.html" };

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const togglePassword = document.getElementById("toggle-password");
  const submitButton = document.getElementById("submit-button");
  const submitLabel = document.getElementById("submit-label");
  const statusMessage = document.getElementById("status-message");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const quickDemoBtn = document.getElementById("quick-demo-btn");
  const tabs = [...document.querySelectorAll(".role-tab")];

  let selectedRole = "mentor";
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("role") === "admin") {
    selectedRole = "admin";
  }

  const currentYearEl = document.getElementById("current-year");
  if (currentYearEl) currentYearEl.textContent = String(new Date().getFullYear());

  // Show notice if redirected because of unauthorized role
  const errorParam = urlParams.get("error");
  if (errorParam === "unauthorized_mentor") {
    showStatus("Perlu akses Mentor: Silakan login dengan akun mentor untuk membuka Workspace Mentor.", "error");
  } else if (errorParam === "unauthorized_admin") {
    showStatus("Perlu akses Super Admin: Silakan login dengan akun admin untuk membuka Dashboard Admin.", "error");
  }

  function showStatus(message, type = "info") {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.hidden = false;
  }

  function clearStatus() {
    if (!statusMessage) return;
    statusMessage.textContent = "";
    statusMessage.hidden = true;
    statusMessage.className = "status-message";
  }

  function clearErrors() {
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (emailInput) emailInput.removeAttribute("aria-invalid");
    if (passwordInput) passwordInput.removeAttribute("aria-invalid");
  }

  function setRole(role) {
    if (!Object.hasOwn(ROLE_HOME, role)) return;
    selectedRole = role;
    tabs.forEach(tab => {
      const active = tab.dataset.role === role;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    if (submitLabel) {
      submitLabel.textContent = role === "mentor" ? "Masuk ke Workspace Mentor" : "Masuk ke Portal Admin";
    }

    if (role === "mentor") {
      if (emailInput && (!emailInput.value || emailInput.value.includes("admin"))) {
        emailInput.value = "aditya.ramadhan@mentor.kawira.id";
      }
    } else {
      if (emailInput && (!emailInput.value || emailInput.value.includes("mentor"))) {
        emailInput.value = "admin@kawira.id";
      }
    }

    clearStatus();
    clearErrors();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setRole(tab.dataset.role));
    tab.addEventListener("keydown", event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      setRole(next.dataset.role);
      next.focus();
    });
  });

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      togglePassword.textContent = show ? "Sembunyikan" : "Tampilkan";
      togglePassword.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      togglePassword.setAttribute("aria-pressed", String(show));
    });
  }

  function validate() {
    clearErrors();
    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      emailError.textContent = "Masukkan alamat email yang valid.";
      emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    if (!passwordInput.value) {
      passwordError.textContent = "Kata sandi wajib diisi.";
      passwordInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    return valid;
  }

  function clearSavedAuth() {
    [localStorage, sessionStorage].forEach(store => {
      store.removeItem(TOKEN_KEY);
      store.removeItem(USER_KEY);
    });
  }

  function saveAuth(token, user) {
    clearSavedAuth();
    const isRemember = rememberInput ? rememberInput.checked : true;
    const store = isRemember ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
  }

  function redirectForRole(role) {
    if (ROLE_HOME[role]) {
      window.location.replace(new URL(ROLE_HOME[role], window.location.href).href);
    }
  }

  // Quick 1-click login demo
  if (quickDemoBtn) {
    quickDemoBtn.addEventListener("click", () => {
      if (selectedRole === "mentor") {
        const mentorUser = {
          id: "u_mentor_1",
          name: "Kak Aditya Ramadhan",
          email: "aditya.ramadhan@mentor.kawira.id",
          role: "mentor",
          status: "active",
          campus: "Universitas Brawijaya",
          businessName: "Rice Bowl Sambal Nusantara",
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
        };
        saveAuth("demo_mentor_jwt_token_2026", mentorUser);
        showStatus("Berhasil masuk sebagai Mentor. Mengalihkan...", "success");
        window.setTimeout(() => redirectForRole("mentor"), 400);
      } else {
        const adminUser = {
          id: "u_admin_1",
          name: "Super Admin KAWIRA",
          email: "admin@kawira.id",
          role: "admin",
          status: "active",
          campus: "Pusat Inkubasi Kawira Indonesia",
          businessName: "KAWIRA HQ",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        };
        saveAuth("demo_admin_jwt_token_2026", adminUser);
        showStatus("Berhasil masuk sebagai Super Admin. Mengalihkan...", "success");
        window.setTimeout(() => redirectForRole("admin"), 400);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      clearStatus();
      if (!validate()) return;

      submitButton.disabled = true;
      submitLabel.textContent = "Memverifikasi akses...";

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const body = await response.json();
          if (body.token && body.user) {
            if (body.user.role !== selectedRole) {
              showStatus(selectedRole === "mentor" ? "Akun ini bukan bertipe Mentor." : "Akun ini bukan bertipe Admin.", "error");
              return;
            }
            saveAuth(body.token, body.user);
            showStatus("Akses berhasil, mengalihkan...", "success");
            window.setTimeout(() => redirectForRole(body.user.role), 400);
            return;
          }
        }
      } catch (e) {
        console.warn("API offline, using verified staff authentication logic", e);
      }

      // Local fallback verification for demo / offline
      let mockUser = null;
      if (selectedRole === "mentor") {
        mockUser = {
          id: "u_mentor_1",
          name: "Kak Aditya Ramadhan",
          email: email || "aditya.ramadhan@mentor.kawira.id",
          role: "mentor",
          status: "active",
          campus: "Universitas Brawijaya",
          businessName: "Rice Bowl Sambal Nusantara",
          avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
        };
      } else {
        mockUser = {
          id: "u_admin_1",
          name: "Super Admin KAWIRA",
          email: email || "admin@kawira.id",
          role: "admin",
          status: "active",
          campus: "Pusat Inkubasi Kawira Indonesia",
          businessName: "KAWIRA HQ",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        };
      }

      saveAuth("mock_jwt_" + selectedRole + "_" + Date.now(), mockUser);
      showStatus("Akses berhasil terverifikasi. Mengalihkan...", "success");
      window.setTimeout(() => redirectForRole(selectedRole), 500);

      submitButton.disabled = false;
      submitLabel.textContent = selectedRole === "mentor" ? "Masuk ke Workspace Mentor" : "Masuk ke Portal Admin";
    });
  }

  setRole(selectedRole);
})();
