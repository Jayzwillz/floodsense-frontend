import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem('floodsense_profile');
      return raw ? JSON.parse(raw) : {
        name: '',
        home: { lat: '', lon: '' },
        work: { lat: '', lon: '' },
        notifyWeb: true,
        notifyEmail: false,
        flags: { elderly: false, mobility: false },
      };
    } catch {
      return { name: '', home: { lat: '', lon: '' }, work: { lat: '', lon: '' }, notifyWeb: true, notifyEmail: false, flags: { elderly: false, mobility: false } };
    }
  });
  const [saved, setSaved] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('floodsense_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const update = (path, value) => {
    setProfile(p => {
      const clone = JSON.parse(JSON.stringify(p));
      const parts = path.split('.');
      let cur = clone;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return clone;
    });
  };

  return (
    <div className="min-h-[60vh] bg-gray-950 text-gray-100 py-8 px-4 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">Profile</h1>
      <div className="max-w-2xl mx-auto bg-gray-900/80 border border-gray-800 rounded-lg p-5">
        <div className="mb-4">
          <label className="block text-xs text-gray-300 uppercase mb-1">Display Name</label>
          <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={profile.name} onChange={e=>update('name', e.target.value)} placeholder="e.g., Ada" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-300 uppercase mb-1">Home Latitude</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={profile.home.lat} onChange={e=>update('home.lat', e.target.value)} placeholder="e.g., 6.5244" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 uppercase mb-1">Home Longitude</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={profile.home.lon} onChange={e=>update('home.lon', e.target.value)} placeholder="e.g., 3.3792" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 uppercase mb-1">Work Latitude</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={profile.work.lat} onChange={e=>update('work.lat', e.target.value)} placeholder="e.g., 6.4600" />
          </div>
          <div>
            <label className="block text-xs text-gray-300 uppercase mb-1">Work Longitude</label>
            <input className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={profile.work.lon} onChange={e=>update('work.lon', e.target.value)} placeholder="e.g., 3.3900" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center gap-2 text-gray-200"><input type="checkbox" checked={profile.notifyWeb} onChange={e=>update('notifyWeb', e.target.checked)} /> Web Notifications</label>
          <label className="flex items-center gap-2 text-gray-200"><input type="checkbox" checked={profile.notifyEmail} onChange={e=>update('notifyEmail', e.target.checked)} /> Email Notifications</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <label className="flex items-center gap-2 text-gray-200"><input type="checkbox" checked={profile.flags.elderly} onChange={e=>update('flags.elderly', e.target.checked)} /> Elderly household</label>
          <label className="flex items-center gap-2 text-gray-200"><input type="checkbox" checked={profile.flags.mobility} onChange={e=>update('flags.mobility', e.target.checked)} /> Mobility challenges</label>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded" onClick={()=>{ try{ localStorage.setItem('floodsense_profile', JSON.stringify(profile)); setSaved('Saved'); setTimeout(()=>setSaved(''), 1200);}catch{}}}>Save</button>
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold px-4 py-2 rounded" onClick={()=>{ try{ const raw = localStorage.getItem('floodsense_profile'); setProfile(raw?JSON.parse(raw):profile);}catch{}}}>Reload</button>
          {saved && <div className="text-sm text-green-400 self-center">{saved}</div>}
        </div>
      </div>
    </div>
  );
}
