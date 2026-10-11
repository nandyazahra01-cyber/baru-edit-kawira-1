import type { Plugin } from 'vite';
import { Server as SocketIOServer } from 'socket.io';
import type { IncomingMessage, ServerResponse } from 'http';

// Mock DB in-memory state shared across server lifecycle
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'mentee' | 'mentor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  businessName?: string;
  category?: string;
  campus?: string;
  avatarUrl?: string;
  joinedAt: string;
  mentorId?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: 'mentee' | 'mentor' | 'admin';
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'warning' | 'error';
}

export interface BookkeepingItem {
  id: string;
  menteeId: string;
  menteeName: string;
  businessName: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  transactionDate: string;
}

export interface ChatSessionOverview {
  id: string;
  menteeId: string;
  menteeName: string;
  businessName: string;
  mentorId: string;
  mentorName: string;
  status: 'active' | 'completed' | 'scheduled';
  messageCount: number;
  lastMessage: string;
  lastActive: string;
}

export interface MentorAvailabilityItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  expertise: string[];
  status: 'available' | 'in_session' | 'offline';
  rating: number;
  activeMentees: number;
  officeHours: string;
}

export interface MentorFeedbackRecord {
  id: string;
  menteeId: string;
  menteeName: string;
  mentorId: string;
  mentorName: string;
  sessionTopic: string;
  progressNotes: string;
  actionItems: string;
  readinessScore: number;
  nextStepStatus: string;
  createdAt: string;
}

// Initial seed data
const initialUsers: ApiUser[] = [
  {
    id: 'u_mentor_1',
    name: 'Kak Aditya Ramadhan',
    email: 'aditya.ramadhan@mentor.kawira.id',
    role: 'mentor',
    status: 'active',
    businessName: 'Rice Bowl Sambal Nusantara',
    category: 'Food & Beverage',
    campus: 'Universitas Brawijaya (P2MW Alumni)',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-08-10'
  },
  {
    id: 'u_mentor_2',
    name: 'Kak Sari Indah Pertiwi',
    email: 'sari.pertiwi@mentor.kawira.id',
    role: 'mentor',
    status: 'active',
    businessName: 'Batik Ecoprint Modern',
    category: 'Fashion & Craft',
    campus: 'Universitas Gadjah Mada (PKM-K Alumni)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-09-01'
  },
  {
    id: 'u_mentor_3',
    name: 'Kak Budi Santoso',
    email: 'budi.santoso@mentor.kawira.id',
    role: 'mentor',
    status: 'active',
    businessName: 'AgroTech Sensor IoT',
    category: 'Technology & Agribisnis',
    campus: 'Institut Teknologi Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-09-15'
  },
  {
    id: 'u_mentor_4',
    name: 'Kak Amanda Putri',
    email: 'amanda.putri@mentor.kawira.id',
    role: 'mentor',
    status: 'active',
    businessName: 'Studio Desain Visual Kreatif',
    category: 'Creative Industry',
    campus: 'Institut Seni Indonesia Yogyakarta',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-10-01'
  },
  {
    id: 'u_mentee_1',
    name: 'Farhan Pratama',
    email: 'farhan.pratama@student.ub.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'Kopi Susu Kampus Seduh',
    category: 'Food & Beverage',
    campus: 'Universitas Brawijaya',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-01-12',
    mentorId: 'u_mentor_1'
  },
  {
    id: 'u_mentee_2',
    name: 'Nadia Aulia Putri',
    email: 'nadia.aulia@student.ui.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'Hijab Voal Printing Alana',
    category: 'Fashion & Lifestyle',
    campus: 'Universitas Indonesia',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-01-20',
    mentorId: 'u_mentor_1'
  },
  {
    id: 'u_mentee_3',
    name: 'Kevin Wijaya',
    email: 'kevin.wijaya@student.itb.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'Snack Jamur Crispy Gurih',
    category: 'Agroindustri & Camilan',
    campus: 'Institut Teknologi Bandung',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-02-01',
    mentorId: 'u_mentor_1'
  },
  {
    id: 'u_mentee_4',
    name: 'Rina Salsabila',
    email: 'rina.salsabila@student.ugm.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'Lilac Scented Candle & Diffuser',
    category: 'Kriya & Home Living',
    campus: 'Universitas Gadjah Mada',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-02-14',
    mentorId: 'u_mentor_1'
  },
  {
    id: 'u_mentee_5',
    name: 'Dimas Anggara',
    email: 'dimas.ang@student.undip.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'EcoStraw Sedotan Bambu Lokal',
    category: 'Ramah Lingkungan',
    campus: 'Universitas Diponegoro',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-02-18',
    mentorId: 'u_mentor_2'
  },
  {
    id: 'u_mentee_6',
    name: 'Clarissa Devi',
    email: 'clarissa.d@student.unair.ac.id',
    role: 'mentee',
    status: 'active',
    businessName: 'GlowSkin Organic Serum',
    category: 'Kecantikan & Herbal',
    campus: 'Universitas Airlangga',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-02-25',
    mentorId: 'u_mentor_2'
  },
  {
    id: 'u_mentee_7',
    name: 'Rizky Maulana',
    email: 'rizky.m@student.uns.ac.id',
    role: 'mentee',
    status: 'suspended',
    businessName: 'PrintCepat Digital Kampus',
    category: 'Jasa & Percetakan',
    campus: 'Universitas Sebelas Maret',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2026-01-05',
    mentorId: 'u_mentor_3'
  },
  {
    id: 'u_admin_1',
    name: 'Super Admin KAWIRA',
    email: 'admin@kawira.id',
    role: 'admin',
    status: 'active',
    campus: 'Pusat Inkubasi Kawira Indonesia',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-06-01'
  },
  {
    id: 'u_admin_2',
    name: 'Tim Validasi Mutu Inkubasi',
    email: 'mutu@kawira.id',
    role: 'admin',
    status: 'active',
    campus: 'Direktorat Pembelajaran Kemendikbud',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    joinedAt: '2025-07-15'
  }
];

