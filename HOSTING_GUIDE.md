# 🌍 Hosting Guide for EventSync Mobile System

To host the mobile app and its supporting services in the cloud, follow these steps. We will use **Render** for the backend/AI.

---

## 1. Database (MongoDB Atlas)
Your backend uses MongoDB for data persistence:
1.  Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster and get your **Connection String**.

---

## 2. Backend Deployment (Render)
1.  Push your code to GitHub.
2.  Log in to [Render](https://render.com/).
3.  Create a **New Web Service**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm run start`
    *   **Env Vars**: `PORT=10000`, `MONGO_URI=your_mongodb_string`
4.  Copy your Render URL (e.g., `https://backend.onrender.com`).

---

## 3. AI Module Deployment (Render)
1.  Create another **New Web Service**:
    *   **Root Directory**: `ai-module`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
2.  Copy this URL (e.g., `https://ai.onrender.com`).

---

## 4. Final Connection
1.  **Backend Config**: On Render, add `AI_MODULE_URL` to your Backend's environment variables using the URL from Step 3.
2.  **Mobile App Config**: Open `mobile-app/App.js` and set:
    ```javascript
    const API_URL = 'https://your-backend.onrender.com';
    ```
3.  **Build Mobile App**:
    ```bash
    npx expo build:android # or use EAS build
    ```

---

## 🛠 Pro Tip: Docker
If you want to host on AWS or DigitalOcean, create a `Dockerfile` in each folder. This ensures the environment is identical to your local setup.

---
**Good luck with your hosting!**
