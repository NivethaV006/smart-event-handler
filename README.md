# EventSync - Smart Venue Operations Center
### 🚀 Entry for Virtual PromptWars

EventSync is a comprehensive, production-grade AI-driven platform designed to revolutionize the attendee experience at large-scale events. By fusing **IoT Sensor data** and **Computer Vision (CCTV)** analysis, EventSync provides real-time venue intelligence, predictive routing, and proactive crowd management.

---

## 🏗 Project Architecture

The application is built on a distributed microservices architecture:

- **Attendee Mobile App (`/mobile-app`)**: A high-performance React Native (Expo) application featuring interactive maps, thermal crowd vision, and real-time AI suggestions.
- **Admin Operations Center (`/admin-dashboard`)**: A glassmorphic web dashboard (React + Vite) for venue managers to monitor live sensor feeds and broadcast emergency alerts.
- **Real-time Backend (`/backend`)**: A Node.js + Socket.io server handling high-frequency data streams from 24+ IoT nodes and 12+ CCTV feeds.
- **AI Analytics Module (`/ai-module`)**: A Python (FastAPI) service that performs predictive pathfinding and queue wait-time estimation.

---

## ✨ Key Features

### 1. Attendee Mobile Experience
- **Interactive Indoor Map**: Tap-to-select navigation nodes with automatic AI pathfinding.
- **Thermal Crowd Vision**: Live thermal-map overlays showing high-density zones via venue heat sensors.
- **Computer Vision Queues**: Real-time wait-time tracking powered by CCTV people-counting analysis.
- **Sensor Hub**: Complete transparency showing the health and data-privacy status of all venue IoT nodes.
- **AI Smart Suggestions**: Proactive recommendations on which stalls to visit based on current population traffic.

### 2. Management Operations
- **Live Sensor Feed**: Terminal-style logging of raw incoming data events for venue transparency.
- **Crowd Heatmap**: Visual representation of spatial capacity across different zones.
- **Broadcast System**: Push instant alerts and resource availability updates to all attendees.
- **Manual Override**: Granular control over zone capacities and safety limits.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Vanilla CSS (Custom Glassmorphism)
- **Mobile**: React Native, Expo, Lucide/Ionicons
- **Backend**: Node.js, Express, Socket.IO, Axios
- **Database**: MongoDB (Optional) / In-Memory (Fallback)
- **AI/ML**: Python, FastAPI, Pydantic

---

## 🚀 Getting Started

### 1. Prerequisite
Ensure you have Node.js and Python 3.10+ installed.

### 2. Backend Setup
```bash
cd backend
npm install
npm run start
# In a second terminal
npm run simulate
```

### 3. Admin Dashboard Setup
```bash
cd admin-dashboard
npm install
npm run dev
```

### 4. Mobile App Setup
```bash
cd mobile-app
npm install
# Update API_URL in App.js to your machine's IP (e.g. 192.168.1.5)
npx expo start
```

### 5. AI Module Setup
```bash
cd ai-module
pip install -r requirements.txt
uvicorn main:app --port 8000
```

---

## 🔒 Data Privacy & Integrity
EventSync follows a **Privacy-by-Design** approach. All computer vision analysis and thermal imaging are processed at the "Edge" (local sensor nodes). Only anonymized density metadata is transmitted to the server, ensuring no PII (Personally Identifiable Information) is ever stored.

---
**Developed for Virtual PromptWars**  
*Optimizing human movement through AI and IoT.*
