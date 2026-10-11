import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  Download, 
  FileText, 
  X, 
  Sparkles, 
  CheckSquare, 
  ArrowRight,
  Lock,
  Award,
  Play,
  Check
} from 'lucide-react';
import { LearningModule } from '../types';
import { QuizModal } from './QuizModal';

interface ModulesCenterProps {
  modules: LearningModule[];
  completedModuleIds: string[];
  quizScores?: Record<string, number>;
  onPassQuiz: (moduleId: string, score: number) => void;
  onToggleCompleteModule: (moduleId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onGoToMentoring?: () => void;
  onOpenStudy?: (moduleNumber: 1 | 2) => void;
}

export const ModulesCenter: React.FC<ModulesCenterProps> = ({
  modules,
  completedModuleIds,
  quizScores = {},
  onPassQuiz,
  onToggleCompleteModule,
  onShowToast,
  onGoToMentoring,
  onOpenStudy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'berjalan' | 'selesai' | 'terkunci'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeReadingModule, setActiveReadingModule] = useState<LearningModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<LearningModule | null>(null);

  const categories = ['Semua', 'Keuangan', 'Marketing', 'Legalitas', 'Bisnis'];

  // Determine status for a module: 'selesai' | 'berjalan' | 'terkunci'
  const getModuleStatus = (m: LearningModule): 'selesai' | 'berjalan' | 'terkunci' => {
    if (completedModuleIds.includes(m.id)) return 'selesai';
    if (m.prerequisiteModuleId && !completedModuleIds.includes(m.prerequisiteModuleId)) {
      return 'terkunci';
    }
    return 'berjalan';
  };

  const filteredModules = modules.filter((m) => {
    const status = getModuleStatus(m);
    if (selectedStatusFilter === 'berjalan' && status !== 'berjalan') return false;
    if (selectedStatusFilter === 'selesai' && status !== 'selesai') return false;
    if (selectedStatusFilter === 'terkunci' && status !== 'terkunci') return false;

    const matchesCat = selectedCategory === 'Semua' || m.cat === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      `${m.title} ${m.cat} ${m.body}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const progressPercent = Math.round((completedModuleIds.length / Math.max(1, modules.length)) * 100);

  // Check mentoring requirement: Modul 1 & Modul 2
  const isMod1Done = completedModuleIds.includes('mod1');
  const isMod2Done = completedModuleIds.includes('mod2');
  const isMentoringUnlocked = isMod1Done && isMod2Done;

  const handleDownloadTemplate = (type: 'caption' | 'legal' | 'competitor') => {
    const templates = {
      caption: `TEMPLATE STRUKTUR KONTEN PROMOSI MAHASISWA — KAWIRA

[0-3 DETIK: HOOK]
"Siapa bilang anak kos gak bisa makan enak dengan budget 15 ribuan?"
Atau: "Masalah terbesar jualan kuliner di kampus itu bukan rasa, tapi..."

[4-15 DETIK: VALUE & CERITA]
Perkenalkan produkmu dan bahan segar yang kamu pakai setiap pagi.
"Di dapur kami, kami pakai rempah asli tanpa pengawet buatan..."

[16-25 DETIK: BUKTI & TEKSTUR]
Tunjukkan visual porsi melimpah, suara kriuk, atau testimoni kawan kampus.

[HARGA & PROMO]
"Cuma Rp 18.000 + gratis ongkir khusus area kampus!"

[CALL TO ACTION (CTA)]
"Klik link WhatsApp di bio sekarang, slot order hari ini sisa 8 porsi ya!"`,

      legal: `CHECKLIST PENGURUSAN LEGALITAS USAHA MAHASISWA — KAWIRA

[ ] Siapkan NIK KTP pemilik usaha
[ ] Pastikan memiliki email aktif & nomor WhatsApp bisnis
[ ] Tentukan Nama Usaha / Brand yang tidak melanggar hak cipta
[ ] Akses portal resmi OSS RBA di oss.go.id
[ ] Pilih menu 'Daftar' untuk Usaha Mikro dan Kecil (UMK) perseorangan
[ ] Masukkan data alamat lokasi kegiatan usaha
[ ] Pilih kode KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)
     - Kuliner makanan ringan: 10792 / 56101
     - Fashion apparel: 14111 / 47711
[ ] Unduh NIB (Nomor Induk Berusaha) format PDF resmi
[ ] Daftarkan sertifikasi Halal gratis jalur Self-Declare (program SEHATI BPJPH)
[ ] Simpan sertifikat NIB di portofolio usaha Kawira`,

      competitor: `SPREADSHEET ANALISIS RISET KOMPETITOR — KAWIRA

Nama Kompetitor | Produk Utama | Harga Jual | Kanal Penjualan | Kelebihan Utama | Kekurangan / Celah | Ide Diferensiasi Toko Kita
-----------------------------------------------------------------------------------------------------------------------------
Kompetitor A    | Rice Bowl Ayam| Rp 20.000  | GoFood / IG     | Porsi besar     | Packaging plastik  | Pakai paper bowl ramah lingkungan
Kompetitor B    | Sambal Kemasan| Rp 28.000  | Shopee / TikTok | Branding kuat   | Pengiriman lambat  | Garansi sampai di hari yang sama
Toko Saya       | ...           | ...        | ...             | ...             | ...                | ...`
    };

    const content = templates[type];
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kawira-${type}-template.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast(`Template ${type} berhasil diunduh.`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Hero Banner with Mentoring Unlock Notification */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6C4CF5] via-[#7859F6] to-[#8C70F7] text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#C6F135] text-xs font-black uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> JALUR BELAJAR: FONDASI KEUANGAN & HPP
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            {isMentoringUnlocked
              ? '✨ Selamat! Syarat Terpenuhi: Akses Mentoring 1-on-1 Telah Terbuka'
              : !isMod1Done
              ? 'Selesaikan Modul 1 & Kuis untuk Membuka Sesi Bimbingan 1-on-1'
              : 'Selesaikan 1 Modul Lagi (Modul 2) untuk Membuka Sesi Bimbingan 1-on-1'}
          </h2>

          <p className="text-xs sm:text-sm text-purple-100 mt-2 leading-relaxed font-normal">
            {isMentoringUnlocked
              ? 'Kamu telah menguasai pemisahan rekening kas dan formula HPP. Sekarang kamu bisa langsung menjadwalkan konsultasi dengan mentor praktisi alumni P2MW & PKM-K.'
              : 'Agar konsultasi bersama mentor berjalan efektif dan berbasis data, wirausaha mahasiswa diwajibkan menyelesaikan 2 modul fondasi & lulus kuis pemahaman terlebih dahulu.'}
          </p>

          {/* Checklist Prasyarat Mentoring */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${isMod1Done ? 'bg-emerald-400/30 text-[#C6F135]' : 'bg-white/10 text-purple-200'}`}>
              {isMod1Done ? '✓' : '○'} Modul 1: Pemisahan Kas 3-Pos
            </span>
            <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${isMod2Done ? 'bg-emerald-400/30 text-[#C6F135]' : 'bg-white/10 text-purple-200'}`}>
              {isMod2Done ? '✓' : '○'} Modul 2: Hitung HPP & Margin
            </span>
          </div>
        </div>

        {/* Learning Progress Widget & Quick Mentoring CTA */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full lg:w-72 flex-shrink-0 relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-purple-200">Progres Jalur Belajar</span>
            <strong className="text-[#C6F135] text-sm">{progressPercent}%</strong>
          </div>
          
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C6F135] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-purple-200 font-medium">
            {completedModuleIds.length} dari {modules.length} modul selesai
          </p>

          {isMentoringUnlocked && onGoToMentoring && (
            <button
              onClick={onGoToMentoring}
              className="w-full py-2 bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              Buka Katalog Mentor Sekarang →
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Segmented Control (Semua, Sedang Berjalan, Selesai, Terkunci) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Modul' },
              { id: 'berjalan', label: 'Sedang Berjalan' },
              { id: 'selesai', label: 'Selesai' },
              { id: 'terkunci', label: 'Terkunci' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedStatusFilter === tab.id
                    ? 'bg-white text-[#6C4CF5] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau topik..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C4CF5]"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <span className="font-bold text-slate-400 whitespace-nowrap mr-1">Kategori:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#6C4CF5] text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Modules Grid with Progression & Lock */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m, idx) => {
          const status = getModuleStatus(m);
          const isDone = status === 'selesai';
          const isLocked = status === 'terkunci';
          const isCurrent = status === 'berjalan';
          const score = quizScores[m.id];

          // Find prerequisite module title
          const prereqModule = m.prerequisiteModuleId
            ? modules.find((x) => x.id === m.prerequisiteModuleId)
            : null;

          return (
            <div
              key={m.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
                isDone
                  ? 'bg-white border-purple-200/90 shadow-xs'
                  : isCurrent
                  ? 'bg-white border-[#6C4CF5] shadow-md shadow-[#6C4CF5]/10 ring-2 ring-[#6C4CF5]/15'
                  : 'bg-slate-50/70 border-slate-200 text-slate-400'
              }`}
            >
              {/* Highlight badge for current focus */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6C4CF5] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C6F135]" /> Fokus Utama Saat Ini
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-purple-100 text-[#6C4CF5]'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? '✓ Selesai · Terverifikasi' : isCurrent ? 'Sedang Berjalan' : 'Terkunci'}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> {m.time}
                  </span>
                </div>

                <div className="flex items-start gap-3 my-2">
                  <span
                    className={`w-10 h-10 rounded-xl text-lg font-black flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : isCurrent
                        ? 'bg-purple-50 text-[#6C4CF5] border border-purple-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isLocked ? <Lock className="w-5 h-5 text-slate-400" /> : m.icon}
                  </span>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Modul {idx + 1} · {m.cat}
                    </span>
                    <h3
                      className={`font-extrabold text-sm leading-snug line-clamp-2 ${
                        isLocked ? 'text-slate-500' : 'text-[#24213A]'
                      }`}
                    >
                      {m.title}
                    </h3>
                  </div>
                </div>

                <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                  {m.body}
                </p>

                {/* Prerequisite notice if locked */}
                {isLocked && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                    <span>
                      Terkunci · Selesaikan <strong>{prereqModule?.title || 'Modul Sebelumnya'}</strong> & kuis untuk membuka materi ini.
                    </span>
                  </div>
                )}

                {/* Quiz score indicator if done */}
                {isDone && score !== undefined && (
                  <div className="mt-3 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" /> Skor Kuis:
                    </span>
                    <span className="bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-950 font-black">
                      {score}% Lulus
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {isDone ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenStudy ? onOpenStudy(idx === 0 ? 1 : 2) : setActiveReadingModule(m)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Baca Materi
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenStudy ? onOpenStudy(idx === 0 ? 1 : 2) : setActiveQuizModule(m)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-[#6C4CF5] transition-colors"
                    >
                      Tinjau Kuis
                    </button>
                  </>
                ) : isCurrent ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenStudy ? onOpenStudy(idx === 0 ? 1 : 2) : setActiveReadingModule(m)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#FAF9FF] hover:bg-purple-100 text-[#6C4CF5] border border-purple-200 transition-colors"
                    >
                      Baca Materi
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenStudy ? onOpenStudy(idx === 0 ? 1 : 2) : setActiveQuizModule(m)}
                      className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-[#6C4CF5] hover:bg-[#5838E8] text-white shadow-xs transition-all flex items-center justify-center gap-1"
                    >
                      Kuis (5 Soal) →
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Materi Terkunci (Selesaikan Modul {idx})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Marketing & Legal Toolkit Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#6C4CF5]">
            TOOLKIT & TEMPLATE SIAP PAKAI
          </span>
          <h3 className="text-xl font-extrabold text-[#24213A] mt-1">Unduh Template Promosi & Dokumen Usaha</h3>
          <p className="text-xs text-slate-500 mt-1">
            Hemat waktu dengan kerangka dokumen siap pakai yang telah teruji untuk mahasiswa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#6C4CF5]/10 text-[#6C4CF5] flex items-center justify-center font-bold text-sm mb-3">
                TXT
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Formula Caption Promosi TikTok & Reels
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Struktur copywriting hook 3 detik, bukti sosial, dan CTA yang memicu order.
              </p>
            </div>
            <button
              onClick={() => handleDownloadTemplate('caption')}
              className="mt-4 w-full py-2 bg-white hover:bg-purple-100 text-[#6C4CF5] border border-purple-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Template
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">
                NIB
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Checklist Legalitas NIB & PIRT Mahasiswa
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Panduan berkas syarat OSS dan pendaftaran sertifikasi Halal gratis self-declare.
              </p>
            </div>
            <button
              onClick={() => handleDownloadTemplate('legal')}
              className="mt-4 w-full py-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Checklist
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                XLS
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                Matriks Riset Kompetitor & Harga
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Template pemetaan harga, keunggulan produk, dan celah pasar kompetitor sekitar.
              </p>
            </div>
            <button
              onClick={() => handleDownloadTemplate('competitor')}
              className="mt-4 w-full py-2 bg-white hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Matriks
            </button>
          </div>
        </div>
      </div>

      {/* 5. Reader Modal */}
      {activeReadingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveReadingModule(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6C4CF5]">
                {activeReadingModule.cat}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {activeReadingModule.time}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-[#24213A] leading-snug">
              {activeReadingModule.title}
            </h3>

            {/* Reading Content */}
            <div className="my-5 p-4 sm:p-5 rounded-2xl bg-[#FAF9FF] border border-purple-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
              {activeReadingModule.body}
            </div>

            {/* Step-by-Step Practice Checklist */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#6C4CF5]" /> Langkah Praktik Usaha:
              </h4>
              <div className="space-y-2">
                {activeReadingModule.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-[#6C4CF5] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action: Lanjut ke Kuis */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {completedModuleIds.includes(activeReadingModule.id)
                  ? '✓ Modul ini sudah lulus kuis'
                  : 'Selesaikan kuis untuk mencatat kelulusan & membuka materi berikutnya'}
              </span>

              <button
                type="button"
                onClick={() => {
                  const target = activeReadingModule;
                  setActiveReadingModule(null);
                  setActiveQuizModule(target);
                }}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs font-extrabold bg-[#6C4CF5] hover:bg-[#5838E8] text-white shadow-md shadow-[#6C4CF5]/25 flex items-center justify-center gap-2 transition-all"
              >
                Lanjut ke Kuis Pemahaman →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Interactive Quiz Modal */}
      {activeQuizModule && (
        <QuizModal
          module={activeQuizModule}
          onClose={() => setActiveQuizModule(null)}
          onPassQuiz={(moduleId, score) => {
            onPassQuiz(moduleId, score);
            setActiveQuizModule(null);
          }}
          onGoToMentoring={onGoToMentoring}
        />
      )}
    </div>
  );
};
