import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Video, 
  CheckCircle2, 
  Star, 
  Clock, 
  DollarSign, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types';

interface ChatRoomModalProps {
  booking: Booking;
  onClose: () => void;
  onSendMessage: (bookingId: string, text: string) => void;
  onCompleteSession: (bookingId: string) => void;
  onSubmitReview: (bookingId: string, rating: number, note: string) => void;
  onShareFinanceSnapshot?: () => string;
}

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  booking,
  onClose,
  onSendMessage,
  onCompleteSession,
  onSubmitReview,
  onShareFinanceSnapshot,
}) => {
  const [inputText, setInputText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewNote, setReviewNote] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [booking.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(booking.id, inputText.trim());
    setInputText('');
  };

  const handleShareSnapshot = () => {
    if (onShareFinanceSnapshot) {
      const summary = onShareFinanceSnapshot();
      onSendMessage(booking.id, summary);
    }
  };

  const handleSaveReview = () => {
    onSubmitReview(booking.id, reviewRating, reviewNote || 'Mentoring sangat bermanfaat dan aplikatif untuk usaha saya.');
    setShowReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[88vh] max-h-[720px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 relative">
        {/* Chat Room Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-[#FAF9FF] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#6C4CF5] text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-[#6C4CF5]/20 relative">
                {booking.mentorAvatarUrl ? (
                  <img
                    src={booking.mentorAvatarUrl}
                    alt={booking.mentorName}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                ) : null}
                <span className={booking.mentorAvatarUrl ? 'hidden' : 'block'}>{booking.initial}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Online" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-[#24213A] truncate">
                  {booking.mentorName}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C6F135]/40 text-[#3A4E00]">
                  {booking.mentorStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-2 truncate">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Clock className="w-3 h-3" /> {booking.slot}
                </span>
                <span>·</span>
                <span className="font-semibold text-[#6C4CF5]">{booking.consultation}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {booking.consultation.includes('Google') && (
              <a
                href={booking.meetingUrl || 'https://meet.google.com'}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <Video className="w-3.5 h-3.5" /> Buka Google Meet
              </a>
            )}

            {booking.status !== 'done' ? (
              <button
                type="button"
                onClick={() => onCompleteSession(booking.id)}
                className="px-3 py-1.5 bg-purple-100/70 hover:bg-[#6C4CF5] text-[#6C4CF5] hover:text-white rounded-xl text-xs font-bold transition-colors"
                title="Tandai sesi telah selesai"
              >
                Selesaikan Sesi
              </button>
            ) : booking.review ? (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {booking.review.rating} / 5
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors"
              >
                Beri Ulasan ★
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Topic Banner */}
        <div className="bg-[#FAF9FF] px-5 py-2.5 border-b border-purple-100/60 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="font-extrabold text-[#6C4CF5] text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-purple-100">
              TOPIK KONSULTASI
            </span>
            <span className="text-slate-700 font-medium truncate">{booking.topic}</span>
          </div>

          {onShareFinanceSnapshot && (
            <button
              type="button"
              onClick={handleShareSnapshot}
              className="text-[11px] font-bold text-[#6C4CF5] hover:underline flex items-center gap-1 whitespace-nowrap flex-shrink-0"
              title="Kirimkan ringkasan data pembukuan kas ke obrolan ini"
            >
              <DollarSign className="w-3 h-3" /> Lampirkan Data Kas
            </button>
          )}
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAF9FD]">
          {/* Welcome note */}
          <div className="text-center my-2">
            <span className="text-[11px] font-semibold text-slate-400 bg-white/80 border border-slate-200/60 px-3 py-1 rounded-full shadow-xs">
              Sesi dimulai · Konsultasi mentor sebaya Kawira
            </span>
          </div>

          {booking.messages && booking.messages.length > 0 ? (
            booking.messages.map((msg) => {
              const isMe = msg.from === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#6C4CF5] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1 text-right font-medium flex items-center justify-end gap-1 ${
                        isMe ? 'text-purple-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              Ruang percakapan mentoring siap. Mulai ceritakan kondisi usahamu kepada mentor.
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 py-1 font-bold">Ide Pertanyaan:</span>
          {[
            'Bagaimana cara menghitung HPP yang aman?',
            'Tips lolos seleksi hibah P2MW?',
            'Berapa budget pas untuk endorse/ads?',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(prompt)}
              className="px-2.5 py-1 bg-[#FAF9FF] hover:bg-purple-100/70 border border-purple-100 text-[#6C4CF5] font-semibold rounded-lg whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis pesan atau pertanyaan untuk mentor..."
            className="flex-1 px-4 py-2.5 bg-[#FAF9FD] rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#6C4CF5] focus:ring-2 focus:ring-[#6C4CF5]/10"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] disabled:opacity-40 disabled:hover:bg-[#6C4CF5] text-white rounded-xl shadow-md shadow-[#6C4CF5]/20 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Review & Rating Modal */}
        {showReviewModal && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
              <span className="text-xs font-black uppercase text-[#6C4CF5] tracking-wider">ULASAN MENTORING</span>
              <h4 className="text-base font-extrabold text-[#24213A] mt-1">Bagaimana Sesi Mentoringmu?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Berikan penilaian untuk {booking.mentorName} agar kualitas bimbingan terus berkembang.
              </p>

              {/* Star Picker */}
              <div className="flex justify-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Tuliskan pengalamanmu, misalnya: Mentor sangat detail menjelaskan rumus HPP dan strategi promo..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5] mb-4"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Nanti Saja
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="flex-1 py-2 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-bold shadow-md shadow-[#6C4CF5]/25"
                >
                  Kirim Ulasan ★
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
