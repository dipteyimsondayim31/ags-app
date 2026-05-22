"use client";

interface CircularProgressProps {
  value: number; // e.g. number of learned cards
  total: number; // e.g. target total cards
  size?: number; // width and height in px
  strokeWidth?: number;
}

export function CircularProgress({
  value,
  total,
  size = 110,
  strokeWidth = 8,
}: CircularProgressProps) {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.min(Math.round((value / safeTotal) * 100), 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-violet-950/30"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Glow Filter */}
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#purpleGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#neon-glow)"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Centered Percentage Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-black text-white tracking-tight">
          %{percentage}
        </span>
      </div>
    </div>
  );
}
