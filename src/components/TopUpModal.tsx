import React, { useState } from 'react';
import { X, Wallet, QrCode, Building2, CreditCard, Sparkles } from 'lucide-react';

interface TopUpModalProps {
  currentBalance: number;
  onClose: () => void;
  onTopUp: (amount: number, method: string) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ currentBalance, onClose, onTopUp }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [selectedMethod, setSelectedMethod] = useState<string>('QRIS (Instan & Bebas Biaya)');

  const amounts = [25000, 50000, 100000, 150000];

  const methods = [
    { id: 'qris', label: 'QRIS (Instan & Bebas Biaya)', icon: QrCode, badge: 'Paling Populer' },
    { id: 'va', label: 'Bank Transfer (BCA, Mandiri, BRI)', icon: Building2 },
    { id: 'ewallet', label: 'E-Wallet (GoPay, OVO, ShopeePay)', icon: CreditCard },
  ];

  const handleConfirm = () => {
    onTopUp(selectedAmount, selectedMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#6C4CF5]/10 text-[#6C4CF5] flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C4CF5]">DOMPET MENTORING</span>
            <h3 className="text-lg font-bold text-[#24213A]">Isi Saldo Konsultasi</h3>
          </div>
        </div>

        {/* Current Balance Box */}
        <div className="bg-[#FAF9FF] border border-[#6C4CF5]/20 rounded-xl p-4 flex items-center justify-between mb-5">
          <div>
            <span className="text-xs text-slate-500 font-medium">Saldo Dompet Saat Ini</span>
            <p className="text-xl font-extrabold text-[#6C4CF5]">
              Rp {currentBalance.toLocaleString('id-ID')}
            </p>
          </div>
          <span className="text-xs bg-[#C6F135]/30 text-[#496500] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Siap Booking
          </span>
        </div>

        {/* Amount Selector */}
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Pilih Nominal Top Up
        </label>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {amounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setSelectedAmount(amt)}
              className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${
                selectedAmount === amt
                  ? 'border-[#6C4CF5] bg-[#6C4CF5] text-white shadow-md shadow-[#6C4CF5]/25'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#6C4CF5]/50'
              }`}
            >
              Rp {amt.toLocaleString('id-ID')}
            </button>
          ))}
        </div>

        {/* Payment Method Selector */}
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Metode Pembayaran
        </label>
        <div className="space-y-2 mb-6">
          {methods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMethod === m.label;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.label)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#6C4CF5] bg-[#FAF9FF]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#6C4CF5] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate">{m.label}</span>
                    {m.badge && (
                      <span className="text-[10px] font-bold bg-[#C6F135] text-[#24213A] px-1.5 py-0.5 rounded">
                        {m.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#6C4CF5] bg-[#6C4CF5]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-sm font-bold shadow-md shadow-[#6C4CF5]/25 transition-all"
          >
            Konfirmasi · Rp {selectedAmount.toLocaleString('id-ID')}
          </button>
        </div>
      </div>
    </div>
  );
};
