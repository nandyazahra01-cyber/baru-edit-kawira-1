import React, { useState } from 'react';
import { 
  Calculator, 
  Target, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface BusinessCalculatorProps {
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onSetMentorTopic?: (topic: string) => void;
}

export const BusinessCalculator: React.FC<BusinessCalculatorProps> = ({
  onShowToast,
  onSetMentorTopic,
}) => {
  // HPP State
  const [bahanBaku, setBahanBaku] = useState<number>(85000);
  const [tenagaKerja, setTenagaKerja] = useState<number>(20000);
  const [kemasan, setKemasan] = useState<number>(12000);
  const [overhead, setOverhead] = useState<number>(18000);
  const [jumlahUnit, setJumlahUnit] = useState<number>(10);
  const [targetMargin, setTargetMargin] = useState<number>(35);

  // BEP State
  const [biayaTetap, setBiayaTetap] = useState<number>(1200000);
  const [hargaJual, setHargaJual] = useState<number>(22000);
  const [biayaVariabel, setBiayaVariabel] = useState<number>(13500);

  const [copiedHpp, setCopiedHpp] = useState(false);
  const [copiedBep, setCopiedBep] = useState(false);

  // HPP Calculations
  const totalBiayaProduksi = (Number(bahanBaku) || 0) + (Number(tenagaKerja) || 0) + (Number(kemasan) || 0) + (Number(overhead) || 0);
  const units = Math.max(1, Number(jumlahUnit) || 1);
  const hppPerUnit = totalBiayaProduksi / units;
  const marginDecimal = (Number(targetMargin) || 0) / 100;
  // Selling price formula: HPP / (1 - margin%) or HPP * (1 + margin%)
  // Standard healthy markup: HPP / (1 - margin%) ensures the target margin is exact
  const hargaJualRekomendasi = marginDecimal < 1 ? hppPerUnit / (1 - marginDecimal) : hppPerUnit * 1.5;
  const estimasiLabaPerUnit = hargaJualRekomendasi - hppPerUnit;

  // BEP Calculations
  const marginKontribusi = Math.max(0, (Number(hargaJual) || 0) - (Number(biayaVariabel) || 0));
  const bepUnit = marginKontribusi > 0 ? Math.ceil((Number(biayaTetap) || 0) / marginKontribusi) : 0;
  const bepOmzet = bepUnit * (Number(hargaJual) || 0);
  const targetHarian = Math.ceil(bepUnit / 30);

  const handleCopyHppSummary = () => {
    const summary = `RINGKASAN HPP KAWIRA\nTotal Biaya: Rp ${totalBiayaProduksi.toLocaleString('id-ID')} (${units} unit)\nHPP per Unit: Rp ${Math.round(hppPerUnit).toLocaleString('id-ID')}\nTarget Margin: ${targetMargin}%\nSaran Harga Jual: Rp ${Math.round(hargaJualRekomendasi).toLocaleString('id-ID')}\nEstimasi Laba/Unit: Rp ${Math.round(estimasiLabaPerUnit).toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(summary);
    setCopiedHpp(true);
    setTimeout(() => setCopiedHpp(false), 2000);
    onShowToast('Ringkasan HPP disalin ke clipboard.');
  };

  const handleCopyBepSummary = () => {
    const summary = `RINGKASAN TITIK IMPAS BEP KAWIRA\nBiaya Tetap: Rp ${biayaTetap.toLocaleString('id-ID')}/bulan\nHarga Jual: Rp ${hargaJual.toLocaleString('id-ID')}\nBiaya Variabel: Rp ${biayaVariabel.toLocaleString('id-ID')}\nBEP Volume: ${bepUnit} unit/bulan (${targetHarian} unit/hari)\nBEP Omzet: Rp ${bepOmzet.toLocaleString('id-ID')}/bulan`;
    navigator.clipboard.writeText(summary);
    setCopiedBep(true);
    setTimeout(() => setCopiedBep(false), 2000);
    onShowToast('Ringkasan BEP disalin ke clipboard.');
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#24213A] via-[#2F294E] to-[#393160] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#C6F135] text-[#24213A] uppercase tracking-wider mb-2 inline-block">
            KALKULATOR BISNIS INTERAKTIF
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hitung HPP & Titik Impas (BEP) dengan Presisi
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 mt-2 max-w-xl leading-relaxed">
            Hindari boncos dan tekor. Tentukan harga jual kompetitif dengan margin keuntungan yang jelas untuk produk kuliner, fashion, maupun jasa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs text-purple-100 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C6F135] flex-shrink-0" />
            <span>Hasil simulasi dapat langsung dilampirkan ke ruang chat mentor</span>
          </div>
        </div>
      </div>

      {/* 2. Grid of 2 Interactive Calculators */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Calculator 1: HPP & Harga Jual */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#6C4CF5]/10 text-[#6C4CF5] flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#6C4CF5] tracking-wider">
                  KOMPONEN PRODUKSI
                </span>
                <h3 className="text-lg font-black text-[#24213A]">Hitung HPP per Unit</h3>
              </div>
            </div>

            <button
              onClick={handleCopyHppSummary}
              className="p-2 text-slate-400 hover:text-[#6C4CF5] rounded-xl hover:bg-purple-50 transition-colors"
              title="Salin ringkasan HPP"
            >
              {copiedHpp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Form Inputs */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Biaya Bahan Baku (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={bahanBaku || ''}
                onChange={(e) => setBahanBaku(Number(e.target.value))}
                placeholder="0"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Biaya Tenaga Kerja (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={tenagaKerja || ''}
                onChange={(e) => setTenagaKerja(Number(e.target.value))}
                placeholder="0"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kemasan / Packaging (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={kemasan || ''}
                onChange={(e) => setKemasan(Number(e.target.value))}
                placeholder="0"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Overhead (Gas/Listrik/Beban)
              </label>
              <input
                type="number"
                min="0"
                value={overhead || ''}
                onChange={(e) => setOverhead(Number(e.target.value))}
                placeholder="0"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jumlah Unit Produksi (pcs)
              </label>
              <input
                type="number"
                min="1"
                value={jumlahUnit || ''}
                onChange={(e) => setJumlahUnit(Number(e.target.value))}
                placeholder="1"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Margin Laba (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={targetMargin || ''}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  placeholder="30"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                />
                <span className="font-extrabold text-slate-400 text-sm">%</span>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF9FF] to-purple-50 border border-[#6C4CF5]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Biaya Produksi:</span>
              <strong className="text-sm font-black text-slate-800">
                Rp {totalBiayaProduksi.toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <span className="text-xs font-bold text-[#6C4CF5]">HPP per Unit (Satuan):</span>
              <strong className="text-lg font-black text-[#6C4CF5]">
                Rp {Math.round(hppPerUnit).toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-600 block">Saran Harga Jual:</span>
                <span className="text-[11px] text-emerald-600 font-bold">
                  (Margin {targetMargin}% tercapai)
                </span>
              </div>
              <strong className="text-2xl font-black text-emerald-600">
                Rp {Math.round(hargaJualRekomendasi).toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-purple-100/60">
              <span>Estimasi Laba per Porsi/Unit:</span>
              <span className="font-bold text-slate-700">
                + Rp {Math.round(estimasiLabaPerUnit).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Calculator 2: BEP Titik Impas */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-[#FF3E80] flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF3E80] tracking-wider">
                  TITIK IMPAS BALIK MODAL
                </span>
                <h3 className="text-lg font-black text-[#24213A]">Hitung BEP (Break-Even)</h3>
              </div>
            </div>

            <button
              onClick={handleCopyBepSummary}
              className="p-2 text-slate-400 hover:text-[#6C4CF5] rounded-xl hover:bg-purple-50 transition-colors"
              title="Salin ringkasan BEP"
            >
              {copiedBep ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Biaya Tetap per Bulan (Sewa Tempat, Gaji, Langganan) (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={biayaTetap || ''}
                onChange={(e) => setBiayaTetap(Number(e.target.value))}
                placeholder="Contoh: 1500000"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Harga Jual per Unit (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={hargaJual || ''}
                  onChange={(e) => setHargaJual(Number(e.target.value))}
                  placeholder="Contoh: 25000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Biaya Variabel per Unit (Bahan) (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  value={biayaVariabel || ''}
                  onChange={(e) => setBiayaVariabel(Number(e.target.value))}
                  placeholder="Contoh: 14000"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
                />
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-[#FF3E80]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Margin Kontribusi per Unit:</span>
              <strong className="text-sm font-black text-slate-800">
                Rp {marginKontribusi.toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
              <span className="text-xs font-bold text-[#FF3E80]">Minimal Penjualan Bulanan (BEP Unit):</span>
              <strong className="text-2xl font-black text-[#FF3E80]">
                {bepUnit} <span className="text-xs font-bold">unit</span>
              </strong>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-600 block">Omzet Impas per Bulan:</span>
                <span className="text-[11px] text-slate-400 font-medium">(Titik aman tidak rugi)</span>
              </div>
              <strong className="text-xl font-black text-[#24213A]">
                Rp {bepOmzet.toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200/80">
              <span className="font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Target Penjualan Harian:
              </span>
              <strong className="font-black text-amber-950">
                ~ {targetHarian} unit / hari
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
