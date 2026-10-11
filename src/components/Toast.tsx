import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastState {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast.show) return null;

  const bgColors = {
    success: 'bg-[#211B38] text-white border-l-4 border-[#C6F135]',
    error: 'bg-[#8F1D3C] text-white border-l-4 border-[#FF3E80]',
    info: 'bg-[#2A2345] text-white border-l-4 border-[#6C4CF5]',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#C6F135] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#FF3E80] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#C6F135] flex-shrink-0" />,
  };

  const currentType = toast.type || 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl ${bgColors[currentType]}`}>
        {icons[currentType]}
        <p className="text-sm font-medium flex-1 pr-2">{toast.message}</p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
