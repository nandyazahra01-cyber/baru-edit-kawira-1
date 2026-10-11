import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Share2, 
  X,
  Sparkles
} from 'lucide-react';
import { CommunityEvent, CollabRequest } from '../types';

interface CommunityCenterProps {
  events: CommunityEvent[];
  collabs: CollabRequest[];
  onRegisterEvent: (eventId: string) => void;
  onAddCollab: (collab: CollabRequest) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CommunityCenter: React.FC<CommunityCenterProps> = ({
  events,
  collabs,
  onRegisterEvent,
  onAddCollab,
  onShowToast,
}) => {
  const [selectedCollabType, setSelectedCollabType] = useState<string>('Semua');
  const [showCollabModal, setShowCollabModal] = useState(false);

  // New collab form
  const [collabTitle, setCollabTitle] = useState('');
  const [collabType, setCollabType] = useState<CollabRequest['type']>('Cari Co-founder');
  const [collabSector, setCollabSector] = useState('Kuliner');
  const [collabDesc, setCollabDesc] = useState('');
  const [collabWa, setCollabWa] = useState('+62 812');

  const collabTypes = ['Semua', 'Cari Co-founder', 'Kolaborasi Produk', 'Cari Desainer', 'Pemasaran Digital'];

  const filteredCollabs = collabs.filter((c) => {
    if (selectedCollabType === 'Semua') return true;
    return c.type === selectedCollabType;
  });

  const handleCreateCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collabTitle || !collabDesc) return;

    onAddCollab({
      id: `c_${Date.now()}`,
      name: 'Saya (Founder)',
      businessName: collabTitle,
      sector: collabSector,
      type: collabType,
      description: collabDesc,
      contactWa: collabWa,
      status: 'Open for Collab',
    });

