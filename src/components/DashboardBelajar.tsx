import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Calculator, 
  Award, 
  Play, 
  BookOpen, 
  Lock, 
  Sparkles, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { LearningModule, PageType } from '../types';

interface DashboardBelajarProps {
  modules: LearningModule[];
  completedModuleIds: string[];
  isMentoringUnlocked: boolean;
  onNavigate: (page: PageType) => void;
  onOpenLesson: (module: LearningModule) => void;
  onOpenQuiz: (module: LearningModule) => void;
  onScheduleMentor: () => void;
}

export const DashboardBelajar: React.FC<DashboardBelajarProps> = ({
  modules,
  completedModuleIds,
  isMentoringUnlocked,
  onNavigate,
  onOpenLesson,
  onOpenQuiz,
  onScheduleMentor,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'berjalan' | 'selesai' | 'terkunci'>('all');

  const filteredModules = modules.filter((m) => {
    if (activeFilter === 'selesai' && !completedModuleIds.includes(m.id)) return false;
    if (activeFilter === 'berjalan' && (completedModuleIds.includes(m.id) || (m.prerequisiteModuleId && !completedModuleIds.includes(m.prerequisiteModuleId)))) return false;
    if (activeFilter === 'terkunci' && (!m.prerequisiteModuleId || completedModuleIds.includes(m.prerequisiteModuleId))) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Big Hero Banner matching Html → Body.png */}
      <div className="relative overflow-hidden p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#4724C4] via-[#5230D8] to-[#5C3CE0] text-white shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6F135] text-[#24213A] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#24213A]" />
            Jalur Aktif: Fondasi Keuangan & HPP
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
            Selesaikan 1 Modul Lagi untuk Membuka Sesi Bimbingan 1-on-1 dengan Mentor Praktisi
          </h2>

          {/* Progress bar line */}
          <div className="mt-6 max-w-lg">
            <div className="flex justify-between text-xs font-bold text-purple-200 mb-2">
              <span>Progress Jalur Belajar</span>
              <strong className="text-[#C6F135]">1 dari 3 Modul Selesai (33%)</strong>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#C6F135] w-1/3 rounded-full transition-all duration-500" />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const mod2 = modules.find((m) => m.id === 'mod2');
                if (mod2) onOpenLesson(mod2);
                else onNavigate('modules');
              }}
              className="px-6 py-3.5 bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              Lanjutkan Belajar <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('modules')}
              className="text-xs sm:text-sm font-bold text-purple-200 hover:text-white transition-colors"
            >
              Lihat Silabus Lengkap
            </button>
          </div>
        </div>

        {/* Floating Tilted Card on Right (Target Batch 4) */}
        <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 rotate-2 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#C6F135] text-[#24213A]">
              Target Batch 4
            </span>
            <Sparkles className="w-4 h-4 text-[#C6F135]" />
          </div>
          <span className="text-[11px] text-purple-200 font-semibold block">Mentor Terhubung</span>
          <strong className="text-xl font-black block mt-0.5">1-on-1 Ready</strong>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-[#C6F135] w-2/3 rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. Four Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jam Belajar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Total Jam Belajar</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5838E8] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong className="text-2xl font-black text-slate-900 block">18.5 Jam</strong>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2.4 jam minggu ini
            </span>
          </div>
        </div>

        {/* Studi Kasus Selesai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Studi Kasus Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5838E8] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong className="text-2xl font-black text-slate-900 block">4 Kasus</strong>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
              Target kuartal: <strong className="text-slate-600">6 kasus</strong>
            </span>
          </div>
        </div>

        {/* Simulasi HPP Dibuat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Simulasi HPP Dibuat</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5838E8] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong className="text-2xl font-black text-slate-900 block">3 Produk Kuliner</strong>
            <span className="text-[11px] font-bold text-[#5838E8] flex items-center gap-1 mt-0.5">
              ✓ Status: Terverifikasi
            </span>
          </div>
        </div>

        {/* Sertifikat Terbit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Sertifikat Terbit</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5838E8] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong className="text-2xl font-black text-slate-900 block">1 Sertifikat</strong>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">
              Modul Validasi Pasar F&B
            </span>
          </div>
        </div>
      </div>

      {/* 3. Kurikulum Terakreditasi & 3 Module Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#5838E8]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#5838E8]">
                KURIKULUM TERAKREDITASI
              </span>
            </div>
            <h3 className="text-xl font-black text-[#24213A] tracking-tight">
              Jalur Belajar: Fondasi Keuangan & Manajemen Bisnis
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs text-xs font-bold">
            {[
              { id: 'all', label: 'Semua Modul' },
              { id: 'berjalan', label: 'Sedang Berjalan' },
              { id: 'selesai', label: 'Selesai' },
              { id: 'terkunci', label: 'Terkunci' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeFilter === tab.id
                    ? 'border border-[#5838E8] text-[#5838E8] bg-purple-50/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Module Cards matching screenshot */}
        <div className="grid md:grid-cols-3 gap-6 pt-2">
          {/* Modul 1: Selesai */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFF199] text-[#7A5B12] flex items-center gap-1">
                  ✓ Selesai · Terverifikasi
                </span>
                <span className="text-xs font-bold text-slate-400">Modul 1</span>
              </div>

              <h4 className="font-extrabold text-base text-[#24213A] leading-snug">
                1. Pemisahan Keuangan Pribadi vs Usaha Kuliner
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Teknik membuka rekening terpisah dan disiplin mencatat arus kas modal harian.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Hasil Kuis Akhir:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Skor: 100% – Lulus
                </span>
              </div>

              <button
                onClick={() => {
                  const mod1 = modules.find((m) => m.id === 'mod1');
                  if (mod1) onOpenLesson(mod1);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-extrabold text-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5838E8]" /> Lihat Ringkasan & Catatan
              </button>
            </div>
          </div>

          {/* Modul 2: Sedang Berjalan (Fokus Utama Saat Ini) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#5838E8] shadow-lg shadow-[#5838E8]/10 relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#5838E8] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              Fokus Utama Saat Ini
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5838E8] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5838E8]" /> Sedang Berjalan
                </span>
                <span className="text-xs font-bold text-slate-400">Modul 2</span>
              </div>

              <h4 className="font-extrabold text-base text-[#24213A] leading-snug">
                2. Menghitung HPP (Harga Pokok Penjualan) & Margin Usaha
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Komponen biaya bahan baku, overhead, tenaga kerja langsung, dan penentuan margin laba kompetitif.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Evaluasi Pemahaman:</span>
                <button
                  onClick={() => {
                    const mod2 = modules.find((m) => m.id === 'mod2');
                    if (mod2) onOpenQuiz(mod2);
                  }}
                  className="font-extrabold text-[#5838E8] hover:underline"
                >
                  📝 Kuis Bab 2: Siap Dikerjakan (0/3 Soal)
                </button>
              </div>

              <button
                onClick={() => onNavigate('bookkeeping')}
                className="w-full py-2.5 rounded-xl bg-[#C6F135] hover:bg-[#b8e522] text-xs font-black text-[#24213A] flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5" /> Buka Lab: Kalkulator HPP
              </button>

              <button
                onClick={() => {
                  const mod2 = modules.find((m) => m.id === 'mod2');
                  if (mod2) onOpenLesson(mod2);
                }}
                className="w-full py-2.5 rounded-xl bg-[#5838E8] hover:bg-[#4724C4] text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Lanjutkan Materi Video (12 Menit)
              </button>
            </div>
          </div>

          {/* Modul 3: Terkunci */}
          <div className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200/80 text-slate-400 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Terkunci · Prasyarat Modul 2
                </span>
                <span className="text-xs font-bold text-slate-400">Modul 3</span>
              </div>

              <h4 className="font-extrabold text-base text-slate-600 leading-snug">
                3. Strategi Penetapan Harga Menu & Simulasi Promo
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Membangun bundling promo tanpa merusak margin keuntungan bersih bisnis F&B.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-200/60 space-y-3">
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/50 text-[11px] text-slate-500 leading-relaxed">
                ⓘ Buka setelah Modul 2 selesai dengan skor kuis minimum 80%.
              </div>

              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-slate-200/80 text-xs font-bold text-slate-400 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" /> Materi Terkunci
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dual Bottom Cards: Lab Praktik Wirausaha & Fasilitator Pendamping */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lab Praktik Wirausaha Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C6F135]/40 text-[#364b00] flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#24213A]">Lab Praktik Wirausaha</h4>
                <p className="text-xs text-slate-400">Buku Kas Digital & Simulator HPP Otomatis</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#C6F135] text-[#24213A]">
              Live Data Demo
            </span>
          </div>

          {/* Sample Product Box matching screenshot */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px]">SAMPEL PRODUK RINTISAN:</span>
              <strong className="text-[#5838E8] font-extrabold text-sm">Ayam Geprek Sambal Korek</strong>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Bahan Baku</span>
                <strong className="text-xs font-black text-slate-800 block mt-0.5">Rp 8.500</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Kemasan/Box</span>
                <strong className="text-xs font-black text-slate-800 block mt-0.5">Rp 1.200</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Overhead & Gas</span>
                <strong className="text-xs font-black text-slate-800 block mt-0.5">Rp 1.800</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-purple-100 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Total HPP Satuan:</span>
                <strong className="text-base font-black text-[#5838E8]">Rp 11.500</strong>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-400 text-[11px] block">Rekomendasi Harga Jual:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-base font-black text-slate-900">Rp 18.000</strong>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#C6F135] text-[#24213A]">
                    Margin 36.1%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Rumus terhubung otomatis dengan buku kas harian.</span>
            <button
              onClick={() => onNavigate('bookkeeping')}
              className="font-extrabold text-[#5838E8] hover:underline flex items-center gap-1"
            >
              Buka Simulator Penuh di Lab Praktik →
            </button>
          </div>
        </div>

        {/* Right: Fasilitator Pendamping Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-[#24213A]">Fasilitator Pendamping</h4>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5838E8]">
              Mentoring Aktif
            </span>
          </div>

          {/* Mentor Profile info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80"
              alt="Chef Arya Pratama"
              className="w-13 h-13 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h5 className="font-extrabold text-sm text-slate-900 truncate">Chef Arya Pratama</h5>
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                  ✓
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Owner @DapurKolektif • 12th Pengalaman Bisnis F&B
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                ★ 4.9/5.0 <span className="text-slate-400 font-normal">(84 sesi review)</span>
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#C6F135]/25 border border-[#C6F135]/50 text-xs text-[#2E4100] flex items-start gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#3D5600]" />
            <span className="leading-relaxed">
              <strong>Tersedia 2 slot konsultasi</strong> minggu ini untuk evaluasi penetapan HPP dan uji rasa menu. (Membutuhkan 1 Kredit Belajar)
            </span>
          </div>

          <button
            onClick={onScheduleMentor}
            className="w-full py-3 bg-[#5838E8] hover:bg-[#4724C4] text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md shadow-[#5838E8]/20 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Jadwalkan Konsultasi 1-on-1
          </button>
        </div>
      </div>

      {/* 5. Bottom Discussion Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5838E8] flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-sm text-slate-900">
              Diskusi Terbaru: "Tips negosiasi harga telur grosir untuk usaha pastry"
            </h5>
            <p className="text-xs text-slate-400 mt-0.5">
              14 mahasiswa pengusaha baru saja membagikan vendor lokal terpercaya di Jawa Timur.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('community')}
          className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-[#5838E8] text-[#5838E8] hover:text-white text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0"
        >
          Ikuti Diskusi →
        </button>
      </div>

      {/* 6. Footer */}
      <footer className="pt-6 border-t border-slate-200/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>© 2024 Kawira Inc. Gerakan Inkubasi Bisnis Wirausaha Muda Kampus Merdeka.</span>
        <div className="flex items-center gap-4 text-slate-500 font-semibold">
          <a href="#" className="hover:text-[#5838E8]">Panduan Praktik</a>
          <a href="#" className="hover:text-[#5838E8]">Pusat Bantuan</a>
          <a href="#" className="hover:text-[#5838E8]">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  );
};
