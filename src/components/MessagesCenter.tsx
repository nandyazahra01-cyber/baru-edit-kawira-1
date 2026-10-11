import React, { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Star, 
  Video, 
  Search, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Booking, Mentor } from '../types';

interface MessagesCenterProps {
  bookings: Booking[];
  mentors: Mentor[];
  onOpenChat: (bookingId: string) => void;
  onBookMentor: (mentor: Mentor) => void;
  onCompleteSession: (bookingId: string) => void;
  onReviewBooking: (bookingId: string) => void;
}

export const MessagesCenter: React.FC<MessagesCenterProps> = ({
  bookings,
  mentors,
  onOpenChat,
  onBookMentor,
  onCompleteSession,
  onReviewBooking,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'upcoming' && b.status !== 'upcoming') return false;
    if (activeFilter === 'done' && b.status !== 'done') return false;
    if (!searchQuery) return true;
    return `${b.mentorName} ${b.topic} ${b.mentorSector}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5]">
            SESI & PESAN KONSULTASI
          </span>
          <h2 className="text-2xl font-black text-[#24213A] mt-0.5">Pesan & Sesi Mentoring</h2>
          <p className="text-xs text-slate-500">
            Akses seluruh ruang percakapan mentoring dan kelola status bimbingan tokomu.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold shadow-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Semua ({bookings.length})
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'upcoming'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Terjadwal ({bookings.filter((b) => b.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setActiveFilter('done')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'done'
                ? 'bg-[#6C4CF5] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#6C4CF5]'
            }`}
          >
            Selesai ({bookings.filter((b) => b.status === 'done').length})
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Booked Sessions List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sesi berdasarkan nama mentor atau topik..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:border-[#6C4CF5]"
            />
          </div>

          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const unreadCount = b.messages.filter((m) => m.from === 'them' && !m.read).length;
                const lastMessage = b.messages[b.messages.length - 1];

                return (
                  <div
                    key={b.id}
                    className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#6C4CF5] text-white font-extrabold flex items-center justify-center text-sm shadow-sm relative">
                            {b.mentorAvatarUrl ? (
                              <img
                                src={b.mentorAvatarUrl}
                                alt={b.mentorName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : null}
                            <span className={b.mentorAvatarUrl ? 'hidden' : 'block'}>{b.initial}</span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3E80] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                              {unreadCount}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-800">
                              {b.mentorName}
                            </h4>
                            <span className="text-[10px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-2 py-0.5 rounded-full">
                              {b.mentorStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 font-semibold">
                              <Calendar className="w-3 h-3 text-[#6C4CF5]" /> {b.slot}
                            </span>
                            <span>·</span>
                            <span className="font-semibold text-slate-600">{b.consultation}</span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                          b.status === 'done'
                            ? 'bg-purple-100 text-[#6C4CF5]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status === 'done' ? '✓ Selesai' : 'Terjadwal'}
                      </span>
                    </div>

                    {/* Topic and Last Message */}
                    <div className="bg-[#FAF9FD] p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 text-[10px] uppercase">Topik:</span>
                        <span className="font-semibold text-slate-800">{b.topic}</span>
                      </div>
                      {lastMessage && (
                        <div className="text-slate-500 pt-1 border-t border-slate-200/50 flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-[#6C4CF5] flex-shrink-0" />
                          <span className="truncate italic">
                            {lastMessage.from === 'me' ? 'Anda: ' : `${b.mentorName.split(' ')[0]}: `}
                            {lastMessage.text}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-400 font-medium">
                        Biaya: <strong className="text-slate-700">Rp {b.price.toLocaleString('id-ID')}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.consultation.includes('Google') && (
                          <a
                            href={b.meetingUrl || 'https://meet.google.com'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" /> Google Meet
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenChat(b.id)}
                          className="px-4 py-2 bg-[#6C4CF5] hover:bg-[#5838E8] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#6C4CF5]/20 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Buka Ruang Chat
                        </button>

                        {b.status === 'done' && b.review ? (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current" /> {b.review.rating} / 5
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onReviewBooking(b.id)}
                            className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                          >
                            {b.status === 'done' ? 'Beri Ulasan ★' : 'Selesaikan'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
              <div>
                <p className="text-sm font-bold text-slate-700">Belum Ada Sesi pada Filter Ini</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pilih mentor dari daftar rekomendasi di samping untuk menjadwalkan konsultasi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Mentor Directory to schedule new session */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#24213A]">Jadwalkan Sesi Baru</h3>
              <p className="text-xs text-slate-500">Pilih mentor sebaya favoritmu.</p>
            </div>
          </div>

          <div className="space-y-3">
            {mentors.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="p-3 bg-[#FAF9FF] rounded-2xl border border-purple-100/70 hover:border-[#6C4CF5]/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br ${m.avatarBg} text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 relative`}
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
                    <h5 className="font-extrabold text-xs text-slate-800 truncate">{m.name}</h5>
                    <p className="text-[10px] text-slate-500 truncate">{m.sector} · {m.status}</p>
                    <span className="text-[10px] font-bold text-[#6C4CF5]">
                      Rp {m.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBookMentor(m)}
                  className="px-3 py-1.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-[11px] font-extrabold rounded-xl transition-all shadow-xs flex-shrink-0"
                >
                  Pesan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
