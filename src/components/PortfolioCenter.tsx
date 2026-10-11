import React from 'react';
import { 
  Award, 
  Download, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile, Transaction, Booking, LearningModule } from '../types';

interface PortfolioCenterProps {
  profile: UserProfile;
  transactions: Transaction[];
  bookings: Booking[];
  completedModuleIds: string[];
  totalModulesCount: number;
  onGoToPage: (page: any) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const PortfolioCenter: React.FC<PortfolioCenterProps> = ({
  profile,
  transactions,
  bookings,
  completedModuleIds,
  totalModulesCount,
  onGoToPage,
  onShowToast,
}) => {
  // Financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'in')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const completedBookings = bookings.filter((b) => b.status === 'done').length;

  // Calculate dynamic progress readiness score
  let score = 10;
  if (profile.businessName) score += 15;
  if (profile.description) score += 10;
  if (transactions.length > 0) score += 25;
  if (bookings.length > 0) score += 15;
  if (completedBookings > 0) score += 10;
  if (completedModuleIds.length > 0) {
    score += Math.round((completedModuleIds.length / Math.max(1, totalModulesCount)) * 15);
  }
  const readinessScore = Math.min(100, score);

  const handleExportPortfolio = () => {
    const report = `=====================================================
PORTOFOLIO USAHA MAHASISWA — KAWIRA PLATFORM
Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
=====================================================

I. DATA DIRI & PERINTIS USAHA
Nama Lengkap      : ${profile.name || '-'}
Status Pengguna   : ${profile.userStatus || 'Mahasiswa'}
Asal Kampus       : ${profile.campus || '-'}
Kontak WhatsApp   : ${profile.phone || '-'}
Tautan Sosial/Web : ${profile.social || '-'}

II. PROFIL BISNIS RINTISAN
Nama Brand/Usaha  : ${profile.businessName || 'Belum diisi'}
Bidang Usaha      : ${profile.sector}
Tahap Usaha       : ${profile.status}
Jalur Program     : ${profile.title || 'Peserta Program Kampus / Mandiri'}
Deskripsi Produk  : ${profile.description || '-'}
Kendala Utama     : ${profile.challenge || '-'}

III. REKAPITULASI KEUANGAN & ARUS KAS
Total Pemasukan   : Rp ${totalIncome.toLocaleString('id-ID')}
Total Pengeluaran : Rp ${totalExpense.toLocaleString('id-ID')}
Saldo Kas Bersih  : Rp ${netBalance.toLocaleString('id-ID')}
Total Transaksi   : ${transactions.length} transaksi terekam

IV. AKTIVITAS MENTORING SEBAYA
Total Sesi Dipesan: ${bookings.length} sesi
Sesi Selesai      : ${completedBookings} sesi
Mentor Pendamping : ${bookings.map((b) => b.mentorName).join(', ') || 'Belum ada'}

V. PENGEMBANGAN DIRI & MODUL BISNIS
Modul Selesai     : ${completedModuleIds.length} dari ${totalModulesCount} modul
Skor Kesiapan     : ${readinessScore}% (Tingkat Kesiapan Inkubasi)

=====================================================
Diterbitkan secara digital oleh KAWIRA (Kawan Berwirausaha)
Platform Resmi Wirausaha Mahasiswa Indonesia
https://kawira.id
=====================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kawira-portofolio-${profile.businessName || 'usaha'}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('Portofolio usaha berhasil diekspor.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#C6F135] via-[#D5F559] to-[#6C4CF5] text-[#24213A] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#24213A] text-[#C6F135] inline-block mb-2">
            REKAP PROGRES USAHA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Portofolio Usaha {profile.businessName || 'Kamu'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 mt-1 max-w-xl font-medium">
            Dokumentasi komprehensif aktivitas pembukuan, mentoring, dan pembelajaran untuk proposal hibah P2MW, PKM-K, maupun inkubator kampus.
          </p>
        </div>

        <button
          onClick={handleExportPortfolio}
          className="px-6 py-3 bg-[#24213A] hover:bg-black text-white text-xs sm:text-sm font-black rounded-xl shadow-lg transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Download className="w-4 h-4 text-[#C6F135]" /> Unduh Rekap Portofolio (.txt)
        </button>
      </div>

      {/* 2. Key Score & Metrics Bar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Skor Kesiapan Inkubasi</span>
            <Sparkles className="w-4 h-4 text-[#6C4CF5]" />
          </div>
          <strong className="text-3xl font-black text-[#6C4CF5] block">
            {readinessScore}%
          </strong>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-[#6C4CF5] rounded-full transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Transactions Recorded */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Transaksi Tercatat</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <strong className="text-3xl font-black text-slate-800 block">
            {transactions.length}
          </strong>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
            Buku Kas Aktif
          </span>
        </div>

        {/* Mentoring Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Sesi Mentoring</span>
            <Award className="w-4 h-4 text-[#FF3E80]" />
          </div>
          <strong className="text-3xl font-black text-slate-800 block">
            {bookings.length}
          </strong>
          <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
            {completedBookings} sesi selesai
          </span>
        </div>

        {/* Modules Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Modul Bisnis</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <strong className="text-3xl font-black text-slate-800 block">
            {completedModuleIds.length}/{totalModulesCount}
          </strong>
          <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold mt-2 inline-block">
            Materi Praktik
          </span>
        </div>
      </div>

      {/* 3. Split: Business Profile + Financial Summary */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-[#24213A]">Identitas Bisnis Rintisan</h3>
            <button
              onClick={() => onGoToPage('profile')}
              className="text-xs font-bold text-[#6C4CF5] hover:underline"
            >
              Ubah Data
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#6C4CF5] text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm relative">
              {profile.businessPhotoUrl ? (
                <img
                  src={profile.businessPhotoUrl}
                  alt={profile.businessName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : null}
              <span>{(profile.businessName || 'UK').slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-extrabold text-slate-800">{profile.businessName || 'Nama Usaha Belum Diisi'}</h4>
              <p className="text-xs text-slate-500">{profile.sector} · {profile.status}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold bg-[#C6F135]/40 text-[#364b00] px-2 py-0.5 rounded-full inline-block">
                  {profile.title || 'Peserta Program Kampus'}
                </span>
                <span className="text-[10px] font-bold bg-purple-50 text-[#6C4CF5] px-2 py-0.5 rounded-full inline-block">
                  {profile.campus}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-600 space-y-2">
            <div>
              <strong className="text-slate-800 block mb-0.5">Deskripsi Produk:</strong>
              <p className="leading-relaxed bg-[#FAF9FF] p-3 rounded-xl border border-purple-50">
                {profile.description || 'Deskripsi singkat usaha belum diisi. Lengkapi di menu Profil.'}
              </p>
            </div>

            <div>
              <strong className="text-slate-800 block mb-0.5">Tantangan Utama Saat Ini:</strong>
              <p className="leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-amber-950">
                {profile.challenge || 'Belum ada catatan kendala utama.'}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-[#24213A]">Ringkasan Keuangan Tervalidasi</h3>
            <button
              onClick={() => onGoToPage('bookkeeping')}
              className="text-xs font-bold text-[#6C4CF5] hover:underline"
            >
              Lihat Buku Kas
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
              <span className="text-[11px] text-emerald-800 font-bold block">Pemasukan</span>
              <strong className="text-sm sm:text-base font-black text-emerald-700 block mt-1">
                Rp {totalIncome.toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 text-center">
              <span className="text-[11px] text-rose-800 font-bold block">Pengeluaran</span>
              <strong className="text-sm sm:text-base font-black text-[#FF3E80] block mt-1">
                Rp {totalExpense.toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="p-3.5 bg-[#24213A] rounded-2xl text-center text-white">
              <span className="text-[11px] text-purple-200 font-bold block">Saldo Kas</span>
              <strong className="text-sm sm:text-base font-black text-[#C6F135] block mt-1">
                Rp {netBalance.toLocaleString('id-ID')}
              </strong>
            </div>
          </div>

          {/* Activity verification badges */}
          <div className="pt-2 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktivitas Terekam di Ekosistem</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-bold text-slate-700">{transactions.length} Transaksi Kas</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6C4CF5] flex-shrink-0" />
                <span className="font-bold text-slate-700">{completedBookings} Sesi Mentoring</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="font-bold text-slate-700">{completedModuleIds.length} Modul Selesai</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-bold text-slate-700">Komunitas Terhubung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
