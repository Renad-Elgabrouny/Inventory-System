# 📦 Inventory Management System

A front-end inventory management web application built with Vanilla JavaScript, jQuery, and Bootstrap 5. It communicates with a local REST API powered by **JSON Server**.

---

## 🚀 Features

- 🔐 Authentication with role-based access (Admin / User)
- 📊 Dashboard with live stock stats and recent activity feed
- 🛒 Product management with stock adjustment and low-stock alerts
- 🏭 Supplier management with full CRUD
- 📋 Purchase order lifecycle (create → receive)
- 📈 Inventory reports (low stock & inventory value)
- 👥 User management (admin only)
- 📝 Activity log for all system actions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | HTML5, Bootstrap 5, Font Awesome |
| Logic | Vanilla JavaScript (ES Modules) |
| DOM helpers | jQuery 3.7.1 |
| Backend (mock) | JSON Server |
| Data | `db/products.json` |

---

## 📁 Project Structure

```
Inventory-System/
├── index.html              # Main dashboard
├── login.html              # Login page
├── register.html           # Registration page
├── pages/                  # Feature page fragments
├── js/
│   ├── main.js             # App entry point
│   ├── components/         # Modal & navbar
│   └── pages/              # Page controllers
├── services/               # API communication layer
├── models/                 # Data models with validation
├── utils/
│   └── Error handlers/     # Custom error classes
├── assets/                 # CSS & images
└── db/
    └── products.json       # JSON Server database
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v14+
- A local static file server (e.g. VS Code [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))

### 1. Install JSON Server

```bash
npm install -g json-server
```

### 2. Start the API

```bash
json-server --watch db/products.json --port 3000
```

API runs at `http://localhost:3000`

### 3. Serve the Front-End

Open `login.html` with Live Server, or run:

```bash
npx serve .
```

Then visit `http://localhost:5500/login.html` in your browser.

> **Note:** The app must be served over HTTP — opening `file://` directly will block ES Modules.

---

## 🔗 API Endpoints

| Resource | Base URL |
|----------|----------|
| Users | `/users` |
| Products | `/product` |
| Suppliers | `/suppliers` |
| Orders | `/orders` |
| Categories | `/categories` |
| Stock Adjustments | `/adjustment` |
| Activity Logs | `/activityLogs` |

---

## 👤 Roles

| Role | Access |
|------|--------|
| `admin` | Full access including User Management |
| `user` | All features except User Management |

---

## 📄 License

This project was built as part of the **ITI (Information Technology Institute)** training program.
