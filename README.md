# 🏨 Hotel Management System

A web-based Hotel Management System built with HTML, CSS, and JavaScript. It provides a complete dashboard to manage rooms, bookings, guests, and staff.

## 📸 Features

- **Dashboard** – Overview of total rooms, occupancy rate, today's check-ins, and revenue
- **Room Management** – View and manage room availability and status
- **Booking Management** – Create, filter, check-in, check-out, and cancel bookings
- **Guest Management** – Track guest information and history
- **Staff Management** – Manage hotel staff records
- **Authentication** – Login and registration with session handling via `localStorage`
- **Responsive Design** – Works on desktop and mobile screens

## 🗂️ Project Structure

```
Hotel Managent System/
├── index.html          # Dashboard (home page)
├── login.html          # Login page
├── register.html       # Registration page
├── pages/
│   ├── rooms.html      # Room management
│   ├── bookings.html   # Booking management
│   ├── guests.html     # Guest management
│   └── staff.html      # Staff management
├── css/
│   ├── style.css       # Global styles
│   ├── dashboard.css   # Dashboard styles
│   └── responsive.css  # Responsive/media queries
└── js/
    ├── main.js         # Shared utilities
    ├── dashboard.js    # Dashboard logic
    ├── room.js         # Room management logic
    ├── bookings.js     # Booking management logic
    ├── guests.js       # Guest management logic
    └── staff.js        # Staff management logic
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sumit12948/Hotel-Management-System.git
   ```

2. Open `Hotel Managent System/login.html` in your browser.

3. Register a new account or log in to access the dashboard.

## 🛠️ Tech Stack

- **HTML5** – Structure
- **CSS3** – Styling and responsive layout
- **Vanilla JavaScript** – Logic and interactivity
- **localStorage** – Session and data persistence

## 📋 Room Types & Rates

| Room Type | Rate per Night |
|-----------|---------------|
| Single    | $70           |
| Double    | $90           |
| Suite     | $140          |

## 📌 Notes

- All data is stored in `localStorage` (no backend/database required).
- The system is intended for demonstration/learning purposes.
