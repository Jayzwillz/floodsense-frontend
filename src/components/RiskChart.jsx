import React, { useMemo, useState } from 'react';

export default function RiskChart({ series = [] }) {
  const width = 540;
  const height = 260;
  const padding = 40;
  const points = series.slice(0, 24); // show up to 24 forecast points

  // Extract data safely
  const temps = points.map(p => (typeof p.temp === 'number' ? p.temp : 0));
  const rains = points.map(p => (typeof p.rain_mm === 'number' ? p.rain_mm : 0));
  const times = points.map(p => (typeof p.ts === 'number' ? new Date(p.ts * 1000) : null));

  // Scales
  const maxTemp = temps.length ? Math.max(...temps) : 1;
  const minTemp = temps.length ? Math.min(...temps) : 0;
  const maxRain = rains.length ? Math.max(...rains) : 1;
  const xStep = points.length ? (width - padding * 2) / (points.length - 1 || 1) : 0;

  // Risk proxy from rain (0–100)
  const riskScores = rains.map(mm => Math.max(0, Math.min(100, Math.round(mm * 3))));

  const linePath = (arr, min, max, color) => {
    const path = points.map((p, i) => {
      const x = padding + i * xStep;
      const val = arr[i] ?? 0;
      const y = padding + (height - padding * 2) * (1 - (val - min) / ((max - min) || 1));
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return <path d={path} fill="none" stroke={color} strokeWidth="2" />;
  };

  const xLabels = useMemo(() => {
    return points.map((p, i) => {
      const d = times[i];
      return d ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : `${i}`;
    });
  }, [points.length]);

  const [hover, setHover] = useState(null); // index

  return (
    <div className="w-full rounded-lg">
      {points.length === 0 ? (
        <div className="w-full h-40 bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-300">
          No forecast data
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          className="bg-blue-950/30 rounded-lg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#4b5563" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#4b5563" strokeWidth="1" />

          {/* Grid */}
          {[0.25, 0.5, 0.75].map((g, gi) => (
            <line key={`g${gi}`} x1={padding} y1={padding + (height - padding * 2) * g} x2={width - padding} y2={padding + (height - padding * 2) * g} stroke="#374151" strokeWidth="1" opacity="0.4" />
          ))}

          {/* Rain bars (left axis) */}
          {points.map((p, i) => {
            const x = padding + i * xStep;
            const barW = Math.max(4, xStep * 0.5);
            const barH = (height - padding * 2) * ((rains[i] ?? 0) / (maxRain || 1));
            const y = height - padding - barH;
            return <rect key={`r${i}`} x={x - barW / 2} y={y} width={barW} height={barH} fill="#60a5fa" opacity={hover === i ? 0.9 : 0.6} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />;
          })}

          {/* Temperature line (right axis) */}
          {linePath(temps, minTemp, maxTemp, '#f59e0b')}

          {/* Risk score proxy line (0–100) */}
          {linePath(riskScores, 0, 100, '#ef4444')}

          {/* X-axis labels */}
          {xLabels.map((lbl, i) => {
            const x = padding + i * xStep;
            return <text key={`x${i}`} x={x} y={height - padding + 14} fill="#9ca3af" fontSize="10" textAnchor="middle">{lbl}</text>;
          })}

          {/* Legends */}
          <rect x={width - 210} y={10} width={200} height={50} rx={8} fill="#0b1220" opacity="0.6" />
          <circle cx={width - 195} cy={25} r={4} fill="#60a5fa" />
          <text x={width - 185} y={28} fill="#cbd5e1" fontSize="11">Rain (bars)</text>
          <circle cx={width - 195} cy={42} r={4} fill="#f59e0b" />
          <text x={width - 185} y={45} fill="#cbd5e1" fontSize="11">Temp (line)</text>
          <circle cx={width - 120} cy={25} r={4} fill="#ef4444" />
          <text x={width - 110} y={28} fill="#cbd5e1" fontSize="11">Risk 0–100</text>

          {/* Y-axis labels */}
          <text x={10} y={padding - 6} fill="#9ca3af" fontSize="10">Rain</text>
          <text x={width - padding + 6} y={padding - 6} fill="#9ca3af" fontSize="10">Temp</text>

          {/* Hover tooltip */}
          {hover != null && (() => {
            const i = hover;
            const x = padding + i * xStep;
            const tooltipY = padding + 10;
            const label = xLabels[i];
            const rain = rains[i]?.toFixed(1);
            const temp = temps[i]?.toFixed(1);
            const risk = riskScores[i];
            return (
              <g>
                <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#93c5fd" strokeDasharray="4 4" />
                <rect x={Math.min(x + 6, width - 150)} y={tooltipY} width={140} height={54} rx={8} fill="#0b1220" opacity="0.85" />
                <text x={Math.min(x + 12, width - 144)} y={tooltipY + 16} fill="#cbd5e1" fontSize="11">{label}</text>
                <text x={Math.min(x + 12, width - 144)} y={tooltipY + 30} fill="#93c5fd" fontSize="11">Rain: {rain} mm</text>
                <text x={Math.min(x + 12, width - 144)} y={tooltipY + 44} fill="#f59e0b" fontSize="11">Temp: {temp} °C • Risk: {risk}</text>
              </g>
            );
          })()}
        </svg>
      )}
    </div>
  );
}
