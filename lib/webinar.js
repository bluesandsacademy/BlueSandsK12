// Details of the webinar advertised on the landing page. Registration happens
// on Luma, so everything here is public and every CTA points at `lumaUrl`.
export const WEBINAR = {
  title: "Bringing STEM to Life in Your Classroom",
  subtitle:
    "A live session for school leaders and teachers on using augmented reality to teach STEM, and how to bring K12 AR Pedia into your school.",

  lumaUrl: "https://luma.com/z307o8sk",

  // Leave either empty and the banner omits it rather than showing a placeholder.
  dateLabel: "Friday, 24 July 2026",
  timeLabel: "",

  // Machine-readable counterpart to dateLabel, in WAT. Once this moment passes
  // the landing-page banner stops rendering, so a finished webinar is never
  // advertised. Keep it in step with dateLabel.
  hideAfter: "2026-07-24T23:59:59+01:00",
};

// The landing page is statically rendered with an hourly revalidate, so this is
// re-evaluated on the server at most an hour after the webinar ends.
export function isWebinarUpcoming(now = new Date()) {
  if (!WEBINAR.hideAfter) return true;
  return now <= new Date(WEBINAR.hideAfter);
}
