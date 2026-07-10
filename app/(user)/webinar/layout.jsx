import { WEBINAR } from "@/lib/webinar";

export const metadata = {
  title: `${WEBINAR.title} — Free Webinar | Blue Sands K12 AR Pedia`,
  description: WEBINAR.subtitle,
  alternates: { canonical: "/webinar" },
  openGraph: {
    title: `${WEBINAR.title} — Free Webinar`,
    description: WEBINAR.subtitle,
    url: "/webinar",
  },
};

export default function WebinarLayout({ children }) {
  return children;
}
