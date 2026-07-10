// Public, client-safe details of the webinar the /webinar page registers for.
// The joining URL is deliberately NOT here: this module is imported by a client
// component, so anything in it ships in the browser bundle. The URL lives in
// the API route and is only handed back on a successful registration.
//
// `slug` keys the rows in `webinar_registrations`, so changing it starts a fresh
// registration list rather than mixing attendees of two different sessions.
export const WEBINAR = {
  slug: "k12-ar-pedia-launch",
  title: "Bringing STEM to Life in Your Classroom",
  subtitle:
    "A live session for school leaders and teachers on using augmented reality to teach STEM, and how to bring K12 AR Pedia into your school.",

  // Leave either of these empty and the page simply omits the chip rather than
  // showing a placeholder date to registrants.
  dateLabel: "Thursday, 23 July 2026",
  timeLabel: "",

  // Machine-readable counterpart to dateLabel, in WAT. Once this moment passes
  // the landing-page banner stops rendering, so a finished webinar is never
  // advertised. Keep it in step with dateLabel.
  hideAfter: "2026-07-23T23:59:59+01:00",

  highlights: [
    "See the AR books and the Spotty holder demonstrated live",
    "Watch a full lesson taught with AR Pedia, start to finish",
    "Ask our team anything about rollout, training and pricing",
  ],
};

// The landing page is statically rendered with an hourly revalidate, so this is
// re-evaluated on the server at most an hour after the webinar ends.
export function isWebinarUpcoming(now = new Date()) {
  if (!WEBINAR.hideAfter) return true;
  return now <= new Date(WEBINAR.hideAfter);
}

export const DESIGNATIONS = [
  "Proprietor / Owner",
  "Principal / Head of School",
  "Vice Principal",
  "Head Teacher",
  "Teacher",
  "ICT Coordinator",
  "Administrator",
  "Other",
];
