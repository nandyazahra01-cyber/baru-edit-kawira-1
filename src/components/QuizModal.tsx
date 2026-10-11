import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Award, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { LearningModule, QuizQuestion } from '../types';

interface QuizModalProps {
  module: LearningModule;
  onClose: () => void;
  onPassQuiz: (moduleId: string, score: number) => void;
  onGoToMentoring?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  onClose,
  onPassQuiz,
  onGoToMentoring,
}) => {
  const quizzes = module.quizzes || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizzes[currentIdx] || {
    question: 'Pemisahan kas usaha sangat penting untuk...',
    options: ['Menghitung laba riil', 'Membayar pajak', 'Semua benar'],
    correctIndex: 0,
    explanation: 'Pemisahan kas menjamin data laba bersih akurat.'
  };

  const getCorrectIndex = (q: QuizQuestion): number => {
    if (q.correctIndex !== undefined) return q.correctIndex;
    if (q.answer !== undefined) return q.answer;
    if (q.correctKey) return q.correctKey.charCodeAt(0) - 65;
    return 0;
  };

  const handleSelectOption = (index: number) => {
    if (hasSubmittedCurrent) return;
    const updated = [...selectedAnswers];
    updated[currentIdx] = index;
    setSelectedAnswers(updated);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers[currentIdx] === undefined) return;
    setHasSubmittedCurrent(true);
  };

  const handleNext = () => {
    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setHasSubmittedCurrent(selectedAnswers[currentIdx + 1] !== undefined);
    } else {
      // Calculate score
      let correct = 0;
      quizzes.forEach((q, i) => {
        if (selectedAnswers[i] === getCorrectIndex(q)) {
          correct += 1;
        }
      });
      const finalScore = Math.round((correct / Math.max(1, quizzes.length)) * 100);
      setIsFinished(true);
      if (finalScore >= 80) {
        onPassQuiz(module.id, finalScore);
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers([]);
    setCurrentIdx(0);
    setHasSubmittedCurrent(false);
    setIsFinished(false);
  };

  // Score calculation
  let correctCount = 0;
  quizzes.forEach((q, i) => {
    if (selectedAnswers[i] === getCorrectIndex(q)) correctCount += 1;
  });
  const scorePercent = Math.round((correctCount / Math.max(1, quizzes.length)) * 100);
  const isPassed = scorePercent >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#6C4CF5] text-white">
                KUIS PEMAHAMAN
              </span>
              <span className="text-xs font-bold text-slate-400">
                Soal {currentIdx + 1} dari {quizzes.length}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[#24213A] mb-4">
              {module.title}
            </h3>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-[#6C4CF5] transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / quizzes.length) * 100}%` }}
              />
            </div>

            {/* Question Box */}
            <div className="mb-6">
              <p className="text-sm font-extrabold text-slate-800 leading-relaxed mb-4">
                {currentQ.question || currentQ.prompt}
              </p>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const optionLabel = typeof opt === 'string' ? opt : opt.label;
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  const isCorrect = optIdx === getCorrectIndex(currentQ);

                  let optionStyle = 'border-slate-200 hover:border-purple-300 bg-white text-slate-700';

                  if (hasSubmittedCurrent) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-[#6C4CF5] bg-[#FAF9FF] text-[#6C4CF5] font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasSubmittedCurrent}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl border text-xs sm:text-sm text-left flex items-start gap-3 transition-all ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{optionLabel}</span>
                      {hasSubmittedCurrent && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {hasSubmittedCurrent && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation when submitted */}
            {hasSubmittedCurrent && (
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-slate-700 mb-6 animate-in fade-in duration-200">
                <span className="font-extrabold text-[#6C4CF5] block mb-0.5">Penjelasan Materi:</span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                {selectedAnswers[currentIdx] === undefined
                  ? 'Pilih satu jawaban'
                  : !hasSubmittedCurrent
                  ? 'Klik periksa jawaban'
                  : 'Jawaban tersimpan'}
              </span>

              {!hasSubmittedCurrent ? (
                <button
                  type="button"
                  disabled={selectedAnswers[currentIdx] === undefined}
                  onClick={handleConfirmAnswer}
                  className="px-5 py-2.5 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
                >
                  {currentIdx < quizzes.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Kuis →'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-4 space-y-5">
            <div
              className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg ${
                isPassed ? 'bg-[#C6F135] text-[#24213A]' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {isPassed ? <Award className="w-8 h-8 text-[#24213A]" /> : <XCircle className="w-8 h-8 text-rose-600" />}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                HASIL EVALUASI PEMBELAJARAN
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#24213A] mt-1">
                {isPassed ? 'Selamat! Kamu Lulus Kuis' : 'Belum Mencapai Nilai Lulus'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isPassed
                  ? `Kamu menjawab ${correctCount} dari ${quizzes.length} soal dengan benar. Pemahaman teorimu siap diterapkan ke praktik usaha.`
                  : `Skor kamu belum memenuhi standar kelulusan 80%. Baca kembali materi dan ulangi kuis untuk mencatat kelulusan.`}
              </p>
            </div>

            {/* Score Pill */}
            <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100 inline-block">
              <span className="text-xs text-slate-400 block font-bold">Skor Akhir:</span>
              <strong
                className={`text-3xl font-black ${
                  isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {scorePercent}%
              </strong>
            </div>

            {/* Mentoring unlocked announcement if passed */}
            {isPassed && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-lime-50 to-pink-50 border border-purple-100 text-xs text-slate-700 flex items-center gap-2.5 text-left">
                <Sparkles className="w-5 h-5 text-[#6C4CF5] flex-shrink-0" />
                <span>
                  Progres materi & kuis ini telah tersimpan dan menjadi syarat verifikasi untuk sesi mentoring sebaya.
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {isPassed ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-black rounded-xl shadow-md transition-all"
                  >
                    Kembali ke Modul
                  </button>
                  {onGoToMentoring && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onGoToMentoring();
                      }}
                      className="w-full sm:flex-1 py-3 bg-[#C6F135] hover:bg-[#b8e522] text-[#24213A] text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                    >
                      Buka Mentoring <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="w-full sm:flex-1 py-3 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Ulangi Kuis
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Pelajari Ulang Materi
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
