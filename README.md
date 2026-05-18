# NestHub : Property listing Application 🏡

**NestHub** is a modern and intuitive property listing platform built with the MERN stack. Whether you're looking to rent, buy, or manage properties, NestHub simplifies the process with a seamless user experience. It supports secure authentication, role-based access, and real-time property listing operations—all in a clean, responsive UI.


---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](https://github.com/brijmohan17/Images/blob/main/nesthubhomepage.png)

---

### ➕ Particular Listing
![Listing](https://github.com/brijmohan17/Images/blob/main/nesthubonelisting.png)

---




## 🚀 Key Features

- 🔐 **JWT Authentication:** Email/password signup, login, and logout  
- 🔍 **Search:** Keyword search with suggestions, sorting, and pagination  
- ⏳ **Session Handling:** Auto-logout on token expiration to maintain security  
- 👤 **Role-Based Access:** Only property owners can modify or delete their listings  
- 🏘️ **Property Listings:** Add, view, update, and delete listings with ease  
- 🔒 **Protected Routes:** Frontend and backend route protection using token verification  
- 🧾 **User Feedback:** Toast notifications and clear error messages for all actions  
- 🖥️ **Responsive UI:** Tailwind CSS for a sleek, mobile-friendly interface  
- ⚙️ **RESTful Backend:** Fully integrated API using Express.js and MongoDB  

---

## 🖼️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router DOM  
- **Backend:** Spring Boot (Java 17), Spring Data MongoDB  
- **Database:** MongoDB  
- **Authentication:** JWT, LocalStorage  


---

## ✅ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/brijmohan17/NestHub.git
```

### 2. Backend Setup (Spring Boot)

```bash
cd propertyList
cp .env.example .env
# Edit .env: ATLASDB, JWT_SECRET, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET
./mvnw spring-boot:run
```

On Windows: `.\mvnw.cmd spring-boot:run`

> The legacy Express app in `Backend/` is deprecated; use `propertyList/` instead.

### 3. Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_SERVER_DOMAIN=http://localhost:4000` in `Frontend/.env`.

## 🚀 Deployment Links

- **Frontend**: [NestHub Frontend](https://nesthub-app.vercel.app/)
- **Backend**: [NestHub Backend API](https://nest-hub-backend.vercel.app/)

## 🔮 Future Enhancements

- 📷 Add image upload functionality via Cloudinary or Firebase  
- 🗺️ Advanced filters (price range, country) on search  
- ⭐ Implement user reviews and property ratings  
- 🔔 Add toast notifications for actions like success/failure  
- 📲 Introduce PWA support for mobile users and offline access 
