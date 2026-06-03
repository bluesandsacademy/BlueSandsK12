"use client";

const events = [
  { emoji: "🏫", school: "Greenfield Primary", city: "Lagos", action: "reserved 20 slots" },
  { emoji: "⭐", school: "Sunrise STEM Academy", city: "Abuja", action: "joined early access" },
  { emoji: "🎉", school: "Lagos Island Prep", city: "Lagos Island", action: "became a partner school" },
  { emoji: "🚀", school: "New Horizons Junior", city: "Port Harcourt", action: "reserved 15 slots" },
  { emoji: "💡", school: "Covenant Academy", city: "Ibadan", action: "joined the waitlist" },
  { emoji: "🌟", school: "Grace International", city: "Kano", action: "booked a free demo" },
  { emoji: "🏆", school: "Royal Stars Primary", city: "Enugu", action: "became a partner school" },
  { emoji: "🔬", school: "Discovery STEM Club", city: "Benin City", action: "reserved 30 slots" },
  { emoji: "📚", school: "Brightfield Academy", city: "Kaduna", action: "joined early access" },
  { emoji: "✨", school: "Future Leaders Prep", city: "Lekki", action: "booked a free demo" },
];

// Duplicate for seamless infinite scroll
const track = [...events, ...events];

export default function SocialProofTicker() {
  return (
    <div
      className="w-full overflow-hidden py-3 border-y border-primary/10"
      style={{ background: "linear-gradient(90deg, #f0f7ff 0%, #fff 30%, #fff 70%, #f0f7ff 100%)" }}
    >
      <style>{`
        @keyframes k12-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .k12-ticker-track {
          animation: k12-ticker 36s linear infinite;
          will-change: transform;
        }
        .k12-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Edge fade masks */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f0f7ff, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #f0f7ff, transparent)" }} />

        <div className="k12-ticker-track flex items-center gap-0 w-max">
          {track.map(({ emoji, school, city, action }, i) => (
            <div key={i} className="flex items-center gap-2.5 mx-5 shrink-0">
              {/* Pill card */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/15 shadow-sm"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-secondary font-bold text-xs">
                  {school}
                  <span className="text-gray-400 font-normal">, {city}</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-primary/30 shrink-0" />
                <span className="text-primary text-xs font-semibold">{action}</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
              </div>

              {/* Dot separator */}
              <span className="text-primary/20 text-lg select-none" aria-hidden="true">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
