# KAWIRA Backend Starter

Starter backend untuk menghubungkan frontend KAWIRA (React + TypeScript + Vite) ke API, PostgreSQL, JWT auth, Socket.IO, dan audit log.

## Stack
- Node.js 20+
- Express + TypeScript
- PostgreSQL (`pg`)
- JWT access token + bcrypt password hashing
- Socket.IO untuk chat real-time
- Zod untuk validasi request
- Helmet, CORS, rate limiting

> Ini adalah fondasi implementasi, bukan sistem production yang sudah diaudit. Sebelum production, tambahkan refresh-token rotation, email verification/password reset, malware scanning lampiran, backup, monitoring, dan pengujian keamanan.

## 1. Instalasi
```bash
cd backend
npm install
cp .env.example .env
# isi DATABASE_URL, JWT_SECRET, CLIENT_ORIGIN
psql "$DATABASE_URL" -f ../database/schema.sql
npm run dev
```

## 2. Integrasi frontend
Salin `frontend-integration/api.ts` dan `frontend-integration/roleNavigation.ts` ke folder `src/lib/` pada aplikasi Vite. Atur `VITE_API_URL=http://localhost:4000/api` dan `VITE_SOCKET_URL=http://localhost:4000`.

API menggunakan header `Authorization: Bearer <token>`. Jangan simpan token di `localStorage` untuk aplikasi sensitif bila bisa dihindari; starter ini memakai memory storage sederhana pada contoh client. Untuk deployment, pertimbangkan cookie `HttpOnly`, `Secure`, `SameSite` dengan desain CSRF yang sesuai.

## 3. Endpoint utama
- `POST /api/auth/register` — registrasi mentee saja.
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/mentoring-sessions` — mentee melihat miliknya, mentor melihat sesi yang terhubung.
- `POST /api/mentoring-sessions` — mentee mengajukan sesi.
- `POST /api/chat/conversations` — buat/ambil percakapan dengan mentor yang terhubung.
- `GET /api/chat/conversations`
- `GET /api/chat/conversations/:id/messages`
- `POST /api/chat/conversations/:id/messages` — fallback REST; real-time memakai Socket.IO.
- `GET /api/admin/activity-logs` — admin only.
- `GET /api/admin/metrics` — admin only.
- `PATCH /api/admin/users/:id/status` — admin only.

## 4. Socket.IO events
Client -> server:
- `conversation:join` `{ conversationId }`
- `message:send` `{ conversationId, text }`
- `message:read` `{ conversationId }`
- `chat:finish` `{ conversationId, summary }`

Server -> client:
- `message:new`
- `message:sent`
- `message:error`
- `message:read`
- `chat:finished`
- `presence:update`

Server memverifikasi JWT dan keanggotaan percakapan sebelum mengizinkan join/kirim pesan.

## 5. Role dan privasi
- Registrasi publik hanya membuat role `mentee`; role `mentor` perlu proses persetujuan admin, dan `admin` harus dibuat lewat proses bootstrap yang aman.
- Jangan percaya `role`, `user_id`, `mentee_id`, atau `sender_id` yang dikirim client. Identitas diambil dari JWT.
- Mentor tidak mendapat endpoint pembukuan mentee. Akses pembukuan dibatasi ke pemilik data.
- Audit log tidak menyimpan password, token, isi pesan, atau data keuangan sensitif.
- IP address di balik reverse proxy hanya boleh dipercaya jika `trust proxy` dikonfigurasi secara benar.
- Lampiran sebaiknya diunggah ke object storage dengan signed URL; jangan menerima file arbitrer langsung ke server tanpa batas ukuran dan pemindaian.

## 6. Bootstrap admin
Buat user pertama melalui skrip/SQL administrasi internal yang memakai bcrypt hash, atau buat endpoint bootstrap sekali pakai yang dinonaktifkan setelah digunakan. Jangan izinkan user memilih role `admin` melalui form registrasi publik.
