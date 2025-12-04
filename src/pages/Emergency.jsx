import React, { useEffect, useMemo, useState } from 'react';

export default function Emergency() {
  const [coords, setCoords] = useState(() => {
    try { const raw = localStorage.getItem('floodsense_coords'); return raw ? JSON.parse(raw) : { lat: 6.5244, lon: 3.3792 }; } catch { return { lat: 6.5244, lon: 3.3792 }; }
  });
  const [area, setArea] = useState(null); // {display, city, state, country, country_code}
  const [loadingArea, setLoadingArea] = useState(true);
  const [places, setPlaces] = useState([]); // results from Overpass
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reverse geocode for nice header
    const loadArea = async () => {
      try {
        setLoadingArea(true);
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=12&addressdetails=1`;
        const res = await fetch(url);
        const data = await res.json();
        const addr = data?.address || {};
        setArea({
          display: data?.display_name,
          city: addr.city || addr.town || addr.village || addr.county || null,
          state: addr.state || null,
          country: addr.country || null,
          country_code: addr.country_code || null,
        });
      } catch {
        // ignore
      } finally {
        setLoadingArea(false);
      }
    };
    loadArea();
  }, [coords.lat, coords.lon]);

  // Compute distance for sorting
  const toRad = (deg) => (deg * Math.PI) / 180;
  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // Query Overpass API for nearby emergency services
    const loadPlaces = async () => {
      setError(null);
      setLoadingPlaces(true);
      try {
        const radius = 10000; // 10km
        const query = `
[out:json][timeout:25];
(
  node["amenity"="police"](around:${radius},${coords.lat},${coords.lon});
  node["amenity"="hospital"](around:${radius},${coords.lat},${coords.lon});
  node["amenity"="fire_station"](around:${radius},${coords.lat},${coords.lon});
  node["emergency"="phone"](around:${radius},${coords.lat},${coords.lon});
  way["amenity"="hospital"](around:${radius},${coords.lat},${coords.lon});
  way["amenity"="police"](around:${radius},${coords.lat},${coords.lon});
  way["amenity"="fire_station"](around:${radius},${coords.lat},${coords.lon});
  relation["amenity"="hospital"](around:${radius},${coords.lat},${coords.lon});
);
out center tags 20;`;
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: new URLSearchParams({ data: query }).toString(),
        });
        const data = await res.json();
        const elems = Array.isArray(data?.elements) ? data.elements : [];
        const normalized = elems.map(el => {
          const center = el.center || { lat: el.lat, lon: el.lon };
          const tags = el.tags || {};
          const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || null;
          const type = tags.amenity || (tags.emergency ? `${tags.emergency}` : 'service');
          const name = tags.name || tags.operator || type;
          const lat = center?.lat;
          const lon = center?.lon;
          const dist = (typeof lat === 'number' && typeof lon === 'number') ? distanceKm(coords.lat, coords.lon, lat, lon) : null;
          return { id: el.id, type, name, phone, lat, lon, dist };
        }).filter(p => typeof p.lat === 'number' && typeof p.lon === 'number');
        normalized.sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9));
        setPlaces(normalized.slice(0, 40));
      } catch (e) {
        setError('Failed to load nearby emergency services');
      } finally {
        setLoadingPlaces(false);
      }
    };
    loadPlaces();
  }, [coords.lat, coords.lon]);

  const emergencyNumbers = useMemo(() => {
    const cc = (area?.country_code || '').toLowerCase();
    // Minimal safe defaults with disclaimer; real numbers vary by country
    const common = [
      { label: 'Global Mobile Emergency (GSM)', number: '112', note: 'Often routes to local emergency services on mobile networks' },
    ];
    const byCountry = {
      us: [{ label: 'Emergency (US)', number: '911' }],
      ca: [{ label: 'Emergency (CA)', number: '911' }],
      gb: [{ label: 'Emergency (UK)', number: '999' }, { label: 'EU Standard (mobile)', number: '112' }],
      ng: [{ label: 'General Emergency (NG)', number: '112' }],
      au: [{ label: 'Emergency (AU)', number: '000' }, { label: 'Mobile (AU)', number: '112' }],
      nz: [{ label: 'Emergency (NZ)', number: '111' }],
      in: [{ label: 'Emergency (IN)', number: '112' }],
      eu: [{ label: 'EU Emergency', number: '112' }],
    };
    return (byCountry[cc] || []).concat(common);
  }, [area?.country_code]);

  return (
    <div className="min-h-[70vh] bg-gray-950 text-gray-100 py-8 px-2 md:px-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <img src="/images/logo.png" alt="FloodSense Logo" className="mx-auto mb-3 w-14 h-14 rounded-full border-2 border-blue-500 object-contain" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Emergency Help</h1>
        <p className="text-sm text-gray-400 mt-1">Based on your saved location</p>
        <div className="text-xs text-gray-500 mt-1">
          {loadingArea ? 'Finding your area…' : (area?.display ? area.display : `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick emergency numbers */}
        <div className="bg-gray-900 rounded-xl p-5 shadow md:col-span-1">
          <h2 className="text-xl font-semibold text-red-400 mb-3">Quick Emergency Numbers</h2>
          <ul className="space-y-2">
            {emergencyNumbers.map((n, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                <div>
                  <div className="text-gray-200 text-sm">{n.label}</div>
                  {n.note && <div className="text-[11px] text-gray-500">{n.note}</div>}
                </div>
                <a href={`tel:${n.number}`} className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">Call {n.number}</a>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-gray-500 mt-3">
            Disclaimer: Numbers may vary by region and carrier.
          </div>
        </div>

        {/* Nearby services list */}
        <div className="bg-gray-900 rounded-xl p-5 shadow md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-blue-300">Nearby Emergency Services</h2>
            <div className="text-xs text-gray-500">Within ~10km</div>
          </div>
          {loadingPlaces ? (
            <div className="w-full h-40 bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-300">Loading nearby services…</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : places.length === 0 ? (
            <div className="text-gray-400">No nearby services found. Try calling the quick numbers above or widen your search.</div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {places.map((p) => (
                <li key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="text-gray-200 font-medium">
                      {p.name}
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300">{p.type.replace('_', ' ')}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {p.dist != null ? `${p.dist.toFixed(1)} km away` : ''}
                      {p.lat && p.lon ? ` • ${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.phone ? (
                      <a href={`tel:${p.phone}`} className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded">Call</a>
                    ) : (
                      <span className="text-[11px] text-gray-500">No phone listed</span>
                    )}
                    {p.lat && p.lon && (
                      <a
                        href={`https://www.google.com/maps?q=${p.lat},${p.lon}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded"
                      >Directions</a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