const initialActivities: ActivityLog[] = [
  {
    id: 'act_101',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    userId: 'u_mentor_1',
    userName: 'Kak Aditya Ramadhan',
    role: 'mentor',
    action: 'chat.message_sent',
    description: 'Mengirimkan saran optimasi HPP ke Farhan Pratama',
    ipAddress: '180.252.164.88',
    userAgent: 'Chrome 122.0 (Windows NT 10.0)',
    status: 'success'
  },
  {
    id: 'act_102',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    userId: 'u_mentee_1',
    userName: 'Farhan Pratama',
    role: 'mentee',
    action: 'bookkeeping.record_created',
    description: 'Mencatat pemasukan kas penjualan 65 cup kopi (Rp 1.170.000)',
    ipAddress: '114.125.42.19',
    userAgent: 'Safari 17.3 (macOS)',
    status: 'success'
  },
  {
    id: 'act_103',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userId: 'u_mentee_2',
    userName: 'Nadia Aulia Putri',
    role: 'mentee',
    action: 'auth.login',
    description: 'Login berhasil via SSO Kampus Universitas Indonesia',
    ipAddress: '103.213.129.5',
    userAgent: 'Chrome Mobile (Android 14)',
    status: 'success'
  },
  {
    id: 'act_104',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    userId: 'u_mentor_2',
    userName: 'Kak Sari Indah Pertiwi',
    role: 'mentor',
    action: 'mentoring.feedback_submitted',
    description: 'Memberikan catatan review packaging brand Clarissa Devi',
    ipAddress: '182.253.110.42',
    userAgent: 'Edge 122.0 (Windows NT 11.0)',
    status: 'success'
  },
  {
    id: 'act_105',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    userId: 'u_mentee_3',
    userName: 'Kevin Wijaya',
    role: 'mentee',
    action: 'calculator.bep_calculated',
    description: 'Melakukan kalkulasi Titik Impas (BEP) target 450 bungkus',
    ipAddress: '125.166.8.91',
    userAgent: 'Firefox 123.0 (Linux x86_64)',
    status: 'success'
  },
  {
    id: 'act_106',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    userId: 'u_admin_1',
    userName: 'Super Admin KAWIRA',
    role: 'admin',
    action: 'admin.user_status_changed',
    description: 'Memperbarui status verifikasi mentor Kak Amanda Putri menjadi aktif',
    ipAddress: '36.85.12.104',
    userAgent: 'Chrome 122.0 (macOS 14.3)',
    status: 'success'
  },
  {
    id: 'act_107',
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    userId: 'u_mentee_7',
    userName: 'Rizky Maulana',
    role: 'mentee',
    action: 'auth.failed_attempt',
    description: 'Peringatan autentikasi: Upaya login akun ditangguhkan sementara',
    ipAddress: '202.67.40.11',
    userAgent: 'Chrome 120.0 (Windows NT 10.0)',
    status: 'warning'
  }
];

