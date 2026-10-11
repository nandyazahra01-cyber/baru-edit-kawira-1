import React, { useState } from 'react';
import { X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { KawiraLogo } from './KawiraLogo';

interface AuthModalProps {
  initialMode?: 'login' | 'register' | 'staff';
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; campus?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'staff'>(initialMode);
  const [staffRole, setStaffRole] = useState<'mentor' | 'admin'>('mentor');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('kawira.anindya@student.ub.ac.id');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [campus, setCampus] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const displayName = email.split('@')[0].replace(/[._-]/g, ' ');
    onLoginSuccess({
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
      campus: campus || 'Universitas Brawijaya',
    });
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffRole === 'mentor') {
      onLoginSuccess({
        name: 'Kak Aditya Ramadhan',
        email: email || 'aditya.ramadhan@mentor.kawira.id',
        campus: 'Universitas Brawijaya (Mentor P2MW)',
      });
    } else {
      onLoginSuccess({
        name: 'Admin Ekosistem Kawira',
        email: email || 'admin@kawira.id',
        campus: 'Pusat Inkubasi Kawira Indonesia',
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    onLoginSuccess({
      name,
      email,
      campus: campus || 'Universitas Brawijaya',
    });
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: 'Kawira Anindya',
      email: 'kawira.anindya@student.ub.ac.id',
      campus: 'Universitas Brawijaya',
    });
  };

  const handleGoogleLogin = () => {
    onLoginSuccess({
      name: 'Kawan Pengusaha',
      email: 'pengusaha.muda@gmail.com',
      campus: 'Institut Teknologi Bandung',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative border border-slate-100 grid md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Promo Banner */}
        <div className="hidden md:flex flex-col justify-between p-8 lg:p-10 bg-gradient-to-br from-[#6C4CF5] via-[#7B5BF7] to-[#8E72F8] text-white relative overflow-hidden">
          <div className="relative z-10">
            <KawiraLogo variant="white" size="sm" />
            <div className="mt-8">
              <span className="inline-block px-3 py-1 bg-white/15 text-[#C6F135] text-xs font-extrabold uppercase tracking-wider rounded-full mb-3">
                PLATFORM WIRAUSAHA MUDA
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
                Kembangkan Bisnis Bersama{' '}
                <span className="text-[#C6F135] underline decoration-[#FF3E80] decoration-4 underline-offset-4">
                  Mentor Sebaya.
                </span>
              </h2>
              <p className="mt-3 text-sm text-purple-100 leading-relaxed">
                Akses konsultasi mentor alumni P2MW & PKM-K, pembukuan kas, kalkulator HPP/BEP, dan komunitas wirausaha muda.
              </p>
            </div>

            {/* Quick Proof Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15">
              <div>
                <p className="text-xl font-black text-white">1.200+</p>
                <p className="text-[11px] text-purple-200">Pengguna</p>
              </div>
              <div>
                <p className="text-xl font-black text-[#C6F135]">340+</p>
                <p className="text-[11px] text-purple-200">Sesi Mentoring</p>
              </div>
              <div>
                <p className="text-xl font-black text-[#FFF199]">4.9/5</p>
                <p className="text-[11px] text-purple-200">Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Testimonial Snippet */}
          <div className="relative z-10 mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF3E80] to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                RA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Rizka Amalia · Dapur Camilan</p>
                <p className="text-[11px] text-[#C6F135]">Alumni P2MW 2024</p>
              </div>
            </div>
            <p className="text-[12px] text-purple-100 italic mt-2">
              "Mentor sebaya di Kawira mengerti banget tantangan mahasiswa. HPP kami jadi rapi dan omzet naik 3x lipat!"
            </p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="p-6 md:p-8 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
          {mode === 'login' && (
            <div>
              <div className="text-center md:text-left mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4CF5]">
                  SELAMAT DATANG KEMBALI
                </span>
                <h3 className="text-2xl font-extrabold text-[#24213A] mt-1">Masuk ke Kawira</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Lanjutkan bimbingan wirausaha dan kelola bisnismu hari ini.
                </p>
              </div>

              {/* 1-Click Demo Login Banner */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full mb-4 py-2.5 px-4 bg-[#C6F135]/30 hover:bg-[#C6F135]/50 border border-[#9CBD0C] text-[#2D3F00] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#6C4CF5]" />
                Masuk Instan (Demo Mode) — Tanpa Ketik
              </button>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-3 transition-colors mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Masuk dengan Google
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] font-semibold text-slate-400">atau dengan email</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kampus.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-[11px] font-semibold text-[#6C4CF5] hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all mt-2"
                >
                  Masuk Sekarang →
                </button>
              </form>

              <p className="text-center text-xs text-slate-600 mt-5">
                Belum punya akun Kawira?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#6C4CF5] hover:underline"
                >
                  Daftar Gratis
                </button>
              </p>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Akses fasilitator & tim?</span>
                <button
                  type="button"
                  onClick={() => setMode('staff')}
                  className="font-bold text-[#0D9488] hover:underline flex items-center gap-1"
                >
                  Portal Staf (Mentor & Admin) →
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <div className="text-center md:text-left mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4CF5]">
                  MULAI BERTUMBUH
                </span>
                <h3 className="text-2xl font-extrabold text-[#24213A] mt-1">Buat Akun Kawira</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Daftar gratis dan terhubung dengan ekosistem wirausaha mahasiswa.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Kawira Anindya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kampus.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asal Kampus / Sekolah</label>
                  <input
                    type="text"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="Contoh: Universitas Brawijaya"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="terms" defaultChecked className="rounded text-[#6C4CF5]" />
                  <label htmlFor="terms" className="text-[11px] text-slate-600">
                    Saya menyetujui ketentuan privasi & penggunaan Kawira
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all mt-2"
                >
                  Daftar Akun Baru →
                </button>
              </form>

              <p className="text-center text-xs text-slate-600 mt-4">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#6C4CF5] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <div className="text-center md:text-left mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C4CF5]">
                  PEMULIHAN KATA SANDI
                </span>
                <h3 className="text-2xl font-extrabold text-[#24213A] mt-1">Lupa Kata Sandi?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan email terdaftar kamu untuk menerima tautan pemulihan.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Tautan pemulihan akun telah dikirim ke ${email}`);
                  setMode('login');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kampus.ac.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all"
                >
                  Kirim Tautan Pemulihan →
                </button>
              </form>

              <p className="text-center text-xs text-slate-600 mt-6">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#6C4CF5] hover:underline"
                >
                  ← Kembali ke Halaman Masuk
                </button>
              </p>
            </div>
          )}

          {mode === 'staff' && (
            <div>
              <div className="text-center md:text-left mb-5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488] bg-teal-50 px-2.5 py-0.5 rounded-full inline-block">
                  STAFF & MENTOR ACCESS
                </span>
                <h3 className="text-2xl font-extrabold text-[#202D3B] mt-1.5">Portal Masuk Staf</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akses workspace mentor sebaya dan panel manajemen ekosistem Kawira.
                </p>
              </div>

              {/* Role switcher matching kawira-login-staff */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStaffRole('mentor')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    staffRole === 'mentor'
                      ? 'bg-white text-[#2B3A4A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="text-[#0D9488]">✦</span> Mentor Praktisi
                </button>
                <button
                  type="button"
                  onClick={() => setStaffRole('admin')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    staffRole === 'admin'
                      ? 'bg-white text-[#2B3A4A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="text-[#0D9488]">▦</span> Admin Pengelola
                </button>
              </div>

              {/* Instant 1-Click Staff Demo */}
              <button
                type="button"
                onClick={() => {
                  if (staffRole === 'mentor') {
                    onLoginSuccess({
                      name: 'Kak Aditya Ramadhan',
                      email: 'aditya.ramadhan@mentor.kawira.id',
                      campus: 'Universitas Brawijaya (Mentor P2MW)',
                    });
                  } else {
                    onLoginSuccess({
                      name: 'Admin Ekosistem Kawira',
                      email: 'admin@kawira.id',
                      campus: 'Pusat Inkubasi Kawira Indonesia',
                    });
                  }
                }}
                className="w-full mb-3.5 py-2.5 px-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0A766E] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#0D9488]" />
                Masuk Langsung sebagai {staffRole === 'mentor' ? 'Mentor (Aditya Ramadhan)' : 'Admin Ekosistem'}
              </button>

              <form onSubmit={handleStaffLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Staf</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={staffRole === 'mentor' ? 'mentor@kawira.id' : 'admin@kawira.id'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/15"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#2B3A4A] hover:bg-[#202D3B] text-white font-bold rounded-xl shadow-md transition-all mt-1"
                >
                  Masuk ke Workspace {staffRole === 'mentor' ? 'Mentor' : 'Admin'} →
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-4">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#6C4CF5] hover:underline"
                >
                  ← Kembali ke Masuk Mahasiswa
                </button>
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
                <span>Halaman Mandiri:</span>
                <a href="/mentor-workspace.html" className="text-[#0D9488] hover:underline font-bold">Workspace Mentor</a>
                <span>•</span>
                <a href="/admin-dashboard.html" className="text-[#0D9488] hover:underline font-bold">Dashboard Admin</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
