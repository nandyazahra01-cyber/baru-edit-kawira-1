import React from 'react';
import { 
  Menu, 
  Bell, 
  HelpCircle, 
  Zap, 
  ChevronRight 
} from 'lucide-react';
import { PageType, UserProfile } from '../types';

interface NavbarProps {
  currentPage: PageType;
  profile: UserProfile;
  breadcrumbs?: string[];
  walletBalance?: number;
  notifications?: any[];
  onOpenMobileMenu: () => void;
  onOpenTopUp: () => void;
  onGoToProfile: () => void;
  onMarkNotificationRead?: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  profile,
  breadcrumbs,
  walletBalance,
  notifications,
  onOpenMobileMenu,
  onOpenTopUp,
  onGoToProfile,
  onMarkNotificationRead,
}) => {
  return (
    <header className="sticky top-0 z-30 min-h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Greeting / Breadcrumb */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? 'font-extrabold text-slate-800'
                      : 'hover:text-[#5838E8] cursor-pointer'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#24213A] truncate">
              Halo, Pengusaha Muda! 👋
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Kamis, 24 Oktober 2024 • Siap kembangkan bisnismu hari ini?
            </p>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href="/login-staff.html"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0A766E] text-xs font-bold transition-all shadow-2xs"
          title="Masuk ke Workspace Mentor & Admin Portal"
        >
          <span className="text-[#0D9488]">✦</span>
          <span>Akses Staf & Admin</span>
        </a>

        {/* Kredit Belajar Pill matching screenshots */}
        <button
          onClick={onOpenTopUp}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9FF] hover:bg-purple-100/70 border border-purple-200/80 text-xs font-bold text-[#5838E8] transition-all shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 fill-[#C6F135] text-[#5838E8]" />
          <span>{profile.learningCredits} Kredit Belajar</span>
          <span className="text-slate-400">·</span>
          <span className="text-[#5838E8] hover:underline font-extrabold text-[11px]">Top Up</span>
        </button>

        {/* Notifications Button */}
        <button
          className="p-2.5 rounded-xl text-slate-500 hover:text-[#5838E8] hover:bg-purple-50 transition-colors relative"
          aria-label="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3E80] ring-2 ring-white" />
        </button>

        {/* Help Question Icon */}
        <button
          className="hidden sm:inline-flex p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Pusat Bantuan"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div
          onClick={onGoToProfile}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5838E8] to-[#FF3E80] text-white font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-xs overflow-hidden relative"
          title={`Profil ${profile.name}`}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <span>
            {(profile.name || 'Kawira')
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};
