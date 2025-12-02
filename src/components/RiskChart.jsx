import React from 'react';

export default function RiskChart({ series = [] }) {
  // Prepare simple SVG chart: x by index, temp line, rain bars
  const width = 500;
  const height = 200;
  const padding = 30;
  const points = series.slice(0, 20); // limit to 20 points
  const temps = points.map(p => p.temp ?? 0);
  const rains = points.map(p => p.rain_mm ?? 0);
  const maxTemp = temps.length ? Math.max(...temps) : 1;
  const minTemp = temps.length ? Math.min(...temps) : 0;
  const maxRain = rains.length ? Math.max(...rains) : 1;
  const xStep = points.length ? (width - padding * 2) / (points.length - 1 || 1) : 0;

  const tempPath = points.map((p, i) => {
    const x = padding + i * xStep;
    const y = padding + (height - padding * 2) * (1 - ((p.temp ?? 0) - minTemp) / (maxTemp - minTemp || 1));
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="w-full rounded-lg">
      <svg width={width} height={height} className="bg-blue-950/30 rounded-lg">
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#4b5563" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#4b5563" strokeWidth="1" />
        {/* Rain bars */}
        {points.map((p, i) => {
          const x = padding + i * xStep;
          const barW = Math.max(3, xStep * 0.4);
          const barH = (height - padding * 2) * ((p.rain_mm ?? 0) / (maxRain || 1));
          const y = height - padding - barH;
          return <rect key={`r${i}`} x={x - barW / 2} y={y} width={barW} height={barH} fill="#60a5fa" opacity="0.6" />;
        })}
        {/* Temp line */}
        <path d={tempPath} fill="none" stroke="#f59e0b" strokeWidth="2" />
        {/* Labels */}
        <text x={padding} y={20} fill="#9ca3af" fontSize="12">Temp (line) & Rain (bars)</text>
      </svg>
      {points.length === 0 && (
        <div className="w-full h-40 bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-300">
          No forecast data
        </div>
      )}
    </div>
  );
}
