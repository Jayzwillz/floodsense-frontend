import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function MapView({ center = { lat: 6.5244, lon: 3.3792 } }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate nearby offsets (~1-3km assuming ~0.01 deg ~ 1.1km near equator)
    const offsets = [
      { dlat: 0.0, dlon: 0.0 },
      { dlat: 0.01, dlon: 0.0 },
      { dlat: -0.01, dlon: 0.0 },
      { dlat: 0.0, dlon: 0.01 },
      { dlat: 0.0, dlon: -0.01 },
      { dlat: 0.01, dlon: 0.01 },
      { dlat: -0.01, dlon: -0.01 },
      { dlat: 0.015, dlon: -0.005 },
      { dlat: -0.015, dlon: 0.005 },
    ];
    setLoading(true);
    Promise.all(offsets.map(o => {
      const lat = center.lat + o.dlat;
      const lon = center.lon + o.dlon;
      return api.get('/api/risk', { params: { lat, lon } })
        .then(res => ({ lat, lon, category: res.data.category, score: res.data.riskScore }))
        .catch(() => ({ lat, lon, category: 'Unknown', score: null }));
    })).then(results => {
      setPoints(results);
      setLoading(false);
    });
  }, [center.lat, center.lon]);

  const colorFor = (cat) => {
    if (cat === 'Low') return 'bg-green-500';
    if (cat === 'Medium') return 'bg-yellow-500';
    if (cat === 'High') return 'bg-orange-500';
    if (cat === 'Severe') return 'bg-red-600';
    return 'bg-gray-500';
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="w-full h-64 bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-300">Loading nearby risk...</div>
      ) : (
        <div className="grid grid-cols-3 gap-3 w-full">
          {points.map((p, i) => (
            <div key={i} className={`rounded-lg p-3 text-center text-gray-900 ${colorFor(p.category)}`}>
              <div className="font-semibold">{p.category}</div>
              <div className="text-xs">Score: {p.score ?? 'N/A'}</div>
              <div className="text-[10px] mt-1">{p.lat.toFixed(4)}, {p.lon.toFixed(4)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
