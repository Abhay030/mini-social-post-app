# Mini Social Post Application (TaskPlanet Inspired)

A fully responsive, production-ready MERN stack social media web application. This project was built to simulate a core "Social Feed" feature where users can authenticate, publish posts (text and image), interact with content via likes and comments, and see updates instantly.

## 🌟 Features

- **Authentication System**: Secure JSON Web Token (JWT) based login and registration with hashed passwords (bcrypt).
- **Global Public Feed**: A chronologically sorted community feed visible to all authenticated users.
- **Rich Media Posting**: Upload text, images, or both simultaneously using an intuitive floating create-post widget. Image data is optimally encoded as Base64 strings.
- **Dynamic Interactions**: 
  - Like or Unlike any post instantly (optimistically toggled in the UI).
  - Add nested comments to any post with an expandable accordion thread to read previous replies.
- **Modern UI/UX**: Premium aesthetic featuring glassmorphism, responsive Material-UI elements, dynamic rendering, and robust state management.

---

## 💻 Tech Stack

- **Frontend**: React.js (Vite), Material-UI (MUI), Axios for centralized API networking.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODMs).
- **Architecture**: Separated MVC pattern (Routes ↔ Controllers ↔ Models).

---

## 📂 Project Structure

```text
├── backend/                  # Express API Server
│   ├── config/               # Database initialization config (db.js)
│   ├── controllers/          # Core business logic separated from endpoints
│   ├── middleware/           # JWT parsing & route authentication guards
│   ├── models/               # MongoDB user/post Schemas
│   ├── routes/               # Express endpoints mapped to controllers
│   └── server.js             # API entry point & CORS configuration
│
├── frontend/                 # React Client (Vite)
│   ├── src/
│   │   ├── api/              # Centralized Axios instance with HTTP Interceptors
│   │   ├── components/       # Reusable chunks (CreatePost, PostItem)
│   │   ├── pages/            # Top level views (AuthPage, FeedPage)
│   │   └── index.css         # Global CSS injecting glassmorphism & typography
```

---

## ⚙️ Installation & Setup Locally

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Cluster or Local Instance.

### 1. Clone the repository
```bash
git clone https://github.com/Abhay030/mini-social-post-app.git
cd mini-social-post-app
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend/` directory:
```env
MONGO_URI="mongodb+srv://<your-cluster-url>/minisocial"
JWT_SECRET="your_random_secure_secret_string"
PORT=5000
```
Start the backend server:
```bash
node server.js
```

### 3. Configure Frontend
Open a new terminal session.
```bash
cd frontend
npm install
```
Create a `.env` file inside the `frontend/` directory (pointing to your running local backend):
```env
VITE_API_URL=http://localhost:5000
```
Start the Vite developer server:
```bash
npm run dev
```

Visit `http://localhost:5173` to interact with the web app!

---

## 📡 API Endpoints Summary

### Auth
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate standard user and return JWT.

### Posts
- `GET /api/posts` - Fetch all public posts.
- `POST /api/posts` - Create a new post. (Requires `Bearer Token`)
- `POST /api/posts/:id/like` - Toggle like by authenticated user. (Requires `Bearer Token`)
- `POST /api/posts/:id/comment` - Add comment. (Requires `Bearer Token`)
