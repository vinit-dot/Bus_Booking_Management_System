
# 🚌 BusBook — MERN Stack Bus Booking System

<p align="center">
  <a href="https://bus-booking-management-system-iues.onrender.com"><strong>🔗 Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/vinit-dot/Bus_Booking_Management_System?style=flat-square" />
</p>

A full-featured online bus ticket booking platform built with MongoDB, Express, React (Vite), and Node.js — search buses, select seats, book tickets, and manage everything from an admin dashboard.

---

## 📸 Screenshots

<!-- Replace these with your own screenshots. Upload images to a `screenshots/` folder in your repo, then reference them like below. -->

| Home Page | Bus Search Results | Seat Selection |
|---|---|---|
| ![Home](./screenshots/home.png) | ![Search](./screenshots/search.png) | ![Seats](./screenshots/seats.png) |

---

## 📋 Features

### User Features
- 🔐 **Authentication** — Register, Login, Forgot/Reset Password (JWT + bcrypt)
- 🔍 **Bus Search** — Search buses by city, date with smart autocomplete
- 📋 **Bus Listing** — Filter by type, price, seats. Sort by departure/price/rating
- 💺 **Seat Selection** — Visual seat map with real-time availability
- 👥 **Passenger Details** — Multi-passenger form with validation
- 💳 **Payments** — Razorpay & Stripe integration
- 🎫 **E-Ticket** — Printable digital ticket after confirmation
- 📜 **Booking History** — View, cancel, and manage all bookings
- ⭐ **Reviews & Ratings** — Rate bus services after travel
- 👤 **Profile** — Edit profile, change password

### Admin Features
- 📊 **Dashboard** — Stats: users, buses, routes, bookings, revenue
- 🚌 **Bus Management** — Add/edit/delete buses with amenities
- 🛣️ **Route Management** — Define city routes, schedules, pricing
- 📋 **Booking Management** — View all bookings with filters
- 👥 **User Management** — View, activate/deactivate users

### Notifications
- 📧 Booking confirmation email
- ❌ Cancellation email

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| State | Context API |
| HTTP | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer |
| Payments | Razorpay, Stripe |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Deployment | Render |

---

## 🏗️ Project Structure

```
busbook/
├── server/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT protect + adminOnly
│   ├── models/
│   ├── routes/                # Express route files
│   ├── utils/
│   ├── index.js               # Entry point
│   └── package.json
│
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── seed.js                    # Database seeder
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/vinit-dot/Bus_Booking_Management_System.git
cd Bus_Booking_Management_System
npm run install-all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/busbook
JWT_SECRET=your_super_secret_key_minimum_32_chars
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

CLIENT_URL=http://localhost:5173
```

Also create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

### 3. Seed the Database

```bash
node seed.js
```

This creates:
- **Admin:** `admin@busbook.com` / `admin123`
- **User:** `user@busbook.com` / `user1234`
- 5 buses + 10 popular routes

### 4. Run the App

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |
| PUT  | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT  | `/api/auth/reset-password/:token` | Reset password |

### Buses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buses/search?from=&to=&date=` | Search buses |
| GET | `/api/buses/:id/seats?routeId=&date=` | Get seat layout |
| POST | `/api/buses` | Add bus (admin) |
| PUT | `/api/buses/:id` | Update bus (admin) |
| DELETE | `/api/buses/:id` | Delete bus (admin) |

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes/cities` | Get all cities |
| GET | `/api/routes` | Get all routes |
| POST | `/api/routes` | Add route (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | My bookings |
| GET | `/api/bookings/:id` | Booking detail |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/bookings` | All bookings (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/razorpay/create-order` | Create Razorpay order |
| POST | `/api/payments/razorpay/verify` | Verify payment |
| POST | `/api/payments/stripe/create-intent` | Create Stripe intent |
| POST | `/api/payments/stripe/confirm` | Confirm Stripe payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/toggle` | Toggle user status |

---

## 💳 Payment Setup

### Razorpay (Recommended for India)
1. Create account at https://razorpay.com
2. Get Key ID and Secret from Settings → API Keys
3. Add to `.env`
4. Add Razorpay script to `client/index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

### Stripe
1. Create account at https://stripe.com
2. Get Secret key from Dashboard
3. Add to `.env`

---

## 🔒 Security
- Passwords hashed with bcrypt (10 rounds)
- JWT authentication on protected routes
- Admin-only middleware for admin routes
- Input validation on critical endpoints
- CORS configured for client origin only

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/vinit-dot/Bus_Booking_Management_System/issues).

## 📝 License

This project is licensed under the MIT License — free for personal and commercial use.

---

<p align="center">Made with ❤️ by <a href="https://github.com/vinit-dot">Vinit Kumar</a></p>
