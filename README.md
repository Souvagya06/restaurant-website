# 🍽️ Khai Khai – Restaurant Reservation System

A full-stack restaurant booking platform that allows users to sign up, log in, and reserve tables seamlessly. Built with a clean UI and integrated with a cloud database using Turso.

---

## 🚀 Features

* 🔐 User Authentication (Sign Up / Login)
* 📅 Table Reservation System
* 👥 Guest Count Selection
* 🗂️ Database Integration (Turso)
* 🔗 User–Reservation Relationship (Foreign Key)
* ⚡ Real-time Form Handling
* 🎯 Clean & Modern UI Design

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3 / Tailwind CSS
* JavaScript (Vanilla)

### Backend

* Node.js
* Express.js

### Database

* Turso (libSQL)

---

## 📁 Project Structure

```
restaurant-website/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── pages/
│
├── .gitignore
├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/restaurant-website.git
cd restaurant-website
```

---

### 2️⃣ Install dependencies

```
cd backend
npm install
```

---

### 3️⃣ Create `.env` file

Inside `/backend`, create a `.env` file:

```
TURSO_DATABASE_URL=your_database_url
TURSO_AUTH_TOKEN=your_auth_token
```

---

### 4️⃣ Run the server

```
node server.js
```

Server will run at:

```
http://localhost:5000
```

---

## 🔄 Workflow

1. User signs up → data stored in database
2. User logs in → authentication verified
3. User makes reservation → linked with user ID
4. Reservation saved in database

---

## 🧠 Database Schema

### Users Table

* id (Primary Key)
* name
* email (Unique)
* password

### Reservations Table

* id (Primary Key)
* user_id (Foreign Key)
* date
* time
* guests

---

## 🔐 Security Note

* `.env` file is ignored using `.gitignore`
* API keys and database credentials are not exposed

---

---

## 📌 Future Improvements

* 🔒 Password hashing (bcrypt)
* 📧 Email confirmation system
* 📊 Admin dashboard
* 📱 Mobile responsiveness improvements

---

## 👨‍💻 Author

**Souvagya Karmakar**

* GitHub: https://github.com/Souvagya06

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and feel free to contribute!

---
