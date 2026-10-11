import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Menu, 
  Clock, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Check, 
  RefreshCw,
  Info,
  Users,
  Star,
  FileSpreadsheet
} from 'lucide-react';
import { LearningModule } from '../types';

interface DetailModulStudyProps {
  moduleNumber: 1 | 2;
  completedModuleIds: string[];
  onCompleteModule: (moduleId: string, score: number) => void;
  onBackToCatalog: () => void;
  onGoToMentoring: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Netlify 5 quiz questions for Modul 1
const QUIZ_QUESTIONS_MODUL_1 = [
  {
    topic: 'DIMENSI ORIENTASI KEWIRAUSAHAAN',
    prompt: 'Seorang founder mahasiswa berani mengubah menu andalannya setelah menganalisis tren konsumsi makanan sehat di kampus, meskipun kompetitor belum melakukannya. Karakter ini mencerminkan dimensi...',
    options: [
      'A. Otonomi (Autonomy)',
      'B. Agresivitas Meniru (Mimicry Aggressiveness)',
      'C. Tindakan Proaktif & Inovasi (Proactiveness & Innovativeness)',
      'D. Penghindaran Risiko Absolut (Risk Avoidance)'
    ],
    answer: 2,
    explanation: 'Mengantisipasi peluang sebelum kompetitor dan berinovasi dengan menu baru mencerminkan tindakan proaktif dan inovatif.'
  },
  {
    topic: 'TAHAPAN EKSEKUSI USAHA',
    prompt: 'Dalam kerangka siklus Ready – Set – Start, fokus utama founder pada fase "READY" adalah...',
    options: [
      'A. Menyewa ruko fisik dengan kontrak 2 tahun',
      'B. Validasi problem-solution dan riset wawancara minimal 30 target konsumen',
      'C. Melakukan rekrutmen 10 orang karyawan operasional',
      'D. Mendaftarkan hak paten merek internasional'
    ],
    answer: 1,
    explanation: 'Fase READY fokus memvalidasi masalah nyata dan kebutuhan pasar sebelum alokasi modal besar.'
  },
  {
    topic: 'PROTEKSI ASET & BADAN HUKUM',
    prompt: 'Apa keunggulan hukum utama mendirikan "PT Perorangan" bagi mahasiswa dibanding menjalankan usaha perseorangan biasa tanpa badan hukum?',
    options: [
      'A. Bebas dari seluruh kewajiban membayar pajak selamanya',
      'B. Tidak memerlukan pencatatan laporan keuangan sama sekali',
      'C. Memisahkan kekayaan pribadi pendiri dari liabilitas utang perusahaan',
      'D. Wajib memiliki minimal 5 orang pemegang saham'
    ],
    answer: 2,
    explanation: 'Badan hukum PT Perorangan membatasi liabilitas sebatas modal disetor, melindungi laptop, motor, dan tabungan pribadi dari klaim kreditur.'
  },
  {
    topic: 'STRATEGI PERTUMBUHAN',
    prompt: 'Model ekspansi usaha yang mereplikasi format bisnis teruji dan standar SOP melalui kerja sama permodalan mitra disebut...',
    options: [
      'A. Waralaba / Franchising',
      'B. Joint Venture',
      'C. Acquihiring',
      'D. Merger Vertikal'
    ],
    answer: 0,
    explanation: 'Waralaba memperluas model bisnis teruji dan SOP terstandarisasi dengan modal dari mitra investor.'
  },
  {
    topic: 'ETIKA & TATA KELOLA KEUANGAN',
    prompt: 'Mengapa pemisahan rekening kas pribadi dengan kas operasional bisnis rintisan sangat krusial sejak hari pertama?',
    options: [
      'A. Agar bisnis terlihat besar di media sosial',
      'B. Mencegah ilusi keuntungan dan kebocoran modal yang mengancam cash runway',
      'C. Memenuhi syarat wajib pengajuan pinjaman bank besar',
      'D. Mengurangi biaya administrasi bank'
    ],
    answer: 1,
    explanation: 'Pemisahan kas mencegah bias keuntungan semu, memperjelas performa laba riil, dan menjaga ketahanan napas kas (cash runway).'
  }
];

// Netlify 5 quiz questions for Modul 2
const QUIZ_QUESTIONS_MODUL_2 = [
  {
    topic: 'RISET PASAR & EMPATHY MAPPING',
    prompt: 'Dalam kuadran Empathy Map, aspek "THINKS" berfokus pada menggali hal apa dari target konsumen?',
    options: [
      'A. Nominal uang cash di dompet',
      'B. Kekhawatiran terpendam, ekspektasi kualitas, dan keraguan sebelum memutuskan transaksi',
      'C. Merek smartphone yang digunakan saat scrolling media sosial',
      'D. Jumlah jam tidur konsumen di malam hari'
    ],
    answer: 1,
    explanation: 'Kuadran THINKS menggali pikiran dan kekhawatiran yang sering kali tidak diucapkan langsung oleh calon konsumen.'
  },
  {
    topic: 'CUSTOMER JOURNEY MAPPING',
    prompt: 'Pada fase "PURCHASE" dalam Customer Journey mahasiswa, titik gesekan (pain point) utama yang paling sering menyebabkan batal beli adalah...',
    options: [
      'A. Warna kemasan terlalu mencolok',
      'B. Proses checkout rumit dan ketiadaan metode bayar QRIS yang instan',
      'C. Terlalu banyak pilihan menu',
      'D. Jam buka toko terlalu pagi'
    ],
    answer: 1,
    explanation: 'Generasi Z menginginkan pembayaran minim hambatan; absennya opsi QRIS instan meningkatkan angka keranjang terbengkalai.'
  },
  {
    topic: 'PERILAKU KONSUMEN GEN Z',
    prompt: 'Strategi promosi visual "Visual-First & FOMO" paling efektif dieksekusi mahasiswa melalui kanal...',
    options: [
      'A. Brosur kertas fotokopi yang disebar di parkiran kampus',
      'B. Iklan baris di koran lokal cetak',
      'C. Konten video pendek autentik di TikTok / Instagram Reels yang memperlihatkan proses pembuatan & tekstur',
      'D. Mengirim email penawaran massal format PDF kaku'
    ],
    answer: 2,
    explanation: 'Gen Z merespons bukti visual dinamis, transparansi di balik layar, dan storytelling autentik dibanding brosur statis.'
  },
  {
    topic: 'VALIDASI PROBLEM-SOLUTION FIT',
    prompt: 'Sebelum meluncurkan menu baru skala penuh, indikator terbaik bahwa produk telah tervalidasi adalah...',
    options: [
      'A. Pujian dari keluarga terdekat',
      'B. Adanya konsumen yang bersedia membayar secara pre-order dan memberikan repeat order',
      'C. Jumlah likes tinggi pada postingan poster teaser',
      'D. Dukungan verbal dari teman satu kelas'
    ],
    answer: 1,
    explanation: 'Komitmen transaksi nyata (pre-order dan repeat order) adalah pembuktian tervalidasi paling objektif.'
  },
  {
    topic: 'RETENSI & ADVOKASI PELANGGAN',
    prompt: 'Cara terbaik mengubah pembeli satu kali menjadi pelanggan setia (advocate) yang merekomendasikan produk ke kawan sekampus adalah...',
    options: [
      'A. Memberikan garansi kepuasan, rasa konsisten, dan program loyalitas atau referral sederhana',
      'B. Terus menerus mengirim spam pesan promosi setiap pagi',
      'C. Menurunkan porsi produk secara diam-diam',
      'D. Mengabaikan kritik dan masukan rasa di kolom komentar'
    ],
    answer: 0,
    explanation: 'Kualitas konsisten dan apresiasi loyalitas menciptakan word-of-mouth alami di lingkungan kampus.'
  }
];

export const DetailModulStudy: React.FC<DetailModulStudyProps> = ({
  moduleNumber,
  completedModuleIds,
  onCompleteModule,
  onBackToCatalog,
  onGoToMentoring,
  onShowToast,
}) => {
  const moduleId = moduleNumber === 1 ? 'mod1' : 'mod2';
  const quizQuestions = moduleNumber === 1 ? QUIZ_QUESTIONS_MODUL_1 : QUIZ_QUESTIONS_MODUL_2;

  // Reading sub-bab panel state
  const initialPanel = moduleNumber === 1 ? 'subbab-1-1' : 'subbab-2-1';
  const [currentPanel, setCurrentPanel] = useState<string>(initialPanel);
  const [isOutlineCollapsed, setIsOutlineCollapsed] = useState(false);

  // Completion states per sub-bab
  const [readState, setReadState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`kawira_read_${moduleId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    if (moduleNumber === 1 && completedModuleIds.includes('mod1')) {
      return { 'subbab-1-1': true, 'subbab-1-2': true, 'subbab-1-3': true };
    }
    return { [initialPanel]: false };
  });

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(() => {
    if (moduleNumber === 1 && completedModuleIds.includes('mod1')) return 100;
    return null;
  });
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Sync readState to localStorage
  const saveReadState = (next: Record<string, boolean>) => {
    setReadState(next);
    try {
      localStorage.setItem(`kawira_read_${moduleId}`, JSON.stringify(next));
    } catch {}
  };

  const isCurrentSubbabRead = !!readState[currentPanel];

  // Calculate percentage
  const totalSubbabs = 3;
  const subbabKeys = moduleNumber === 1 
    ? ['subbab-1-1', 'subbab-1-2', 'subbab-1-3'] 
    : ['subbab-2-1', 'subbab-2-2', 'subbab-2-3'];
  const completedSubbabsCount = subbabKeys.filter((k) => readState[k]).length;
  const quizPassed = (quizScore !== null && quizScore >= 80) || completedModuleIds.includes(moduleId);
  
  const progressPercent = quizPassed 
    ? 100 
    : Math.round(((completedSubbabsCount + (quizPassed ? 1 : 0)) / (totalSubbabs + 1)) * 100);

  // Quiz is unlocked once all 3 sub-babs are marked read
  const isQuizUnlocked = subbabKeys.every((k) => readState[k]);

  // Handle Mark Selesai Dibaca Toggle
  const handleToggleRead = () => {
    const nextVal = !readState[currentPanel];
    const nextState = { ...readState, [currentPanel]: nextVal };
    saveReadState(nextState);
    if (nextVal) {
      onShowToast(`Sub-bab berhasil ditandai selesai dibaca.`);
    }
  };

  // Switch Sub-bab
  const handleSwitchPanel = (panelId: string) => {
    setCurrentPanel(panelId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next sub-bab navigation
  const handleNextSubbab = () => {
    const curIdx = subbabKeys.indexOf(currentPanel);
    if (curIdx >= 0 && curIdx < subbabKeys.length - 1) {
      handleSwitchPanel(subbabKeys[curIdx + 1]);
    } else {
      // Go to quiz
      handleSwitchPanel('quiz-evaluation');
    }
  };

  // Previous sub-bab navigation
  const handlePreviousSubbab = () => {
    if (currentPanel === 'quiz-evaluation') {
      handleSwitchPanel(subbabKeys[subbabKeys.length - 1]);
      return;
    }
    const curIdx = subbabKeys.indexOf(currentPanel);
    if (curIdx > 0) {
      handleSwitchPanel(subbabKeys[curIdx - 1]);
    } else {
      onBackToCatalog();
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(score);
    setShowResultDialog(true);

    if (score >= 80) {
      onCompleteModule(moduleId, score);
      onShowToast(`🎉 Selamat! Kamu lulus kuis dengan skor ${score}%.`);
    } else {
      onShowToast(`Skor kamu ${score}%. Minimal kelulusan 80%. Silakan tinjau pembahasan dan ulangi.`, 'error');
    }
  };

  // Retry quiz
  const handleRetryQuiz = () => {
    setSelectedAnswers(Array(5).fill(null));
    setCurrentQuestionIndex(0);
    setReviewMode(false);
    setShowResultDialog(false);
    setQuizScore(null);
  };

  // Check if both mod1 and mod2 are now complete
  const allPrereqsMet = completedModuleIds.includes('mod1') && (moduleId === 'mod2' && quizPassed);

  return (
    <div className="study-dashboard-layout bg-[#F8F7FC] min-h-screen text-[#24213A] pb-24">
      {/* Top Header Bar */}
      <header className="study-topbar sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E6F0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <button
          onClick={onBackToCatalog}
          className="study-back-link flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5838E8] hover:text-[#4724C4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Modul
        </button>

        <div className="study-topbar-right flex items-center gap-3">
          <span className="study-course-label text-xs font-black tracking-wider text-slate-400 uppercase hidden sm:inline">
            MODUL {moduleNumber} <span className="text-slate-300">/</span> {moduleNumber === 1 ? 'PENGANTAR BISNIS' : 'RISET PASAR'}
          </span>
          <button
            onClick={() => setIsOutlineCollapsed(!isOutlineCollapsed)}
            className="study-outline-toggle p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Buka / Tutup Daftar Sub-Bab"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Study Container: Sidebar + Article */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Outline Sidebar (Col 4) */}
          <aside className={`${isOutlineCollapsed ? 'hidden lg:hidden' : 'lg:col-span-4'} space-y-6 sticky top-24`}>
            <div className="study-outline-panel bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E6F0] shadow-xs">
              
              {/* Progress Header */}
              <div className="study-outline-progress-heading flex items-center justify-between text-xs font-extrabold mb-2">
                <span className="text-[#6C4CF5] uppercase tracking-wider">
                  MODUL {moduleNumber}: {moduleNumber === 1 ? 'PENGANTAR BISNIS' : 'RISET PASAR'}
                </span>
                <strong className="text-slate-700">{progressPercent}% Selesai</strong>
              </div>

              {/* Progress Bar */}
              <div className="study-progress-track h-2 bg-[#E9E4F3] rounded-full overflow-hidden mb-5">
                <div 
                  className="h-full bg-gradient-to-r from-[#6C4CF5] to-[#C6F135] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <h2 className="text-base font-black text-[#24213A] leading-snug">
                {moduleNumber === 1 
                  ? 'Mengenal Dasar-Dasar Dunia Bisnis' 
                  : 'Validasi Pasar & Psikologi Konsumen Gen Z'}
              </h2>
              <p className="study-outline-intro text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
                {moduleNumber === 1
                  ? 'Fondasi orientasi kewirausahaan, siklus pembentukan, dan legalitas usaha mahasiswa.'
                  : 'Metode riset konsumen, peta empati, dan strategi produk ramah anak muda.'}
              </p>

              {/* Navigation Lesson List */}
              <nav className="study-lesson-list space-y-2.5">
                {moduleNumber === 1 ? (
                  <>
                    <button
                      onClick={() => handleSwitchPanel('subbab-1-1')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-1-1'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-1-1'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-1-1' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-1-1'] ? '✓ SELESAI' : currentPanel === 'subbab-1-1' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">12 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        1.1 Kewirausahaan & Pembentukan Entitas Bisnis
                      </span>
                    </button>

                    <button
                      onClick={() => handleSwitchPanel('subbab-1-2')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-1-2'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-1-2'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-1-2' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-1-2'] ? '✓ SELESAI' : currentPanel === 'subbab-1-2' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">15 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        1.2 Strategi Pemasaran & Penetrasi Pasar Global
                      </span>
                    </button>

                    <button
                      onClick={() => handleSwitchPanel('subbab-1-3')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-1-3'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-1-3'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-1-3' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-1-3'] ? '✓ SELESAI' : currentPanel === 'subbab-1-3' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">14 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        1.3 Akuntansi, Pelaporan, dan Manajemen Keuangan
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSwitchPanel('subbab-2-1')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-2-1'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-2-1'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-2-1' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-2-1'] ? '✓ SELESAI' : currentPanel === 'subbab-2-1' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">12 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        2.1 Riset Pasar & Validasi Kebutuhan (Problem-Solution Fit)
                      </span>
                    </button>

                    <button
                      onClick={() => handleSwitchPanel('subbab-2-2')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-2-2'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-2-2'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-2-2' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-2-2'] ? '✓ SELESAI' : currentPanel === 'subbab-2-2' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">15 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        2.2 Empathy Mapping & Perjalanan Konsumen 5 Fase
                      </span>
                    </button>

                    <button
                      onClick={() => handleSwitchPanel('subbab-2-3')}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        currentPanel === 'subbab-2-3'
                          ? 'border-[#6C4CF5] bg-[#FAF8FF] shadow-xs ring-1 ring-[#6C4CF5]/20'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          readState['subbab-2-3'] 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : currentPanel === 'subbab-2-3' 
                            ? 'bg-purple-100 text-[#6C4CF5]' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {readState['subbab-2-3'] ? '✓ SELESAI' : currentPanel === 'subbab-2-3' ? 'SEDANG DIBACA' : 'BELUM DIBACA'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">14 Menit</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        2.3 Menaklukkan Pasar Gen Z & Checklist Audit Layanan
                      </span>
                    </button>
                  </>
                )}

                {/* Kuis Evaluasi Outline Button */}
                <button
                  onClick={() => handleSwitchPanel('quiz-evaluation')}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    currentPanel === 'quiz-evaluation'
                      ? 'border-[#6C4CF5] bg-[#FAF8FF] ring-1 ring-[#6C4CF5]/20 shadow-xs'
                      : isQuizUnlocked
                      ? 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                      : 'border-slate-100 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      quizPassed 
                        ? 'bg-emerald-500 text-white' 
                        : isQuizUnlocked 
                        ? 'bg-[#6C4CF5] text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {quizPassed ? '✓' : isQuizUnlocked ? '?' : <Lock className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <strong className="text-xs font-extrabold text-slate-800 block">
                        Kuis Evaluasi Modul {moduleNumber}
                      </strong>
                      <small className="text-[11px] font-semibold text-slate-500">
                        {quizPassed
                          ? '✓ Lulus · Kuis selesai'
                          : isQuizUnlocked
                          ? 'Standar 80% · Siap Dimulai'
                          : 'Standar 80% · Terkunci'}
                      </small>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-400">
                    {quizPassed ? '✓' : isQuizUnlocked ? '→' : '▣'}
                  </span>
                </button>
              </nav>

              {/* Peer social proof footer */}
              <div className="study-peers flex items-center gap-3 pt-4 border-t border-slate-100 mt-5">
                <div className="study-peer-avatars flex -space-x-1.5">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-[#6C4CF5] font-black text-[10px] flex items-center justify-center border-2 border-white">
                    FA
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#C6F135] text-[#24213A] font-black text-[10px] flex items-center justify-center border-2 border-white">
                    BP
                  </span>
                  <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 font-black text-[10px] flex items-center justify-center border-2 border-white">
                    SN
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  <strong className="text-slate-800 font-bold">52 Rekan Mahasiswa</strong> telah menuntaskan materi ini.
                </p>
              </div>

            </div>
          </aside>

          {/* Main Reading / Quiz Article (Col 8) */}
          <main className={isOutlineCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'}>
            
            {/* -------------------- SUB-BAB 1.1 -------------------- */}
            {moduleNumber === 1 && currentPanel === 'subbab-1-1' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 12 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Orientasi Entitas Bisnis
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    Kewirausahaan & Pembentukan Entitas Bisnis: Dari Siklus Eksekusi hingga Badan Hukum
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Membedah esensi pola pikir wirausaha, tahapan validasi operasional Ready-Set-Start, pemilihan bentuk kepemilikan bisnis, serta opsi ekspansi modern bagi founder mahasiswa.
                  </p>
                </header>

                {/* Section 01 */}
                <section className="study-section space-y-4">
                  <div className="study-section-heading flex items-start gap-3">
                    <span className="study-section-number w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      01
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        1.1 Kewirausahaan & Pembentukan Entitas Bisnis
                      </h2>
                      <p className="text-xs text-slate-400">
                        Fundamental & Orientasi Kewirausahaan (Entrepreneurial Orientation) · Wibowo & Narmaditya (2022); Felix (2021); Lumpkin & Dess
                      </p>
                    </div>
                  </div>

                  <blockquote className="study-quote p-4 sm:p-5 rounded-2xl bg-purple-50/70 border-l-4 border-[#6C4CF5] text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    “Orientasi kewirausahaan—yang dioperasionalisasikan melalui inovasi terarah, inisiatif proaktif, dan keberanian mengambil risiko terukur—merupakan penentu utama resiliensi usaha mahasiswa dalam mengonversi gagasan menjadi entitas bisnis mandiri yang berdaya saing.”
                  </blockquote>

                  {/* 5 Dimension Cards */}
                  <div className="study-dimension-grid grid sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">
                        ★
                      </div>
                      <h3 className="text-xs font-extrabold text-[#5838E8]">
                        1. Inovasi <small className="text-slate-400 font-semibold block">(Innovativeness)</small>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kreativitas dan pembaruan solusi produk maupun teknologi untuk menjawab kebutuhan pelanggan.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">
                        ▲
                      </div>
                      <h3 className="text-xs font-extrabold text-[#5838E8]">
                        2. Tindakan Proaktif <small className="text-slate-400 font-semibold block">(Proactiveness)</small>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kecepatan menangkap peluang pasar sebelum kompetitor bergerak mendahului.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">
                        ✓
                      </div>
                      <h3 className="text-xs font-extrabold text-[#5838E8]">
                        3. Pengambilan Risiko Terukur
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Komitmen alokasi modal dengan mitigasi risiko yang berpijak pada data riil lapangan.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">
                        →
                      </div>
                      <h3 className="text-xs font-extrabold text-[#5838E8]">
                        4. Agresivitas Kompetitif
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Keunggulan diferensiasi nilai dan strategi penetrasi pasar yang tepat sasaran.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white sm:col-span-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">
                        👥
                      </div>
                      <h3 className="text-xs font-extrabold text-[#5838E8]">
                        5. Otonomi Keputusan <small className="text-slate-400 font-semibold block">(Autonomy)</small>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kemandirian tim pendiri memegang kendali visi bisnis tanpa terhalang birokrasi kaku kampus.
                      </p>
                    </div>
                  </div>

                  {/* Insight Praktik callout */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-900 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      i
                    </span>
                    <p>
                      <strong>Insight Praktik:</strong> Karakter wirausaha bukanlah bakat lahir semata, melainkan kompetensi dinamis (resiliensi & ambidexterity) yang dilatih lewat aksi nyata dan evaluasi berkala.
                    </p>
                  </div>
                </section>

                {/* Section 02 */}
                <section className="study-section space-y-4 pt-4 border-t border-slate-100">
                  <div className="study-section-heading flex items-start gap-3">
                    <span className="study-section-number w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      02
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Tahapan Eksekusi Usaha: Siklus Ready – Set – Start
                      </h2>
                      <p className="text-xs text-slate-400">
                        Kerangka eksekusi bertahap · Nasution et al.; Alhassan et al.
                      </p>
                    </div>
                  </div>

                  {/* Benchmark radar card */}
                  <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] font-black tracking-wider text-[#6C4CF5] uppercase">
                        EO BENCHMARK
                      </span>
                      <h3 className="text-base font-black text-slate-800 mt-0.5">Skor Kesiapan Tim</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                        Profil kesiapan founder mahasiswa untuk mengeksekusi dan mengembangkan gagasan bisnis secara mandiri.
                      </p>
                      <div className="mt-3">
                        <strong className="text-3xl font-black text-[#5838E8]">80 <small className="text-sm font-bold text-slate-400">/ 100</small></strong>
                      </div>
                    </div>

                    {/* Radar SVG */}
                    <div className="w-56 h-40 flex items-center justify-center">
                      <svg viewBox="0 0 240 210" className="w-full h-full">
                        <polygon points="120,20 204,81 172,180 68,180 36,81" fill="none" stroke="#E3DEEC" strokeWidth="1" />
                        <polygon points="120,45 183,91 159,165 81,165 57,91" fill="none" stroke="#E3DEEC" strokeWidth="1" />
                        <polygon points="120,70 162,101 146,150 94,150 78,101" fill="none" stroke="#E3DEEC" strokeWidth="1" />
                        <path d="M120 20v160M36 81l136 99M204 81 68 180M36 81h168" fill="none" stroke="#E7E3ED" strokeWidth="1" />
                        <polygon points="120,52 178,96 146,151 83,154 59,96" fill="rgba(108, 76, 245, 0.2)" stroke="#6C4CF5" strokeWidth="2" />
                        <circle cx="120" cy="52" r="3" fill="#FFF" stroke="#6C4CF5" strokeWidth="2" />
                        <circle cx="178" cy="96" r="3" fill="#FFF" stroke="#6C4CF5" strokeWidth="2" />
                        <circle cx="146" cy="151" r="3" fill="#FFF" stroke="#6C4CF5" strokeWidth="2" />
                        <circle cx="83" cy="154" r="3" fill="#FFF" stroke="#6C4CF5" strokeWidth="2" />
                        <circle cx="59" cy="96" r="3" fill="#FFF" stroke="#6C4CF5" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* 3 Phase Cards */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border-t-4 border-amber-400 bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                        FASE 1 · READY
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 mt-1">Riset & Validasi</h4>
                      <ul className="text-[11px] text-slate-500 mt-2 space-y-1 list-disc list-inside leading-relaxed">
                        <li>Wawancara 30 target konsumen</li>
                        <li>Uji MVP melalui sistem pre-order</li>
                        <li>Output: BMC tervalidasi pasar</li>
                      </ul>
                      <span className="block mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
                        Benchmark: 2–4 Minggu
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border-t-4 border-[#6C4CF5] bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase tracking-wider">
                        FASE 2 · SET
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 mt-1">Fondasi & Penataan</h4>
                      <ul className="text-[11px] text-slate-500 mt-2 space-y-1 list-disc list-inside leading-relaxed">
                        <li>Founders' Agreement & vesting</li>
                        <li>NIB via OSS dan rekening bisnis</li>
                        <li>Susun SOP baku operasional</li>
                      </ul>
                      <span className="block mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-[#6C4CF5]">
                        Titik kritis: Perizinan OSS beres
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border-t-4 border-emerald-500 bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                        FASE 3 · START
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-800 mt-1">Peluncuran & Scale</h4>
                      <ul className="text-[11px] text-slate-500 mt-2 space-y-1 list-disc list-inside leading-relaxed">
                        <li>Go-To-Market multichannel</li>
                        <li>Cash Flow Watch: jaga runway & HPP</li>
                        <li>Pantau metrik repeat order harian</li>
                      </ul>
                      <span className="block mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-600">
                        Target: Positive Unit Margin
                      </span>
                    </div>
                  </div>
                </section>

                {/* Section 03 */}
                <section className="study-section space-y-4 pt-4 border-t border-slate-100">
                  <div className="study-section-heading flex items-start gap-3">
                    <span className="study-section-number w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      03
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Bentuk Kepemilikan Bisnis & Proteksi Aset Pribadi
                      </h2>
                      <p className="text-xs text-slate-400">
                        Rujukan: UU Cipta Kerja; Anie (2022); Ahmad & Fakih
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-200/60 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#5838E8] text-white flex items-center justify-center font-bold text-xs">
                          ⬟
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                            Prinsip Proteksi Kekayaan Pribadi vs Liabilitas Bisnis
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Perbandingan dampak hukum bagi founder mahasiswa saat terjadi wanprestasi atau kendala finansial.
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#C6F135] text-[#24213A] text-[10px] font-black uppercase">
                        Solusi UU Cipta Kerja
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Tanpa Badan Hukum */}
                      <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs font-black text-red-800">
                            △ Tanpa Badan Hukum (Perseorangan / CV)
                          </strong>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-200 text-red-900">
                            Risiko Sangat Tinggi
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-red-100 text-xs text-slate-600 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold block">
                            Tabungan Mahasiswa & Aset Pribadi:
                          </span>
                          <strong className="text-sm font-black text-red-600 block">TERANCAM DISITA</strong>
                          <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-full" />
                          </div>
                          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                            Bila usaha berutang Rp 50 juta dan kas habis, kreditur <strong>berhak secara hukum menyita laptop, motor, dan tabungan pribadi</strong> founder.
                          </p>
                        </div>
                      </div>

                      {/* PT Perorangan */}
                      <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xs font-black text-[#5838E8]">
                            ✦ PT Perorangan (Badan Hukum)
                          </strong>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#C6F135] text-[#24213A]">
                            Tembok Proteksi Hukum
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-purple-100 text-xs text-slate-600 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold block">
                            Tabungan Mahasiswa & Aset Pribadi:
                          </span>
                          <strong className="text-sm font-black text-emerald-600 block">100% AMAN TERPISAH</strong>
                          <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                          </div>
                          <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                            Liabilitas kerugian dibatasi <strong>hanya sebatas modal disetor perusahaan</strong>. Kekayaan pribadi founder kampus tidak dapat disentuh pihak ketiga.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 04 */}
                <section className="study-section space-y-4 pt-4 border-t border-slate-100">
                  <div className="study-section-heading flex items-start gap-3">
                    <span className="study-section-number w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      04
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Opsi Ekspansi Usaha & Alternatif Pertumbuhan
                      </h2>
                      <p className="text-xs text-slate-400">
                        Rujukan strategi skala: Ahsan et al.; Al-Tabbaa & Zahoor
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5]">01</span>
                      <h4 className="text-xs font-black text-slate-800 mt-1">Waralaba <small className="text-slate-400 block font-normal">(Franchising)</small></h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Replikasi model teruji dan SOP standar melalui modal mitra investor.
                      </p>
                      <span className="block mt-2 text-[10px] text-slate-400 font-semibold">Contoh: booth minuman</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5]">02</span>
                      <h4 className="text-xs font-black text-slate-800 mt-1">Koperasi Mahasiswa</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Skalasi berbasis solidaritas dan pengadaan bahan baku grosir bersama.
                      </p>
                      <span className="block mt-2 text-[10px] text-slate-400 font-semibold">Kolaborasi komunitas</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5]">03</span>
                      <h4 className="text-xs font-black text-slate-800 mt-1">Aliansi Strategis</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kolaborasi efisiensi capex antar brand lokal untuk memperluas jangkauan.
                      </p>
                      <span className="block mt-2 text-[10px] text-slate-400 font-semibold">Berbagi outlet / booth</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5]">04</span>
                      <h4 className="text-xs font-black text-slate-800 mt-1">Acquihiring</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Integrasi tim inovator berkinerja tinggi untuk memperkuat daya saing usaha.
                      </p>
                      <span className="block mt-2 text-[10px] text-slate-400 font-semibold">Ekspansi kapabilitas</span>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- SUB-BAB 1.2 -------------------- */}
            {moduleNumber === 1 && currentPanel === 'subbab-1-2' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 15 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Marketing & Go-To-Market
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    1.2 Strategi Pemasaran Terpadu: Dari Validasi Pasar Lokal Menuju Penetrasi Global
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Membangun positioning brand mahasiswa yang kokoh, matriks saluran pemasaran digital, dan strategi penetrasi segmen pasar bertahap.
                  </p>
                </header>

                <section className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      A
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Matriks Segmenting, Targeting, & Positioning (STP) Mahasiswa
                      </h2>
                      <p className="text-xs text-slate-400">
                        Temukan segmen yang tepat dan bangun alasan kuat agar pelanggan memilih brand-mu.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">01 · SEGMENTASI</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Pilah Perilaku Pasar</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kelompokkan pasar berdasarkan perilaku belanja digital Gen Z, kebutuhan, minat, dan kebiasaan menemukan produk.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">02 · TARGETING</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Pilih Early Adopter</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Tentukan early adopter di ekosistem kampus atau komunitas yang paling terbuka mencoba solusi baru.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">03 · POSITIONING</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Tegaskan Diferensiasi</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Bangun positioning jelas: “Produk Lokal Kualitas Premium, Porsi Memuaskan, Harga Mahasiswa”.
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- SUB-BAB 1.3 -------------------- */}
            {moduleNumber === 1 && currentPanel === 'subbab-1-3' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 14 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Literasi Finansial
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    1.3 Akuntansi Praktis, Arus Kas, dan Tata Kelola Finansial Startup Mahasiswa
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Penyusunan laporan laba-rugi sederhana, menjaga ketahanan kas (runway), dan integrasi pembukuan digital tanpa beban akuntansi rumit.
                  </p>
                </header>

                {/* 3 Pilar Finansial */}
                <section className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      A
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        3 Pilar Utama Laporan Keuangan Rintisan
                      </h2>
                      <p className="text-xs text-slate-400">
                        Catatan sederhana memberi gambaran kesehatan usaha dan dasar keputusan yang objektif.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">01 · LIKUIDITAS</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Arus Kas (Cash Flow)</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Urat nadi operasional harian: pantau perputaran kas masuk harian dibandingkan pengeluaran riil.
                      </p>
                      <strong className="block mt-2 text-[11px] text-emerald-600 font-bold">Kas Masuk ↔ Kas Keluar</strong>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">02 · PROFITABILITAS</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Laba Rugi (P&L)</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Ukur profitabilitas riil setelah seluruh beban operasional dan HPP diperhitungkan dengan cermat.
                      </p>
                      <strong className="block mt-2 text-[11px] text-[#5838E8] font-bold">Pendapatan − Beban = Laba</strong>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">03 · POSISI USAHA</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Neraca Sederhana</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Petakan aset usaha, utang lancar, dan modal pemilik pada satu periode penutupan buku.
                      </p>
                      <strong className="block mt-2 text-[11px] text-amber-600 font-bold">Aset = Liabilitas + Ekuitas</strong>
                    </div>
                  </div>

                  {/* Cash Runway Formula Card */}
                  <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 mt-4 space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#6C4CF5] tracking-wider">
                      FORMULA CASH RUNWAY MAHASISWA
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Cash Runway = Total Saldo Kas Tersedia ÷ Rata-rata Burn Rate Bersih per Bulan
                    </p>
                    <div className="p-3.5 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Contoh Kasus Toko Kuliner:</span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Kas sisa <strong>Rp 12.000.000</strong> · Pengeluaran minus pemasukan <strong>Rp 3.000.000 / bln</strong>
                        </p>
                      </div>
                      <div className="text-right">
                        <strong className="text-2xl font-black text-[#5838E8]">4</strong>
                        <span className="block text-[10px] font-bold text-slate-500">BULAN RUNWAY</span>
                      </div>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- SUB-BAB 2.1 (MODUL 2) -------------------- */}
            {moduleNumber === 2 && currentPanel === 'subbab-2-1' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 12 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Riset Pasar & Validasi
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    2.1 Riset Pasar & Validasi Kebutuhan (Problem-Solution Fit)
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Menghindari jebakan asumsi pribadi dengan menguji kelayakan ide, wawancara mendalam 30 calon pembeli, dan mengonfirmasi kesediaan membayar (willingness to pay).
                  </p>
                </header>

                <section className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      A
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        4 Langkah Validasi Masalah Konsumen
                      </h2>
                      <p className="text-xs text-slate-400">
                        Prinsip The Mom Test: tanyakan perilaku masa lalu konsumen, bukan opini spekulatif.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">01</span>
                      <h4 className="text-xs font-bold text-slate-800">Definisikan Hipotesis Masalah</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Tentukan masalah spesifik yang kamu duga dihadapi mahasiswa kampus.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">02</span>
                      <h4 className="text-xs font-bold text-slate-800">Wawancara Terbuka</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Gali pengalaman buruk yang pernah mereka alami saat membeli produk serupa.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">03</span>
                      <h4 className="text-xs font-bold text-slate-800">Uji MVP & Pre-Order</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Minta komitmen uang muka atau pre-order nyata sebelum produksi massal.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4CF5] flex items-center justify-center font-bold text-xs mb-2">04</span>
                      <h4 className="text-xs font-bold text-slate-800">Analisis Feedback</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Perbaiki resep/solusi berdasarkan keluhan nyata konsumen batch perdana.
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- SUB-BAB 2.2 (MODUL 2) -------------------- */}
            {moduleNumber === 2 && currentPanel === 'subbab-2-2' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 15 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      User Experience & Mapping
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    2.2 Empathy Mapping & Perjalanan Konsumen 5 Fase
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Menyatukan sinyal ucapan, pikiran, tindakan, dan emosi konsumen dalam kuadran empati untuk merancang pengalaman minim friksi.
                  </p>
                </header>

                <section className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0">
                      A
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Kuadran Empathy Map Konsumen Mahasiswa
                      </h2>
                      <p className="text-xs text-slate-400">
                        Petakan apa yang dilihat, didengar, diucapkan, dan dirasakan calon pembelimu.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-xl border-t-4 border-amber-400 bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-amber-600 uppercase">SAYS · UCAPAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Apa yang diucapkan?</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Pernyataan publik konsumen: “Aku ingin pesan makan siang yang praktis tanpa harus antre lama di kantin kampus.”
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border-t-4 border-[#6C4CF5] bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">THINKS · PIKIRAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Apa yang dipikirkan?</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Kekhawatiran terpendam: “Apakah higienis? Apakah porsinya cukup kenyang untuk belajar sampai sore?”
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border-t-4 border-emerald-500 bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">DOES · TINDAKAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Apa yang dilakukan?</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Aksi yang terlihat: Membandingkan harga di ShopeeFood/GoFood dan membaca ulasan sebelum melakukan checkout.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border-t-4 border-pink-500 bg-white border border-slate-200/80">
                      <span className="text-[10px] font-black text-pink-600 uppercase">FEELS · PERASAAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Apa yang dirasakan?</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Emosi konsumen: Frustrasi jika pengiriman telat saat jam istirahat mepet, lega setelah perut kenyang tepat waktu.
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- SUB-BAB 2.3 (MODUL 2) -------------------- */}
            {moduleNumber === 2 && currentPanel === 'subbab-2-3' && (
              <article className="study-article bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-8 animate-in fade-in duration-200">
                <header className="study-article-header pb-6 border-b border-slate-100">
                  <div className="study-article-tags flex flex-wrap items-center gap-2 mb-3">
                    <span className="study-time-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold">
                      <Clock className="w-3.5 h-3.5" /> 14 Menit Estimasi Baca
                    </span>
                    <span className="study-topic-tag inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Tren & Psikologi Konsumen
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A] tracking-tight leading-snug">
                    2.3 Menaklukkan Pasar Generasi Z: Pola Konsumsi Spontan & Frictionless Service
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Menganalisis kebiasaan beli mahasiswa dan Gen Z di era media sosial, pembayaran QRIS, dan ekspektasi layanan tanpa hambatan.
                  </p>
                </header>

                <section className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-amber-600 uppercase">01 · VISUAL & FOMO</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Visual-First Decision</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Keputusan beli dipicu bukti visual menarik di TikTok & Instagram Reels: suara crunch, lelehan keju, porsi melimpah.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase">02 · TRANSAKSI INSTAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Frictionless QRIS</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Konsumen muda menghindari uang kembalian tunai; sediakan QRIS statis di meja/booth untuk transaksi 3 detik.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/80 bg-white">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">03 · KEPERCAYAAN</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Otentisitas & Review</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Gen Z lebih percaya review jujur kawan sebaya (UGC) dibanding iklan berbayar yang terasa kaku.
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            )}

            {/* -------------------- KUIS EVALUASI PANEL -------------------- */}
            {currentPanel === 'quiz-evaluation' && (
              <section className="study-panel bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E6F0] shadow-sm space-y-6 animate-in fade-in duration-200">
                <header className="pb-5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-[#FFF199] text-[#7A5A00] text-[11px] font-extrabold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 10 Menit
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-[#6C4CF5] text-[11px] font-extrabold">
                      Evaluasi Modul {moduleNumber}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24213A]">
                    Kuis Evaluasi: {moduleNumber === 1 ? 'Pengantar Bisnis & Entitas Usaha' : 'Validasi Riset Pasar & Konsumen'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    5 Soal Pilihan Ganda · Standar Kelulusan 80% (Min. Benar 4 Soal) · Syarat Membuka Mentoring
                  </p>
                </header>

                {/* If Quiz is Locked */}
                {!isQuizUnlocked ? (
                  <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black text-base flex-shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-sm font-black text-amber-900 block">Kuis Masih Terkunci</strong>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                          Tandai semua sub-bab pelajaran selesai dibaca terlebih dahulu untuk membuka lembar evaluasi ini.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSwitchPanel(subbabKeys[0])}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
                    >
                      Buka Sub-bab {moduleNumber === 1 ? '1.1' : '2.1'} Sekarang
                    </button>
                  </div>
                ) : (
                  /* Quiz Flow */
                  <div className="space-y-6">
                    {/* Progress Bar & Counter */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold text-slate-600">
                        Pertanyaan {currentQuestionIndex + 1} dari {quizQuestions.length}
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6C4CF5] transition-all duration-300 rounded-full"
                          style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="p-6 sm:p-7 rounded-2xl bg-[#FAF9FF] border border-purple-100">
                      <span className="text-[10px] font-black text-[#6C4CF5] uppercase tracking-wider block mb-2">
                        {quizQuestions[currentQuestionIndex].topic}
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed mb-5">
                        {quizQuestions[currentQuestionIndex].prompt}
                      </h2>

                      {/* Options List */}
                      <div className="space-y-2.5">
                        {quizQuestions[currentQuestionIndex].options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                          const isCorrect = reviewMode && optIdx === quizQuestions[currentQuestionIndex].answer;
                          const isWrong = reviewMode && isSelected && !isCorrect;

                          return (
                            <label
                              key={optIdx}
                              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                                isCorrect
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                                  : isWrong
                                  ? 'border-red-400 bg-red-50 text-red-900 ring-1 ring-red-400'
                                  : isSelected
                                  ? 'border-[#6C4CF5] bg-purple-50 text-[#5838E8] ring-1 ring-[#6C4CF5]'
                                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${currentQuestionIndex}`}
                                checked={isSelected}
                                disabled={reviewMode}
                                onChange={() => {
                                  const updated = [...selectedAnswers];
                                  updated[currentQuestionIndex] = optIdx;
                                  setSelectedAnswers(updated);
                                }}
                                className="mt-0.5 accent-[#6C4CF5]"
                              />
                              <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                                {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Review mode explanation */}
                      {reviewMode && (
                        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-500 text-xs text-emerald-900 leading-relaxed">
                          <strong>Pembahasan:</strong> {quizQuestions[currentQuestionIndex].explanation}
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        ← Sebelumnya
                      </button>

                      {currentQuestionIndex < quizQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          disabled={selectedAnswers[currentQuestionIndex] === null}
                          className="px-6 py-2.5 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold shadow-md shadow-[#6C4CF5]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Selanjutnya →
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={selectedAnswers.some((a) => a === null)}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4CF5] to-[#5838E8] hover:opacity-95 text-white text-xs font-black shadow-lg shadow-[#6C4CF5]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Kirim Jawaban & Lihat Skor
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

          </main>
        </div>
      </div>

      {/* Sticky Bottom Footer for reading progress & navigation */}
      {currentPanel !== 'quiz-evaluation' && (
        <footer className="study-sticky-footer fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E6F0] px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
          <button
            onClick={handlePreviousSubbab}
            className="study-footer-previous text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Kembali
          </button>

          {/* Mark Selesai Dibaca Toggle Checkbox */}
          <label className="study-read-toggle flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCurrentSubbabRead}
              onChange={handleToggleRead}
              className="w-4 h-4 rounded text-[#6C4CF5] accent-[#6C4CF5] cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">
              Tandai Selesai Dibaca <b className={`ml-1 ${isCurrentSubbabRead ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isCurrentSubbabRead ? '✓' : '○'}
              </b>
            </span>
          </label>

          <button
            onClick={handleNextSubbab}
            disabled={!isCurrentSubbabRead}
            className="study-footer-next px-5 py-2.5 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-black shadow-md shadow-[#6C4CF5]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            Lanjutkan Materi <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </footer>
      )}

      {/* Success / Result Dialog Modal */}
      {showResultDialog && quizScore !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-5">
            <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-lg ${
              quizScore >= 80 ? 'bg-[#C6F135] text-[#24213A]' : 'bg-red-100 text-red-600'
            }`}>
              {quizScore >= 80 ? '🏆' : '⚠️'}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#24213A]">
                {quizScore >= 80
                  ? `Selamat! Kamu Telah Menuntaskan Modul ${moduleNumber}`
                  : `Kuis Belum Mencapai Syarat Lulus (80%)`}
              </h2>
              <strong className={`block text-2xl font-black mt-2 ${
                quizScore >= 80 ? 'text-[#5838E8]' : 'text-red-500'
              }`}>
                Skor: {quizScore} / 100 {quizScore >= 80 ? '— LULUS' : '— BELUM LULUS'}
              </strong>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {quizScore >= 80
                  ? 'Pemahaman fondasimu siap diterapkan ke praktik usaha nyata dan portofolio.'
                  : 'Minimal kelulusan adalah 80% (4 soal benar). Tinjau pembahasan soal untuk memahami konsep yang keliru.'}
              </p>
            </div>

            {/* Highlight: If both Modul 1 and Modul 2 are complete, unlocking mentoring! */}
            {quizScore >= 80 && (completedModuleIds.includes('mod1') || moduleId === 'mod1') && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-lime-50 to-pink-50 border border-purple-200 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#5838E8]" />
                  <strong className="text-xs font-black text-[#5838E8]">
                    {moduleNumber === 1 
                      ? 'Langkah Selanjutnya: Lanjutkan Modul 2 untuk Buka Mentoring' 
                      : '🎉 SESI MENTORING SEBAYA SEKARANG TELAH TERBUKA!'}
                  </strong>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {moduleNumber === 1
                    ? 'Setelah menuntaskan Modul 2 (Riset Pasar & Konsumen), seluruh fitur konsultasi 1-on-1 dengan mentor praktisi akan aktif otomatis.'
                    : 'Seluruh persyaratan kelulusan modul dan kuis telah terpenuhi. Kamu sekarang dapat memilih mentor, menjadwalkan sesi bimbingan, dan konsultasi privat!'}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              {moduleNumber === 2 && quizScore >= 80 ? (
                <button
                  onClick={() => {
                    setShowResultDialog(false);
                    onGoToMentoring();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C4CF5] to-[#5838E8] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#6C4CF5]/30 flex items-center justify-center gap-2"
                >
                  Buka Sesi Mentoring 1-on-1 Sekarang <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowResultDialog(false);
                    onBackToCatalog();
                  }}
                  className="w-full py-3 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white font-black text-xs sm:text-sm shadow-md shadow-[#6C4CF5]/20"
                >
                  Kembali ke Katalog Modul
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowResultDialog(false);
                    setReviewMode(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Tinjau Pembahasan Kuis
                </button>

                {quizScore < 80 && (
                  <button
                    onClick={handleRetryQuiz}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    Ulangi Kuis
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
