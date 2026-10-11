import type { KawiraRole } from "./api";

export type NavItem = { label: string; href: string; icon?: string };

const menus: Record<KawiraRole, NavItem[]> = {
  mentee: [
    { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { label: "Pembukuan", href: "/bookkeeping", icon: "wallet" },
    { label: "Mentoring", href: "/mentoring", icon: "users" },
    { label: "Pesan", href: "/messages", icon: "message-circle" },
    { label: "Modul & Template", href: "/modules", icon: "book-open" },
    { label: "Komunitas", href: "/community", icon: "messages-square" },
    { label: "Profil", href: "/profile", icon: "user-round" }
  ],
  mentor: [
    { label: "Workspace", href: "/mentor/dashboard", icon: "layout-dashboard" },
    { label: "Jadwal Mentoring", href: "/mentor/sessions", icon: "calendar" },
    { label: "Mentee Aktif", href: "/mentor/mentees", icon: "users" },
    { label: "Inbox Chat", href: "/mentor/messages", icon: "message-circle" },
    { label: "Evaluasi", href: "/mentor/evaluations", icon: "clipboard-check" },
    { label: "Modul & Komunitas", href: "/modules", icon: "book-open" },
    { label: "Profil", href: "/profile", icon: "user-round" }
  ],
  admin: [
    { label: "Admin Dashboard", href: "/admin", icon: "layout-dashboard" },
    { label: "Manajemen User", href: "/admin/users", icon: "users" },
    { label: "Persetujuan Mentor", href: "/admin/mentors", icon: "user-check" },
    { label: "Activity Tracker", href: "/admin/activity", icon: "activity" },
    { label: "Audit Log", href: "/admin/audit-logs", icon: "shield-check" },
    { label: "Analytics", href: "/admin/analytics", icon: "chart-no-axes-combined" }
  ]
};

export function getNavigation(role: KawiraRole): NavItem[] {
  return menus[role] ?? [];
}
