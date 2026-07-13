import { Newspaper, Megaphone, Calendar } from "lucide-react";

export const metadata = { title: "News & Insights — Admin" };

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
          News & Insights
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Announcements, press coverage, and event write-ups for Blue Sands K12 AR Pedia.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Newspaper className="w-7 h-7 text-primary" />
        </div>
        <p className="text-secondary font-bold text-lg">Nothing published yet</p>
        <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
          Press conferences, product announcements, and event recaps will appear here once they
          go live. Publishing tools will land in this section when the first story is ready.
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mt-8 max-w-2xl mx-auto text-left">
          <Planned Icon={Megaphone} title="Announcements" note="Product news and milestones." />
          <Planned Icon={Calendar} title="Press events" note="Conferences and briefings." />
          <Planned Icon={Newspaper} title="In the media" note="Coverage and mentions." />
        </div>
      </div>
    </div>
  );
}

function Planned({ Icon, title, note }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <Icon className="w-4.5 h-4.5 text-primary mb-2" />
      <p className="font-bold text-secondary text-sm">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{note}</p>
    </div>
  );
}
