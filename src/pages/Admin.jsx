import React from 'react';
import MapView from '../components/MapView';
import RiskChart from '../components/RiskChart';

export default function Admin() {
  return (
    <div className="min-h-[60vh] bg-gray-950 text-gray-100 py-8 px-4 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-purple-300 mb-4 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Manage Communities</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow mb-2">Add Community</button>
          <div className="text-gray-400 text-sm mb-4">View, edit, or remove communities.</div>
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Community Map</h2>
          <MapView />
        </div>
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col items-center w-full">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Broadcast Alert</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow mb-2">Send Alert</button>
          <div className="text-gray-400 text-sm mb-4">Send notifications to all users.</div>
          <h2 className="text-xl font-semibold text-yellow-300 mb-2">Water Level Trends</h2>
          <RiskChart />
        </div>
      </div>
    </div>
  );
}
