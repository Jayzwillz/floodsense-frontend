import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Alerts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = () => {
    setLoading(true);
    setError(null);
    api.get('/api/alerts')
      .then(res => {
        setItems(res.data.alerts || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load alerts');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const simulateAlert = () => {
    api.post('/api/alerts', { message: 'Simulated alert from UI', category: 'High' })
      .then(() => loadAlerts())
      .catch(() => setError('Failed to create alert'));
  };

  return (
    <div className="min-h-[60vh] bg-gray-950 text-gray-100 py-8 px-4 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">Flood Alerts</h1>
      <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
        <p className="text-lg text-gray-300 mb-2">Recent Alerts & Notifications</p>
        {loading && <div className="text-blue-300">Loading...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && (
          <ul className="space-y-3">
            {items.length === 0 && (
              <li className="bg-blue-900/20 rounded p-3 text-gray-400">No alerts yet</li>
            )}
            {items.map(a => (
              <li key={a.id} className="bg-blue-900/40 rounded p-3">
                <div className="font-semibold">[{a.category}] {a.message}</div>
                <div className="text-xs text-gray-300">{new Date(a.at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-center">
        <button onClick={simulateAlert} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow">Simulate Alert</button>
      </div>
    </div>
  );
}
