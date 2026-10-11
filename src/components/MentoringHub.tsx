import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  Sparkles, 
  MessageSquare, 
  Video, 
  Wallet,
  X,
  Lock,
  Unlock,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Mentor, Booking, SectorType, MentorStatusType } from '../types';

interface MentoringHubProps {
  mentors: Mentor[];
  bookings: Booking[];
  walletBalance: number;
  userChallenge?: string;
  isMentoringUnlocked: boolean;
  completedModuleIds: string[];
  onBookMentor: (mentorId: string, slot: string, consultation: 'Sesi Chat Real-time' | 'Sesi Call (Google Meet)', topic: string) => void;
  onOpenChat: (bookingId: string) => void;
  onOpenTopUp: () => void;
  onGoToModules: () => void;
  onUnlockDemo: () => void;
}

export const MentoringHub: React.FC<MentoringHubProps> = ({
  mentors,
  bookings,
  walletBalance,
  userChallenge = '',
  isMentoringUnlocked,
  completedModuleIds,
  onBookMentor,
  onOpenChat,
  onOpenTopUp,
  onGoToModules,
  onUnlockDemo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Modals state
  const [selectedMentorForView, setSelectedMentorForView] = useState<Mentor | null>(null);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [showLockedWarningModal, setShowLockedWarningModal] = useState(false);

  // Booking Form State
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingConsultation, setBookingConsultation] = useState<'Sesi Chat Real-time' | 'Sesi Call (Google Meet)'>('Sesi Chat Real-time');
  const [bookingTopic, setBookingTopic] = useState('');

  const sectors: (string | SectorType)[] = ['Semua', 'Kuliner', 'Marketing', 'Teknologi', 'Fashion', 'Kreatif', 'Jasa'];
  const statuses: (string | MentorStatusType)[] = ['Semua', 'Alumni P2MW', 'Alumni PKM-K', 'Praktisi UMKM', 'Wirausaha Muda'];

  // Check which prerequisite modules are finished
  const isMod1Done = completedModuleIds.includes('mod1');
  const isMod2Done = completedModuleIds.includes('mod2');
  const prereqCompletedCount = (isMod1Done ? 1 : 0) + (isMod2Done ? 1 : 0);

  // Filtered mentors list
  const filteredMentors = mentors.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      `${m.name} ${m.sector} ${m.tags.join(' ')} ${m.bio} ${m.campus}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'Semua' || m.sector === selectedSector;
    const matchesStatus = selectedStatus === 'Semua' || m.status === selectedStatus;
    return matchesSearch && matchesSector && matchesStatus;
  });

  const handleStartBooking = (mentor: Mentor) => {
    if (!isMentoringUnlocked) {
      setShowLockedWarningModal(true);
      return;
    }
    setSelectedMentorForBooking(mentor);
    setBookingSlot(mentor.slots[0] || 'Besok · 19:00 WIB');
    setBookingTopic(userChallenge ? `Tantangan usaha saya: ${userChallenge}` : 'Konsultasi HPP, strategi promosi, dan pendampingan proposal usaha.');
  };

  const handleConfirmBooking = () => {
    if (!selectedMentorForBooking) return;
    onBookMentor(
      selectedMentorForBooking.id,
      bookingSlot,
      bookingConsultation,
      bookingTopic.trim() || 'Konsultasi wirausaha mahasiswa'
    );
    setSelectedMentorForBooking(null);
  };

  const isWalletSufficient = selectedMentorForBooking ? walletBalance >= selectedMentorForBooking.price : true;

  return (
    <div className="space-y-8">
      {/* 1. Locked Notice or Unlocked Badge */}
      {!isMentoringUnlocked ? (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#24213A] via-[#322B52] to-[#24213A] text-white shadow-xl border border-purple-500/30 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-[#FF3E80] border border-[#FF3E80]/40 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full">
                    AKSES MENTORING TERKUNCI
                  </span>
                  <span className="text-xs text-purple-200">
                    {prereqCompletedCount}/2 Modul Prasyarat Selesai
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  Selesaikan Modul Prasyarat & Kuis Pemahaman Terlebih Dahulu
                </h3>
                <p className="text-xs text-purple-200 mt-1 max-w-2xl leading-relaxed">
                  Agar konsultasi bersama mentor praktisi alumni P2MW & PKM-K berjalan optimal dan berbasis data tokomu, kamu wajib menyelesaikan <strong>Modul 1 (Pemisahan Kas 3-Pos)</strong> dan <strong>Modul 2 (Hitung HPP & Margin)</strong> serta lulus kuisnya.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={onGoToModules}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                <BookOpen className="w-4 h-4 text-[#C6F135]" /> Lanjutkan Belajar & Kuis →
              </button>
              <button
                onClick={onUnlockDemo}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                title="Buka akses mentoring langsung untuk kemudahan pengujian demo"
              >
                <Unlock className="w-3.5 h-3.5 text-[#C6F135]" /> Buka Akses (Mode Demo)
              </button>
            </div>
          </div>

          {/* Checklist Prasyarat */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-4 text-xs font-semibold">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl ${isMod1Done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-purple-300'}`}>
              {isMod1Done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              Modul 1: Pemisahan Kas & SOP 3-Pos {isMod1Done && '(Lulus Kuis)'}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-xl ${isMod2Done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-purple-300'}`}>
              {isMod2Done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              Modul 2: Hitung HPP & Margin Sehat {isMod2Done && '(Lulus Kuis)'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-900 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Syarat Belajar Terpenuhi:</strong> Akses sesi konsultasi 1-on-1 dengan mentor praktisi kini terbuka penuh.
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white flex-shrink-0">
            Akses Terbuka
          </span>
        </div>
      )}

      {/* 2. Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6C4CF5] via-[#7B5BF7] to-[#8E72F8] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#C6F135] text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> PUSAT MENTORING SEBAYA KAWIRA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Temukan Mentor yang Tepat untuk Usahamu
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-2 leading-relaxed">
            Didampingi langsung oleh alumni P2MW & PMW yang sudah melewati fase awal rintisan. Gunakan data pembukuan & HPP tokomu sebagai bahan diskusi.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl w-full sm:w-auto text-center sm:text-left">
            <span className="text-[10px] text-purple-200 uppercase font-bold block">Saldo Mentoringmu</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-0.5">
              <strong className="text-lg font-black text-[#C6F135]">
                Rp {walletBalance.toLocaleString('id-ID')}
              </strong>
              <button
                onClick={onOpenTopUp}
                className="text-[11px] font-extrabold bg-white text-[#6C4CF5] px-2.5 py-1 rounded-lg hover:bg-[#C6F135] hover:text-[#24213A] transition-colors"
              >
                + Top Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Session Card if any */}
      {bookings.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-amber-400 text-amber-950 font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0 relative">
              {bookings[0].mentorAvatarUrl ? (
                <img
                  src={bookings[0].mentorAvatarUrl}
                  alt={bookings[0].mentorName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : null}
              <span className={bookings[0].mentorAvatarUrl ? 'hidden' : 'block'}>{bookings[0].initial}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                  SESI MENDATANG
                </span>
                <span className="text-xs text-slate-500 font-semibold">{bookings[0].slot}</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                Konsultasi bersama {bookings[0].mentorName}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                Topik: {bookings[0].topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onOpenChat(bookings[0].id)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Buka Ruang Chat Mentoring
            </button>
          </div>
        </div>
      )}

      {/* 4. Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari mentor berdasarkan nama, bidang, kampus, atau keahlian (contoh: P2MW, Kuliner, Ads)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 font-semibold px-2">
            <span>Tarif sesi:</span>
            <span className="font-extrabold text-[#6C4CF5] bg-purple-50 px-2.5 py-1 rounded-lg">
              Rp 20.000 – 35.000 / sesi
            </span>
          </div>
        </div>

        {/* Sector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-400 whitespace-nowrap mr-1">Bidang Usaha:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedSector === sec
                  ? 'bg-[#6C4CF5] text-white shadow-sm shadow-[#6C4CF5]/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Status Background Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <span className="font-bold text-slate-400 whitespace-nowrap mr-1">Kategori Mentor:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#24213A] text-[#C6F135] shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Mentors Directory Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#24213A]">
              Mentor Tersedia ({filteredMentors.length})
            </h3>
            <p className="text-xs text-slate-500">
              {!isMentoringUnlocked
                ? 'Selesaikan Modul 1 & Modul 2 untuk membuka slot pemesanan.'
                : 'Pilih mentor yang paling relevan dengan bidang bisnismu.'}
            </p>
          </div>
        </div>

        {filteredMentors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`w-13 h-13 rounded-2xl overflow-hidden bg-gradient-to-br ${m.avatarBg} text-white font-extrabold flex items-center justify-center text-base shadow-sm flex-shrink-0 relative`}
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
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-sm text-[#24213A] truncate">{m.name}</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Online" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{m.campus}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-2 py-0.5 rounded-full">
                          {m.status}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">·</span>
                        <span className="text-[10px] font-bold text-slate-500">{m.sector}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 my-3">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{m.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({m.reviewsCount} sesi)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Pengalaman {m.experience}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[36px]">
                    {m.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {m.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-[#FAF9FF] border border-purple-100 text-[#6C4CF5] px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6C4CF5]" />
                    <span>Slot: <strong>{m.slots[0]}</strong></span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tarif per sesi</span>
                    <strong className="text-sm font-extrabold text-[#6C4CF5]">
                      Rp {m.price.toLocaleString('id-ID')}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMentorForView(m)}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Profil
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartBooking(m)}
                      className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
                        !isMentoringUnlocked
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-[#6C4CF5] hover:bg-[#5838E8] text-white shadow-sm shadow-[#6C4CF5]/20 hover:-translate-y-0.5'
                      }`}
                    >
                      {!isMentoringUnlocked && <Lock className="w-3 h-3 text-slate-500" />}
                      Pesan Sesi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
            Tidak ada mentor yang cocok dengan pencarian atau filter saat ini.
          </div>
        )}
      </div>

      {/* 6. Riwayat Sesi Mentoring */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#24213A]">Riwayat Sesi Mentoringmu</h3>
            <p className="text-xs text-slate-500">Semua riwayat pemesanan sesi konsultasi & ruang chat.</p>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Mentor</th>
                  <th className="pb-3">Jadwal Sesi</th>
                  <th className="pb-3">Topik & Jenis</th>
                  <th className="pb-3">Biaya</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#6C4CF5] text-white text-xs font-bold flex items-center justify-center">
                          {b.initial}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs sm:text-sm">{b.mentorName}</p>
                          <span className="text-[10px] text-slate-400">{b.mentorSector}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-slate-600 font-medium">{b.slot}</td>
                    <td className="py-3.5 text-xs text-slate-600 max-w-[200px]">
                      <span className="font-bold text-[#6C4CF5] block">{b.consultation}</span>
                      <span className="text-[11px] text-slate-500 truncate block">{b.topic}</span>
                    </td>
                    <td className="py-3.5 text-xs font-bold text-slate-800">
                      Rp {b.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block ${
                          b.status === 'done'
                            ? 'bg-purple-100 text-[#6C4CF5]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status === 'done' ? 'Selesai' : 'Terjadwal'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onOpenChat(b.id)}
                        className="px-3 py-1.5 bg-[#FAF9FF] hover:bg-[#6C4CF5] text-[#6C4CF5] hover:text-white border border-purple-100 text-xs font-bold rounded-xl transition-all"
                      >
                        Ruang Chat →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Belum ada riwayat pemesanan sesi mentoring.
          </div>
        )}
      </div>

      {/* 7. Locked Warning Modal */}
      {showLockedWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative border border-slate-100 text-center space-y-4">
            <button
              onClick={() => setShowLockedWarningModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#FF3E80] mx-auto flex items-center justify-center text-2xl shadow-sm border border-rose-100">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                PRASYARAT BELAJAR DIPERLUKAN
              </span>
              <h3 className="text-xl font-extrabold text-[#24213A] mt-2">
                Akses Sesi Mentoring Masih Terkunci
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Di Kawira, wirausaha mahasiswa diwajibkan menyelesaikan <strong>Modul 1 (Pemisahan Kas)</strong> dan <strong>Modul 2 (Hitung HPP)</strong> serta lulus kuis terlebih dahulu sebelum konsultasi 1-on-1 bersama mentor.
              </p>
            </div>

            <div className="bg-[#FAF9FF] p-3.5 rounded-2xl border border-purple-100 text-xs text-left space-y-1.5 font-medium">
              <div className="flex items-center gap-2">
                <span className={isMod1Done ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {isMod1Done ? '✓' : '○'}
                </span>
                <span className={isMod1Done ? 'text-slate-800 font-bold' : 'text-slate-500'}>
                  Modul 1: Pemisahan Kas & SOP Rekening 3-Pos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isMod2Done ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  {isMod2Done ? '✓' : '○'}
                </span>
                <span className={isMod2Done ? 'text-slate-800 font-bold' : 'text-slate-500'}>
                  Modul 2: Cara Akurat Menghitung HPP per Unit
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowLockedWarningModal(false);
                  onGoToModules();
                }}
                className="flex-1 py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#C6F135]" /> Belajar Modul Sekarang →
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLockedWarningModal(false);
                  onUnlockDemo();
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Buka Mode Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Mentor Detail Modal */}
      {selectedMentorForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMentorForView(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-slate-100">
              <div
                className={`w-18 h-18 rounded-3xl overflow-hidden bg-gradient-to-br ${selectedMentorForView.avatarBg} text-white font-extrabold flex items-center justify-center text-2xl shadow-lg flex-shrink-0 relative`}
              >
                {selectedMentorForView.avatarUrl ? (
                  <img
                    src={selectedMentorForView.avatarUrl}
                    alt={selectedMentorForView.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                ) : null}
                <span className={selectedMentorForView.avatarUrl ? 'hidden' : 'block'}>{selectedMentorForView.initial}</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#C6F135]/40 text-[#364b00]">
                  {selectedMentorForView.status}
                </span>
                <h3 className="text-xl font-extrabold text-[#24213A] mt-1">{selectedMentorForView.name}</h3>
                <p className="text-xs text-slate-500">{selectedMentorForView.campus} · Bidang {selectedMentorForView.sector}</p>
                <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" /> {selectedMentorForView.rating}
                  <span className="text-slate-400 font-normal">({selectedMentorForView.reviewsCount} review mahasiswa)</span>
                </div>
              </div>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tentang Mentor</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{selectedMentorForView.bio}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Portofolio & Prestasi</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {(selectedMentorForView.portfolio || []).map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C4CF5]" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ulasan Mahasiswa</h4>
                <div className="space-y-2">
                  {(selectedMentorForView.reviews || []).map((rev, i) => (
                    <div key={i} className="p-3 bg-[#FAF9FF] rounded-xl border border-purple-50 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-800">{rev.name || rev.reviewer}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-slate-600 italic">"{rev.text || rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Tarif Sesi Mentoring</span>
                <strong className="text-lg font-black text-[#6C4CF5]">
                  Rp {selectedMentorForView.price.toLocaleString('id-ID')}
                </strong>
              </div>

              <button
                onClick={() => {
                  const m = selectedMentorForView;
                  setSelectedMentorForView(null);
                  handleStartBooking(m);
                }}
                className="py-2.5 px-6 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all"
              >
                Lanjut Pesan Sesi →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Booking Modal */}
      {selectedMentorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedMentorForBooking(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-black uppercase tracking-wider text-[#6C4CF5]">
              PESAN SESI MENTORING
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6C4CF5] to-[#8E72F8] text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0 relative">
                {selectedMentorForBooking.avatarUrl ? (
                  <img
                    src={selectedMentorForBooking.avatarUrl}
                    alt={selectedMentorForBooking.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                ) : null}
                <span className={selectedMentorForBooking.avatarUrl ? 'hidden' : 'block'}>{selectedMentorForBooking.initial}</span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#24213A] leading-tight">
                  {selectedMentorForBooking.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedMentorForBooking.campus} · {selectedMentorForBooking.status}</p>
              </div>
            </div>

            {/* Price & Wallet Balance Check */}
            <div className="bg-[#FAF9FF] border border-[#6C4CF5]/20 rounded-2xl p-4 my-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Biaya Sesi:</span>
                <strong className="text-base font-black text-[#6C4CF5]">
                  Rp {selectedMentorForBooking.price.toLocaleString('id-ID')}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-semibold block">Saldo Dompetmu:</span>
                <strong
                  className={`text-base font-black ${
                    isWalletSufficient ? 'text-emerald-600' : 'text-[#FF3E80]'
                  }`}
                >
                  Rp {walletBalance.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            {!isWalletSufficient && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between mb-4">
                <span>Saldo dompet tidak mencukupi untuk biaya sesi ini.</span>
                <button
                  type="button"
                  onClick={onOpenTopUp}
                  className="font-extrabold underline text-[#6C4CF5] whitespace-nowrap ml-2"
                >
                  Top Up Sekarang
                </button>
              </div>
            )}

            {/* Consultation Type Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenis Konsultasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Sesi Chat Real-time', label: 'Chat Real-Time', icon: MessageSquare },
                    { id: 'Sesi Call (Google Meet)', label: 'Call Google Meet', icon: Video },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = bookingConsultation === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBookingConsultation(item.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'border-[#6C4CF5] bg-[#6C4CF5] text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Jadwal Sesi yang Tersedia
                </label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                >
                  {selectedMentorForBooking.slots.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic / Challenge */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Topik / Kendala yang Ingin Dibahas
                  </label>
                  {userChallenge && (
                    <button
                      type="button"
                      onClick={() => setBookingTopic(`Saya ingin membahas kendala usaha: ${userChallenge}`)}
                      className="text-[10px] font-bold text-[#6C4CF5] hover:underline"
                    >
                      Gunakan Kendala Profil
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="Ceritakan kondisi tokomu, misalnya: Perhitungan HPP kami belum pas, atau butuh saran strategi konten TikTok..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedMentorForBooking(null)}
                className="flex-1 py-2.5 border border-slate-200 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!isWalletSufficient || !bookingTopic.trim()}
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all"
              >
                Bayar & Jadwalkan Sesi →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
