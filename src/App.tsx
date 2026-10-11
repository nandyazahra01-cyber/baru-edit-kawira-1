import React, { useState, useEffect } from 'react';
import { 
  PageType, 
  UserProfile, 
  Booking, 
  Transaction, 
  LearningModule, 
  CommunityEvent, 
  CollabRequest, 
  WalletTransaction, 
  NotificationItem, 
  Mentor 
} from './types';
import { 
  INITIAL_MENTORS, 
  INITIAL_MODULES, 
  INITIAL_COMMUNITY_EVENTS, 
  INITIAL_COLLAB_REQUESTS, 
  INITIAL_TRANSACTIONS 
} from './data/mockData';

import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast, ToastState } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { TopUpModal } from './components/TopUpModal';
import { ChatRoomModal } from './components/ChatRoomModal';

import { DashboardOverview } from './components/DashboardOverview';
import { MentoringHub } from './components/MentoringHub';
import { MessagesCenter } from './components/MessagesCenter';
import { Bookkeeping } from './components/Bookkeeping';
import { BusinessCalculator } from './components/BusinessCalculator';
import { ModulesCenter } from './components/ModulesCenter';
import { CommunityCenter } from './components/CommunityCenter';
import { PortfolioCenter } from './components/PortfolioCenter';
import { ProfileSettings } from './components/ProfileSettings';
import { DetailModulStudy } from './components/DetailModulStudy';

const STORAGE_KEY = 'kawira_state_v4';

