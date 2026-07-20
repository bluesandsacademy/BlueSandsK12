import { Video, CalendarDays, ArrowRight } from "lucide-react";
import { WEBINAR, isWebinarUpcoming } from "@/lib/webinar";

// Sits directly above the hero so a first-time visitor sees the webinar before
// anything else. Registration is handled by Luma, so the CTA leaves the site.
// Renders nothing once the webinar has passed.
export default function WebinarBanner() {
  if (!isWebinarUpcoming()) return null;

  const when = [WEBINAR.dateLabel, WEBINAR.timeLabel].filter(Boolean).join(" at ");

  return (
    <section className="bg-secondary">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sunshine px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-secondary shrink-0">
            <Video className="w-3 h-3" strokeWidth={2.75} />
            Free Live Webinar
          </span>

          <span className="flex flex-col sm:flex-row items-center gap-x-2.5 gap-y-1 min-w-0">
            <span className="text-sm font-bold text-white truncate max-w-full">
              {WEBINAR.title}
            </span>

            {when && (
              <>
                <span aria-hidden className="hidden sm:block w-1 h-1 rounded-full bg-white/30 shrink-0" />
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/60 shrink-0">
                  <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {when}
                </span>
              </>
            )}
          </span>

          <a
            href={WEBINAR.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-1.5 text-[13px] font-display font-bold text-white shrink-0 whitespace-nowrap hover:bg-[#ff6f73] transition-colors"
          >
            Reserve Your Seat
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