    setShowCollabModal(false);
    setCollabTitle('');
    setCollabDesc('');
    onShowToast('Ajakan kolaborasi berhasil dipublikasikan di Teman Rintis!');
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText('https://kawira.id/komunitas/undang/KAWIRA-2026');
    onShowToast('Tautan undangan komunitas berhasil disalin.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6C4CF5] via-[#7859F6] to-[#8C70F7] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-white/20 text-[#C6F135] uppercase tracking-wider mb-2 inline-block">
            PUSAT KOMUNITAS & JEJARING
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bangun Relasi Bersama Wirausaha Muda
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-2 max-w-xl leading-relaxed">
            Perluas jaringan wirausaha kampus. Dapatkan info hibah kompetisi (P2MW/PKM-K), ikuti webinar sharing, dan temukan mitra bisnis di Teman Rintis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowCollabModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Ajakan Kolaborasi
          </button>
          <button
            onClick={handleCopyInviteLink}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Undang Teman
          </button>
        </div>
      </div>

      {/* 2. Official Channels Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
                  WA
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    WHATSAPP OFFICIAL
                  </span>
                  <h3 className="text-base font-extrabold text-[#24213A]">Grup Diskusi Harian & Info Hibah</h3>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Aktif" />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Kanal utama informasi kurasi kompetisi nasional, pengingat jadwal bimbingan, dan networking ringan dengan 850+ mahasiswa.
            </p>

            <div className="flex flex-wrap gap-2 my-4">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                #Info-P2MW
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                #Networking
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                #Sharing-Bisnis
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onShowToast('Membuka tautan WhatsApp grup komunitas...');
              window.open('https://chat.whatsapp.com', '_blank');
            }}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            Buka Grup WhatsApp <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Discord Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#5865F2] flex items-center justify-center text-xl font-black">
                  DC
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#5865F2]">
                    DISCORD SERVER
                  </span>
                  <h3 className="text-base font-extrabold text-[#24213A]">Kawira Lounge</h3>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                24/7 Voice & Coworking
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Ruang diskusi interaktif, voice stage klinik pitching, dan saluran diskusi per industri (kuliner, fashion, teknologi, jasa).
            </p>

            <div className="flex flex-wrap gap-2 my-4">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                #Voice-Lounge
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                #Klinik-Pitching
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                #F&B-Discussion
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onShowToast('Membuka tautan Discord Kawira Lounge...');
              window.open('https://discord.com', '_blank');
            }}
            className="w-full py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#6C4CF5]/20"
          >
            Masuk Discord Server <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Split 2: Agenda Sharing & Teman Rintis Board */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Agenda Sharing */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-extrabold text-[#24213A]">Agenda & Sesi Sharing</h3>
              <p className="text-xs text-slate-500">Ikuti kegiatan sharing gratis bersama mentor & praktisi.</p>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100/80 space-y-2 hover:border-[#6C4CF5]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-[#6C4CF5]">
                    {ev.type}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ev.status === 'Live' ? 'bg-[#FF3E80] text-white animate-pulse' : 'bg-[#C6F135]/40 text-[#364b00]'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>

                <div className="flex items-start gap-3 my-1">
                  {ev.hostAvatarUrl && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#6C4CF5] text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 relative">
                      <img
                        src={ev.hostAvatarUrl}
                        alt={ev.host}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span>{ev.host.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Narasumber: <strong className="text-slate-700">{ev.host}</strong> ({ev.role})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-100/60 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6C4CF5]" /> {ev.date}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRegisterEvent(ev.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ev.registered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#6C4CF5] hover:bg-[#5838E8] text-white shadow-xs'
                    }`}
                  >
                    {ev.registered ? '✓ Terdaftar' : 'Daftar Sesi'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ethics Tip */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
            💡 <strong>Etika Komunitas:</strong> Jaga sportivitas, hindari spamming promosi tanpa izin, dan gunakan forum untuk saling mendukung pertumbuhan wirausaha muda.
          </div>
        </div>

        {/* Right: Papan Cari Mitra — Teman Rintis */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#24213A]">
                  Papan Cari Mitra — <span className="text-[#6C4CF5]">Teman Rintis</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500">Temukan partner mahasiswa untuk melengkapi tim usahamu.</p>
            </div>

            <button
              onClick={() => setShowCollabModal(true)}
              className="px-3.5 py-1.5 bg-[#FAF9FF] hover:bg-[#6C4CF5] text-[#6C4CF5] hover:text-white border border-purple-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Pasang Iklan Mitra
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {collabTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCollabType(type)}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCollabType === type
                    ? 'bg-[#6C4CF5] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Collab Cards */}
          <div className="space-y-3.5 pt-2">
            {filteredCollabs.map((collab) => (
              <div
                key={collab.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-purple-100 text-[#6C4CF5] font-black text-xs flex items-center justify-center flex-shrink-0 relative">
                      {collab.avatarUrl ? (
                        <img
                          src={collab.avatarUrl}
                          alt={collab.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : null}
                      <span className={collab.avatarUrl ? 'hidden' : 'block'}>{collab.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
                        {collab.name} <span className="font-normal text-slate-400">· {collab.businessName}</span>
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{collab.sector}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-2 py-0.5 rounded-full">
                    {collab.status}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-0.5 bg-rose-50 border border-rose-100 text-[#FF3E80] text-[10px] font-extrabold rounded-md">
                  {collab.type}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {collab.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Hubungi langsung:</span>
                  <button
                    onClick={() => {
                      onShowToast(`Membuka WhatsApp ke ${collab.name}...`);
                      window.open(`https://wa.me/${collab.contactWa.replace(/[^0-9]/g, '')}`, '_blank');
                    }}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Hubungi via WA <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Modal Buat Ajakan Kolaborasi */}
      {showCollabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowCollabModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-black uppercase tracking-wider text-[#6C4CF5]">
              TEMAN RINTIS KAWIRA
            </span>
            <h3 className="text-xl font-extrabold text-[#24213A] mt-1">Pasang Ajakan Kolaborasi Mitra</h3>
            <p className="text-xs text-slate-500 mt-1">
              Publikasikan kebutuhan partnermu agar wirausaha mahasiswa lain dapat terhubung.
            </p>

            <form onSubmit={handleCreateCollab} className="space-y-3.5 mt-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Usaha / Brand</label>
                <input
                  type="text"
                  required
                  value={collabTitle}
                  onChange={(e) => setCollabTitle(e.target.value)}
                  placeholder="Contoh: Dapur Ricebowl Sambal Matah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kebutuhan Mitra</label>
                  <select
                    value={collabType}
                    onChange={(e) => setCollabType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  >
                    <option value="Cari Co-founder">Cari Co-founder</option>
                    <option value="Kolaborasi Produk">Kolaborasi Produk</option>
                    <option value="Cari Desainer">Cari Desainer</option>
                    <option value="Pemasaran Digital">Pemasaran Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bidang Usaha</label>
                  <select
                    value={collabSector}
                    onChange={(e) => setCollabSector(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Jasa">Jasa</option>
                    <option value="Kreatif">Kreatif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Kontak</label>
                <input
                  type="text"
                  required
                  value={collabWa}
                  onChange={(e) => setCollabWa(e.target.value)}
                  placeholder="+62 812..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi & Syarat Kolaborasi</label>
                <textarea
                  rows={3}
                  required
                  value={collabDesc}
                  onChange={(e) => setCollabDesc(e.target.value)}
                  placeholder="Ceritakan kondisi usahamu dan kriteria partner yang kamu cari..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCollabModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white font-extrabold shadow-md shadow-[#6C4CF5]/25"
                >
                  Publikasikan Ajakan →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
