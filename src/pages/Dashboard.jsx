
import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import MapView from '../components/MapView';
import RiskChart from '../components/RiskChart';

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('floodsense_coords');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lon === 'number' && !Number.isNaN(parsed.lat) && !Number.isNaN(parsed.lon)) {
          return parsed;
        }
      }
    } catch {}
    return { lat: 6.5244, lon: 3.3792 }; // default Lagos
  });
  const [latInput, setLatInput] = useState(() => coords.lat);
  const [lonInput, setLonInput] = useState(() => coords.lon);
  const [geoStatus, setGeoStatus] = useState('');
  const [risk, setRisk] = useState(null);
  const [forecast, setForecast] = useState(null);

  const fetchWeather = (c) => {
    setLoading(true);
    setError(null);
    api.get('/api/weather', { params: { lat: c.lat, lon: c.lon } })
      .then(res => {
        setWeather(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch weather data');
        setLoading(false);
      });
  };

  const fetchRisk = (c) => {
    setLoading(true);
    setError(null);
    api.get('/api/risk', { params: { lat: c.lat, lon: c.lon } })
      .then(res => {
        setRisk(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch flood risk');
        setLoading(false);
      });
  };

  const fetchForecast = (c) => {
    api.get('/api/forecast', { params: { lat: c.lat, lon: c.lon } })
      .then(res => setForecast(res.data))
      .catch(() => {});
  };

  const isValidCoords = (c) => typeof c.lat === 'number' && typeof c.lon === 'number' && !Number.isNaN(c.lat) && !Number.isNaN(c.lon);

  // Persist coords whenever they change (only if valid)
  useEffect(() => {
    try {
      if (isValidCoords(coords)) {
        localStorage.setItem('floodsense_coords', JSON.stringify(coords));
      }
    } catch {}
  }, [coords]);

  useEffect(() => {
    // Initial fetch using restored coords only; no browser geolocation
    fetchWeather(coords);
    fetchRisk(coords);
    fetchForecast(coords);
    setGeoStatus('Manual location mode');
    // No cleanup needed
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-950 text-gray-100 py-8 px-2 md:px-8 rounded-xl shadow-lg relative">
      {/* Logo */}
      <img src="/images/logo.png" alt="FloodSense Logo" className="mx-auto mb-4 w-16 h-16 rounded-full shadow border-2 border-blue-500 bg-white object-contain" />

      {/* Flood Risk & Prediction */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">FloodSense Dashboard</h1>
        <p className="text-lg text-gray-300 mb-4">Monitor your flood risk, predictions, and community safety in real time.</p>
        <div className="text-sm text-gray-400 mb-2">{geoStatus}</div>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <div className="flex items-center gap-2 bg-gray-900 rounded px-3 py-2">
            <span className="text-gray-400 text-sm">Lat:</span>
            <input
              type="number"
              step="0.000001"
              className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-28"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
            <span className="text-gray-400 text-sm">Lon:</span>
            <input
              type="number"
              step="0.000001"
              className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-28"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
              onClick={() => {
                const candidate = { lat: Number(latInput), lon: Number(lonInput) };
                if (isValidCoords(candidate)) {
                  setCoords(candidate);
                  fetchWeather(candidate);
                  fetchRisk(candidate);
                  fetchForecast(candidate);
                  setGeoStatus('Coordinates updated');
                } else {
                  setGeoStatus('Please enter valid latitude and longitude');
                }
              }}
            >Update</button>
          </div>
        </div>
        {loading && (
          <div className="text-blue-300 text-lg">Loading data...</div>
        )}
        {error && (
          <div className="text-red-400 text-lg">{error}</div>
        )}

        {risk && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Flood Risk</h2>
              <div className="text-5xl font-bold mb-2">
                <span className={
                  risk.category === 'Low' ? 'text-green-400' :
                  risk.category === 'Medium' ? 'text-yellow-400' :
                  risk.category === 'High' ? 'text-orange-400' : 'text-red-500'
                }>{risk.riskScore}</span>
              </div>
              <div className="text-sm text-gray-300">Category: {risk.category}</div>
              <div className="text-xs text-gray-500">Updated: {new Date(risk.timestamp).toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Factors</h2>
              <div className="text-gray-300">Rain: {risk.factors.rain_mm} mm</div>
              <div className="text-gray-300">Humidity: {risk.factors.humidity}%</div>
              <div className="text-gray-300">Wind: {risk.factors.wind} m/s</div>
              <div className="text-gray-300">Recent Avg: {risk.factors.recentAccumulation} mm</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Safety Tips</h2>
              <ul className="list-disc list-inside text-gray-200">
                {risk.tips.map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
            </div>
          </div>
        )}
        {weather && weather.main && weather.weather && weather.weather[0] ? (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-4">
            <div className="bg-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Current Weather</h2>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {weather.main.temp}°C
              </div>
              <div className="text-gray-400">
                {weather.weather[0].description}
              </div>
              <div className="text-gray-400">
                Humidity: {weather.main.humidity}%
              </div>
              <div className="text-gray-400">
                Wind: {weather.wind ? `${weather.wind.speed} m/s` : 'N/A'}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Location</h2>
              <div className="text-2xl font-bold text-green-400 mb-2">{weather.name}</div>
              <div className="text-gray-400">Country: {weather.sys && weather.sys.country ? weather.sys.country : 'N/A'}</div>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 shadow w-full md:w-1/3">
              <h2 className="text-xl font-semibold text-blue-300 mb-2">Clouds</h2>
              <div className="text-2xl font-bold text-red-400 mb-2">{weather.clouds && typeof weather.clouds.all !== 'undefined' ? `${weather.clouds.all}%` : 'N/A'}</div>
              <div className="text-gray-400">Visibility: {typeof weather.visibility !== 'undefined' ? `${weather.visibility}m` : 'N/A'}</div>
            </div>
          </div>
        ) : weather && !loading && !error ? (
          <div className="text-red-400 text-lg">Weather data is unavailable for this location.</div>
        ) : null}
      </div>

      {/* Map & Chart Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center justify-center min-h-[250px]">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Community Map</h2>
          <MapView center={coords} />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center justify-center min-h-[250px]">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Water Level History</h2>
          <RiskChart series={forecast?.series || []} />
        </div>
      </div>

      {/* Emergency Contact & Safety Tips */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start mb-8">
        <div className="bg-gray-900 rounded-xl p-6 shadow w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Emergency Contact</h2>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow mb-2">Call for Help</button>
          <div className="text-gray-400 text-sm">Notify neighbors, local response teams, or emergency services.</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-yellow-300 mb-2">Quick Safety Tips</h2>
          <ul className="list-disc list-inside text-gray-200 text-left mb-2">
            <li>Keep documents in waterproof bags</li>
            <li>Turn off electrical appliances during heavy rain</li>
            <li>Know your nearest safe location</li>
            <li>Avoid walking/driving through flood water</li>
            <li>Store emergency numbers</li>
          </ul>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg shadow">See Full Guide</button>
        </div>
      </div>

      {/* Footer Logo */}
      <div className="text-center mt-8">
        <img src="/images/logo.png" alt="FloodSense Logo" className="mx-auto mb-2 w-12 h-12 rounded-full shadow border-2 border-blue-500 bg-white object-contain" />
        <div className="text-xs text-gray-500">FloodSense &copy; {new Date().getFullYear()}</div>
      </div>
    </div>
  )
}
