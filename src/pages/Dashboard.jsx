
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { const raw = localStorage.getItem('floodsense_favorites'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

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
        setRisk(prev => {
          const next = res.data;
          try {
            if (Notification && Notification.permission === 'granted' && prev?.category && next?.category) {
              const escalate = (from, to) => {
                const order = ['Low', 'Medium', 'High', 'Severe'];
                return order.indexOf(to) > order.indexOf(from);
              };
              if (escalate(prev.category, next.category)) {
                const body = `Risk increased from ${prev.category} to ${next.category}.`;
                if (navigator.serviceWorker?.ready) {
                  navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification('FloodSense Risk Update', { body, icon: '/images/logo.png', badge: '/images/logo.png' });
                  });
                } else {
                  new Notification('FloodSense Risk Update', { body });
                }
              }
            }
          } catch {}
          return next;
        });
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

  const searchLocation = async () => {
    const q = String(searchQuery || '').trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      setError(null);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      const results = (data || []).map(d => ({
        display: d.display_name,
        lat: parseFloat(d.lat),
        lon: parseFloat(d.lon)
      }));
      setSearchResults(results);
    } catch (e) {
      setError('Location search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const isValidCoords = (c) => typeof c.lat === 'number' && typeof c.lon === 'number' && !Number.isNaN(c.lat) && !Number.isNaN(c.lon);
  const persistFavorites = (arr) => { try { localStorage.setItem('floodsense_favorites', JSON.stringify(arr)); } catch {} };

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
        {/* Location Search */}
        <div className="flex justify-center mb-4 px-2">
          <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur rounded-lg border border-gray-800 px-4 py-4 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Search city, address, landmark (e.g., Lagos, NG)"
                className="flex-1 bg-gray-800 text-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                onClick={searchLocation}
              >{searchLoading ? 'Searching…' : 'Search'}</button>
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-3 bg-gray-800 rounded border border-gray-700 divide-y divide-gray-700">
                {searchResults.map((r, i) => (
                  <li key={i} className="p-2 hover:bg-gray-700 cursor-pointer text-left" onClick={() => {
                    const candidate = { lat: r.lat, lon: r.lon };
                    setLatInput(candidate.lat);
                    setLonInput(candidate.lon);
                    setCoords(candidate);
                    fetchWeather(candidate);
                    fetchRisk(candidate);
                    fetchForecast(candidate);
                    setGeoStatus(`Selected: ${r.display}`);
                    setSearchResults([]);
                  }}>
                    <div className="text-gray-200 text-sm">{r.display}</div>
                    <div className="text-[11px] text-gray-400">{r.lat.toFixed(4)}, {r.lon.toFixed(4)}</div>
                  </li>
                ))}
              </ul>
            )}
            {/* Favorites bar */}
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              {favorites.map((f, i) => (
                <button key={i} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs" onClick={() => {
                  const candidate = { lat: f.lat, lon: f.lon };
                  setLatInput(candidate.lat); setLonInput(candidate.lon);
                  setCoords(candidate); fetchWeather(candidate); fetchRisk(candidate); fetchForecast(candidate);
                  setGeoStatus(`Favorite: ${f.name}`);
                }}>{f.name}</button>
              ))}
              <button
                className="ml-auto px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={() => {
                  const name = prompt('Name this location (e.g., Home, Market):');
                  if (!name) return;
                  const fav = { name, lat: Number(latInput), lon: Number(lonInput) };
                  if (!isValidCoords(fav)) return;
                  const next = [...favorites, fav];
                  setFavorites(next); persistFavorites(next);
                }}
              >+ Save Current</button>
              {favorites.length > 0 && (
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs"
                  onClick={() => {
                    const name = prompt('Remove favorite by name:');
                    if (!name) return;
                    const next = favorites.filter(f => f.name !== name);
                    setFavorites(next); persistFavorites(next);
                  }}
                >Remove Favorite</button>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-5 px-2">
          <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur rounded-lg border border-gray-800 px-4 py-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <div className="text-sm font-semibold text-blue-300 tracking-wide">Manual Location</div>
              <div className="flex gap-2 text-xs text-gray-400">
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  onClick={() => {
                    setLatInput(coords.lat);
                    setLonInput(coords.lon);
                    setGeoStatus('Re-synced inputs from saved coordinates');
                  }}
                >Sync Saved</button>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  onClick={() => {
                    const def = { lat: 6.5244, lon: 3.3792 };
                    setLatInput(def.lat);
                    setLonInput(def.lon);
                    setGeoStatus('Reset to default (Lagos)');
                  }}
                >Reset Default</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="lat" className="block text-gray-300 text-xs font-medium uppercase tracking-wide mb-1">Latitude</label>
                <input
                  id="lat"
                  type="number"
                  step="0.000001"
                  inputMode="decimal"
                  className={`bg-gray-800 text-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border ${isValidCoords({ lat: Number(latInput), lon: Number(lonInput) }) ? 'border-gray-700' : 'border-red-600'}`}
                  placeholder="e.g. 6.5244"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="lon" className="block text-gray-300 text-xs font-medium uppercase tracking-wide mb-1">Longitude</label>
                <input
                  id="lon"
                  type="number"
                  step="0.000001"
                  inputMode="decimal"
                  className={`bg-gray-800 text-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border ${isValidCoords({ lat: Number(latInput), lon: Number(lonInput) }) ? 'border-gray-700' : 'border-red-600'}`}
                  placeholder="e.g. 3.3792"
                  value={lonInput}
                  onChange={(e) => setLonInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
              </div>
              <div className="flex h-full items-end">
                <button
                  disabled={!isValidCoords({ lat: Number(latInput), lon: Number(lonInput) })}
                  className={`w-full sm:w-auto font-semibold py-2 px-4 rounded transition-colors ${isValidCoords({ lat: Number(latInput), lon: Number(lonInput) }) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
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
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[0.01, -0.01, 0.001, -0.001].map((delta, i) => (
                <button
                  key={i}
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  onClick={() => {
                    // adjust latitude for first two, longitude for next two sets
                    if (i < 2) {
                      const newLat = Number(latInput) + delta;
                      setLatInput(parseFloat(newLat.toFixed(6)));
                    } else {
                      const newLon = Number(lonInput) + delta;
                      setLonInput(parseFloat(newLon.toFixed(6)));
                    }
                  }}
                >{i < 2 ? (delta > 0 ? '+Lat 0.01' : '-Lat 0.01') : (delta > 0 ? '+Lon 0.001' : '-Lon 0.001')}</button>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-gray-400 flex flex-wrap gap-4">
              <div>Current Saved: <span className="text-gray-200">{coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}</span></div>
              <div>Input: <span className="text-gray-200">{latInput !== '' && lonInput !== '' ? `${Number(latInput).toFixed(4)}, ${Number(lonInput).toFixed(4)}` : '—'}</span></div>
              {!isValidCoords({ lat: Number(latInput), lon: Number(lonInput) }) && (
                <div className="text-red-500">Invalid coordinates</div>
              )}
            </div>
          </div>
        </div>
        {loading && (
          <div className="text-blue-300 text-lg">Loading data...</div>
        )}
        {error && (
          <div className="text-red-400 text-lg">{error}</div>
        )}
        {/* Notification opt-in */}
        {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
          <div className="mt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1 rounded" onClick={async()=>{
              try { await Notification.requestPermission(); } catch {}
            }}>Enable Notifications</button>
          </div>
        )}

        {(risk || (weather && weather.main && weather.weather && weather.weather[0])) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {risk && (
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
            )}

            {risk && (
              <div className="bg-gray-900 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">Factors</h2>
                <div className="text-gray-300">Rain: {risk.factors.rain_mm} mm</div>
                <div className="text-gray-300">Humidity: {risk.factors.humidity}%</div>
                <div className="text-gray-300">Wind: {risk.factors.wind} m/s</div>
                <div className="text-gray-300">Recent Avg: {risk.factors.recentAccumulation} mm</div>
              </div>
            )}

            {weather && weather.main && weather.weather && weather.weather[0] && (
              <div className="bg-gray-900 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">Current Weather</h2>
                <div className="text-4xl font-bold text-yellow-400 mb-2">{weather.main.temp}°C</div>
                <div className="text-gray-400">{weather.weather[0].description}</div>
                <div className="text-gray-400">Humidity: {weather.main.humidity}%</div>
                <div className="text-gray-400">Wind: {weather.wind ? `${weather.wind.speed} m/s` : 'N/A'}</div>
              </div>
            )}

            {weather && weather.main && (
              <div className="bg-gray-900 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">Location</h2>
                <div className="text-2xl font-bold text-green-400 mb-2">{weather.name}</div>
                <div className="text-gray-400">Country: {weather.sys && weather.sys.country ? weather.sys.country : 'N/A'}</div>
              </div>
            )}

            {weather && (
              <div className="bg-gray-900 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">Clouds</h2>
                <div className="text-2xl font-bold text-red-400 mb-2">{weather.clouds && typeof weather.clouds.all !== 'undefined' ? `${weather.clouds.all}%` : 'N/A'}</div>
                <div className="text-gray-400">Visibility: {typeof weather.visibility !== 'undefined' ? `${weather.visibility}m` : 'N/A'}</div>
              </div>
            )}

            {risk && (
              <div className="bg-gray-900 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">Safety Tips</h2>
                <ul className="list-disc list-inside text-gray-200">
                  {risk.tips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
            )}
          </div>
        )}
        {(!weather || !weather.main || !weather.weather || !weather.weather[0]) && weather && !loading && !error && (
          <div className="text-red-400 text-lg">Weather data is unavailable for this location.</div>
        )}
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