const initialBookkeeping: BookkeepingItem[] = [
  {
    id: 'bk_1',
    menteeId: 'u_mentee_1',
    menteeName: 'Farhan Pratama',
    businessName: 'Kopi Susu Kampus Seduh',
    type: 'income',
    category: 'Penjualan Langsung',
    amount: 1170000,
    description: 'Penjualan 65 cup kopi susu aren bazar fakultas teknik',
    transactionDate: '2026-10-10'
  },
  {
    id: 'bk_2',
    menteeId: 'u_mentee_1',
    menteeName: 'Farhan Pratama',
    businessName: 'Kopi Susu Kampus Seduh',
    type: 'expense',
    category: 'Bahan Baku',
    amount: 420000,
    description: 'Beli biji kopi arabika 2kg dan susu fresh milk 12 liter',
    transactionDate: '2026-10-09'
  },
  {
    id: 'bk_3',
    menteeId: 'u_mentee_2',
    menteeName: 'Nadia Aulia Putri',
    businessName: 'Hijab Voal Printing Alana',
    type: 'income',
    category: 'Pre-Order Reseller',
    amount: 2450000,
    description: 'Pembayaran DP batch 1 hijab motif botanical kampus',
    transactionDate: '2026-10-10'
  },
  {
    id: 'bk_4',
    menteeId: 'u_mentee_2',
    menteeName: 'Nadia Aulia Putri',
    businessName: 'Hijab Voal Printing Alana',
    type: 'expense',
    category: 'Produksi & Cetak',
    amount: 1100000,
    description: 'Ongkos cetak sublimasi 50 meter kain ultrafine voal',
    transactionDate: '2026-10-08'
  },
  {
    id: 'bk_5',
    menteeId: 'u_mentee_3',
    menteeName: 'Kevin Wijaya',
    businessName: 'Snack Jamur Crispy Gurih',
    type: 'income',
    category: 'Konsinyasi Kantin',
    amount: 780000,
    description: 'Setoran penjualan minggu ke-1 kantin asrama mahasiswa ITB',
    transactionDate: '2026-10-09'
  },
  {
    id: 'bk_6',
    menteeId: 'u_mentee_3',
    menteeName: 'Kevin Wijaya',
    businessName: 'Snack Jamur Crispy Gurih',
    type: 'expense',
    category: 'Kemasan & Label',
    amount: 290000,
    description: 'Cetak stiker vinyl hologram & 200 pcs standing pouch matte',
    transactionDate: '2026-10-07'
  },
  {
    id: 'bk_7',
    menteeId: 'u_mentee_6',
    menteeName: 'Clarissa Devi',
    businessName: 'GlowSkin Organic Serum',
    type: 'income',
    category: 'Penjualan Online Marketplace',
    amount: 3850000,
    description: 'Pencairan saldo toko Shopee penjualan 35 botol serum',
    transactionDate: '2026-10-10'
  },
  {
    id: 'bk_8',
    menteeId: 'u_mentee_4',
    menteeName: 'Rina Salsabila',
    businessName: 'Lilac Scented Candle',
    type: 'expense',
    category: 'Bahan Baku Aromaterapi',
    amount: 540000,
    description: 'Beli soy wax flakes 5kg dan 3 botol fragrance oil lavender',
    transactionDate: '2026-10-06'
  }
];

