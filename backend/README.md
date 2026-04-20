# EventSync Real-time Backend
### Central Intelligence Hub for Smart Venue Operations

The EventSync backend is a high-frequency data aggregation server that processes IoT sensor streams and computer vision metadata to power the venue experience.

## ⚙ Key Features
- **Real-time Synchronization**: Socket.io engine for low-latency crowd and queue updates.
- **Microservices Orchestration**: Connects the Python AI module with the React clients.
- **In-Memory Logic**: Fallback pathfinding and routing logic for maximum uptime.
- **IoT Simulation**: Built-in script to simulate live venue dynamics for development and demos.

## 🚀 Installation & Setup
1. **Navigate to this directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the core server**:
   ```bash
   npm run start
   ```
4. **Start the simulator (for demos)**:
   In a separate terminal, run:
   ```bash
   npm run simulate
   ```

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Real-time**: Socket.IO
- **HTTP Client**: Axios

---
**Developed for Virtual PromptWars**
