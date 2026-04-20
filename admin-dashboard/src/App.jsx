import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

function App() {
  const [crowdData, setCrowdData] = useState([]);
  const [queues, setQueues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const [updateZone, setUpdateZone] = useState('');
  const [updateDensity, setUpdateDensity] = useState('');
  const [sensorLogs, setSensorLogs] = useState([]);

  useEffect(() => {
    socket.on('alerts', (data) => setAlerts(data));

    socket.on('crowd-update', (data) => {
      setCrowdData(data);
      setSensorLogs(prev => [`[${new Date().toLocaleTimeString()}] Zone Update received`, ...prev].slice(0, 10));
    });

    socket.on('queue-update', (data) => {
      setQueues(data);
      setSensorLogs(prev => [`[${new Date().toLocaleTimeString()}] Queue Sensor triggered`, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('crowd-update');
      socket.off('queue-update');
      socket.off('alerts');
    };
  }, []);

  const sendAlert = async (e) => {
    e.preventDefault();
    if (!alertMsg) return;
    await axios.post(`${API_URL}/alerts`, { message: alertMsg, type: 'warning' });
    setAlertMsg('');
  };

  const manualDensityUpdate = async (e) => {
    e.preventDefault();
    if (!updateZone || !updateDensity) return;
    await axios.post(`${API_URL}/crowd-data`, { id: updateZone, density: parseInt(updateDensity) });
    setUpdateDensity('');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Event Operations Center</h1>
          <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 500 }}>IoT & CCTV Data Aggregation Hub</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="status-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
            📡 24 IoT Nodes Active
          </div>
          <div className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            🎥 12 Cameras Online
          </div>
          <div className="status-badge">Live System</div>
        </div>
      </header>
      
      <main className="dashboard-grid">
        {/* Crowd Density / Heatmap */}
        <section className="card">
          <h2>Thermal & Vision Crowd Density</h2>
          <div className="zone-grid">
            {crowdData.map(zone => (
              <div key={zone.id} className="zone-card" style={{
                background: `linear-gradient(135deg, rgba(255, 100, 100, ${zone.density / 100}), rgba(255, 50, 50, ${zone.density / 100}))`
              }}>
                <h3>{zone.name}</h3>
                <p>{zone.density}% Spatial Capacity</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${zone.density}%` }}></div>
                </div>
                <p style={{fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7}}>Data source: Sensor {zone.id.toUpperCase()}</p>
              </div>
            ))}
          </div>

          <form onSubmit={manualDensityUpdate} className="control-form">
            <h3>Manual Override</h3>
            <select value={updateZone} onChange={e => setUpdateZone(e.target.value)}>
              <option value="">Select Zone</option>
              {crowdData.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
            <input type="number" placeholder="Density (0-100)" value={updateDensity} onChange={e => setUpdateDensity(e.target.value)} />
            <button type="submit" className="btn btn-primary">Update Zone</button>
          </form>
        </section>

        {/* Queues & Alerts */}
        <div className="side-panel">
          <section className="card">
            <h2>Vision Wait-Time Estimator</h2>
            <ul className="queue-list">
              {queues.map(q => (
                <li key={q.id}>
                  <span>{q.name}</span>
                  <span className={`badge ${q.waitTimeMins > 10 ? 'high' : 'low'}`}>{q.waitTimeMins} mins</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Live Sensor Feed</h2>
            <div className="recent-alerts" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              {sensorLogs.map((log, i) => (
                <div key={i} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#10B981', marginBottom: '0.25rem' }}>
                  {log}
                </div>
              ))}
              {sensorLogs.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Waiting for sensor data...</p>}
            </div>
          </section>

          <section className="card">
            <h2>Send Broadcast Alert</h2>
            <form onSubmit={sendAlert} className="alert-form">
              <textarea placeholder="Type message for all attendees..." value={alertMsg} onChange={e => setAlertMsg(e.target.value)} />
              <button type="submit" className="btn btn-danger">Push Alert</button>
            </form>
            <div className="recent-alerts">
              {alerts.slice(0, 3).map(a => (
                <div key={a.id} className="alert-item">
                  <small>{new Date(a.time).toLocaleTimeString()}</small>
                  <p>{a.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
