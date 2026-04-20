# EventSync Mobile App
### Attendee Interface for Smart Venue Operations

This is the mobile client for the EventSync platform, designed for attendees to navigate large-scale events with real-time intelligence.

## 📱 Key Features
- **Interactive Map**: Tap-to-select navigation using AI-optimized routing.
- **Thermal Vision**: View live crowd density via thermal sensor heatmaps.
- **Computer Vision Queues**: Real-time wait-time tracking for food stalls and facilities.
- **Sensor Infrastructure**: Transparency module showing IoT node health and data privacy.
- **AI Smart Suggestions**: Real-time population traffic analysis for facility recommendations.

## 🚀 Installation & Setup
1. **Navigate to this directory**:
   ```bash
   cd mobile-app
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure API Endpoints**:
   Open `App.js` and update the `API_URL` to your local machine's IP address:
   ```javascript
   const API_URL = 'http://192.168.1.X:5000';
   ```
4. **Start the application**:
   ```bash
   npx expo start
   ```

## 🛠 Tech Stack
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation (Stack)
- **Real-time Data**: Socket.io-client
- **Icons**: Ionicons (@expo/vector-icons)

---
**Developed for Virtual PromptWars**
