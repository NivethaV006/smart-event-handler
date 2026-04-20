const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function simulate() {
  console.log('Starting real-time simulation...');
  setInterval(async () => {
    try {
      // Simulate random crowd changes
      const zones = ['zoneA', 'zoneB', 'zoneC', 'zoneD'];
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      const randomDensity = Math.floor(Math.random() * 100);
      await axios.post(`${API_URL}/crowd-data`, { id: randomZone, density: randomDensity });

      // Simulate random queue changes
      const queues = ['q1', 'q2', 'q3'];
      const randomQ = queues[Math.floor(Math.random() * queues.length)];
      const randomWait = Math.floor(Math.random() * 30);
      await axios.post(`${API_URL}/queue-status`, { id: randomQ, waitTimeMins: randomWait });

      console.log(`Updated ${randomZone} to ${randomDensity}% and ${randomQ} to ${randomWait}mins`);
    } catch (err) {
      console.log('Error in simulation:', err.message);
    }
  }, 5000); // update every 5 seconds
}

simulate();
