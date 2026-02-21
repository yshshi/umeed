# Umeed - MLM Platform (MERN Stack)

Production-ready Network Marketing (MLM) platform with modern UI, referral system, commission logic, and admin panel.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Email:** Nodemailer (SMTP configurable)

## Project Structure

```
Umeed/
├── backend/
│   ├── config/         # DB, email config
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/       # Email, commission
│   ├── utils/
│   ├── scripts/        # seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layout/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (copy from `.env.example`):

- Set `MONGODB_URI` to your MongoDB connection string.
- Set `JWT_SECRET` for production.
- Optionally set SMTP variables for emails.

```bash
# Run backend
npm run dev
# or
npm start
```

Server runs at `http://localhost:5000`.

### 2. Seed data (optional)

```bash
cd backend
# Ensure MONGODB_URI is set in .env
node scripts/seed.js
```

This creates:
- Admin: `admin@mlm.com` / Member ID: `NM10000` / Password: `admin123`
- Sample user: `john@example.com` / `NM10001` / `password123`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` to the backend.

### 4. Environment

**Backend `.env`:**

- `MONGODB_URI` - Your MongoDB connection string (required)
- `JWT_SECRET` - Secret for JWT (required in production)
- `PORT` - Default 5000
- `FRONTEND_URL` - For CORS and email links (e.g. `http://localhost:5173`)
- `SMTP_*` - For Nodemailer (optional; emails logged to console if not set)

**Frontend:** Optional `VITE_API_URL` (default `/api` for proxy).

## Features

- **Auth:** Register (with optional referral code), Login (Member ID + Password), JWT, protected routes
- **Referral:** Unique referral code (same as Member ID), `/register?ref=NM10001`, parent/ancestors stored
- **Dashboard:** Welcome, Member ID, level, dates, business, member counts, income, wallet, referral link with copy
- **Profile:** Edit personal, address, family, bank details
- **Business:** Self (business type, joining date, income); Team (recursive tree, click to load subtree)
- **Registration:** Logged-in user can register new member under self; parent/level auto-set; welcome + referral email
- **Commission:** On new registration: L1 10%, L2 7%, L3 5%, L4+ 2%; stored in commissions, wallet & transaction updated; email sent
- **Commission page:** History table (date, from user, level, amount, status)
- **Wallet:** Balance, total income/bonus, transaction history
- **Admin:** List users, activate/deactivate, platform stats (total users, active, total commission)
- **Email:** Welcome, referral alert, commission credited (via Nodemailer when SMTP configured)

## API Overview

| Method | Route | Description |
|--------|--------|-------------|
| POST | /api/auth/register | Register (body: name, email, mobile, password, businessType, referralCode?) |
| POST | /api/auth/login | Login (body: memberId, password) |
| GET | /api/auth/me | Current user (Bearer token) |
| PUT | /api/users/profile | Update profile (Bearer) |
| GET | /api/users/:id | Get user by ID (own or admin) |
| GET | /api/team/tree/:userId | Tree for userId (Bearer) |
| GET | /api/team/stats | Direct & total members (Bearer) |
| GET | /api/commissions | My commissions (Bearer) |
| GET | /api/wallet/transactions | My transactions (Bearer) |
| POST | /api/registration | Register new member under current user (Bearer) |
| GET | /api/admin/users | All users (admin) |
| PUT | /api/admin/users/:id/active | Toggle active (admin) |
| GET | /api/admin/stats | Platform stats (admin) |

## Commission Logic

- Joining amount: ₹1000 (configurable in `backend/services/commissionService.js`).
- Level 1: 10%, Level 2: 7%, Level 3: 5%, Level 4+: 2%.
- On new user registration, commissions are calculated for all ancestors and credited to wallet; entries created in Commission and Transaction collections.

## Tree Logic

- Each user has `ancestors` array for optimized queries.
- `GET /api/team/tree/:userId` returns root + direct children (one level). Clicking a member in the UI loads that member’s tree (same API with their `userId`).

## Security

- JWT middleware on protected routes
- Passwords hashed with bcrypt
- Input validation on auth/registration
- Rate limiting on auth routes
- Role-based admin middleware

## License

MIT.
