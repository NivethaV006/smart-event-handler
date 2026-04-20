# 🌍 Hosting Guide for EventSync Platform

To host this multi-module system in the cloud, follow these steps. We will use **Render** for the backend/AI and **Vercel** for the dashboard.

---

## 1. Database (MongoDB Atlas)
Since your backend uses MongoDB (optional but recommended), create a free cluster:
1.  Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Database and a User.
3.  Get your **Connection String** (looks like `mongodb+srv://...`).

---

## 2. Backend Deployment (Render)
1.  Push your code to a GitHub repository.
2.  Log in to [Render](https://render.com/).
3.  Create a **New Web Service** and connect your repo.
4.  **Root Directory**: `backend`
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm run start`
7.  **Environment Variables**:
    *   `PORT`: `10000`
    *   `MONGO_URI`: (Your MongoDB Atlas string)
8.  **Note**: Once deployed, Render will give you a URL (e.g., `https://eventsync-backend.onrender.com`).

---

## 3. AI Module Deployment (Render)
1.  Create another **New Web Service** on Render.
2.  **Root Directory**: `ai-module`
3.  **Build Command**: `pip install -r requirements.txt`
4.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5.  **Note**: Take note of this URL (e.g., `https://eventsync-ai.onrender.com`).

---

## 4. Connect Backend to AI
In your **Backend** environment variables on Render, add:
*   `AI_MODULE_URL`: (The URL from step 3)

*Note: You may need to update `backend/server.js` to use `process.env.AI_MODULE_URL` instead of the hardcoded `127.0.0.1:8000`.*

---

## 5. Admin Dashboard Deployment (Vercel)
1.  Log in to [Vercel](https://vercel.com/).
2.  Connect your GitHub repo.
3.  **Root Directory**: `admin-dashboard`
4.  **Framework Preset**: `Vite`
5.  **Build Command**: `npm run build`
6.  **Output Directory**: `dist`
7.  **Environment Variables**:
    *   `VITE_API_URL`: (Your Backend URL from step 2)

---

## 6. Mobile App Update
Before building your mobile app for production:
1.  Open `mobile-app/App.js`.
2.  Update `API_URL` to your hosted Backend URL:
    ```javascript
    const API_URL = 'https://eventsync-backend.onrender.com';
    ```
3.  Use **EAS Build** to create an APK/IPA or share via Expo Go.
    ```bash
    npm install -g eas-cli
    eas build -p android --profile preview
    ```

---

## 🛠 Pro Tip: Docker
If you want to host on AWS or DigitalOcean, create a `Dockerfile` in each folder. This ensures the environment is identical to your local setup.

---
**Good luck with your hosting!**
