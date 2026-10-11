(() => {
  "use strict";

  // 1. ROLE GUARD: Only mentor can access this page
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

  if (!currentUser || currentUser.role !== "mentor") {
    // Redirect to login staff with unauthorized error
    window.location.replace("./login-staff.html?role=mentor&error=unauthorized_mentor");
    return;
  }

  // 2. STATE & UI ELEMENTS
  let mentees = [];
  let feedbacks = [];
  let activeMentee = null;
  let chatHistories = {}; // { menteeId: Array of messages }
  let socket = null;

  const menteesContainer = document.getElementById("mentees-container");
  const menteeSearchInput = document.getElementById("mentee-search-input");
  const chatMessagesList = document.getElementById("chat-messages-list");
  const chatSendForm = document.getElementById("chat-send-form");
  const chatMessageInput = document.getElementById("chat-message-input");
  const chatActiveName = document.getElementById("chat-active-name");
  const chatActiveAvatar = document.getElementById("chat-active-avatar");
  const chatActiveBusiness = document.getElementById("chat-active-business");
  const chatActivePresence = document.getElementById("chat-active-presence");
  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackForm = document.getElementById("feedback-form");
  const fbMenteeSelect = document.getElementById("fb-mentee-select");
  const feedbackTableBody = document.getElementById("feedback-table-body");
  const feedbackSummaryCount = document.getElementById("feedback-summary-count");
  const toastContainer = document.getElementById("toast-container");

  // Update Mentor Profile in Sidebar
  const sidebarAvatar = document.getElementById("sidebar-mentor-avatar");
  const sidebarName = document.getElementById("sidebar-mentor-name");
  if (sidebarName && currentUser.name) sidebarName.textContent = currentUser.name;
  if (sidebarAvatar && currentUser.avatarUrl) sidebarAvatar.src = currentUser.avatarUrl;

  // Logout button
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      window.location.replace("./login-staff.html");
    });
  }

  // 3. TOAST HELPER
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

  // 4. WEBSOCKET / SOCKET.IO SETUP
  function initWebSocket() {
    try {
      if (typeof window.io !== "undefined") {
        socket = window.io(window.location.origin);
        
        socket.on("connect", () => {
          socket.emit("join_room", `mentor_${currentUser.id}`);
        });

        // Listen for receive_message event
        socket.on("receive_message", (msg) => {
          handleIncomingMessage(msg);
        });
      }
    } catch (err) {
      console.warn("WebSocket fallback mode active", err);
    }

    // BroadcastChannel fallback for multi-tab sync
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("kawira_chat_channel");
      channel.onmessage = (event) => {
        if (event.data && event.data.type === "chat_message") {
          handleIncomingMessage(event.data.message);
        }
      };
    }
  }

  function handleIncomingMessage(msg) {
    if (!msg || !msg.text) return;
    const targetMenteeId = msg.senderRole === "mentor" ? msg.receiverId : msg.senderId;
    if (!chatHistories[targetMenteeId]) {
      chatHistories[targetMenteeId] = [];
    }

    // Avoid duplicate message IDs
    const exists = chatHistories[targetMenteeId].some((m) => m.id === msg.id);
    if (!exists) {
      chatHistories[targetMenteeId].push(msg);
      if (activeMentee && activeMentee.id === targetMenteeId) {
        renderChatMessages();
      }
    }
  }

  // 5. FETCH MENTEES AND FEEDBACKS FROM API
  async function loadMentorData() {
    try {
      const response = await fetch("/api/mentor/mentees");
      if (response.ok) {
        const data = await response.json();
        mentees = data.mentees || [];
        feedbacks = data.feedbacks || [];
      } else {
        throw new Error("API returned non-200");
      }
    } catch (err) {
      console.warn("Using offline mock data fallback for mentor mentees", err);
      // Fallback default mentees
      mentees = [
        {
          id: "u_mentee_1",
          name: "Farhan Pratama",
          email: "farhan.pratama@student.ub.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Kopi Susu Kampus Seduh",
          category: "Food & Beverage",
          campus: "Universitas Brawijaya",
          sessionStatus: "Sedang Berlangsung",
          isOnline: true,
          lastSession: "Hari ini, 10:15 WIB",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: "u_mentee_2",
          name: "Nadia Aulia Putri",
          email: "nadia.aulia@student.ui.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Hijab Voal Printing Alana",
          category: "Fashion & Lifestyle",
          campus: "Universitas Indonesia",
          sessionStatus: "Menunggu Diskusi",
          isOnline: true,
          lastSession: "Kemarin, 14:00 WIB",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: "u_mentee_3",
          name: "Kevin Wijaya",
          email: "kevin.wijaya@student.itb.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Snack Jamur Crispy Gurih",
          category: "Agroindustri & Camilan",
          campus: "Institut Teknologi Bandung",
          sessionStatus: "Selesai Diskusi",
          isOnline: false,
          lastSession: "2 hari lalu",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
        },
        {
          id: "u_mentee_4",
          name: "Rina Salsabila",
          email: "rina.salsabila@student.ugm.ac.id",
          role: "mentee",
          status: "active",
          businessName: "Lilac Scented Candle",
          category: "Kriya & Home Living",
          campus: "Universitas Gadjah Mada",
          sessionStatus: "Terjadwal",
          isOnline: false,
          lastSession: "3 hari lalu",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
        }
      ];

      feedbacks = [
        {
          id: "fb_1",
          menteeId: "u_mentee_3",
          menteeName: "Kevin Wijaya",
          mentorId: currentUser.id,
          mentorName: currentUser.name,
          sessionTopic: "Validasi Kemasan Standing Pouch & Titik Impas BEP",
          progressNotes: "Kevin sudah menghitung biaya pokok kemasan per bungkus Rp 1.450. Margin perlu dijaga di 40% agar aman saat diskon reseller.",
          actionItems: "1. Uji ketahanan segel sealer 7 hari. 2. Susun proposal konsinyasi ke 5 kantin kampus baru.",
          readinessScore: 4,
          nextStepStatus: "Selesai & Target Tercapai",
          createdAt: "2026-10-09 17:15 WIB"
        }
      ];
    }

    // Seed initial chat history for Farhan
    chatHistories["u_mentee_1"] = [
      {
        id: "msg_init_1",
        senderId: "u_mentee_1",
        senderName: "Farhan Pratama",
        senderRole: "mentee",
        text: "Halo Kak Aditya! Selamat pagi, izin mau konsultasi mengenai perhitungan HPP untuk varian kopi susu gula aren botol 250ml.",
        timestamp: "10:05",
        status: "read"
      },
      {
        id: "msg_init_2",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: "mentor",
        text: "Pagi Farhan! Tentu. Sudah masukkan biaya bahan baku kopi, susu, botol, stiker, dan porsi es batu ke rumus HPP?",
        timestamp: "10:08",
        status: "read"
      },
      {
        id: "msg_init_3",
        senderId: "u_mentee_1",
        senderName: "Farhan Pratama",
        senderRole: "mentee",
        text: "Sudah Kak! Total biaya bahan mentah ketemu Rp 7.200 per botol. Kalau mau jual Rp 15.000 apakah marginnya sudah sehat?",
        timestamp: "10:12",
        status: "read"
      }
    ];

    chatHistories["u_mentee_2"] = [
      {
        id: "msg_nadia_1",
        senderId: "u_mentee_2",
        senderName: "Nadia Aulia",
        senderRole: "mentee",
        text: "Halo Kak Aditya, kemarin sesi foto katalog batch 1 sudah selesai. Kapan bisa dapat feedback untuk pemilihan font logo ya?",
        timestamp: "Kemarin",
        status: "read"
      }
    ];

    // Select first mentee as active
    if (mentees.length > 0) {
      activeMentee = mentees[0];
    }

    renderMenteesList();
    renderChatMessages();
    renderFeedbackTable();
    populateFeedbackSelect();
  }

  // 6. RENDER MENTEES LIST
  function renderMenteesList() {
    if (!menteesContainer) return;
    const query = (menteeSearchInput?.value || "").toLowerCase();
    const filtered = mentees.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.businessName && m.businessName.toLowerCase().includes(query)) ||
        (m.category && m.category.toLowerCase().includes(query))
    );

    document.getElementById("badge-mentee-count").textContent = String(mentees.length);

    if (filtered.length === 0) {
      menteesContainer.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">Tidak ada mentee yang cocok dengan pencarian.</div>`;
      return;
    }

    menteesContainer.innerHTML = filtered
      .map((m) => {
        const isSelected = activeMentee && activeMentee.id === m.id;
        const statusBadgeClass =
          m.sessionStatus === "Sedang Berlangsung"
            ? "badge-active"
            : m.sessionStatus === "Menunggu Diskusi"
            ? "badge-warning"
            : "badge-mentor";

        return `
          <div class="mentee-card ${isSelected ? "selected" : ""}" data-mentee-id="${m.id}">
            <div class="mentee-card-top">
              <img class="mentee-avatar" src="${m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" alt="${m.name}">
              <div class="mentee-details">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                  <h3>${m.name}</h3>
                  <span class="badge ${statusBadgeClass}">${m.sessionStatus || 'Aktif'}</span>
                </div>
                <div class="mentee-business">${m.businessName || 'Usaha Mahasiswa'}</div>
                <div class="mentee-meta" style="margin-top: 2px;">
                  <span>${m.category || 'Wirausaha'}</span> • <span>${m.campus || 'Kampus'}</span>
                </div>
              </div>
            </div>

            <div class="mentee-card-actions">
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted);">
                <span class="dot ${m.isOnline ? "online" : "offline"}"></span>
                <span>${m.isOnline ? "Online Sekarang" : "Terakhir aktif: " + (m.lastSession || 'Baru-baru ini')}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm btn-open-fb-specific" data-mentee-id="${m.id}" title="Beri catatan & feedback">
                  Catatan
                </button>
                <button class="btn btn-primary btn-sm btn-start-chat" data-mentee-id="${m.id}">
                  Mulai Live Chat
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    // Attach click events
    menteesContainer.querySelectorAll(".mentee-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Prevent if clicked on a button
        if ((e.target).closest("button")) return;
        const id = card.dataset.menteeId;
        selectMentee(id);
      });
    });

    menteesContainer.querySelectorAll(".btn-start-chat").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = (btn).dataset.menteeId;
        selectMentee(id);
        chatMessageInput?.focus();
      });
    });

    menteesContainer.querySelectorAll(".btn-open-fb-specific").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = (btn).dataset.menteeId;
        openFeedbackModal(id);
      });
    });
  }

  function selectMentee(id) {
    const target = mentees.find((m) => m.id === id);
    if (!target) return;
    activeMentee = target;
    renderMenteesList();
    renderChatHeader();
    renderChatMessages();
  }

  function renderChatHeader() {
    if (!activeMentee) return;
    if (chatActiveName) chatActiveName.textContent = activeMentee.name;
    if (chatActiveAvatar && activeMentee.avatarUrl) chatActiveAvatar.src = activeMentee.avatarUrl;
    if (chatActiveBusiness) chatActiveBusiness.textContent = `${activeMentee.businessName} (${activeMentee.category})`;
    if (chatActivePresence) {
      chatActivePresence.className = `dot ${activeMentee.isOnline ? "online" : "offline"}`;
      chatActivePresence.title = activeMentee.isOnline ? "Online" : "Offline";
    }
  }

  // 7. RENDER LIVE CHAT MESSAGES
  function renderChatMessages() {
    if (!chatMessagesList || !activeMentee) return;
    const history = chatHistories[activeMentee.id] || [];

    if (history.length === 0) {
      chatMessagesList.innerHTML = `
        <div style="text-align: center; margin: auto; color: var(--text-muted); font-size: 13px;">
          <div style="font-weight: 700; color: var(--navy); margin-bottom: 4px;">Ruang Konsultasi Live dengan ${activeMentee.name}</div>
          <p>Mulai percakapan mentoring untuk memandu penetapan harga, strategi pemasaran, atau operasional usahanya.</p>
        </div>
      `;
      return;
    }

    chatMessagesList.innerHTML = history
      .map((msg) => {
        const isMentor = msg.senderRole === "mentor";
        return `
          <div class="chat-bubble ${isMentor ? "mentor" : "mentee"}">
            <div style="font-size: 10px; font-weight: 700; margin-bottom: 2px; opacity: 0.85;">
              ${isMentor ? "Anda (Mentor)" : activeMentee.name}
            </div>
            <div>${escapeHtml(msg.text)}</div>
            <div class="chat-bubble-meta">
              <span>${msg.timestamp || "Baru saja"}</span>
              ${isMentor ? "<span>✓✓</span>" : ""}
            </div>
          </div>
        `;
      })
      .join("");

    // Auto scroll to bottom
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 8. SEND CHAT MESSAGE
  if (chatSendForm) {
    chatSendForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatMessageInput?.value.trim();
      if (!text || !activeMentee) return;

      const newMsg = {
        id: "msg_" + Date.now(),
        conversationId: `conv_${activeMentee.id}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: "mentor",
        receiverId: activeMentee.id,
        text: text,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: "sent"
      };

      if (!chatHistories[activeMentee.id]) {
        chatHistories[activeMentee.id] = [];
      }
      chatHistories[activeMentee.id].push(newMsg);
      renderChatMessages();
      chatMessageInput.value = "";

      // Send via WebSocket Event `send_message`
      if (socket && socket.connected) {
        socket.emit("send_message", newMsg);
      } else {
        // Fallback simulation: Mentee auto replies after 1.4s
        setTimeout(() => {
          simulateMenteeReply(activeMentee);
        }, 1400);
      }

      // Sync BroadcastChannel
      if ("BroadcastChannel" in window) {
        const channel = new BroadcastChannel("kawira_chat_channel");
        channel.postMessage({ type: "chat_message", message: newMsg });
      }
    });
  }

  function simulateMenteeReply(mentee) {
    const replies = [
      "Terima kasih arahannya Kak Aditya! Saya segera perbaiki rincian biaya pokok produksinya.",
      "Betul sekali Kak, kami akan uji coba harga Rp 15.000 dengan promo bundling 2 cup.",
      "Siap Kak! Untuk pencatatan kas harian akan rutin kami masukkan ke pembukuan Kawira.",
      "Apakah untuk biaya stiker dan botol perlu dimasukkan ke biaya bahan baku atau overhead Kak?",
      "Saran Kakak sangat jelas. Terima kasih banyak sudah mendampingi usaha kami!"
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const menteeMsg = {
      id: "msg_reply_" + Date.now(),
      senderId: mentee.id,
      senderName: mentee.name,
      senderRole: "mentee",
      receiverId: currentUser.id,
      text: replyText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: "delivered"
    };

    if (!chatHistories[mentee.id]) chatHistories[mentee.id] = [];
    chatHistories[mentee.id].push(menteeMsg);
    if (activeMentee && activeMentee.id === mentee.id) {
      renderChatMessages();
    }
  }

  // Quick Prompt Chips
  document.querySelectorAll(".prompt-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const promptText = chip.dataset.prompt;
      if (chatMessageInput && promptText) {
        chatMessageInput.value = promptText;
        chatMessageInput.focus();
      }
    });
  });

  // End Session Summary Button
  const btnEndSession = document.getElementById("btn-end-session-summary");
  if (btnEndSession) {
    btnEndSession.addEventListener("click", () => {
      if (activeMentee) {
        openFeedbackModal(activeMentee.id);
      } else {
        openFeedbackModal();
      }
    });
  }

  // 9. FEEDBACK & NOTES MODAL
  function openFeedbackModal(preselectedMenteeId = null) {
    if (!feedbackModal) return;
    populateFeedbackSelect();
    if (preselectedMenteeId && fbMenteeSelect) {
      fbMenteeSelect.value = preselectedMenteeId;
    }
    feedbackModal.hidden = false;
  }

  function closeFeedbackModal() {
    if (!feedbackModal) return;
    feedbackModal.hidden = true;
    feedbackForm?.reset();
  }

  const btnOpenFeedbackModal = document.getElementById("btn-open-feedback-modal");
  const modalCloseBtn = document.getElementById("modal-feedback-close");
  const modalCancelBtn = document.getElementById("modal-feedback-cancel");

  btnOpenFeedbackModal?.addEventListener("click", () => openFeedbackModal());
  modalCloseBtn?.addEventListener("click", closeFeedbackModal);
  modalCancelBtn?.addEventListener("click", closeFeedbackModal);

  function populateFeedbackSelect() {
    if (!fbMenteeSelect) return;
    fbMenteeSelect.innerHTML = mentees
      .map((m) => `<option value="${m.id}">${m.name} - ${m.businessName}</option>`)
      .join("");
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const targetId = fbMenteeSelect?.value;
      const menteeObj = mentees.find((m) => m.id === targetId);
      if (!menteeObj) return;

      const topic = document.getElementById("fb-topic-input").value.trim();
      const notes = document.getElementById("fb-notes-input").value.trim();
      const actionItems = document.getElementById("fb-action-input").value.trim();
      const score = Number(document.getElementById("fb-score-select").value);
      const nextStatus = document.getElementById("fb-status-select").value;

      const payload = {
        menteeId: targetId,
        menteeName: menteeObj.name,
        mentorId: currentUser.id,
        mentorName: currentUser.name,
        sessionTopic: topic,
        progressNotes: notes,
        actionItems: actionItems,
        readinessScore: score,
        nextStepStatus: nextStatus
      };

      try {
        const res = await fetch("/api/mentor/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const body = await res.json();
          if (body.feedback) {
            feedbacks.unshift(body.feedback);
          }
        } else {
          feedbacks.unshift({
            id: "fb_" + Date.now(),
            ...payload,
            createdAt: new Date().toLocaleString("id-ID")
          });
        }
      } catch {
        feedbacks.unshift({
          id: "fb_" + Date.now(),
          ...payload,
          createdAt: new Date().toLocaleString("id-ID")
        });
      }

      // Update mentee session status
      menteeObj.sessionStatus = "Selesai Diskusi";
      renderMenteesList();
      renderFeedbackTable();
      closeFeedbackModal();
      showToast(`Evaluasi berhasil disimpan untuk ${menteeObj.name}!`);
    });
  }

  function renderFeedbackTable() {
    if (!feedbackTableBody) return;
    if (feedbackSummaryCount) {
      feedbackSummaryCount.textContent = `${feedbacks.length} catatan tersimpan`;
    }
    const badgeCount = document.getElementById("badge-feedback-count");
    if (badgeCount) badgeCount.textContent = String(feedbacks.length);

    if (feedbacks.length === 0) {
      feedbackTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Belum ada catatan mentoring yang diberikan.</td></tr>`;
      return;
    }

    feedbackTableBody.innerHTML = feedbacks
      .map((f) => {
        const stars = "★".repeat(f.readinessScore) + "☆".repeat(5 - f.readinessScore);
        return `
          <tr>
            <td style="white-space: nowrap; font-size: 11px; color: var(--text-muted);">${f.createdAt || "Hari ini"}</td>
            <td>
              <strong style="color: var(--navy); display: block;">${escapeHtml(f.menteeName)}</strong>
              <small style="color: var(--teal-dark);">${f.menteeBusiness || "Usaha Mentee"}</small>
            </td>
            <td style="font-weight: 700; color: var(--navy);">${escapeHtml(f.sessionTopic)}</td>
            <td style="max-width: 260px; line-height: 1.5;">${escapeHtml(f.progressNotes)}</td>
            <td style="max-width: 220px; color: var(--teal-dark); font-weight: 600;">${escapeHtml(f.actionItems)}</td>
            <td style="white-space: nowrap;">
              <span style="color: #F59E0B; font-weight: 800;">${stars}</span>
              <span style="font-size: 11px; color: var(--text-muted); margin-left: 4px;">(${f.readinessScore}/5)</span>
            </td>
            <td>
              <span class="badge badge-active">${escapeHtml(f.nextStepStatus)}</span>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // 10. SEARCH MENTEE FILTER
  menteeSearchInput?.addEventListener("input", () => {
    renderMenteesList();
  });

  // Tab navigation in sidebar
  document.querySelectorAll(".sidebar-nav .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-nav .nav-item").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      if (tab === "mentees") {
        document.querySelector(".mentor-grid")?.scrollIntoView({ behavior: "smooth" });
      } else if (tab === "livechat") {
        document.getElementById("live-chat-panel")?.scrollIntoView({ behavior: "smooth" });
        chatMessageInput?.focus();
      } else if (tab === "feedbacks") {
        document.getElementById("section-feedback-history")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Initial Boot
  initWebSocket();
  loadMentorData();
})();
