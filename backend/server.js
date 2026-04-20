require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-Memory Database for simplicity if MongoDB is not provided
let useMongo = process.env.MONGO_URI ? true : false;
if (useMongo) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));
}

let crowdData = [
  { id: 'zoneA', name: 'Main Gate', density: 20, maxCapacity: 100 },
  { id: 'zoneB', name: 'Food Court', density: 85, maxCapacity: 100 },
  { id: 'zoneC', name: 'Washrooms', density: 40, maxCapacity: 50 },
  { id: 'zoneD', name: 'Stage 1', density: 95, maxCapacity: 200 }
];

let queues = [
  { id: 'q1', name: 'Food Stall 1', waitTimeMins: 15 },
  { id: 'q2', name: 'Food Stall 2', waitTimeMins: 5 },
  { id: 'q3', name: 'Washroom A', waitTimeMins: 2 }
];

let alerts = [
  { id: '1', message: 'Welcome to the Event!', type: 'info', time: new Date() }
];

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('crowd-update', crowdData);
  socket.emit('queue-update', queues);
  socket.emit('alerts', alerts);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST APIs
app.get('/crowd-data', (req, res) => res.json(crowdData));

app.post('/crowd-data', (req, res) => {
  const { id, density } = req.body;
  const zone = crowdData.find(z => z.id === id);
  if (zone) {
    zone.density = density;
    io.emit('crowd-update', crowdData); // broadcast
    res.json({ success: true, zone });
  } else {
    res.status(404).json({ error: 'Zone not found' });
  }
});

app.get('/queue-status', (req, res) => res.json(queues));

app.post('/queue-status', (req, res) => {
  const { id, waitTimeMins } = req.body;
  const q = queues.find(x => x.id === id);
  if (q) {
    q.waitTimeMins = waitTimeMins;
    io.emit('queue-update', queues);
    res.json({ success: true, q });
  } else {
    res.status(404).json({ error: 'Queue not found' });
  }
});

app.get('/alerts', (req, res) => res.json(alerts));

app.post('/alerts', (req, res) => {
  const newAlert = { id: Date.now().toString(), message: req.body.message, type: req.body.type || 'info', time: new Date() };
  alerts.unshift(newAlert);
  io.emit('alerts', alerts);
  res.json({ success: true, alert: newAlert });
});

app.get('/route-suggestion', async (req, res) => {
  const { start, end } = req.query;
  // Use AI module if running
  try {
    const axios = require('axios');
    const aiRes = await axios.post('http://127.0.0.1:8000/predict-route', { start, end });
    return res.json(aiRes.data);
  } catch (err) {
    // Fallback simple logic
    return res.json({ route: [start, 'Midpoint', end], estimatedTimeMins: 10, note: "AI module unreachable, using fallback" });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
