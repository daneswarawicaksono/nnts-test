import React, { useState } from 'react';

export interface CognitiveRadarData {
  ironScore: number; // 0 - 100 (Visuomotor reaction speed)
  ironLatencyMs: number;
  zincScore: number; // 0 - 100 (Inhibition control accuracy)
  zincErrors: number;
  b12Score: number; // 0 - 100 (Memory span)
  b12Span: number;
}

export interface CognitiveRadarChartProps {
  data: CognitiveRadarData;
  size?: number;
  className?: string;
}

export const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({
  data,
  size = 280,
  className = '',
}) => {
  const [activeAxis, setActiveAxis] = useState<'iron' | 'zinc' | 'b12' | null>(null);

  // Geometric center and radius
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;

  // Angles for 3 axes:
  // Axis 0 (Iron/Fe): Top ( -90 deg / -PI/2 )
  // Axis 1 (Zinc/Zn): Bottom Right ( 30 deg / PI/6 )
  // Axis 2 (B12): Bottom Left ( 150 deg / 5*PI/6 )
  const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];

  const getPoint = (angle: number, valueNormalized: number) => {
    const r = radius * Math.max(0.08, Math.min(1, valueNormalized));
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Concentric guideline rings at 33%, 66%, 100%
  const ringLevels = [0.33, 0.66, 1.0];

  // Patient normalized scores (0 to 1)
  const patientPoints = [
    getPoint(angles[0], data.ironScore / 100),
    getPoint(angles[1], data.zincScore / 100),
    getPoint(angles[2], data.b12Score / 100),
  ];
  const patientPolygonStr = patientPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Standard Healthy Benchmark polygon (85% across all 3 axes)
  const benchmarkPoints = [
    getPoint(angles[0], 0.85),
    getPoint(angles[1], 0.85),
    getPoint(angles[2], 0.85),
  ];
  const benchmarkPolygonStr = benchmarkPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className={`flex flex-col items-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs ${className}`}>
      {/* Header & Legend */}
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2">
        <div>
          <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase">
            Radar Profil Neurokognitif
          </h3>
          <span className="text-xs text-slate-600">
            Korelasi Mikronutrien Fe, Zn, B12
          </span>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-indigo-700">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            <span>Pasien</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600 inline-block" />
            <span>Benchmark Usia</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible select-none"
          role="img"
          aria-label="Grafik Radar Neurokognitif 3 Domain: Zat Besi, Seng, dan Vitamin B12"
        >
          {/* Background Concentric Triangular Rings */}
          {ringLevels.map((lvl, idx) => {
            const pts = angles.map((a) => getPoint(a, lvl));
            const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
            return (
              <polygon
                key={`ring-${idx}`}
                points={poly}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1.2"
                strokeDasharray={idx === 2 ? 'none' : '3 3'}
              />
            );
          })}

          {/* Tri-Axial Spoke Lines */}
          {angles.map((a, idx) => {
            const outer = getPoint(a, 1.0);
            return (
              <line
                key={`spoke-${idx}`}
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Healthy Age Benchmark Polygon (Green outline) */}
          <polygon
            points={benchmarkPolygonStr}
            fill="#10B981"
            fillOpacity="0.08"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Patient Current Score Polygon (Indigo) */}
          <polygon
            points={patientPolygonStr}
            fill="#4F46E5"
            fillOpacity="0.25"
            stroke="#4F46E5"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Interactive Vertex Handles */}
          {patientPoints.map((pt, idx) => {
            const axisKey = idx === 0 ? 'iron' : idx === 1 ? 'zinc' : 'b12';
            const isActive = activeAxis === axisKey;
            return (
              <circle
                key={`vertex-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 6 : 4.5}
                fill="#4F46E5"
                stroke="#FFFFFF"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:scale-125"
                onMouseEnter={() => setActiveAxis(axisKey)}
                onMouseLeave={() => setActiveAxis(null)}
              />
            );
          })}

          {/* Axis Labels */}
          {/* Top Axis: Fe (Iron) */}
          <text
            x={cx}
            y={cy - radius - 18}
            textAnchor="middle"
            className="text-xs font-bold fill-slate-900"
          >
            Fe : Atensi &amp; Kecepatan
          </text>
          <text
            x={cx}
            y={cy - radius - 4}
            textAnchor="middle"
            className="text-xs font-mono font-bold fill-indigo-700"
          >
            {data.ironLatencyMs} ms ({data.ironScore}%)
          </text>

          {/* Bottom-Right Axis: Zn (Zinc) */}
          <text
            x={cx + radius + 12}
            y={cy + radius * 0.65}
            textAnchor="start"
            className="text-xs font-bold fill-slate-900"
          >
            Zn : Kontrol Inhibisi
          </text>
          <text
            x={cx + radius + 12}
            y={cy + radius * 0.65 + 14}
            textAnchor="start"
            className="text-xs font-mono font-bold fill-indigo-700"
          >
            {data.zincScore}% (Err: {data.zincErrors})
          </text>

          {/* Bottom-Left Axis: Vitamin B12 */}
          <text
            x={cx - radius - 12}
            y={cy + radius * 0.65}
            textAnchor="end"
            className="text-xs font-bold fill-slate-900"
          >
            B12 : Memori Kerja
          </text>
          <text
            x={cx - radius - 12}
            y={cy + radius * 0.65 + 14}
            textAnchor="end"
            className="text-xs font-mono font-bold fill-indigo-700"
          >
            Span: {data.b12Span} digit ({data.b12Score}%)
          </text>
        </svg>
      </div>

      {/* Quick Clinical Interpretation Footer */}
      <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-700">Zat Besi: {data.ironScore >= 75 ? 'Cukup' : 'Defisit Terindikasi'}</span>
        <span className="text-slate-700">Seng: {data.zincScore >= 75 ? 'Optimal' : 'Kurang'}</span>
        <span className="text-slate-700">B12: {data.b12Score >= 75 ? 'Baik' : 'Waspada'}</span>
      </div>
    </div>
  );
};
