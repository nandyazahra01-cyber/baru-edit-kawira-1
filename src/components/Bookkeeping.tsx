import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Search,
  CheckCircle2,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { Transaction, UserProfile } from '../types';

interface BookkeepingProps {
  transactions: Transaction[];
  profile: UserProfile;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onGoToProfile: () => void;
}

export const Bookkeeping: React.FC<BookkeepingProps> = ({
  transactions,
  profile,
  onAddTransaction,
  onDeleteTransaction,
  onShowToast,
  onGoToProfile,
}) => {
  const [txType, setTxType] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Penjualan Produk');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoriesIn = ['Penjualan Produk', 'Jasa Konsultasi', 'Pendanaan / Hibah', 'Investasi Modal', 'Lainnya'];
  const categoriesOut = ['Bahan Baku', 'Operasional & Gas', 'Kemasan & Packaging', 'Pemasaran & Ads', 'Gaji / Upah', 'Transportasi', 'Lainnya'];

  // Totals calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'in')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'out')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      onShowToast('Nominal transaksi harus lebih dari 0.', 'error');
      return;
    }

    onAddTransaction({
      date,
      type: txType,
      category,
      note: note.trim() || category,
      amount: numAmount,
      source: 'via Web',
    });

    setAmount('');
    setNote('');
    onShowToast(`Transaksi ${txType === 'in' ? 'pemasukan' : 'pengeluaran'} berhasil dicatat.`);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      onShowToast('Belum ada transaksi untuk diekspor.', 'error');
      return;
    }

    const headers = 'Tanggal,Jenis,Kategori,Catatan,Sumber,Nominal (Rp)\n';
    const rows = transactions
      .map((t) =>
        [
          t.date,
          t.type === 'in' ? 'Pemasukan' : 'Pengeluaran',
          `"${t.category}"`,
          `"${t.note}"`,
          t.source || 'via Web',
          t.amount,
        ].join(',')
      )
      .join('\n');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kawira-buku-kas-${profile.businessName || 'usaha'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('File CSV buku kas berhasil diunduh.');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery) return true;
    return `${t.note} ${t.category} ${t.amount}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#6C4CF5]">
            KEUANGAN & ARUS KAS
          </span>
          <h2 className="text-2xl font-black text-[#24213A] mt-0.5">Pembukuan & Arus Kas Usaha</h2>
          <p className="text-xs text-slate-500">
            Catat arus transaksi harian secara disiplin sebagai bahan analisa pendampingan mentor.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6C4CF5]" /> Ekspor Spreadsheet (CSV)
          </button>
        </div>
      </div>

      {/* 2. Google Sheets Sync Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-slate-800">Google Sheets Sync</h4>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Tersinkronisasi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Terhubung: <strong className="text-slate-700">Lap_Keuangan_{profile.businessName || 'Usaha'}.xlsx</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast('Menghubungkan ke spreadsheet Google Drive demo...');
            window.open('https://docs.google.com/spreadsheets', '_blank');
          }}
          className="text-xs font-bold text-[#6C4CF5] hover:text-[#5838E8] flex items-center gap-1 hover:underline"
        >
          Buka Spreadsheet <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 3. Business Card */}
      <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6C4CF5] text-white font-black flex items-center justify-center text-sm">
            {(profile.businessName || 'Usaha').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">{profile.businessName || 'Nama Usaha Belum Diisi'}</span>
              <span className="text-[10px] font-extrabold bg-[#C6F135]/40 text-[#364b00] px-2 py-0.5 rounded-full">
                ✓ Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-500">{profile.sector} · {profile.status}</p>
          </div>
        </div>

        <button
          onClick={onGoToProfile}
          className="text-xs font-bold text-[#6C4CF5] hover:underline"
        >
          Edit Profil Usaha
        </button>
      </div>

      {/* 4. Stat Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Total Pemasukan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl font-black text-emerald-600 block">
            Rp {totalIncome.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
            + Arus Kas Masuk
          </span>
        </div>

        {/* Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
            <span>Total Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#FF3E80] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <strong className="text-2xl font-black text-[#FF3E80] block">
            Rp {totalExpense.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-2 inline-block">
            - Beban & Belanja Bahan
          </span>
        </div>

        {/* Net Balance */}
        <div className="bg-[#24213A] p-5 rounded-2xl text-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-purple-200 font-bold mb-1">
            <span>Saldo Kas Bersih</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#C6F135] text-[#24213A] rounded">
              Real-time
            </span>
          </div>
          <strong className="text-2xl font-black text-[#C6F135] block">
            Rp {netBalance.toLocaleString('id-ID')}
          </strong>
          <span className="text-[11px] text-purple-300 mt-2 block font-medium">
            Saldo usaha siap pakai
          </span>
        </div>
      </div>

      {/* 5. Main Split: Record Form + Cashflow Ledger */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#24213A]">Catat Transaksi Harian</h3>
            <p className="text-xs text-slate-500">Masukkan transaksi pemasukan atau pengeluaran tokomu.</p>
          </div>

          <form onSubmit={handleSaveTransaction} className="space-y-4">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Transaksi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('in');
                    setCategory('Penjualan Produk');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    txType === 'in'
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" /> Pemasukan (+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('out');
                    setCategory('Bahan Baku');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                    txType === 'out'
                      ? 'border-[#FF3E80] bg-[#FF3E80] text-white shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" /> Pengeluaran (-)
                </button>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 150000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#6C4CF5]"
              >
                {(txType === 'in' ? categoriesIn : categoriesOut).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Keterangan</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Penjualan 5 porsi rice bowl lewat WA..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#6C4CF5] hover:bg-[#5838E8] text-white text-xs font-extrabold rounded-xl shadow-md shadow-[#6C4CF5]/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Simpan Transaksi
            </button>
          </form>

          {/* Quick Tip Box */}
          <div className="mt-5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Tips Kawira:</strong> Catat setiap transaksi pada hari yang sama agar laporan pembukuan tokomu siap digunakan untuk review mentor atau verifikasi proposal P2MW.
            </p>
          </div>
        </div>

        {/* Right: History & Search Table */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#24213A]">Buku Kas & Riwayat</h3>
              <p className="text-xs text-slate-500">{transactions.length} transaksi tersimpan</p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#6C4CF5]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Keterangan</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Nominal</th>
                  <th className="pb-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 text-slate-500 font-medium whitespace-nowrap">{t.date}</td>
                      <td className="py-3">
                        <strong className="font-bold text-slate-800 block">{t.note}</strong>
                        {t.source && (
                          <span className="text-[10px] text-slate-400">{t.source}</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 font-extrabold whitespace-nowrap">
                        <span className={t.type === 'in' ? 'text-emerald-600' : 'text-[#FF3E80]'}>
                          {t.type === 'in' ? '+' : '−'} Rp {Number(t.amount).toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(t.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                          title="Hapus transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Tidak ada transaksi yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
