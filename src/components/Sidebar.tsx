import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Layers, 
  MessageSquare, 
  Calculator,
  Award, 
  LogOut, 
  X,
  Sparkles
} from 'lucide-react';
import { PageType, UserProfile } from '../types';

interface SidebarProps {
  currentPage: PageType;
  isOpenMobile: boolean;
  profile: UserProfile;
  isMentoringUnlocked: boolean;
  unreadMessagesCount?: number;
  walletBalance?: number;
  onSelectPage: (page: PageType) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
  onOpenTopUp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  isOpenMobile,
  profile,
  isMentoringUnlocked,
  unreadMessagesCount = 0,
  onSelectPage,
  onCloseMobile,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard Belajar', icon: LayoutDashboard },
    { id: 'modules' as PageType, label: 'Jalur Belajar & Kuis', icon: GraduationCap },
    { id: 'mentoring' as PageType, label: 'Fasilitator Belajar', icon: Users, isLocked: !isMentoringUnlocked },
    { id: 'messages' as PageType, label: 'Pesan & Sesi Konsultasi', icon: MessageSquare, badgeText: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined },
    { id: 'bookkeeping' as PageType, label: 'Lab Praktik (Buku Kas & HPP)', icon: Layers, badgeText: 'LAB' },
    { id: 'calculators' as PageType, label: 'Kalkulator HPP & BEP', icon: Calculator },
    { id: 'community' as PageType, label: 'Forum Diskusi', icon: Users },
    { id: 'portfolio' as PageType, label: 'Transkrip & Sertifikat', icon: Award },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between py-6 px-4 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo matching screenshots */}
          <div className="flex items-center justify-between px-2 mb-6">
            <div
              onClick={() => onSelectPage('dashboard')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              {/* Purple square with graduation cap / rocket */}
              <div className="w-10 h-10 rounded-2xl bg-[#5838E8] shadow-md shadow-[#5838E8]/25 flex items-center justify-center text-white flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-xl text-[#5838E8] tracking-tight">
                  Kawira
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Platform Belajar Wirausaha
                </span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#5838E8] text-white shadow-md shadow-[#5838E8]/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#5838E8]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="flex-1 truncate">{item.label}</span>

                  {item.badgeText && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#C6F135] text-[#24213A]">
                      {item.badgeText}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Pill */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <a
            href="/login-staff.html"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#0D9488] bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-xl transition-colors"
            title="Masuk ke Workspace Mentor & Admin Portal"
          >
            <span>✦ Portal Staf (Mentor & Admin)</span>
          </a>

          <div
            onClick={() => onSelectPage('profile')}
            className="p-3 bg-[#FAF9FF] hover:bg-purple-50/80 border border-purple-100/70 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-purple-100 text-[#5838E8] font-bold text-xs flex items-center justify-center flex-shrink-0 relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : null}
              <span>{(profile.name || 'KW').slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <strong className="text-xs font-extrabold text-slate-800 block truncate">
                {profile.name}
              </strong>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-[#C6F135]/40 text-[#364b00] inline-block mt-0.5 truncate">
                {profile.sector} • {profile.cohort || 'Batch 2026'}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
