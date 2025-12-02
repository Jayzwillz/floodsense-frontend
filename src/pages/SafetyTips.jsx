import React from 'react';

export default function SafetyTips() {
  return (
    <div className="min-h-[60vh] bg-gray-950 text-gray-100 py-8 px-4 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300 mb-4 text-center">Flood Safety Tips</h1>
      <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
        <ul className="list-disc list-inside space-y-3 text-lg text-gray-200">
          <li>Keep important documents in waterproof bags</li>
          <li>Turn off electrical appliances during heavy rain</li>
          <li>Know your nearest safe location</li>
          <li>Avoid walking or driving through flood water</li>
          <li>Store emergency numbers</li>
          <li>Prepare an emergency kit with food, water, and medicine</li>
          <li>Listen to local authorities and follow evacuation orders</li>
        </ul>
      </div>
      <div className="text-center">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg shadow">Download Tips</button>
      </div>
    </div>
  );
}
