import React, { useEffect, useState } from 'react';

export default function SafetyTips() {
  const [tips, setTips] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('floodsense_last_risk');
      if (raw) {
        const obj = JSON.parse(raw);
        if (Array.isArray(obj?.tips) && obj.tips.length > 0) {
          setTips(obj.tips);
          return;
        }
      }
    } catch {}
    setTips([
      'Keep important documents in waterproof bags',
      'Turn off electrical appliances during heavy rain',
      'Know your nearest safe location',
      'Avoid walking or driving through flood water',
      'Store emergency numbers',
      'Prepare an emergency kit with food, water, and medicine',
      'Listen to local authorities and follow evacuation orders',
    ]);
  }, []);
  return (
    <div className="min-h-[60vh] bg-gray-950 text-gray-100 py-8 px-4 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300 mb-4 text-center">Flood Safety Tips</h1>
      <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
        <ul className="list-disc list-inside space-y-3 text-lg text-gray-200">
          {tips.map((t, i) => (<li key={i}>{t}</li>))}
        </ul>
      </div>
      <div className="text-center">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg shadow">Download Tips</button>
      </div>
    </div>
  );
}
