"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/* Counts 0 → `to` once, when scrolled into view. Pass `decimals` for
   fractional targets; integers are locale-formatted with thousands. */
export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  decimals = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const shown = decimals
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US");

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
