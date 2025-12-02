import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

export default function MapView({ center = { lat: 6.5244, lon: 3.3792 } }) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayIndex, setDayIndex] = useState(0); // 0 = Now, 1..4 = next days

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
    const loadNow = () => Promise.all(offsets.map(o => {
      const lat = center.lat + o.dlat;
      const lon = center.lon + o.dlon;
      return api.get('/api/risk', { params: { lat, lon } })
        .then(res => ({ lat, lon, category: res.data.category, score: res.data.riskScore, rain_mm: null }))
        .catch(() => ({ lat, lon, category: 'Unknown', score: null, rain_mm: null }));
    }));

    const dateForIndex = (idx) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + idx);
      return d;
    };
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const categoryFromRain = (mm) => {
      if (mm == null) return 'Unknown';
      if (mm < 2) return 'Low';
      if (mm < 10) return 'Medium';
      if (mm < 30) return 'High';
      return 'Severe';
    };
    const scoreFromRain = (mm) => Math.max(0, Math.min(100, Math.round(mm * 3)));

    const loadForecastDay = (idx) => Promise.all(offsets.map(o => {
      const lat = center.lat + o.dlat;
      const lon = center.lon + o.dlon;
      return api.get('/api/forecast', { params: { lat, lon } })
        .then(res => {
          const series = Array.isArray(res.data?.series) ? res.data.series : [];
          const targetDay = dateForIndex(idx);
          const totalRain = series.reduce((sum, p) => {
            const dt = p?.ts ? new Date(p.ts * 1000) : null;
            if (dt && sameDay(dt, targetDay)) {
              const r = typeof p.rain_mm === 'number' ? p.rain_mm : 0;
              return sum + r;
            }
            return sum;
          }, 0);
          const cat = categoryFromRain(totalRain);
          const sc = scoreFromRain(totalRain);
          return { lat, lon, category: cat, score: sc, rain_mm: Math.round(totalRain * 10) / 10 };
        })
        .catch(() => ({ lat, lon, category: 'Unknown', score: null, rain_mm: null }));
    }));

    const loader = dayIndex === 0 ? loadNow() : loadForecastDay(dayIndex);
    loader.then(results => {
      setPoints(results);
      setLoading(false);
    });
  }, [center.lat, center.lon, dayIndex]);

  const colorFor = (cat) => {
    if (cat === 'Low') return 'bg-green-500';
    if (cat === 'Medium') return 'bg-yellow-500';
    if (cat === 'High') return 'bg-orange-500';
    if (cat === 'Severe') return 'bg-red-600';
    return 'bg-gray-500';
  };

  const dayLabels = useMemo(() => {
    const labels = ['Now'];
    for (let i = 1; i <= 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    return labels;
  }, []);

  const toRad = (deg) => (deg * Math.PI) / 180;
  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const bearingDeg = (lat1, lon1, lat2, lon2) => {
    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  };
  const bearingToCardinal = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return dirs[Math.round(deg / 45)];
  };

  return (
    <div className="w-full">
      {/* Selected day label */}
      <div className="text-center text-sm text-gray-300 mb-2">Showing: {dayLabels[dayIndex]}</div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-200 mb-3">
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500"></span> Low</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-yellow-500"></span> Medium</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-orange-500"></span> High</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-600"></span> Severe</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-gray-500"></span> Unknown</div>
      </div>
      {/* Day selector */}
      <div className="flex flex-wrap gap-2 mb-3 justify-center">
        {dayLabels.map((label, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded border text-sm ${idx === dayIndex ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'}`}
            onClick={() => setDayIndex(idx)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="w-full h-56 md:h-64 bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-300">Loading nearby risk...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {points.map((p, i) => {
            const dist = distanceKm(center.lat, center.lon, p.lat, p.lon);
            const dir = bearingToCardinal(bearingDeg(center.lat, center.lon, p.lat, p.lon));
            return (
              <div key={i} className={`rounded-lg p-3 text-center text-gray-900 ${colorFor(p.category)}`}>
                <div className="font-semibold">{p.category}</div>
                <div className="text-xs">Score: {p.score ?? 'N/A'}</div>
                {dayIndex > 0 && (
                  <div className="text-[11px]">Rain: {p.rain_mm ?? 'N/A'} mm</div>
                )}
                <div className="text-[10px] mt-1">~{dist.toFixed(1)} km {dir}</div>
                <div className="text-[10px] opacity-80">{p.lat.toFixed(4)}, {p.lon.toFixed(4)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
