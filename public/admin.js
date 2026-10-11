(() => {
  "use strict";

  // 1. ROLE GUARD: Only super admin can access this portal
  const TOKEN_KEY = "kawira_token";
  const USER_KEY = "kawira_user";

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  const currentUser = getStoredUser();

  if (!currentUser || currentUser.role !== "admin") {
    // Redirect to login staff with unauthorized error
    window.location.replace("./login-staff.html?role=admin&error=unauthorized_admin");
    return;
  }

  // 2. STATE
  let users = [];
  let activities = [];
  let dbOverview = {
    bookkeepingRecords: [],
    chatConversations: [],
    mentorAvailability: [],
    kpis: {}
  };

  let activeRoleFilter = "all";
  let activeStatusFilter = "all";
  let activeAuditRole = "all";
  let activeAuditAction = "all";
  let activeDbTab = "bookkeeping";

  // UI ELEMENTS
  const userTableBody = document.getElementById("user-table-body");
  const auditTableBody = document.getElementById("audit-table-body");
  const userSearchInput = document.getElementById("user-search-input");
  const userStatusFilter = document.getElementById("user-status-filter");
  const auditSearchInput = document.getElementById("audit-search-input");
  const auditRoleFilter = document.getElementById("audit-role-filter");
  const auditActionFilter = document.getElementById("audit-action-filter");
  const toastContainer = document.getElementById("toast-container");

  // Admin Profile info in sidebar
  const sidebarAvatar = document.getElementById("sidebar-admin-avatar");
  const sidebarName = document.getElementById("sidebar-admin-name");
  if (sidebarName && currentUser.name) sidebarName.textContent = currentUser.name;
  if (sidebarAvatar && currentUser.avatarUrl) sidebarAvatar.src = currentUser.avatarUrl;

  // Logout
  const btnLogout = document.getElementById("btn-admin-logout");
  btnLogout?.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.location.replace("./login-staff.html");
  });

  // Toast Helper
  function showToast(message, type = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === "success" ? "✓" : "!"}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }

  function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 3. API FETCH FUNCTIONS
  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Users fetch error");
      const data = await res.json();
      users = data.users || [];
      updateUserStats(data.stats);
    } catch (err) {
      console.warn("Fallback to offline users data", err);
      // Fallback seed
      users = [
        {
          id: "u_mentor_1",
          name: "Kak Aditya Ramadhan",
          email: "aditya.ramadhan@mentor.kawira.id",
          role: "mentor",
          status: "active",
          businessName: "Rice Bowl Sambal Nusantara",
          campus: "Universitas Brawijaya (P2MW Alumni)",
          joinedAt: "2025-08-10"
        },
        {
          id: "u_mentor_2",
          name: "Kak Sari Indah Pertiwi",
          email: "sari.pertiwi@mentor.kawira.id",
          role: "mentor",
          status: "active",
          businessName: "Batik Ecoprint Modern",
          campus: "Universitas Gadjah Mada (PKM-K Alumni)",
          joinedAt: "2025-09-01"
        },
        {
          id: "u_mentor_3",
          name: "Kak Budi Santoso",
          email: "budi.santoso@mentor.kawira.id",
          role: "mentor",
          status: "active",
          businessName: "AgroTech Sensor IoT",
          campus: "Institut Teknologi Bandung",
          joinedAt: "2025-09-15"
        },
        {
          id: "u_mentor_4",
          name: "Kak Amanda Putri",
          email: "amanda.putri@mentor.kawira.id",
          role: "mentor",
          status: "active",
          businessName: "Studio Desain Visual Kreatif",
          campus: "Institut Seni Indonesia Yogyakarta",
          joinedAt: "2025-10-01"
        },
        {
          id: "u_mentee_1",
          name: "Farhan Pratama",
          email: "farhan.pratama@student.ub.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Kopi Susu Kampus Seduh",
          campus: "Universitas Brawijaya",
          joinedAt: "2026-01-12"
        },
        {
          id: "u_mentee_2",
          name: "Nadia Aulia Putri",
          email: "nadia.aulia@student.ui.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Hijab Voal Printing Alana",
          campus: "Universitas Indonesia",
          joinedAt: "2026-01-20"
        },
        {
          id: "u_mentee_3",
          name: "Kevin Wijaya",
          email: "kevin.wijaya@student.itb.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Snack Jamur Crispy Gurih",
          campus: "Institut Teknologi Bandung",
          joinedAt: "2026-02-01"
        },
        {
          id: "u_mentee_4",
          name: "Rina Salsabila",
          email: "rina.salsabila@student.ugm.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Lilac Scented Candle",
          campus: "Universitas Gadjah Mada",
          joinedAt: "2026-02-14"
        },
        {
          id: "u_mentee_5",
          name: "Dimas Anggara",
          email: "dimas.ang@student.undip.ac.id",
          role: "mentee",
          status: "active",
          businessName: "EcoStraw Sedotan Bambu Lokal",
          campus: "Universitas Diponegoro",
          joinedAt: "2026-02-18"
        },
        {
          id: "u_mentee_6",
          name: "Clarissa Devi",
          email: "clarissa.d@student.unair.ac.id",
          role: "mentee",
          status: "active",
          businessName: "GlowSkin Organic Serum",
          campus: "Universitas Airlangga",
          joinedAt: "2026-02-25"
        },
        {
          id: "u_mentee_7",
          name: "Rizky Maulana",
          email: "rizky.m@student.uns.ac.id",
          role: "mentee",
          status: "suspended",
          businessName: "PrintCepat Digital Kampus",
          campus: "Universitas Sebelas Maret",
          joinedAt: "2026-01-05"
        },
        {
          id: "u_admin_1",
          name: "Super Admin KAWIRA",
          email: "admin@kawira.id",
          role: "admin",
          status: "active",
          campus: "Pusat Inkubasi Kawira Indonesia",
          joinedAt: "2025-06-01"
        },
        {
          id: "u_admin_2",
          name: "Tim Validasi Mutu Inkubasi",
          email: "mutu@kawira.id",
          role: "admin",
          status: "active",
          campus: "Direktorat Pembelajaran Kemendikbud",
          joinedAt: "2025-07-15"
        }
      ];
      updateUserStats();
    }
    renderUsersTable();
  }

  function updateUserStats(stats) {
    const menteesCount = stats ? stats.totalMentees : users.filter((u) => u.role === "mentee").length;
    const mentorsCount = stats ? stats.totalMentors : users.filter((u) => u.role === "mentor").length;

    const elMentees = document.getElementById("stat-total-mentees");
    const elMentors = document.getElementById("stat-total-mentors");
    const badgeUsers = document.getElementById("badge-total-users");

    if (elMentees) elMentees.textContent = String(menteesCount);
    if (elMentors) elMentors.textContent = String(mentorsCount);
    if (badgeUsers) badgeUsers.textContent = String(users.length);
  }

  async function fetchActivities() {
    try {
      const res = await fetch("/api/admin/activities");
      if (!res.ok) throw new Error("Activities fetch error");
      const data = await res.json();
      activities = data.activities || [];
    } catch (err) {
      console.warn("Fallback to offline activities data", err);
      activities = [
        {
          id: "act_101",
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          userId: "u_mentor_1",
          userName: "Kak Aditya Ramadhan",
          role: "mentor",
          action: "chat.message_sent",
          description: "Mengirimkan saran optimasi HPP ke Farhan Pratama",
          ipAddress: "180.252.164.88",
          userAgent: "Chrome 122.0 (Windows NT 10.0)",
          status: "success"
        },
        {
          id: "act_102",
          timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
          userId: "u_mentee_1",
          userName: "Farhan Pratama",
          role: "mentee",
          action: "bookkeeping.record_created",
          description: "Mencatat pemasukan kas penjualan 65 cup kopi (Rp 1.170.000)",
          ipAddress: "114.125.42.19",
          userAgent: "Safari 17.3 (macOS)",
          status: "success"
        },
        {
          id: "act_103",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          userId: "u_mentee_2",
          userName: "Nadia Aulia Putri",
          role: "mentee",
          action: "auth.login",
          description: "Login berhasil via SSO Kampus Universitas Indonesia",
          ipAddress: "103.213.129.5",
          userAgent: "Chrome Mobile (Android 14)",
          status: "success"
        },
        {
          id: "act_104",
          timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
          userId: "u_mentor_2",
          userName: "Kak Sari Indah Pertiwi",
          role: "mentor",
          action: "mentoring.feedback_submitted",
          description: "Memberikan catatan review packaging brand Clarissa Devi",
          ipAddress: "182.253.110.42",
          userAgent: "Edge 122.0 (Windows NT 11.0)",
          status: "success"
        },
        {
          id: "act_105",
          timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
          userId: "u_mentee_3",
          userName: "Kevin Wijaya",
          role: "mentee",
          action: "calculator.bep_calculated",
          description: "Melakukan kalkulasi Titik Impas (BEP) target 450 bungkus",
          ipAddress: "125.166.8.91",
          userAgent: "Firefox 123.0 (Linux x86_64)",
          status: "success"
        },
        {
          id: "act_106",
          timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
          userId: "u_admin_1",
          userName: "Super Admin KAWIRA",
          role: "admin",
          action: "admin.user_status_changed",
          description: "Memperbarui status verifikasi mentor Kak Amanda Putri menjadi aktif",
          ipAddress: "36.85.12.104",
          userAgent: "Chrome 122.0 (macOS 14.3)",
          status: "success"
        },
        {
          id: "act_107",
          timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
          userId: "u_mentee_7",
          userName: "Rizky Maulana",
          role: "mentee",
          action: "auth.failed_attempt",
          description: "Peringatan autentikasi: Upaya login akun ditangguhkan sementara",
          ipAddress: "202.67.40.11",
          userAgent: "Chrome 120.0 (Windows NT 10.0)",
          status: "warning"
        }
      ];
    }
    renderAuditTable();
  }

  async function fetchDatabaseOverview() {
    try {
      const res = await fetch("/api/database/overview");
      if (!res.ok) throw new Error("Overview fetch error");
      const data = await res.json();
      dbOverview = data;
      if (data.kpis) {
        if (data.kpis.totalChatMessages) {
          document.getElementById("stat-total-chats").textContent = String(data.kpis.totalChatMessages);
        }
        if (data.kpis.totalMentoringSessions) {
          document.getElementById("stat-total-sessions").textContent = String(data.kpis.totalMentoringSessions);
        }
        if (data.kpis.totalBookkeepingRecords) {
          document.getElementById("stat-total-bookkeeping").textContent = String(data.kpis.totalBookkeepingRecords);
        }
        if (data.kpis.totalCashflowVolume) {
          document.getElementById("stat-cashflow-total").textContent = formatRupiah(data.kpis.totalCashflowVolume);
        }
      }
    } catch (err) {
      console.warn("Fallback to offline database overview", err);
      // Fallback
      dbOverview = {
        bookkeepingRecords: [
          {
            id: "bk_1",
            menteeId: "u_mentee_1",
            menteeName: "Farhan Pratama",
            businessName: "Kopi Susu Kampus Seduh",
            type: "income",
            category: "Penjualan Langsung",
            amount: 1170000,
            description: "Penjualan 65 cup kopi susu aren bazar fakultas teknik",
            transactionDate: "2026-10-10"
          },
          {
            id: "bk_2",
            menteeId: "u_mentee_1",
            menteeName: "Farhan Pratama",
            businessName: "Kopi Susu Kampus Seduh",
            type: "expense",
            category: "Bahan Baku",
            amount: 420000,
            description: "Beli biji kopi arabika 2kg dan susu fresh milk 12 liter",
            transactionDate: "2026-10-09"
          },
          {
            id: "bk_3",
            menteeId: "u_mentee_2",
            menteeName: "Nadia Aulia Putri",
            businessName: "Hijab Voal Printing Alana",
            type: "income",
            category: "Pre-Order Reseller",
            amount: 2450000,
            description: "Pembayaran DP batch 1 hijab motif botanical kampus",
            transactionDate: "2026-10-10"
          },
          {
            id: "bk_4",
            menteeId: "u_mentee_2",
            menteeName: "Nadia Aulia Putri",
            businessName: "Hijab Voal Printing Alana",
            type: "expense",
            category: "Produksi & Cetak",
            amount: 1100000,
            description: "Ongkos cetak sublimasi 50 meter kain ultrafine voal",
            transactionDate: "2026-10-08"
          },
          {
            id: "bk_5",
            menteeId: "u_mentee_3",
            menteeName: "Kevin Wijaya",
            businessName: "Snack Jamur Crispy Gurih",
            type: "income",
            category: "Konsinyasi Kantin",
            amount: 780000,
            description: "Setoran penjualan minggu ke-1 kantin asrama mahasiswa ITB",
            transactionDate: "2026-10-09"
          },
          {
            id: "bk_6",
            menteeId: "u_mentee_3",
            menteeName: "Kevin Wijaya",
            businessName: "Snack Jamur Crispy Gurih",
            type: "expense",
            category: "Kemasan & Label",
            amount: 290000,
            description: "Cetak stiker vinyl hologram & 200 pcs standing pouch matte",
            transactionDate: "2026-10-07"
          },
          {
            id: "bk_7",
            menteeId: "u_mentee_6",
            menteeName: "Clarissa Devi",
            businessName: "GlowSkin Organic Serum",
            type: "income",
            category: "Penjualan Online Marketplace",
            amount: 3850000,
            description: "Pencairan saldo toko Shopee penjualan 35 botol serum",
            transactionDate: "2026-10-10"
          },
          {
            id: "bk_8",
            menteeId: "u_mentee_4",
            menteeName: "Rina Salsabila",
            businessName: "Lilac Scented Candle",
            type: "expense",
            category: "Bahan Baku Aromaterapi",
            amount: 540000,
            description: "Beli soy wax flakes 5kg dan 3 botol fragrance oil lavender",
            transactionDate: "2026-10-06"
          }
        ],
        chatConversations: [
          {
            id: "conv_1",
            menteeId: "u_mentee_1",
            menteeName: "Farhan Pratama",
            businessName: "Kopi Susu Kampus Seduh",
            mentorId: "u_mentor_1",
            mentorName: "Kak Aditya Ramadhan",
            status: "active",
            messageCount: 32,
            lastMessage: "Siap Kak, saya sudah revisi tabel HPP cup sesuai saran!",
            lastActive: "2 menit lalu"
          },
          {
            id: "conv_2",
            menteeId: "u_mentee_2",
            menteeName: "Nadia Aulia Putri",
            businessName: "Hijab Voal Printing Alana",
            mentorId: "u_mentor_1",
            mentorName: "Kak Aditya Ramadhan",
            status: "active",
            messageCount: 18,
            lastMessage: "Untuk biaya overhead listrik konveksi cara baginya bagaimana kak?",
            lastActive: "25 menit lalu"
          },
          {
            id: "conv_3",
            menteeId: "u_mentee_3",
            menteeName: "Kevin Wijaya",
            businessName: "Snack Jamur Crispy Gurih",
            mentorId: "u_mentor_1",
            mentorName: "Kak Aditya Ramadhan",
            status: "completed",
            messageCount: 41,
            lastMessage: "Catatan feedback sesi validasi kemasan telah tersimpan.",
            lastActive: "Kemarin, 16:30"
          },
          {
            id: "conv_4",
            menteeId: "u_mentee_6",
            menteeName: "Clarissa Devi",
            businessName: "GlowSkin Organic Serum",
            mentorId: "u_mentor_2",
            mentorName: "Kak Sari Indah Pertiwi",
            status: "active",
            messageCount: 26,
            lastMessage: "Foto mockup instagram feed-nya sudah sesuai tone brand ya kak.",
            lastActive: "1 jam lalu"
          },
          {
            id: "conv_5",
            menteeId: "u_mentee_5",
            menteeName: "Dimas Anggara",
            businessName: "EcoStraw Sedotan Bambu",
            mentorId: "u_mentor_2",
            mentorName: "Kak Sari Indah Pertiwi",
            status: "active",
            messageCount: 12,
            lastMessage: "Mau tanya strategi outreach ke cafe-cafe sekitar Semarang.",
            lastActive: "3 jam lalu"
          }
        ],
        mentorAvailability: [
          {
            id: "u_mentor_1",
            name: "Kak Aditya Ramadhan",
            email: "aditya.ramadhan@mentor.kawira.id",
            avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
            expertise: ["F&B Scale-up", "Penetapan HPP", "SOP Dapur & Operasional"],
            status: "available",
            rating: 4.9,
            activeMentees: 4,
            officeHours: "09:00 - 17:00 WIB"
          },
          {
            id: "u_mentor_2",
            name: "Kak Sari Indah Pertiwi",
            email: "sari.pertiwi@mentor.kawira.id",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            expertise: ["Digital Marketing", "Branding & Kemasan", "Katalog Produk"],
            status: "in_session",
            rating: 4.8,
            activeMentees: 3,
            officeHours: "13:00 - 18:00 WIB"
          },
          {
            id: "u_mentor_3",
            name: "Kak Budi Santoso",
            email: "budi.santoso@mentor.kawira.id",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
            expertise: ["Tech Hardware", "Validasi Pasar", "Pitch Deck Investor"],
            status: "available",
            rating: 4.9,
            activeMentees: 2,
            officeHours: "19:00 - 21:00 WIB"
          },
          {
            id: "u_mentor_4",
            name: "Kak Amanda Putri",
            email: "amanda.putri@mentor.kawira.id",
            avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
            expertise: ["Content Creation", "Social Media Selling", "Kreativitas Visual"],
            status: "offline",
            rating: 4.7,
            activeMentees: 2,
            officeHours: "10:00 - 15:00 WIB"
          }
        ]
      };
    }
    renderDatabaseOverview();
  }

  // 4. RENDER USERS TABLE
  function renderUsersTable() {
    if (!userTableBody) return;
    const q = (userSearchInput?.value || "").toLowerCase().trim();

    let filtered = [...users];

    if (activeRoleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === activeRoleFilter);
    }
    if (activeStatusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === activeStatusFilter);
    }
    if (q) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.businessName && u.businessName.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      userTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">Tidak ada pengguna yang cocok dengan kriteria filter.</td></tr>`;
      return;
    }

    userTableBody.innerHTML = filtered
      .map((u) => {
        const roleBadge =
          u.role === "admin"
            ? `<span class="badge badge-admin">Super Admin</span>`
            : u.role === "mentor"
            ? `<span class="badge badge-mentor">Mentor</span>`
            : `<span class="badge badge-mentee">Mentee</span>`;

        const isSuspended = u.status === "suspended";
        const statusBadge = isSuspended
          ? `<span class="badge badge-suspended">Ditangguhkan</span>`
          : `<span class="badge badge-active"><span class="dot online"></span> Aktif</span>`;

        const initials = (u.name || "U")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                ${
                  u.avatarUrl
                    ? `<img src="${u.avatarUrl}" style="width: 34px; height: 34px; border-radius: 9px; object-fit: cover;" alt="${u.name}">`
                    : `<div style="width: 34px; height: 34px; border-radius: 9px; background: #E2E8F0; color: var(--navy); display: grid; place-items: center; font-weight: 800; font-size: 11px;">${initials}</div>`
                }
                <div>
                  <div style="font-weight: 700; color: var(--navy);">${escapeHtml(u.name)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(u.email)}</div>
                </div>
              </div>
            </td>
            <td>${roleBadge}</td>
            <td>${statusBadge}</td>
            <td>
              <div style="font-weight: 600; color: var(--navy);">${escapeHtml(u.businessName || "-")}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(u.campus || "Indonesia")}</div>
            </td>
            <td style="color: var(--text-muted); font-size: 11px;">${u.joinedAt || "2026-01-01"}</td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm btn-edit-user" data-user-id="${u.id}">
                  Edit Role
                </button>
                <button class="btn btn-sm ${isSuspended ? "btn-success-outline" : "btn-danger-outline"} btn-toggle-status" data-user-id="${u.id}" data-current-status="${u.status}">
                  ${isSuspended ? "Aktifkan" : "Suspend"}
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    // Attach Event Listeners
    userTableBody.querySelectorAll(".btn-toggle-status").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = (btn).dataset.userId;
        const current = (btn).dataset.currentStatus;
        const newStatus = current === "suspended" ? "active" : "suspended";
        toggleUserStatus(id, newStatus);
      });
    });

    userTableBody.querySelectorAll(".btn-edit-user").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = (btn).dataset.userId;
        openUserEditModal(id);
      });
    });
  }

  // 5. USER STATUS & ROLE API ACTIONS
  async function toggleUserStatus(userId, newStatus) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        user.status = newStatus;
        showToast(`Status akun ${user.name} diubah menjadi ${newStatus}.`);
      } else {
        user.status = newStatus;
        showToast(`Status akun ${user.name} diperbarui ke ${newStatus}.`);
      }
    } catch {
      user.status = newStatus;
      showToast(`Status akun ${user.name} diperbarui ke ${newStatus}.`);
    }

    // Add audit entry locally
    activities.unshift({
      id: "act_" + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: "admin",
      action: "admin.user_status_changed",
      description: `Admin mengubah status user ${user.name} (${user.email}) menjadi ${newStatus}`,
      ipAddress: "127.0.0.1",
      userAgent: "Kawira Admin Portal",
      status: "success"
    });

    renderUsersTable();
    renderAuditTable();
  }

  // 6. EDIT USER MODAL
  const userModal = document.getElementById("user-modal");
  const userEditForm = document.getElementById("user-edit-form");
  const editUserIdInput = document.getElementById("edit-user-id");
  const editUserNameInput = document.getElementById("edit-user-name");
  const editUserEmailInput = document.getElementById("edit-user-email");
  const editUserRoleSelect = document.getElementById("edit-user-role");
  const editUserStatusSelect = document.getElementById("edit-user-status");
  const modalCloseBtn = document.getElementById("modal-user-close");
  const modalCancelBtn = document.getElementById("modal-user-cancel");

  function openUserEditModal(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user || !userModal) return;

    editUserIdInput.value = user.id;
    editUserNameInput.value = user.name;
    editUserEmailInput.value = user.email;
    editUserRoleSelect.value = user.role;
    editUserStatusSelect.value = user.status;

    userModal.hidden = false;
  }

  function closeUserModal() {
    if (!userModal) return;
    userModal.hidden = true;
  }

  modalCloseBtn?.addEventListener("click", closeUserModal);
  modalCancelBtn?.addEventListener("click", closeUserModal);

  userEditForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editUserIdInput.value;
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newRole = editUserRoleSelect.value;
    const newStatus = editUserStatusSelect.value;

    try {
      await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn("Offline patch fallback", err);
    }

    user.role = newRole;
    user.status = newStatus;

    activities.unshift({
      id: "act_" + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      role: "admin",
      action: "admin.user_role_changed",
      description: `Admin memperbarui role ${user.name} menjadi [${newRole}] dan status [${newStatus}]`,
      ipAddress: "127.0.0.1",
      userAgent: "Kawira Admin Portal",
      status: "success"
    });

    closeUserModal();
    renderUsersTable();
    renderAuditTable();
    showToast(`Data pengguna ${user.name} berhasil diperbarui!`);
  });

  // 7. RENDER AUDIT LOG TABLE
  function renderAuditTable() {
    if (!auditTableBody) return;
    const q = (auditSearchInput?.value || "").toLowerCase().trim();

    let filtered = [...activities];

    if (activeAuditRole !== "all") {
      filtered = filtered.filter((a) => a.role === activeAuditRole);
    }
    if (activeAuditAction !== "all") {
      filtered = filtered.filter((a) => a.action.startsWith(activeAuditAction));
    }
    if (q) {
      filtered = filtered.filter(
        (a) =>
          a.userName.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.ipAddress.includes(q) ||
          a.userId.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      auditTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">Tidak ada riwayat aktivitas yang sesuai filter.</td></tr>`;
      return;
    }

    auditTableBody.innerHTML = filtered
      .map((a) => {
        const roleBadge =
          a.role === "admin"
            ? `<span class="badge badge-admin">Admin</span>`
            : a.role === "mentor"
            ? `<span class="badge badge-mentor">Mentor</span>`
            : `<span class="badge badge-mentee">Mentee</span>`;

        const isSuccess = a.status === "success";
        const statusBadge = isSuccess
          ? `<span class="badge badge-success">Success</span>`
          : `<span class="badge badge-warning">Warning</span>`;

        const formattedTime = new Date(a.timestamp).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });

        return `
          <tr>
            <td style="white-space: nowrap; font-size: 11px; color: var(--text-muted);">
              <div>${formattedTime}</div>
              <small style="opacity: 0.7;">ID: ${escapeHtml(a.id)}</small>
            </td>
            <td>
              <div style="font-weight: 700; color: var(--navy);">${escapeHtml(a.userName)}</div>
              <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                ${roleBadge}
                <span style="font-size: 10px; color: var(--text-sub);">(${escapeHtml(a.userId)})</span>
              </div>
            </td>
            <td>
              <code style="font-size: 11px; background: #F1F5F9; padding: 2px 6px; border-radius: 4px; color: var(--navy); font-weight: 700;">
                ${escapeHtml(a.action)}
              </code>
            </td>
            <td style="max-width: 280px; line-height: 1.45; font-size: 12px;">
              ${escapeHtml(a.description)}
            </td>
            <td style="white-space: nowrap; font-size: 11px;">
              <div style="font-family: monospace; font-weight: 700; color: var(--teal-dark);">${escapeHtml(a.ipAddress)}</div>
              <div style="color: var(--text-muted); font-size: 10px; max-width: 140px; overflow: hidden; text-overflow: ellipsis;">
                ${escapeHtml(a.userAgent)}
              </div>
            </td>
            <td>${statusBadge}</td>
          </tr>
        `;
      })
      .join("");
  }

  // 8. RENDER DATABASE OVERVIEW (3 VIEWS)
  function renderDatabaseOverview() {
    const viewBookkeeping = document.getElementById("db-view-bookkeeping");
    const viewChats = document.getElementById("db-view-chats");
    const viewMentors = document.getElementById("db-view-mentors");

    if (viewBookkeeping) viewBookkeeping.style.display = activeDbTab === "bookkeeping" ? "block" : "none";
    if (viewChats) viewChats.style.display = activeDbTab === "chats" ? "block" : "none";
    if (viewMentors) viewMentors.style.display = activeDbTab === "mentors" ? "block" : "none";

    // View A: Bookkeeping
    const bookkeepingBody = document.getElementById("db-bookkeeping-body");
    if (bookkeepingBody) {
      const records = dbOverview.bookkeepingRecords || [];
      if (records.length === 0) {
        bookkeepingBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px;">Belum ada catatan pembukuan mentee.</td></tr>`;
      } else {
        bookkeepingBody.innerHTML = records
          .map((b) => {
            const isIncome = b.type === "income";
            return `
              <tr>
                <td style="white-space: nowrap; font-size: 11px; color: var(--text-muted);">${b.transactionDate}</td>
                <td>
                  <strong style="color: var(--navy); display: block;">${escapeHtml(b.menteeName)}</strong>
                  <small style="color: var(--teal-dark);">${escapeHtml(b.businessName)}</small>
                </td>
                <td>
                  <span class="badge ${isIncome ? "badge-income" : "badge-expense"}">
                    ${isIncome ? "↓ Pemasukan" : "↑ Pengeluaran"}
                  </span>
                </td>
                <td style="font-weight: 600;">${escapeHtml(b.category)}</td>
                <td style="font-weight: 800; font-size: 13px; color: ${isIncome ? "#166534" : "#991B1B"};">
                  ${isIncome ? "+" : "-"}${formatRupiah(b.amount)}
                </td>
                <td style="max-width: 260px; line-height: 1.4;">${escapeHtml(b.description)}</td>
              </tr>
            `;
          })
          .join("");
      }
    }

    // View B: Chat Conversations Recap
    const chatsBody = document.getElementById("db-chats-body");
    if (chatsBody) {
      const convs = dbOverview.chatConversations || [];
      if (convs.length === 0) {
        chatsBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px;">Belum ada sesi percakapan chat.</td></tr>`;
      } else {
        chatsBody.innerHTML = convs
          .map((c) => {
            const isCompleted = c.status === "completed";
            return `
              <tr>
                <td style="font-family: monospace; font-size: 11px; color: var(--text-muted);">${c.id}</td>
                <td>
                  <div style="font-weight: 700; color: var(--navy);">${escapeHtml(c.menteeName)}</div>
                  <div style="font-size: 11px; color: var(--teal-dark);">${escapeHtml(c.businessName)}</div>
                </td>
                <td style="font-weight: 600; color: var(--navy);">${escapeHtml(c.mentorName)}</td>
                <td style="font-weight: 800; color: var(--teal-dark);">${c.messageCount} pesan</td>
                <td style="font-size: 11px; color: var(--text-muted);">${c.lastActive}</td>
                <td style="max-width: 220px; font-size: 11px; color: var(--text-muted); line-height: 1.4;">
                  "${escapeHtml(c.lastMessage)}"
                </td>
                <td>
                  <span class="badge ${isCompleted ? "badge-active" : "badge-warning"}">
                    ${isCompleted ? "Selesai" : "Aktif"}
                  </span>
                </td>
              </tr>
            `;
          })
          .join("");
      }
    }

    // View C: Mentor Availability
    const mentorsBody = document.getElementById("db-mentors-body");
    if (mentorsBody) {
      const mentors = dbOverview.mentorAvailability || [];
      if (mentors.length === 0) {
        mentorsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px;">Belum ada data ketersediaan mentor.</td></tr>`;
      } else {
        mentorsBody.innerHTML = mentors
          .map((m) => {
            const statusBadge =
              m.status === "available"
                ? `<span class="badge badge-active"><span class="dot online"></span> Tersedia</span>`
                : m.status === "in_session"
                ? `<span class="badge badge-warning">Sedang Sesi</span>`
                : `<span class="badge badge-suspended">Offline</span>`;

            return `
              <tr>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${m.avatarUrl}" style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;">
                    <div>
                      <div style="font-weight: 700; color: var(--navy);">${escapeHtml(m.name)}</div>
                      <div style="font-size: 10px; color: var(--text-muted);">${escapeHtml(m.email)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${(m.expertise || []).map((exp) => `<span style="background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${escapeHtml(exp)}</span>`).join("")}
                  </div>
                </td>
                <td>${statusBadge}</td>
                <td style="font-weight: 700; color: var(--teal-dark);">${m.activeMentees} Mentee</td>
                <td style="font-size: 11px; color: var(--text-muted);">${m.officeHours}</td>
                <td style="white-space: nowrap;">
                  <span style="color: #F59E0B; font-weight: 800;">★ ${m.rating}</span>
                  <span style="font-size: 10px; color: var(--text-muted);">/ 5.0</span>
                </td>
              </tr>
            `;
          })
          .join("");
      }
    }
  }

  // 9. EVENT LISTENERS FOR FILTERS & TABS
  // User role filter tabs
  document.querySelectorAll("#user-role-tabs .tab-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#user-role-tabs .tab-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeRoleFilter = btn.dataset.roleFilter;
      renderUsersTable();
    });
  });

  // User status select
  userStatusFilter?.addEventListener("change", (e) => {
    activeStatusFilter = (e.target).value;
    renderUsersTable();
  });

  // User search input
  userSearchInput?.addEventListener("input", () => {
    renderUsersTable();
  });

  // Audit filter listeners
  auditRoleFilter?.addEventListener("change", (e) => {
    activeAuditRole = (e.target).value;
    renderAuditTable();
  });

  auditActionFilter?.addEventListener("change", (e) => {
    activeAuditAction = (e.target).value;
    renderAuditTable();
  });

  auditSearchInput?.addEventListener("input", () => {
    renderAuditTable();
  });

  // Database overview sub-tabs
  document.querySelectorAll("#db-overview-tabs .tab-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#db-overview-tabs .tab-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeDbTab = btn.dataset.dbTab;
      renderDatabaseOverview();
    });
  });

  // Export audit log button (JSON download)
  document.getElementById("btn-export-audit")?.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit_trail_kawira_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("File audit log JSON berhasil di-export!");
  });

  // Refresh data button
  document.getElementById("btn-refresh-data")?.addEventListener("click", () => {
    fetchUsers();
    fetchActivities();
    fetchDatabaseOverview();
    showToast("Data platform berhasil disegarkan!");
  });

  // Sidebar navigation scroll
  document.querySelectorAll(".sidebar-nav .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav .nav-item").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const sectionId = btn.dataset.section;
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 10. INITIAL BOOT
  fetchUsers();
  fetchActivities();
  fetchDatabaseOverview();
})();
