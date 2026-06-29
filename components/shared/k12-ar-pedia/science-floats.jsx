"use client";

import { motion, useReducedMotion } from "framer-motion";

// Pre-computed DNA helix data (2 full rotations over 140px height)
const DNA_H = 140;
const DNA_PTS = Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  const a = t * Math.PI * 4;
  return { x1: +(20 + 14 * Math.cos(a)).toFixed(1), x2: +(20 - 14 * Math.cos(a)).toFixed(1), y: +(t * DNA_H).toFixed(1), rung: i % 4 === 0 };
});
const s1 = DNA_PTS.map((p, i) => `${i ? "L" : "M"}${p.x1},${p.y}`).join(" ");
const s2 = DNA_PTS.map((p, i) => `${i ? "L" : "M"}${p.x2},${p.y}`).join(" ");
const rungs = DNA_PTS.filter((p) => p.rung);

export function FloatAtom({ className = "", size = 110 }) {
  const reduced = useReducedMotion();
  const float = reduced ? {} : { animate: { y: [0, -16, 0] }, transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut" } };

  return (
    <motion.div className={`pointer-events-none select-none ${className}`} {...float}>
      <svg width={size} height={size} viewBox="0 0 110 110" fill="none" aria-hidden="true">
        {/* Orbit rings (static, tilted) */}
        <ellipse cx="55" cy="55" rx="48" ry="16" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45" />
        <ellipse cx="55" cy="55" rx="48" ry="16" stroke="#a855f7" strokeWidth="1.5" opacity="0.45" transform="rotate(60,55,55)" />
        <ellipse cx="55" cy="55" rx="48" ry="16" stroke="#10b981" strokeWidth="1.5" opacity="0.45" transform="rotate(-60,55,55)" />

        {/* Electron 1 — blue, fast */}
        <motion.g
          style={{ transformOrigin: "55px 55px" }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="103" cy="55" r="5.5" fill="#60a5fa" />
        </motion.g>

        {/* Electron 2 — violet, medium, reverse */}
        <motion.g
          style={{ transformOrigin: "55px 55px" }}
          animate={reduced ? {} : { rotate: -360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="79" cy="96" r="5.5" fill="#c084fc" />
        </motion.g>

        {/* Electron 3 — emerald, slow */}
        <motion.g
          style={{ transformOrigin: "55px 55px" }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear", delay: 1 }}
        >
          <circle cx="79" cy="14" r="5.5" fill="#34d399" />
        </motion.g>

        {/* Nucleus (on top) */}
        <circle cx="55" cy="55" r="13" fill="#fbbf24" opacity="0.18" />
        <circle cx="55" cy="55" r="9" fill="#f59e0b" />
        <circle cx="55" cy="55" r="5" fill="#fcd34d" />
      </svg>
    </motion.div>
  );
}

export function FloatPlanet({ className = "", size = 100 }) {
  const reduced = useReducedMotion();
  const w = Math.round(size * 1.65);
  const h = size;
  const cx = Math.round(w / 2);
  const cy = Math.round(h / 2);
  const r = Math.round(size * 0.36);
  const rx = Math.round(w * 0.46);
  const ry = Math.round(h * 0.17);
  const halfC = Math.round(rx * 1.02); // ~half circumference approx

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={reduced ? {} : { y: [0, -14, 0], rotate: [0, -4, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
        {/* Ring back */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          stroke="#fcd34d" strokeWidth="3.5" fill="none" opacity="0.4"
          strokeDasharray={`${halfC} ${halfC * 2}`} />
        {/* Planet body */}
        <circle cx={cx} cy={cy} r={r} fill="#2563eb" />
        {/* Surface details */}
        <ellipse cx={cx} cy={cy - Math.round(r * 0.2)} rx={Math.round(r * 0.65)} ry={Math.round(r * 0.17)} fill="rgba(255,255,255,0.1)" />
        <ellipse cx={cx} cy={cy + Math.round(r * 0.18)} rx={Math.round(r * 0.8)} ry={Math.round(r * 0.14)} fill="rgba(0,0,0,0.1)" />
        <circle cx={cx - Math.round(r * 0.3)} cy={cy - Math.round(r * 0.32)} r={Math.round(r * 0.28)} fill="rgba(255,255,255,0.11)" />
        {/* Ring front */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          stroke="#f59e0b" strokeWidth="5" fill="none" opacity="0.72"
          strokeDasharray={`${halfC} ${halfC * 2}`} strokeDashoffset={`${halfC * 2}`} />
      </svg>
    </motion.div>
  );
}

export function FloatDNA({ className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={reduced ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
    >
      <svg width="40" height={DNA_H} viewBox={`0 0 40 ${DNA_H}`} fill="none" aria-hidden="true">
        <path d={s1} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        <path d={s2} stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        {rungs.map(({ x1, x2, y }, i) => (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <circle cx={x1} cy={y} r="2.5" fill="#60a5fa" />
            <circle cx={x2} cy={y} r="2.5" fill="#34d399" />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

export function FloatSparkle({ className = "", size = 56, color = "#f59e0b" }) {
  const reduced = useReducedMotion();
  const c = size / 2;
  const r1 = size / 2;
  const r2 = size / 5.5;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return `${(c + r * Math.cos(angle)).toFixed(2)},${(c + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={reduced ? {} : { rotate: [0, 90, 180, 270, 360], scale: [1, 1.18, 1, 1.18, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <polygon points={pts} fill={color} opacity="0.88" />
        <circle cx={c} cy={c} r={r2 * 0.75} fill="rgba(255,255,255,0.55)" />
      </svg>
    </motion.div>
  );
}