export default function App() {
  // App mode: whether user is viewing the landing page or logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'staff' | null>(null);

  // Active page inside application
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeStudyModule, setActiveStudyModule] = useState<1 | 2 | null>(null);

  // Interactive modals
  const [activeChatBookingId, setActiveChatBookingId] = useState<string | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Core Data State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Kawira Anindya',
    email: 'kawira.anindya@student.ub.ac.id',
    campus: 'Universitas Brawijaya',
    phone: '+62 812-3456-7890',
    social: 'instagram.com/dapur.nusantara',
    userStatus: 'Mahasiswa',
    cohort: 'Batch 2026',
    businessName: 'Dapur Ricebowl Nusantara',
    sector: 'Kuliner',
    status: 'Berjalan (Early Stage)',
    title: 'Peserta P2MW Kemendikbudristek 2026',
    description: 'Usaha kuliner rice bowl dengan resep rempah nusantara segar kemasan eco-friendly khusus mahasiswa & pekerja kantoran.',
    challenge: 'Menghitung HPP yang stabil saat harga bahan baku naik & menembus pendanaan P2MW tahap inkubasi.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    businessPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  });

  const [walletBalance, setWalletBalance] = useState<number>(50000);
  const [walletLedger, setWalletLedger] = useState<WalletTransaction[]>([
    { id: 'wt1', date: '2026-09-08', type: 'topup', amount: 50000, note: 'Saldo awal pendaftaran akun' },
  ]);

  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [modules, setModules] = useState<LearningModule[]>(INITIAL_MODULES);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(['mod1']);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({ mod1: 100 });
  const [communityEvents, setCommunityEvents] = useState<CommunityEvent[]>(INITIAL_COMMUNITY_EVENTS);
  const [collabs, setCollabs] = useState<CollabRequest[]>(INITIAL_COLLAB_REQUESTS);

  // Check whether mentoring is unlocked: requires Modul 1 and Modul 2
  const isMentoringUnlocked = completedModuleIds.includes('mod1') && completedModuleIds.includes('mod2');

  // Initial demo bookings
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'b1',
      mentorId: 'm1',
      mentorName: 'Kak Aditya Ramadhan',
      mentorSector: 'Kuliner',
      mentorStatus: 'Alumni P2MW',
      initial: 'AR',
      mentorAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      slot: 'Besok · 19:30 WIB',
      topic: 'Bedah struktur HPP & penyusunan proposal anggaran P2MW',
      consultation: 'Sesi Chat Real-time',
      price: 25000,
      status: 'upcoming',
      createdAt: Date.now() - 100000,
      meetingUrl: 'https://meet.google.com/kawira-demo-meet',
      messages: [
        {
          id: 'msg1',
          from: 'them',
          text: 'Halo Kawira Anindya! Salam kenal, saya Aditya. Terima kasih sudah menjadwalkan sesi. Silakan ceritakan produk tokomu dan komponen biaya yang ingin kita bedah bersama ya!',
          timestamp: '19:30',
          read: true,
        },
        {
          id: 'msg2',
          from: 'me',
          text: 'Halo Kak Aditya! Produk saya ricebowl sambal matah. Saat ini kendala di penetapan margin bersih dan kalkulasi kemasan.',
          timestamp: '19:32',
          read: true,
        },
        {
          id: 'msg3',
          from: 'them',
          text: 'Siap! Sangat umum terjadi di F&B. Besok kita kupas pemisahan biaya tetap vs variabel, plus tips lolos evaluasi reviewer P2MW.',
          timestamp: '19:35',
          read: false,
        },
      ],
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Pengingat Sesi Mentoring',
      desc: 'Sesi konsultasi bersama Kak Aditya Ramadhan dijadwalkan besok pukul 19:30 WIB.',
      time: '10 mnt lalu',
      read: false,
      type: 'mentoring',
    },
    {
      id: 'n2',
      title: 'Webinar Hibah P2MW',
      desc: 'Sharing session strategi lolos pendanaan P2MW 2026 dibuka untuk anggota Kawira.',
      time: '1 jam lalu',
      read: false,
      type: 'community',
    },
    {
      id: 'n3',
      title: 'Pembukuan Kas Terupdate',
      desc: '5 transaksi baru telah tersinkronisasi di Buku Kas.',
      time: 'Kemarin',
      read: true,
      type: 'finance',
    },
  ]);

  // Load from LocalStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (typeof parsed.walletBalance === 'number') setWalletBalance(parsed.walletBalance);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.completedModuleIds) setCompletedModuleIds(parsed.completedModuleIds);
        if (parsed.walletLedger) setWalletLedger(parsed.walletLedger);
        if (parsed.collabs) setCollabs(parsed.collabs);
      }
    } catch (e) {
      console.warn('Could not parse localStorage', e);
    }
  }, []);

  // Save to LocalStorage
  const saveState = (updatedPartial: Record<string, any>) => {
    try {
      const currentState = {
        profile,
        walletBalance,
        bookings,
        transactions,
        completedModuleIds,
        walletLedger,
        collabs,
        ...updatedPartial,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  // Handler: Top up wallet
  const handleTopUp = (amount: number, method: string) => {
    const newBalance = walletBalance + amount;
    const newTx: WalletTransaction = {
      id: `wt_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'topup',
      amount,
      note: `Top Up Saldo via ${method.split(' ')[0]}`,
    };
    const updatedLedger = [...walletLedger, newTx];

    setWalletBalance(newBalance);
    setWalletLedger(updatedLedger);
    saveState({ walletBalance: newBalance, walletLedger: updatedLedger });
    showToast(`Saldo bertambah Rp ${amount.toLocaleString('id-ID')}!`);
  };

  // Handler: Book a mentor
  const handleBookMentor = (
    mentorId: string,
    slot: string,
    consultation: 'Sesi Chat Real-time' | 'Sesi Call (Google Meet)',
    topic: string
  ) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    if (!mentor) return;

    if (walletBalance < mentor.price) {
      showToast('Saldo mentoring tidak cukup. Silakan isi saldo terlebih dahulu.', 'error');
      setShowTopUpModal(true);
      return;
    }

    const newBalance = walletBalance - mentor.price;
    const newWalletTx: WalletTransaction = {
      id: `wt_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'payment',
      amount: mentor.price,
      note: `Pembayaran sesi mentoring bersama ${mentor.name}`,
    };
    const updatedLedger = [...walletLedger, newWalletTx];

    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorSector: mentor.sector,
      mentorStatus: mentor.status,
      initial: mentor.initial,
      mentorAvatarUrl: mentor.avatarUrl,
      slot,
      topic,
      consultation,
      price: mentor.price,
      status: 'upcoming',
      createdAt: Date.now(),
      meetingUrl: consultation.includes('Google') ? 'https://meet.google.com/kawira-room-p2mw' : undefined,
      messages: [
        {
          id: `msg_${Date.now()}`,
          from: 'them',
          text: `Halo ${profile.name.split(' ')[0]}! Terima kasih sudah menjadwalkan sesi. Saya sudah mencatat topikmu: "${topic}". Siapkan catatan usaha tokomu ya!`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ],
    };

    const updatedBookings = [newBooking, ...bookings];
    setWalletBalance(newBalance);
    setWalletLedger(updatedLedger);
    setBookings(updatedBookings);

    saveState({
      walletBalance: newBalance,
      walletLedger: updatedLedger,
      bookings: updatedBookings,
    });

    showToast(`Sesi bersama ${mentor.name} berhasil dijadwalkan! Saldo terpotong Rp ${mentor.price.toLocaleString('id-ID')}.`);
    setActiveChatBookingId(newBooking.id);
  };

  // Handler: Send chat message in mentoring room
  const handleSendMessage = (bookingId: string, text: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const myMsg = {
      id: `msg_${Date.now()}`,
      from: 'me' as const,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    const updatedMessages = [...booking.messages, myMsg];
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, messages: updatedMessages } : b
    );

    setBookings(updatedBookings);
    saveState({ bookings: updatedBookings });

    // Simulate smart mentor response after ~1.2s
    setTimeout(() => {
      let replyText = `Poin yang bagus sekali! Dalam bisnis ${profile.sector}, kunci utamanya adalah konsistensi margin dan menjaga pelanggan lama tetap repeat order. Coba aplikasikan saran ini ke pembukuan tokomu ya!`;

      const lower = text.toLowerCase();
      if (lower.includes('hpp') || lower.includes('harga') || lower.includes('margin')) {
        replyText = `Terkait HPP ${profile.businessName || 'tokomu'}: Pastikan biaya kemasan dan upah harian tidak dimasukkan ke margin kotor. Gunakan target margin minimum 35% agar operasional tokomu punya cadangan likuiditas saat harga bahan pokok berfluktuasi.`;
      } else if (lower.includes('p2mw') || lower.includes('hibah') || lower.includes('pkm') || lower.includes('pitch')) {
        replyText = `Untuk seleksi P2MW & PMW, reviewer sangat menyukai angka validasi nyata: berapa porsi/unit yang sudah terjual per hari, siapa target pelanggan utama di kampus, dan kelayakan anggaran belanja modal alat vs operasional. Data buku kas Kawiramu bisa langsung kamu sertakan sebagai lampiran!`;
      } else if (lower.includes('promosi') || lower.includes('tiktok') || lower.includes('iklan') || lower.includes('konten')) {
        replyText = `Untuk konten promosi mahasiswa: Jangan langsung hard selling. Pakai formula Hook-Value-Offer dari modul Kawira. Tunjukkan behind-the-scene proses produksi jam 5 pagi atau reaksi jujur teman kampus saat pertama mencoba produkmu!`;
      }

      const mentorReply = {
        id: `msg_${Date.now()}_m`,
        from: 'them' as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, messages: [...b.messages, mentorReply] } : b
        )
      );
    }, 1300);
  };

  // Handler: Complete mentoring session
  const handleCompleteSession = (bookingId: string) => {
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'done' as const } : b
    );
    setBookings(updatedBookings);
    saveState({ bookings: updatedBookings });
    showToast('Sesi mentoring ditandai selesai dan tercatat di portofolio tokomu!');
  };

  // Handler: Review mentoring session
  const handleReviewBooking = (bookingId: string, rating: number, note: string) => {
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: 'done' as const,
            review: { rating, note, date: new Date().toLocaleDateString('id-ID') },
          }
        : b
    );

    setBookings(updatedBookings);
    saveState({ bookings: updatedBookings });
    showToast('Terima kasih! Ulasan & rating sesi berhasil disimpan.');
  };

  // Handler: Add transaction in bookkeeping
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      ...newTxData,
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveState({ transactions: updated });
  };

  // Handler: Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveState({ transactions: updated });
    showToast('Transaksi dihapus.');
  };

  // Handler: Pass quiz & complete module
  const handlePassQuiz = (moduleId: string, score: number) => {
    const updatedIds = completedModuleIds.includes(moduleId)
      ? completedModuleIds
      : [...completedModuleIds, moduleId];

    const updatedScores = { ...quizScores, [moduleId]: score };
    setCompletedModuleIds(updatedIds);
    setQuizScores(updatedScores);
    saveState({ completedModuleIds: updatedIds, quizScores: updatedScores });

    const willUnlockMentoring = updatedIds.includes('mod1') && updatedIds.includes('mod2');
    if (willUnlockMentoring && (!completedModuleIds.includes('mod1') || !completedModuleIds.includes('mod2'))) {
      showToast('🎉 Luar biasa! Modul 1 & 2 selesai. Akses Mentoring Sebaya 1-on-1 sekarang TERBUKA!');
    } else {
      showToast(`Lulus kuis pemahaman modul dengan skor ${score}%!`);
    }
  };

  // Handler: Bypass unlock for demo / judging convenience
  const handleUnlockDemo = () => {
    const demoIds = Array.from(new Set([...completedModuleIds, 'mod1', 'mod2']));
    const demoScores = { ...quizScores, mod1: 100, mod2: 100 };
    setCompletedModuleIds(demoIds);
    setQuizScores(demoScores);
    saveState({ completedModuleIds: demoIds, quizScores: demoScores });
    showToast('✨ Mode Penguji / Demo: Modul 1 & 2 telah dibuka. Akses mentoring aktif!');
  };

  // Handler: Toggle complete learning module
  const handleToggleCompleteModule = (moduleId: string) => {
    let updated: string[];
    if (completedModuleIds.includes(moduleId)) {
      updated = completedModuleIds.filter((id) => id !== moduleId);
      showToast('Status modul diperbarui.');
    } else {
      updated = [...completedModuleIds, moduleId];
      showToast('Selamat! Modul terselesaikan dan skor portofolio bertambah.');
    }
    setCompletedModuleIds(updated);
    saveState({ completedModuleIds: updated });
  };

  // Handler: Register community event
  const handleRegisterEvent = (eventId: string) => {
    const updated = communityEvents.map((ev) =>
      ev.id === eventId ? { ...ev, registered: !ev.registered } : ev
    );
    setCommunityEvents(updated);
    const target = updated.find((e) => e.id === eventId);
    showToast(target?.registered ? 'Kamu berhasil mendaftar sesi sharing!' : 'Pendaftaran sesi dibatalkan.');
  };

  // Handler: Add collab request (Teman Rintis)
  const handleAddCollab = (newCollab: CollabRequest) => {
    const updated = [newCollab, ...collabs];
    setCollabs(updated);
    saveState({ collabs: updated });
  };

  // Handler: Update user & business profile
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveState({ profile: updatedProfile });
  };

  // Financial snapshot helper to share into chat
  const handleShareFinanceSnapshot = (): string => {
    const inc = transactions.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);
    const out = transactions.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    return `[DATA KEUANGAN TOKO SAYA — KAWIRA]\nPemasukan: Rp ${inc.toLocaleString('id-ID')}\nPengeluaran: Rp ${out.toLocaleString('id-ID')}\nSaldo Kas: Rp ${(inc - out).toLocaleString('id-ID')}\nTotal Transaksi: ${transactions.length} transaksi terekam.\nMohon masukannya terkait alokasi kas & efisiensi biaya toko kami ya Kak!`;
  };

  // Unread messages count for badge
  const unreadMessagesCount = bookings.reduce(
    (count, b) => count + b.messages.filter((m) => m.from === 'them' && !m.read).length,
    0
  );

  const activeChatBooking = bookings.find((b) => b.id === activeChatBookingId);

  // If not authenticated, render the rich Landing Page!
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => setAuthModalMode(mode)}
          onEnterAppDirectly={() => {
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
            showToast('Masuk ke mode aplikasi Kawira.');
          }}
        />

        {authModalMode && (
          <AuthModal
            initialMode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onLoginSuccess={(user) => {
              setProfile((prev) => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                campus: user.campus || prev.campus,
              }));
              setIsAuthenticated(true);
              setAuthModalMode(null);
              showToast(`Selamat datang, ${user.name}!`);
            }}
          />
        )}

        <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      </>
    );
  }

  // Authenticated App Shell
  if (activeStudyModule !== null) {
    return (
      <>
        <DetailModulStudy
          moduleNumber={activeStudyModule}
          completedModuleIds={completedModuleIds}
          onCompleteModule={(modId, score) => {
            handlePassQuiz(modId, score);
          }}
          onBackToCatalog={() => setActiveStudyModule(null)}
          onGoToMentoring={() => {
            setActiveStudyModule(null);
            setCurrentPage('mentoring');
          }}
          onShowToast={showToast}
        />
        <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#24213A] flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        isOpenMobile={isMobileSidebarOpen}
        unreadMessagesCount={unreadMessagesCount}
        profile={profile}
        walletBalance={walletBalance}
        isMentoringUnlocked={isMentoringUnlocked}
        onSelectPage={(page) => setCurrentPage(page)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={() => {
          setIsAuthenticated(false);
          showToast('Anda telah keluar dari akun Kawira.');
        }}
        onOpenTopUp={() => setShowTopUpModal(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-68 flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          profile={profile}
          walletBalance={walletBalance}
          notifications={notifications}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenTopUp={() => setShowTopUpModal(true)}
          onGoToProfile={() => setCurrentPage('profile')}
          onMarkNotificationRead={(id: string) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
          }}
        />

        {/* Page Views Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {currentPage === 'dashboard' && (
            <DashboardOverview
              profile={profile}
              mentors={mentors}
              bookings={bookings}
              transactions={transactions}
              isMentoringUnlocked={isMentoringUnlocked}
              completedModuleIds={completedModuleIds}
              onNavigate={(page) => setCurrentPage(page)}
              onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
              onBookMentorQuick={(mentor) => {
                setCurrentPage('mentoring');
              }}
            />
          )}

          {currentPage === 'mentoring' && (
            <MentoringHub
              mentors={mentors}
              bookings={bookings}
              walletBalance={walletBalance}
              userChallenge={profile.challenge}
              isMentoringUnlocked={isMentoringUnlocked}
              completedModuleIds={completedModuleIds}
              onBookMentor={handleBookMentor}
              onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
              onOpenTopUp={() => setShowTopUpModal(true)}
              onGoToModules={() => setCurrentPage('modules')}
              onUnlockDemo={handleUnlockDemo}
            />
          )}

          {currentPage === 'messages' && (
            <MessagesCenter
              bookings={bookings}
              mentors={mentors}
              onOpenChat={(bookingId) => setActiveChatBookingId(bookingId)}
              onBookMentor={(mentor) => setCurrentPage('mentoring')}
              onCompleteSession={handleCompleteSession}
              onReviewBooking={(bookingId) => setActiveChatBookingId(bookingId)}
            />
          )}

          {currentPage === 'bookkeeping' && (
            <Bookkeeping
              transactions={transactions}
              profile={profile}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onShowToast={showToast}
              onGoToProfile={() => setCurrentPage('profile')}
            />
          )}

          {currentPage === 'calculators' && (
            <BusinessCalculator
              onShowToast={showToast}
              onSetMentorTopic={(topic) => {
                setCurrentPage('mentoring');
                showToast('Topik kalkulasi disalin untuk diskusi mentor.');
              }}
            />
          )}

          {currentPage === 'modules' && (
            <ModulesCenter
              modules={modules}
              completedModuleIds={completedModuleIds}
              quizScores={quizScores}
              onPassQuiz={handlePassQuiz}
              onToggleCompleteModule={handleToggleCompleteModule}
              onShowToast={showToast}
              onGoToMentoring={() => setCurrentPage('mentoring')}
              onOpenStudy={(num) => setActiveStudyModule(num)}
            />
          )}

          {currentPage === 'community' && (
            <CommunityCenter
              events={communityEvents}
              collabs={collabs}
              onRegisterEvent={handleRegisterEvent}
              onAddCollab={handleAddCollab}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'portfolio' && (
            <PortfolioCenter
              profile={profile}
              transactions={transactions}
              bookings={bookings}
              completedModuleIds={completedModuleIds}
              totalModulesCount={modules.length}
              onGoToPage={(page) => setCurrentPage(page)}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileSettings
              profile={profile}
              walletBalance={walletBalance}
              walletLedger={walletLedger}
              onUpdateProfile={handleUpdateProfile}
              onOpenTopUp={() => setShowTopUpModal(true)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Interactive Chat Room Modal */}
      {activeChatBooking && (
        <ChatRoomModal
          booking={activeChatBooking}
          onClose={() => setActiveChatBookingId(null)}
          onSendMessage={handleSendMessage}
          onCompleteSession={handleCompleteSession}
          onSubmitReview={handleReviewBooking}
          onShareFinanceSnapshot={handleShareFinanceSnapshot}
        />
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <TopUpModal
          currentBalance={walletBalance}
          onClose={() => setShowTopUpModal(false)}
          onTopUp={handleTopUp}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
    </div>
  );
}
