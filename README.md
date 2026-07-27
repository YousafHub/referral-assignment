# Referral System

A full-stack referral system built with **Next.js**, **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

## ✨ Features

- User registration with unique referral codes
- User login with JWT authentication
- HTTP-only cookie based authentication
- Referral system with point rewards
- Dashboard displaying referral statistics
- Duplicate referral reward prevention
- Type-safe development using TypeScript

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod

## Frontend

- Next.js 16
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

---

# 📁 Project Structure

```text
referral-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd referral-assignment
```

## 2. Setup Backend

```bash
cd backend
npm install

cp .env.example .env

npx prisma generate
npx prisma db push

npm run dev
```

## 3. Setup Frontend

```bash
cd frontend
npm install

cp .env.example .env.local

npm run dev
```

---

# 🔑 Environment Variables

## Backend (`backend/.env`)

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |
| GET | `/api/dashboard` | Get dashboard information |
| GET | `/api/me` | Get authenticated user |

---

# 📱 Pages

- `/register`
- `/login`
- `/dashboard`

---

# 🔄 Referral Logic

- Every user receives a unique referral code during registration.
- Users can optionally register using an existing referral code.
- A successful referral awards **10 points** to the referrer.
- Each account can only be referred once, preventing duplicate referral rewards.
- User creation and referral point updates are processed together using a Prisma transaction to ensure data consistency.

---

# 🔒 Security

- Passwords hashed using bcrypt
- JWT authentication
- HTTP-only cookies
- Zod request validation
- Protected routes
- Duplicate referral prevention

---

# ▶️ Running the Application

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

Backend runs on:

```
http://localhost:5000
```

Prisma Studio (optional):

```bash
cd backend
npx prisma studio
```