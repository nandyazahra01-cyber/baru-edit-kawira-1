# KAWIRA Staff Login

Files: `public/login-staff.html`, `public/login-staff.js`, `styles.css`.

## Setup
Serve this folder with a local web server (not `file://`) and run the KAWIRA API at `http://localhost:4000/api`, or edit `API_BASE_URL` in `public/login-staff.js`.

Expected `POST /api/auth/login` response:
```json
{"token":"JWT_ACCESS_TOKEN","user":{"id":"uuid","name":"Nama","email":"mentor@example.com","role":"mentor","status":"active"}}
```
`GET /api/auth/me` must return `{ "user": { ... } }` for a valid token. The auto-routing guard verifies the token server-side rather than trusting localStorage alone.

The Remember Me checkbox stores the session in localStorage when checked, or sessionStorage when unchecked. For production, use HTTPS and consider HttpOnly/Secure/SameSite cookies for tokens. Always enforce authorization on the backend; frontend role checks are not a security boundary.
