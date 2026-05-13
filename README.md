# DineScan — QR Table Ordering & Cashier Management System

DineScan adalah sistem pemesanan makanan/minuman modern berbasis QR Code untuk restoran atau kafe. Customer cukup scan QR di meja, pesan, dan bayar. Staf kasir dan dapur akan menerima pesanan secara realtime.

## 🚀 Fitur Utama

- **Customer:** Scan QR, Digital Menu, Shopping Cart, Online/Cash Payment, Realtime Order Status.
- **Cashier Dashboard:** Realtime Incoming Orders, Cash Payment Confirmation, Kitchen Ticket Dispatch, Receipt Printing.
- **Kitchen Display System (KDS):** Kanban-style order management, Production timer, Status updates.
- **Admin Panel:** Business Statistics, Menu CRUD, Table & QR Management, Staff Management.

## 🛠 Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, Zustand, Socket.IO Client.
- **Backend:** Node.js + Express, Socket.IO, Prisma ORM, JWT.
- **Database:** SQLite (Default for easy setup) / PostgreSQL / MySQL.

---

## 📦 Cara Instalasi

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (v16+) dan **npm**.

### 2. Setup Backend
```bash
cd server
npm install
# Setup environment (Opsional, sudah ada default)
# cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```
Server akan berjalan di `http://localhost:5001`.

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

---

## 🧪 Cara Testing Flow

### 1. Customer Scan QR
- Buka browser dan arahkan ke `http://localhost:5173/table/TBL-001`.
- Pilih menu, tambahkan ke keranjang.
- Lakukan checkout.

### 2. Online Payment
- Pilih "Online Payment" saat checkout.
- Muncul modal Dummy Payment Gateway.
- Klik "Confirm Payment (Success)".
- Status pesanan akan otomatis berubah menjadi **PAID**.
- Pesanan masuk ke dashboard Kasir dan Dapur secara realtime.

### 3. Cash Payment
- Pilih "Pay at Cashier" saat checkout.
- Customer akan melihat nomor order dan instruksi bayar ke kasir.
- Buka dashboard Kasir (`/login` -> `cashier@dinescan.com`).
- Klik "Confirm Cash Payment" untuk memproses pesanan.

---

## 🔑 Akun Demo

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@dinescan.com | password123 |
| **Cashier** | cashier@dinescan.com | password123 |
| **Kitchen** | kitchen@dinescan.com | password123 |

---

## 📸 Screen Preview
- **Customer Menu:** Mobile-first design dengan kategori dan search.
- **Cashier Board:** Antarmuka bersih untuk mengelola antrean pembayaran.
- **Kitchen Board:** Dark mode KDS untuk fokus pada persiapan makanan.
- **Admin Stats:** Grafik dan ringkasan pendapatan harian.

---
Dibuat dengan ❤️ oleh Antigravity.