const initialChatSessions: ChatSessionOverview[] = [
  {
    id: 'conv_1',
    menteeId: 'u_mentee_1',
    menteeName: 'Farhan Pratama',
    businessName: 'Kopi Susu Kampus Seduh',
    mentorId: 'u_mentor_1',
    mentorName: 'Kak Aditya Ramadhan',
    status: 'active',
    messageCount: 32,
    lastMessage: 'Siap Kak, saya sudah revisi tabel HPP cup sesuai saran!',
    lastActive: '2 menit lalu'
  },
  {
    id: 'conv_2',
    menteeId: 'u_mentee_2',
    menteeName: 'Nadia Aulia Putri',
    businessName: 'Hijab Voal Printing Alana',
    mentorId: 'u_mentor_1',
    mentorName: 'Kak Aditya Ramadhan',
    status: 'active',
    messageCount: 18,
    lastMessage: 'Untuk biaya overhead listrik konveksi cara baginya bagaimana kak?',
    lastActive: '25 menit lalu'
  },
  {
    id: 'conv_3',
    menteeId: 'u_mentee_3',
    menteeName: 'Kevin Wijaya',
    businessName: 'Snack Jamur Crispy Gurih',
    mentorId: 'u_mentor_1',
    mentorName: 'Kak Aditya Ramadhan',
    status: 'completed',
    messageCount: 41,
    lastMessage: 'Catatan feedback sesi validasi kemasan telah tersimpan.',
    lastActive: 'Kemarin, 16:30'
  },
  {
    id: 'conv_4',
    menteeId: 'u_mentee_6',
    menteeName: 'Clarissa Devi',
    businessName: 'GlowSkin Organic Serum',
    mentorId: 'u_mentor_2',
    mentorName: 'Kak Sari Indah Pertiwi',
    status: 'active',
    messageCount: 26,
    lastMessage: 'Foto mockup instagram feed-nya sudah sesuai tone brand ya kak.',
    lastActive: '1 jam lalu'
  },
  {
    id: 'conv_5',
    menteeId: 'u_mentee_5',
    menteeName: 'Dimas Anggara',
    businessName: 'EcoStraw Sedotan Bambu',
    mentorId: 'u_mentor_2',
    mentorName: 'Kak Sari Indah Pertiwi',
    status: 'active',
    messageCount: 12,
    lastMessage: 'Mau tanya strategi outreach ke cafe-cafe sekitar Semarang.',
    lastActive: '3 jam lalu'
  }
];

const initialMentorAvailability: MentorAvailabilityItem[] = [
  {
    id: 'u_mentor_1',
    name: 'Kak Aditya Ramadhan',
    email: 'aditya.ramadhan@mentor.kawira.id',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    expertise: ['F&B Scale-up', 'Penetapan HPP', 'SOP Dapur & Operasional'],
    status: 'available',
    rating: 4.9,
    activeMentees: 4,
    officeHours: '09:00 - 17:00 WIB'
  },
  {
    id: 'u_mentor_2',
    name: 'Kak Sari Indah Pertiwi',
    email: 'sari.pertiwi@mentor.kawira.id',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    expertise: ['Digital Marketing', 'Branding & Kemasan', 'Katalog Produk'],
    status: 'in_session',
    rating: 4.8,
    activeMentees: 3,
    officeHours: '13:00 - 18:00 WIB'
  },
  {
    id: 'u_mentor_3',
    name: 'Kak Budi Santoso',
    email: 'budi.santoso@mentor.kawira.id',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    expertise: ['Tech Hardware', 'Validasi Pasar', 'Pitch Deck Investor'],
    status: 'available',
    rating: 4.9,
    activeMentees: 2,
    officeHours: '19:00 - 21:00 WIB'
  },
  {
    id: 'u_mentor_4',
    name: 'Kak Amanda Putri',
    email: 'amanda.putri@mentor.kawira.id',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    expertise: ['Content Creation', 'Social Media Selling', 'Kreativitas Visual'],
    status: 'offline',
    rating: 4.7,
    activeMentees: 2,
    officeHours: '10:00 - 15:00 WIB'
  }
];

