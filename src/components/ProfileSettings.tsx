import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Wallet, 
  Lock, 
  Bell, 
  Plus, 
  Save, 
  ShieldCheck, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  walletBalance: number;
  walletLedger: WalletTransaction[];
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenTopUp: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  walletBalance,
  walletLedger,
  onUpdateProfile,
  onOpenTopUp,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'security'>('profile');

  // Local form state
  const [form, setForm] = useState<UserProfile>({ ...profile });

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifySession, setNotifySession] = useState(true);
  const [notifyWebinar, setNotifyWebinar] = useState(true);
  const [notifyCommunity, setNotifyCommunity] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(form);
    onShowToast('Profil usaha berhasil diperbarui.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      onShowToast('Kata sandi baru minimal 6 karakter.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Kata sandi akun berhasil diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5]">
            PENGATURAN PENGGUNA
          </span>
          <h2 className="text-2xl font-black text-[#24213A] mt-0.5">
            {activeTab === 'profile' && 'Data Diri & Profil Usaha'}
            {activeTab === 'wallet' && 'Dompet & Arus Saldo Mentoring'}
            {activeTab === 'security' && 'Pengaturan Akun & Keamanan'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'profile' && 'Kelola identitas pemilik dan ringkasan usaha untuk personalisasi bimbingan.'}
            {activeTab === 'wallet' && 'Kelola saldo untuk pemesanan sesi konsultasi bersama mentor sebaya.'}
            {activeTab === 'security' && 'Kelola keamanan akun kata sandi dan preferensi pengingat.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Profil Usaha
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'wallet'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Dompet ({Math.round(walletBalance / 1000)}k)
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'security'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Keamanan
          </button>
        </div>
      </div>

      {/* 2. Tab 1: Data Diri & Profil Usaha */}
      {activeTab === 'profile' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Mini Summary Box */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-[#6C4CF5] to-[#8E72F8] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-[#6C4CF5]/20 relative">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt={form.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                ) : null}
                <span>{(form.name || 'UK').slice(0, 2).toUpperCase()}</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#C6F135] text-[#24213A] flex items-center justify-center text-xs font-black border-2 border-white">
                ✓
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-[#24213A]">{form.name || 'Nama Pengguna'}</h3>
              <p className="text-xs text-slate-500">{form.campus || 'Kampus belum diisi'}</p>
              <span className="text-[10px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-2.5 py-0.5 rounded-full mt-2 inline-block">
                {form.userStatus} · {form.status}
              </span>
            </div>

            {/* Wallet Quick Box */}
            <div className="p-4 bg-[#FAF9FF] rounded-2xl border border-purple-100 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Saldo Mentoring</span>
                <Wallet className="w-3.5 h-3.5 text-[#6C4CF5]" />
              </div>
              <strong className="text-lg font-black text-[#6C4CF5] block">
                Rp {walletBalance.toLocaleString('id-ID')}
              </strong>
              <button
                type="button"
                onClick={onOpenTopUp}
                className="mt-2.5 w-full py-1.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl transition-all shadow-xs"
              >
                + Isi Saldo Dompet
              </button>
            </div>
          </div>

          {/* Right Edit Form */}
          <form
            onSubmit={handleSaveProfile}
            className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            {/* Part 1: Personal Data */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-extrabold text-sm text-[#24213A]">1. Data Diri Pemilik Usaha</h4>
                <span className="text-[10px] font-bold text-slate-400">Identitas Pribadi</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Pengguna</label>
                  <select
                    value={form.userStatus}
                    onChange={(e) => setForm({ ...form, userStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  >
                    <option value="Mahasiswa">Mahasiswa</option>
                    <option value="Pelajar">Pelajar</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asal Kampus / Sekolah</label>
                  <input
                    type="text"
                    value={form.campus}
                    onChange={(e) => setForm({ ...form, campus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+62 812..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Tautan Instagram / LinkedIn Toko</label>
                  <input
                    type="text"
                    value={form.social}
                    onChange={(e) => setForm({ ...form, social: e.target.value })}
                    placeholder="instagram.com/namatokomu"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Foto Profil / Avatar (URL)</label>
                  <input
                    type="text"
                    value={form.avatarUrl || ''}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold">Pilihan Foto Mahasiswa:</span>
                    {[
                      { label: 'Mahasiswi 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
                      { label: 'Mahasiswa 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' },
                      { label: 'Mahasiswi 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
                      { label: 'Mahasiswa 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                    ].map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setForm({ ...form, avatarUrl: p.url })}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-[#6C4CF5] hover:text-white text-slate-600 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Part 2: Business Profile */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-extrabold text-sm text-[#24213A]">2. Profil Bisnis Rintisan</h4>
                <span className="text-[10px] font-bold text-[#6C4CF5]">Dipakai Saat Diskusi Mentor</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Usaha / Brand</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Contoh: Dapur Ricebowl Nusantara"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bidang Usaha</label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Jasa">Jasa</option>
                    <option value="Kreatif">Kreatif</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahap Usaha</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  >
                    <option value="Baru Merintis">Baru Merintis</option>
                    <option value="Berjalan (Early Stage)">Berjalan (Early Stage)</option>
                    <option value="Sedang Berkembang">Sedang Berkembang</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Jalur / Judul Program Usaha</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Contoh: Peserta Hibah P2MW Kemendikbud 2026 / Usaha Mandiri"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Produk</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Ceritakan produk unggulan, target pasar mahasiswa/umum..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Kendala Utama yang Dihadapi</label>
                  <textarea
                    rows={2}
                    value={form.challenge}
                    onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                    placeholder="Contoh: Perhitungan HPP belum pas, sulit bagi waktu kuliah & produksi, konten promosi sepi..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/25 flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Tab 2: Dompet & Saldo Mentoring */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase text-[#6C4CF5] tracking-wider block">
                SALDO KONSULTASI MENTOR
              </span>
              <strong className="text-3xl font-black text-[#24213A] mt-1 block">
                Rp {walletBalance.toLocaleString('id-ID')}
              </strong>
              <p className="text-xs text-slate-500 mt-1">
                Saldo terpotong otomatis saat kamu menjadwalkan sesi konsultasi dengan mentor.
              </p>
            </div>

            <button
              onClick={onOpenTopUp}
              className="py-3 px-6 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Isi Saldo Dompet
            </button>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-[#24213A] mb-1">Riwayat Arus Saldo Mentoring</h3>
            <p className="text-xs text-slate-500 mb-4">Catatan isi saldo (top up) dan pembayaran sesi konsultasi.</p>

            <div className="divide-y divide-slate-100">
              {walletLedger.length > 0 ? (
                walletLedger
                  .slice()
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                            item.type === 'topup'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-[#FF3E80]'
                          }`}
                        >
                          {item.type === 'topup' ? '+' : '−'}
                        </div>
                        <div>
                          <strong className="font-extrabold text-slate-800 block">{item.note}</strong>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                      </div>

                      <strong
                        className={`text-sm font-extrabold ${
                          item.type === 'topup' ? 'text-emerald-600' : 'text-[#FF3E80]'
                        }`}
                      >
                        {item.type === 'topup' ? '+' : '−'} Rp {item.amount.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">Belum ada riwayat transaksi saldo.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab 3: Pengaturan Akun & Keamanan */}
      {activeTab === 'security' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Password Change Form */}
          <form
            onSubmit={handleChangePassword}
            className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-[#24213A]">Ubah Kata Sandi</h3>
              <p className="text-xs text-slate-500">Perbarui kata sandi untuk mengamankan akun tokomu.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Terdaftar</label>
              <input
                type="text"
                disabled
                value={profile.email}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-6 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/25 transition-all"
              >
                Simpan Kata Sandi Baru
              </button>
            </div>
          </form>

          {/* Notification Preferences */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-base font-extrabold text-[#24213A]">Pengingat & Notifikasi</h3>
              <p className="text-xs text-slate-500">Pilih notifikasi otomatis yang ingin kamu terima.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between gap-3 p-3 bg-[#FAF9FF] rounded-2xl border border-purple-50">
                <div>
                  <strong className="text-slate-800 block">Pengingat Sesi Mentoring</strong>
                  <span className="text-[11px] text-slate-500">Notifikasi 2 jam sebelum jadwal konsultasi</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySession}
                  onChange={(e) => setNotifySession(e.target.checked)}
                  className="rounded text-[#6C4CF5] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-[#FAF9FF] rounded-2xl border border-purple-50">
                <div>
                  <strong className="text-slate-800 block">Info Webinar & Hibah P2MW</strong>
                  <span className="text-[11px] text-slate-500">Update pendaftaran kompetisi wirausaha</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWebinar}
                  onChange={(e) => setNotifyWebinar(e.target.checked)}
                  className="rounded text-[#6C4CF5] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-[#FAF9FF] rounded-2xl border border-purple-50">
                <div>
                  <strong className="text-slate-800 block">Update Komunitas & Teman Rintis</strong>
                  <span className="text-[11px] text-slate-500">Pemberitahuan ajakan kolaborasi mitra</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyCommunity}
                  onChange={(e) => setNotifyCommunity(e.target.checked)}
                  className="rounded text-[#6C4CF5] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
