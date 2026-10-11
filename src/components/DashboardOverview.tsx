import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Star, 
  Clock, 
  MessageSquare, 
  Calculator, 
  BookOpen, 
  Users, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { Mentor, Booking, Transaction, UserProfile, PageType } from '../types';

interface DashboardOverviewProps {
  profile: UserProfile;
  mentors: Mentor[];
  bookings: Booking[];
  transactions: Transaction[];
  isMentoringUnlocked: boolean;
  completedModuleIds: string[];
  onNavigate: (page: PageType) => void;
  onOpenChat: (bookingId: string) => void;
  onBookMentorQuick: (mentor: Mentor) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  mentors,
  bookings,
  transactions,
  isMentoringUnlocked,
  completedModuleIds,
  onNavigate,
  onOpenChat,
  onBookMentorQuick,
}) => {
  // Financial totals
  const totalIncome = transactions
    .filter((t) => t.type === 'in')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const upcomingBooking = bookings.find((b) => b.status === 'upcoming');
  const recommendedMentors = mentors.slice(0, 3);

  const isMod1Done = completedModuleIds.includes('mod1');
  const isMod2Done = completedModuleIds.includes('mod2');
  const prereqCount = (isMod1Done ? 1 : 0) + (isMod2Done ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#C6F135] via-[#D5F559] to-[#6C4CF5] text-[#24213A] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#24213A] text-[#C6F135] inline-block mb-2">
            TEMAN BERTUMBUH WIRAUSAHA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Halo, {(profile.name || 'Pengusaha Muda').split(' ')[0]}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1">
            Kelola <strong className="font-extrabold text-[#24213A]">{profile.businessName || 'usaha rintisanmu'}</strong> dengan bimbingan mentor sebaya yang lebih terarah.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="px-5 py-2.5 bg-[#24213A] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            {profile.businessName ? 'Edit Profil Usaha' : 'Lengkapi Profil Toko'} →
          </button>
        </div>
      </div>

      {/* 2. Educational Prerequisite Gate Banner */}
      {!isMentoringUnlocked ? (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#24213A] via-[#352D57] to-[#24213A] text-white shadow-lg border border-purple-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider">
              <Lock className="w-3 h-3" /> PRASYARAT SESI MENTORING 1-ON-1
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              {!isMod1Done
                ? 'Selesaikan Modul 1 & Kuis untuk Membuka Sesi Bimbingan Mentor'
                : 'Selesaikan 1 Modul Lagi (Modul 2 & Kuis) untuk Membuka Sesi Bimbingan 1-on-1'}
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed font-normal">
              Agar mentoring menghasilkan solusi konkret dan terarah, wirausaha mahasiswa wajib menyelesaikan materi fondasi kas dan kalkulasi HPP terlebih dahulu.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-purple-200">
              <span className="flex items-center gap-1.5">
                {isMod1Done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : '○'} Modul 1 (Pemisahan Kas 3-Pos)
              </span>
              <span className="flex items-center gap-1.5">
                {isMod2Done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : '○'} Modul 2 (Hitung HPP)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => onNavigate('modules')}
              className="w-full sm:w-auto px-6 py-3 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#C6F135]" /> Lanjutkan Belajar & Kuis →
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Syarat Belajar Terpenuhi:</strong> Akses penuh mentoring 1-on-1 dengan mentor praktisi alumni P2MW & PKM-K telah aktif.
            </span>
          </div>
          <button
            onClick={() => onNavigate('mentoring')}
            className="text-[11px] font-black uppercase text-emerald-800 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            Pilih Mentor →
          </button>
        </div>
      )}

      {/* 3. Three Financial Metric Cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {/* Income Today */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Pemasukan Tercatat</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl font-black text-emerald-600 block">
            Rp {totalIncome.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-2 inline-block">
            ↑ Arus Kas Masuk Aktif
          </span>
        </div>

        {/* Expense Today */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#FF3E80] flex items-center justify-center font-bold">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl font-black text-[#FF3E80] block">
            Rp {totalExpense.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md mt-2 inline-block">
            ↘ Beban & Bahan Baku
          </span>
        </div>

        {/* Net Cashflow */}
        <div className="bg-[#24213A] p-5 rounded-3xl text-white shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-200">Saldo Kas Bersih</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#C6F135] text-[#24213A]">
              Real-time
            </span>
          </div>
          <strong className="text-2xl font-black text-[#C6F135] block">
            Rp {netBalance.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] text-purple-200 mt-2 block font-medium">
            Saldo usaha siap operasional
          </span>
        </div>
      </div>

      {/* 4. Main Dashboard Grid: Mentor Recommendations + Upcoming Session */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recommended Mentors */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#24213A]">Rekomendasi Mentor Sebaya</h3>
              <p className="text-xs text-slate-500">Dipilih berdasarkan bidang usaha dan kebutuhan tokomu.</p>
            </div>
            <button
              onClick={() => onNavigate('mentoring')}
              className="text-xs font-bold text-[#6C4CF5] hover:text-[#5838E8] flex items-center gap-1"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {recommendedMentors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br ${m.avatarBg} text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 relative`}
                    >
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <span className={m.avatarUrl ? 'hidden' : 'block'}>{m.initial}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-[#24213A] truncate">{m.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{m.campus}</p>
                      <span className="text-[9px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                    {m.bio}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-current" /> {m.rating}
                    </span>
                    <strong className="text-[#6C4CF5] font-extrabold">
                      Rp {m.price.toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isMentoringUnlocked) {
                      onNavigate('mentoring');
                    } else {
                      onBookMentorQuick(m);
                    }
                  }}
                  className={`mt-4 w-full py-2 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 ${
                    !isMentoringUnlocked
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-[#6C4CF5] hover:bg-[#5838E8] text-white'
                  }`}
                >
                  {!isMentoringUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                  {isMentoringUnlocked ? 'Pesan Sesi' : 'Kunci (Belajar Dulu)'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Session / Next Action Card */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-[#24213A]">Sesi Mendatang</h3>
            <button
              onClick={() => onNavigate('messages')}
              className="text-xs font-bold text-[#6C4CF5] hover:underline"
            >
              Semua Sesi
            </button>
          </div>

          {upcomingBooking ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#FAF9FF] rounded-2xl border border-purple-100">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#6C4CF5] text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 relative">
                  {upcomingBooking.mentorAvatarUrl ? (
                    <img
                      src={upcomingBooking.mentorAvatarUrl}
                      alt={upcomingBooking.mentorName}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : null}
                  <span className={upcomingBooking.mentorAvatarUrl ? 'hidden' : 'block'}>{upcomingBooking.initial}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-[#24213A] truncate">{upcomingBooking.mentorName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#6C4CF5]" /> {upcomingBooking.slot}
                  </p>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-[#6C4CF5] inline-block mt-1">
                    {upcomingBooking.consultation}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Topik Konsultasi:</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                  {upcomingBooking.topic}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenChat(upcomingBooking.id)}
                className="w-full py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Buka Ruang Chat Mentoring
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Belum Ada Sesi Terjadwal</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {!isMentoringUnlocked
                    ? 'Selesaikan modul & kuis prasyarat untuk membuka sesi.'
                    : 'Pilih mentor sebaya untuk mendampingi strategi tokomu.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate(!isMentoringUnlocked ? 'modules' : 'mentoring')}
                className="px-4 py-2 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl transition-all"
              >
                {!isMentoringUnlocked ? 'Buka Modul Belajar →' : 'Cari Mentor Sekarang →'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Quick Action Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('bookkeeping')}
          className="p-4 bg-white hover:bg-[#FAF9FF] border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left flex items-center gap-3.5 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <strong className="text-xs sm:text-sm font-extrabold text-[#24213A] block truncate">
              Catat Transaksi Harian
            </strong>
            <span className="text-[11px] text-slate-400 truncate block">Update buku kas & arus masuk tokomu</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C4CF5] transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('calculators')}
          className="p-4 bg-white hover:bg-[#FAF9FF] border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left flex items-center gap-3.5 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4CF5] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <strong className="text-xs sm:text-sm font-extrabold text-[#24213A] block truncate">
              Hitung HPP & Titik Impas BEP
            </strong>
            <span className="text-[11px] text-slate-400 truncate block">Gunakan kalkulator bisnis interaktif</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C4CF5] transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('modules')}
          className="p-4 bg-white hover:bg-[#FAF9FF] border border-slate-200/80 hover:border-purple-200 rounded-2xl text-left flex items-center gap-3.5 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <strong className="text-xs sm:text-sm font-extrabold text-[#24213A] block truncate">
              Pelajari Modul & Kuis
            </strong>
            <span className="text-[11px] text-slate-400 truncate block">Kuis pemahaman & buka akses mentoring</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C4CF5] transition-colors" />
        </button>
      </div>
    </div>
  );
};