const initialFeedbacks: MentorFeedbackRecord[] = [
  {
    id: 'fb_1',
    menteeId: 'u_mentee_3',
    menteeName: 'Kevin Wijaya',
    mentorId: 'u_mentor_1',
    mentorName: 'Kak Aditya Ramadhan',
    sessionTopic: 'Validasi Kemasan Standing Pouch & Titik Impas BEP',
    progressNotes: 'Kevin sudah menghitung biaya pokok kemasan per bungkus Rp 1.450. Perlu menaikkan margin sedikit agar aman saat reseller meminta diskon 15%.',
    actionItems: '1. Uji ketahanan segel sealer 7 hari. 2. Susun proposal konsinyasi ke 5 kantin kampus baru.',
    readinessScore: 4,
    nextStepStatus: 'Sesi Selesai (Target Tercapai)',
    createdAt: '2026-10-09 17:15 WIB'
  }
];

// Helper to parse JSON body
function parseBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({} as T);
      }
    });
  });
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export function mockBackendPlugin(): Plugin {
  let io: SocketIOServer | null = null;
  const users = [...initialUsers];
  const activities = [...initialActivities];
  const bookkeeping = [...initialBookkeeping];
  const chatSessions = [...initialChatSessions];
  const feedbacks = [...initialFeedbacks];

  return {
    name: 'kawira-mock-backend',
    configureServer(server) {
      // Attach Socket.io to server.httpServer
      if (server.httpServer && !io) {
        io = new SocketIOServer(server.httpServer, {
          cors: { origin: '*' }
        });

        io.on('connection', (socket) => {
          socket.on('join_room', (room: string) => {
            socket.join(room);
          });

          // WebSocket Event: send_message
          socket.on('send_message', (payload: {
            conversationId?: string;
            senderId?: string;
            senderName?: string;
            senderRole?: string;
            receiverId?: string;
            text?: string;
            timestamp?: string;
          }) => {
            const messageData = {
              id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
              conversationId: payload.conversationId || 'default_room',
              senderId: payload.senderId || 'unknown',
              senderName: payload.senderName || 'Pengguna',
              senderRole: payload.senderRole || 'mentor',
              receiverId: payload.receiverId || '',
              text: payload.text || '',
              timestamp: payload.timestamp || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              status: 'sent'
            };

            // Broadcast receive_message to all connected clients & rooms
            io?.emit('receive_message', messageData);

            // Record audit activity
            activities.unshift({
              id: 'act_' + Date.now(),
              timestamp: new Date().toISOString(),
              userId: messageData.senderId,
              userName: messageData.senderName,
              role: (messageData.senderRole as 'mentor' | 'mentee' | 'admin') || 'mentor',
              action: 'chat.message_sent',
              description: `Pesan dikirim dalam sesi konsultasi: "${messageData.text.slice(0, 45)}${messageData.text.length > 45 ? '...' : ''}"`,
              ipAddress: '127.0.0.1',
              userAgent: 'KAWIRA Live Socket Engine',
              status: 'success'
            });

            // Simulate realistic mentee automatic reply if sender was a mentor
            if (payload.senderRole === 'mentor') {
              setTimeout(() => {
                const autoReplies = [
                  'Baik Kak, terima kasih arahannya! Saya coba sesuaikan rincian biayanya sekarang.',
                  'Betul sekali Kak, sebelumnya saya belum hitung penyusutan alat blender dan timbangan.',
                  'Untuk target BEP unit per bulan berarti kami perlu jual minimal 350 porsi ya Kak?',
                  'Siap Kak Aditya, besok saya kirimkan update laporan arus kas mingguan ke sistem.',
                  'Terima kasih banyak atas feedbacknya Kak! Sangat membantu persiapan expo kampus kami.'
                ];
                const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
                const replyMsg = {
                  id: 'msg_' + (Date.now() + 1),
                  conversationId: payload.conversationId || 'default_room',
                  senderId: payload.receiverId || 'u_mentee_1',
                  senderName: 'Farhan Pratama (Mentee)',
                  senderRole: 'mentee',
                  receiverId: payload.senderId,
                  text: replyText,
                  timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                  status: 'delivered'
                };
                io?.emit('receive_message', replyMsg);
              }, 1200);
            }
          });

          socket.on('disconnect', () => {
            // client disconnected
          });
        });
      }

      // Middleware for API routes
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.end();
          return;
        }

        // 1. GET /api/admin/users
        if (req.method === 'GET' && url.startsWith('/api/admin/users')) {
          const parsedUrl = new URL(url, 'http://localhost');
          const role = parsedUrl.searchParams.get('role');
          const status = parsedUrl.searchParams.get('status');
          const q = parsedUrl.searchParams.get('q')?.toLowerCase();

          let result = [...users];
          if (role) result = result.filter(u => u.role === role);
          if (status) result = result.filter(u => u.status === status);
          if (q) result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

          sendJson(res, {
            users: result,
            total: result.length,
            stats: {
              totalMentees: users.filter(u => u.role === 'mentee').length,
              totalMentors: users.filter(u => u.role === 'mentor').length,
              totalAdmins: users.filter(u => u.role === 'admin').length,
              activeCount: users.filter(u => u.status === 'active').length,
              suspendedCount: users.filter(u => u.status === 'suspended').length
            }
          });
          return;
        }

        // 2. GET /api/admin/activities
        if (req.method === 'GET' && url.startsWith('/api/admin/activities')) {
          const parsedUrl = new URL(url, 'http://localhost');
          const role = parsedUrl.searchParams.get('role');
          const action = parsedUrl.searchParams.get('action');
          const q = parsedUrl.searchParams.get('q')?.toLowerCase();

          let result = [...activities];
          if (role && role !== 'all') result = result.filter(a => a.role === role);
          if (action && action !== 'all') result = result.filter(a => a.action.startsWith(action));
          if (q) {
            result = result.filter(a =>
              a.userName.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q) ||
              a.ipAddress.includes(q) ||
              a.userId.toLowerCase().includes(q)
            );
          }

          sendJson(res, {
            activities: result,
            total: result.length
          });
          return;
        }

        // 3. PATCH /api/admin/users/:id/status
        if (req.method === 'PATCH' && url.match(/^\/api\/admin\/users\/[^/]+\/status$/)) {
          const parts = url.split('/');
          const userId = parts[4];
          const body = await parseBody<{ status: 'active' | 'suspended' | 'pending' }>(req);
          const user = users.find(u => u.id === userId);
          if (!user) {
            sendJson(res, { error: 'USER_NOT_FOUND' }, 404);
            return;
          }
          user.status = body.status;
          activities.unshift({
            id: 'act_' + Date.now(),
            timestamp: new Date().toISOString(),
            userId: 'u_admin_1',
            userName: 'Super Admin KAWIRA',
            role: 'admin',
            action: 'admin.user_status_changed',
            description: `Mengubah status user ${user.name} (${user.email}) menjadi ${body.status}`,
            ipAddress: '127.0.0.1',
            userAgent: 'Kawira Portal Manager',
            status: 'success'
          });
          sendJson(res, { success: true, user });
          return;
        }

        // 4. PATCH /api/admin/users/:id/role
        if (req.method === 'PATCH' && url.match(/^\/api\/admin\/users\/[^/]+\/role$/)) {
          const parts = url.split('/');
          const userId = parts[4];
          const body = await parseBody<{ role: 'mentee' | 'mentor' | 'admin' }>(req);
          const user = users.find(u => u.id === userId);
          if (!user) {
            sendJson(res, { error: 'USER_NOT_FOUND' }, 404);
            return;
          }
          const oldRole = user.role;
          user.role = body.role;
          activities.unshift({
            id: 'act_' + Date.now(),
            timestamp: new Date().toISOString(),
            userId: 'u_admin_1',
            userName: 'Super Admin KAWIRA',
            role: 'admin',
            action: 'admin.user_role_changed',
            description: `Mengubah hak akses user ${user.name} dari ${oldRole} menjadi ${body.role}`,
            ipAddress: '127.0.0.1',
            userAgent: 'Kawira Portal Manager',
            status: 'success'
          });
          sendJson(res, { success: true, user });
          return;
        }

        // 5. GET /api/database/overview
        if (req.method === 'GET' && url.startsWith('/api/database/overview')) {
          sendJson(res, {
            bookkeepingRecords: bookkeeping,
            chatConversations: chatSessions,
            mentorAvailability: initialMentorAvailability,
            kpis: {
              totalMentees: users.filter(u => u.role === 'mentee').length,
              totalMentors: users.filter(u => u.role === 'mentor').length,
              totalChatMessages: chatSessions.reduce((acc, c) => acc + c.messageCount, 0) + 142,
              totalMentoringSessions: chatSessions.length + feedbacks.length + 8,
              totalBookkeepingRecords: bookkeeping.length,
              totalCashflowVolume: bookkeeping.reduce((acc, b) => acc + b.amount, 0)
            }
          });
          return;
        }

        // 6. GET /api/mentor/mentees
        if (req.method === 'GET' && url.startsWith('/api/mentor/mentees')) {
          const mentorMentees = users
            .filter(u => u.role === 'mentee')
            .slice(0, 4)
            .map((m, idx) => ({
              ...m,
              sessionStatus: idx === 0 ? 'Sedang Berlangsung' : idx === 1 ? 'Menunggu Diskusi' : idx === 2 ? 'Selesai Diskusi' : 'Terjadwal',
              isOnline: idx === 0 || idx === 1,
              lastSession: idx === 0 ? 'Hari ini, 10:15 WIB' : idx === 1 ? 'Kemarin, 14:00 WIB' : '2 hari lalu',
              lastTopic: idx === 0 ? 'Perhitungan HPP & Food Cost' : idx === 1 ? 'Branding & Foto Produk Voal' : 'Formulasi Kemasan & Izin PIRT'
            }));

          sendJson(res, {
            mentees: mentorMentees,
            feedbacks: feedbacks
          });
          return;
        }

        // 7. POST /api/mentor/feedback
        if (req.method === 'POST' && url.startsWith('/api/mentor/feedback')) {
          const body = await parseBody<{
            menteeId: string;
            menteeName: string;
            mentorId: string;
            mentorName: string;
            sessionTopic: string;
            progressNotes: string;
            actionItems: string;
            readinessScore: number;
            nextStepStatus: string;
          }>(req);

          const newFb: MentorFeedbackRecord = {
            id: 'fb_' + Date.now(),
            menteeId: body.menteeId || 'u_mentee_1',
            menteeName: body.menteeName || 'Farhan Pratama',
            mentorId: body.mentorId || 'u_mentor_1',
            mentorName: body.mentorName || 'Kak Aditya Ramadhan',
            sessionTopic: body.sessionTopic || 'Sesi Mentoring Praktis',
            progressNotes: body.progressNotes || '',
            actionItems: body.actionItems || '',
            readinessScore: body.readinessScore || 4,
            nextStepStatus: body.nextStepStatus || 'Selesai & Rekomendasi Terkirim',
            createdAt: new Date().toLocaleString('id-ID')
          };
          feedbacks.unshift(newFb);

          activities.unshift({
            id: 'act_' + Date.now(),
            timestamp: new Date().toISOString(),
            userId: newFb.mentorId,
            userName: newFb.mentorName,
            role: 'mentor',
            action: 'mentoring.feedback_submitted',
            description: `Memberikan catatan evaluasi & skor kesiapan (${newFb.readinessScore}/5) untuk ${newFb.menteeName}`,
            ipAddress: '127.0.0.1',
            userAgent: 'Kawira Mentor Workspace',
            status: 'success'
          });

          sendJson(res, { success: true, feedback: newFb });
          return;
        }

        next();
      });
    }
  };
}
