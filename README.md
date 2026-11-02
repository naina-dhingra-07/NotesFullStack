# Notes App

React + Node/Express + MongoDB note-taking app with private and public notes.

## Structure

```
notes-app/
├── server/
│   ├── server.js
│   ├── config/db.js
│   ├── models/        User.js, Note.js
│   ├── middleware/    auth.js
│   ├── controllers/   authController.js, noteController.js
│   └── routes/        authRoutes.js, noteRoutes.js
└── client/
    ├── vite.config.js
    └── src/
        ├── App.jsx, api.js, main.jsx, index.css
        └── components/ AuthForm, Dashboard, NoteForm, NoteCard
```

## Run it

Requires Node 18+ and a running MongoDB (local, or an Atlas URI).

```bash
# 1. API
cd server
cp .env.example .env      # set JWT_SECRET (e.g. `openssl rand -hex 32`) and MONGO_URI
npm install
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so the auth cookie is same-origin.

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account, sets cookie |
| POST | /api/auth/login | – | Log in, sets cookie |
| POST | /api/auth/logout | – | Clears cookie |
| GET | /api/auth/me | yes | Current user |
| GET | /api/notes | yes | My notes (private + public) |
| GET | /api/notes/public | yes | All public notes (author name only) |
| POST | /api/notes | yes | Create `{ title, body, isPublic }` |
| PUT | /api/notes/:id | owner | Update |
| DELETE | /api/notes/:id | owner | Delete |

## Security notes

- Passwords are hashed with bcrypt (12 rounds) in a Mongoose pre-save hook and excluded from queries by default.
- JWT (7 days) is stored in an `httpOnly`, `sameSite=lax` cookie (`secure` in production). The middleware also accepts `Authorization: Bearer <token>`.
- Ownership is enforced server-side on update/delete (403 otherwise); the UI hiding buttons is only cosmetic.
- Public feed exposes only the author's name, never email.
- Before deploying: serve over HTTPS, set `NODE_ENV=production`, and consider adding `helmet` and rate limiting on `/api/auth/*`.
