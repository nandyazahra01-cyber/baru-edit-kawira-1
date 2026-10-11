export type PageType = 
  | 'dashboard' 
  | 'mentoring' 
  | 'messages' 
  | 'bookkeeping' 
  | 'calculators' 
  | 'modules' 
  | 'community' 
  | 'portfolio' 
  | 'profile';

export type SectorType = 'Kuliner' | 'Fashion' | 'Jasa' | 'Teknologi' | 'Kriya' | 'Kerajinan' | 'Marketing' | 'Kreatif' | 'Lainnya';
export type MentorStatusType = 'Fasilitator Sektor Kuliner' | 'Fasilitator Sektor Fashion' | 'Fasilitator Sektor Teknologi' | 'Alumni P2MW' | 'Alumni PKM-K' | 'Praktisi UMKM' | 'Wirausaha Muda';

export interface PrereqItem {
  id: string;
  name: string;
  isCompleted: boolean;
  scoreText?: string;
  requiredModuleId?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role?: string;
  campus?: string;
  company?: string;
  sector: SectorType;
  status?: MentorStatusType | string;
  categoryTag?: string;
  bio?: string;
  rating: number;
  reviewsCount?: number;
  reviews?: { reviewer: string; name?: string; rating: number; comment?: string; text?: string; date: string }[];
  price: number;
  availableSlotsText?: string;
  slots: string[];
  tags: string[];
  experience?: string;
  portfolio?: string[];
  avatarBg?: string;
  avatarUrl?: string;
  initial: string;
  isUnlocked?: boolean;
  unlockReason?: string;
  prerequisites?: PrereqItem[];
  availableDates?: { day: string; date: string; monthYear: string; slotCount: number; available: boolean }[];
  availableHours?: { time: string; period: string }[];
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole?: string;
  mentorSector: SectorType;
  mentorStatus?: string;
  initial: string;
  slot: string;
  dateText?: string;
  timeText?: string;
  topic: string;
  focusTopic?: string;
  consultation: 'Sesi Chat Real-time' | 'Sesi Call (Google Meet)';
  creditsCost?: number;
  price: number;
  status: 'upcoming' | 'done';
  createdAt: number;
  meetingUrl?: string;
  avatarUrl?: string;
  mentorAvatarUrl?: string;
  messages: ChatMessage[];
  review?: {
    rating: number;
    note?: string;
    comment?: string;
    date: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  type: 'in' | 'out';
  category: string;
  note: string;
  amount: number;
  source?: 'via Web' | 'via Google Sheets';
}

export interface QuizQuestion {
  id?: string;
  topicTag?: string;
  question: string;
  prompt?: string;
  subDescription?: string;
  options: (string | { key: string; label: string; tag?: string })[];
  correctKey?: string;
  correctIndex?: number;
  answer?: number;
  explanation?: string;
}

export interface LearningModule {
  id: string;
  code?: string;
  number?: number;
  title: string;
  cat: 'Keuangan' | 'Marketing' | 'Legalitas' | 'Bisnis';
  time: string;
  icon?: string;
  status?: 'selesai' | 'berjalan' | 'terkunci';
  score?: number;
  desc?: string;
  body: string;
  steps: string[];
  prerequisiteText?: string;
  prerequisiteModuleId?: string;
  quizzes?: QuizQuestion[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  host: string;
  role: string;
  date: string;
  type: string;
  status: 'Gratis' | 'Terbuka' | 'Live';
  registered?: boolean;
  hostAvatarUrl?: string;
}

export interface CollabRequest {
  id: string;
  name: string;
  businessName: string;
  sector: string;
  type: 'Cari Co-founder' | 'Kolaborasi Produk' | 'Cari Desainer' | 'Pemasaran Digital';
  description: string;
  contactWa: string;
  status: string;
  avatarUrl?: string;
}

export interface TranscriptItem {
  code: string;
  name: string;
  activityType: string;
  completionDate: string;
  scoreText: string;
  validatorName: string;
  statusText: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  type: 'topup' | 'payment';
  amount: number;
  note: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'mentoring' | 'community' | 'finance';
}

export interface UserProfile {
  name: string;
  email: string;
  campus: string;
  cohort?: string;
  sector: SectorType;
  businessName: string;
  role?: string;
  avatarUrl?: string;
  businessPhotoUrl?: string;
  learningCredits?: number;
  phone?: string;
  social?: string;
  userStatus?: string;
  status?: string;
  title?: string;
  description?: string;
  challenge?: string;
}
