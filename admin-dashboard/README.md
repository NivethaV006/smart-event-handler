# EventSync Admin Operations Center
### Management Dashboard for Smart Venue Operations

A high-performance web dashboard for venue managers to monitor real-time crowd dynamics, manage IoT infrastructure, and communicate with attendees.

## 🖥 Key Features
- **Thermal & Vision Heatmap**: Real-time crowd density visualization with sensor-level granularity.
- **Vision Wait-Time Estimator**: Monitor wait times calculated via computer vision analysis.
- **Live Sensor Feed**: Terminal-style log of raw incoming data for transparency.
- **Broadcast Operations**: Send instant alerts and resource updates to all mobile app users.
- **Manual Overrides**: Adjust safety thresholds and zone capacities on the fly.

## 🚀 Installation & Setup
1. **Navigate to this directory**:
   ```bash
   cd admin-dashboard
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Access the dashboard**:
   Open the localhost URL (usually `http://localhost:5173`) in your browser.

## 🛠 Tech Stack
- **Framework**: React + Vite
- **Real-time Data**: Socket.io-client
- **API Communication**: Axios
- **Styling**: Glassmorphism (Custom CSS)

---
**Developed for Virtual PromptWars**
