import React from 'react';
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Calculator, 
  BookOpen, 
  Share2, 
  Star,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { KawiraLogo } from './KawiraLogo';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register' | 'staff') => void;
  onEnterAppDirectly: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onEnterAppDirectly }) => {
  return (
    <div className="min-h-screen bg-white text-[#24213A] selection:bg-[#C6F135] selection:text-[#24213A]">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          <KawiraLogo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#tentang" className="hover:text-[#6C4CF5] transition-colors">Tentang Kami</a>
            <a href="#layanan" className="hover:text-[#6C4CF5] transition-colors">Layanan Utama</a>
            <a href="#mentoring-preview" className="hover:text-[#6C4CF5] transition-colors">Mentor Sebaya</a>
            <a href="#komunitas" className="hover:text-[#6C4CF5] transition-colors">Komunitas</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenAuth('staff')}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-[#0D9488] hover:bg-teal-50 rounded-xl transition-colors"
            >
              Portal Staf
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#6C4CF5] rounded-xl hover:bg-slate-50 transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 text-sm font-bold bg-[#6C4CF5] hover:bg-[#5838E8] text-white rounded-xl shadow-md shadow-[#6C4CF5]/20 hover:-translate-y-0.5 transition-all"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-[#FAF9FF] via-white to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9FF] border border-[#6C4CF5]/20 text-[#6C4CF5] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C6F135]" />
              PLATFORM WIRAUSAHA MAHASISWA INDONESIA
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#24213A]">
              Kembangkan Bisnis Bersama{' '}
              <span className="text-[#6C4CF5] relative inline-block">
                Sesama.
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#C6F135]/50 -z-10 rounded-sm" />
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Temukan mentor sebaya alumni P2MW & PKM-K, catat pembukuan kas harian, hitung kalkulator HPP/BEP, dan tumbuh bersama ekosistem wirausaha muda.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white font-extrabold rounded-xl shadow-lg shadow-[#6C4CF5]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Mulai Konsultasi Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onEnterAppDirectly}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FAF9FF] hover:bg-purple-100/60 border border-[#6C4CF5]/30 text-[#6C4CF5] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FF3E80]" />
                Jelajahi Demo Langsung
              </button>
            </div>

            {/* Social Proof Bar */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                {[
                  { init: 'AR', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80' },
                  { init: 'SP', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
                  { init: 'BS', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
                  { init: 'NK', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#6C4CF5] to-[#FF3E80] text-white flex items-center justify-center text-[10px] font-black overflow-hidden relative"
                  >
                    <img
                      src={item.img}
                      alt="Wirausaha Muda"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <span className="text-[9px]">{item.init}</span>
                  </div>
                ))}
              </div>
              <div className="text-left text-xs text-slate-600">
                <span className="font-extrabold text-[#24213A]">1.200+ Wirausaha Muda</span>
                <span className="block text-slate-400">Telah bergabung & berproses bersama</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Interactive App Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/80 rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 mb-4 text-xs text-slate-400 font-semibold">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-auto font-mono text-[11px]">app.kawira.id</span>
              </div>

              {/* Mock Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6C4CF5] to-[#8E72F8] text-white mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-[#C6F135]">
                    TEMAN BERTUMBUH
                  </span>
                  <span className="text-[10px] text-white/80">Batch 2026</span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base">Halo, Pengusaha Muda! 👋</h4>
                <p className="text-xs text-purple-100 mt-0.5">Kelola usaha kuliner lebih terarah & berdaya.</p>
              </div>

              {/* Mock Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-[#FAF9FF] p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Pemasukan</span>
                  <strong className="text-xs font-black text-emerald-600 block mt-0.5">Rp 575.000</strong>
                </div>
                <div className="bg-[#FAF9FF] p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Pengeluaran</span>
                  <strong className="text-xs font-black text-[#FF3E80] block mt-0.5">Rp 195.000</strong>
                </div>
                <div className="bg-[#24213A] p-2.5 rounded-xl text-white text-center">
                  <span className="text-[10px] text-purple-200 font-bold block">Saldo Kas</span>
                  <strong className="text-xs font-black text-[#C6F135] block mt-0.5">Rp 380.000</strong>
                </div>
              </div>

              {/* Mock Mentor Card */}
              <div className="p-3 rounded-xl border border-purple-100 bg-[#FAF9FF] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#6C4CF5] text-white font-black text-xs flex items-center justify-center flex-shrink-0 relative">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                      alt="Kak Aditya Ramadhan"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <span>AR</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 truncate">Kak Aditya Ramadhan</p>
                    <p className="text-[10px] text-slate-500 truncate">Alumni P2MW · Mentor Kuliner</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#C6F135] text-[#24213A] text-[10px] font-black rounded-lg whitespace-nowrap">
                  Tersedia
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tentang Kami (Mission & Stats) */}
      <section id="tentang" className="py-20 bg-gradient-to-r from-[#6C4CF5] via-[#7859F6] to-[#8A6EF7] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-3xl font-black text-[#C6F135]">1.200+</span>
              <p className="text-xs text-purple-100 font-semibold mt-1">Mahasiswa Aktif</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-3xl font-black text-white">340+</span>
              <p className="text-xs text-purple-100 font-semibold mt-1">Sesi Mentoring Berjalan</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-3xl font-black text-[#FFF199]">85%</span>
              <p className="text-xs text-purple-100 font-semibold mt-1">Belum Pernah Punya Mentor</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-3xl font-black text-[#C6F135]">4.9 / 5</span>
              <p className="text-xs text-purple-100 font-semibold mt-1">Rating Kepuasan Sesi</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-xs font-black uppercase tracking-wider text-[#C6F135] px-3 py-1 rounded-full bg-white/10 inline-block mb-3">
              TENTANG KAMI
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-snug">
              Dibangun oleh Mahasiswa, <br />
              <span className="serif-accent italic text-purple-100 font-normal">untuk Mahasiswa.</span>
            </h2>
            <p className="mt-4 text-purple-100 leading-relaxed text-sm sm:text-base">
              Kawira hadir sebagai teman belajar dan bertumbuh bagi wirausaha muda yang sedang melewati fase awal rintisan. Kami menghubungkan pencatatan keuangan riil dengan pendampingan mentor sebaya alumni P2MW & PKM-K agar saran mentoring lebih tepat sasaran.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {['Mentor Sebaya P2MW', 'Buku Kas Sederhana', 'Kalkulator HPP & BEP', 'Modul Praktis', 'Komunitas Mitra'].map((tag, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/15 text-white font-bold">
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Layanan Kami (4 Core Pillars) */}
      <section id="layanan" className="py-20 bg-[#FAF9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5] px-3 py-1 rounded-full bg-purple-100/70 inline-block mb-2">
              LAYANAN UTAMA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#24213A] tracking-tight">
              Semua yang Kamu Butuhkan <br />
              <span className="text-[#6C4CF5]">dalam Satu Platform</span>
            </h2>
            <p className="mt-3 text-slate-500 text-sm">
              Empat pilar layanan terpadu Kawira dirancang sesuai kebutuhan mahasiswa di fase awal usaha.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Mentoring */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#6C4CF5]/10 text-[#6C4CF5] flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-[#FF3E80] inline-block mb-2">
                  MENTORING SEBAYA
                </span>
                <h3 className="text-lg font-bold text-[#24213A]">Pilih Mentor</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Konsultasi intensif dengan mentor sebaya alumni P2MW/PKM-K atau praktisi UMKM sesuai bidang usahamu.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> Filter bidang & keahlian
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> Tarif terjangkau mahasiswa
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> Sesi Chat & Google Meet
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterAppDirectly}
                className="mt-6 w-full py-2 bg-purple-50 hover:bg-[#6C4CF5] text-[#6C4CF5] hover:text-white text-xs font-bold rounded-xl transition-colors"
              >
                Cari Mentor →
              </button>
            </div>

            {/* Pillar 2: Pembukuan & Kalkulator */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mb-2">
                  KEUANGAN USAHA
                </span>
                <h3 className="text-lg font-bold text-[#24213A]">Buku Kas & HPP/BEP</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Catat transaksi harian dan gunakan kalkulator bisnis interaktif untuk menentukan margin laba yang sehat.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Buku kas harian & arus masuk
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hitung HPP per unit instan
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hitung target titik impas BEP
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterAppDirectly}
                className="mt-6 w-full py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold rounded-xl transition-colors"
              >
                Coba Kalkulator →
              </button>
            </div>

            {/* Pillar 3: Modul & Panduan */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 inline-block mb-2">
                  EDUKASI PRAKTIS
                </span>
                <h3 className="text-lg font-bold text-[#24213A]">Modul & Template</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Materi ringkas step-by-step tentang marketing TikTok/Reels, legalitas NIB/PIRT, SEO, dan template promosi.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Modul bacaan 6-12 menit
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Checklist legalitas NIB OSS
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Template promosi siap pakai
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterAppDirectly}
                className="mt-6 w-full py-2 bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white text-xs font-bold rounded-xl transition-colors"
              >
                Buka Modul →
              </button>
            </div>

            {/* Pillar 4: Komunitas & Networking */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6C4CF5] flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-[#6C4CF5] inline-block mb-2">
                  JARINGAN BISNIS
                </span>
                <h3 className="text-lg font-bold text-[#24213A]">Komunitas & Mitra</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Bangun relasi, ikuti agenda sharing mingguan, dan temukan co-founder di papan "Teman Rintis".
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> WhatsApp Official Group
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> Kawira Discord Lounge
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C4CF5]" /> Papan cari co-founder/mitra
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterAppDirectly}
                className="mt-6 w-full py-2 bg-purple-50 hover:bg-[#6C4CF5] text-[#6C4CF5] hover:text-white text-xs font-bold rounded-xl transition-colors"
              >
                Gabung Komunitas →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mentor Preview Grid */}
      <section id="mentoring-preview" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5] px-3 py-1 rounded-full bg-purple-100/70 inline-block mb-2">
                MENTOR SEBAYA PILIHAN
              </span>
              <h2 className="text-3xl font-black text-[#24213A] tracking-tight">Belajar dari yang Sudah Pernah Berhasil</h2>
            </div>
            <button
              onClick={onEnterAppDirectly}
              className="text-sm font-bold text-[#6C4CF5] hover:text-[#5838E8] flex items-center gap-1"
            >
              Lihat Seluruh Mentor (6+) →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kak Aditya Ramadhan',
                campus: 'Universitas Brawijaya',
                status: 'Alumni P2MW',
                sector: 'Kuliner',
                rating: 4.9,
                price: 25000,
                initial: 'AR',
                bg: 'bg-purple-600',
                avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
                bio: 'Mendampingi usaha makanan & minuman dari validasi ide, kalkulasi HPP, hingga tembus pendanaan P2MW 2024.'
              },
              {
                name: 'Kak Sari Indah Pertiwi',
                campus: 'Universitas Gadjah Mada',
                status: 'Alumni PKM-K',
                sector: 'Marketing',
                rating: 4.8,
                price: 30000,
                initial: 'SP',
                bg: 'bg-pink-600',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                bio: 'Fokus pada strategi konten organik TikTok, digital funnel Tokopedia & Shopee, serta ads modal mahasiswa.'
              },
              {
                name: 'Kak Budi Santoso',
                campus: 'Institut Teknologi Bandung',
                status: 'Wirausaha Muda',
                sector: 'Teknologi',
                rating: 4.7,
                price: 35000,
                initial: 'BS',
                bg: 'bg-amber-600',
                avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
                bio: 'Membantu startup & jasa kreatif menyusun paket layanan B2B, penentuan BEP, dan proposal kerja sama.'
              }
            ].map((m, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all">
                <div>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl overflow-hidden ${m.bg} text-white font-extrabold flex items-center justify-center text-sm flex-shrink-0 relative`}>
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span>{m.initial}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-sm truncate">{m.name}</h4>
                      <p className="text-xs text-slate-500">{m.campus}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold bg-[#C6F135]/40 text-[#3A4E00] px-2 py-0.5 rounded-full">
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">{m.bio}</p>

                  <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {m.rating}
                    </span>
                    <strong className="text-[#6C4CF5] font-extrabold">
                      Rp {m.price.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">/sesi</span>
                    </strong>
                  </div>
                </div>

                <button
                  onClick={onEnterAppDirectly}
                  className="mt-5 w-full py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#6C4CF5]/20"
                >
                  Jadwalkan Konsultasi
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Komunitas Preview & CTA */}
      <section id="komunitas" className="py-20 bg-[#FAF9FF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5] px-3 py-1 rounded-full bg-purple-100/70 inline-block mb-2">
              KOMUNITAS MAHASISWA
            </span>
            <h2 className="text-3xl font-black text-[#24213A] tracking-tight">Bergabung dengan Jaringan Kami</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Perluas relasi lintas kampus, dapatkan update info hibah P2MW/PKM-K, dan temukan rekan kolaborasi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xl font-bold">
                WA
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-800">WhatsApp Group</h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">850+</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Grup diskusi harian, info webinar, dan kurasi hibah.</p>
                <button
                  onClick={() => window.open('https://chat.whatsapp.com', '_blank')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Gabung Grup WhatsApp <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#5865F2] flex items-center justify-center flex-shrink-0 text-xl font-bold">
                DC
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-800">Discord Server</h4>
                  <span className="text-[10px] font-bold bg-indigo-100 text-[#5865F2] px-2 py-0.5 rounded-full">Aktif 24/7</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Kawira Lounge: voice chat, co-working & bedah pitch deck.</p>
                <button
                  onClick={() => window.open('https://discord.com', '_blank')}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#5865F2] hover:text-indigo-800"
                >
                  Masuk ke Server Discord <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Big CTA Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#6C4CF5] via-[#7B5CF5] to-[#9278F7] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-white/20 text-[#C6F135]">
                SIAP MULAI?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2">Mulai Perjalanan Wirausahamu Hari Ini</h3>
              <p className="text-xs sm:text-sm text-purple-100 mt-2">
                Daftar akun gratis, temukan mentor yang cocok, dan kelola keuangan bisnismu lebih terarah.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 bg-[#C6F135] hover:bg-[#b5e022] text-[#24213A] font-black rounded-xl text-sm shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0"
            >
              Mulai Konsultasi Gratis →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#171524] text-slate-400 py-14 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <KawiraLogo variant="white" size="sm" />
            <p className="text-xs text-slate-400 mt-4 max-w-sm leading-relaxed">
              Kawira (Kawan Berwirausaha) adalah platform mentoring sebaya dan pendampingan usaha mahasiswa Indonesia.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Fitur Platform</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#layanan" className="hover:text-white transition-colors">Mentoring Sebaya</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Pembukuan Kas</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Kalkulator HPP & BEP</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Modul & Template</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Komunitas</h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#komunitas" className="hover:text-white transition-colors">WhatsApp Channel</a></li>
              <li><a href="#komunitas" className="hover:text-white transition-colors">Discord Lounge</a></li>
              <li><a href="#komunitas" className="hover:text-white transition-colors">Teman Rintis (Mitra)</a></li>
              <li><a href="#komunitas" className="hover:text-white transition-colors">Agenda Webinar</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Kawira (Kawan Berwirausaha). Platform Wirausaha Muda Indonesia.
        </div>
      </footer>
    </div>
  );
};
