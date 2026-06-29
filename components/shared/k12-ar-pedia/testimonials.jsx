"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const quotes = [
  {
    text: "Students became instantly more engaged. The curiosity AR Pedia sparked was something we had never seen before.",
    author: "Mrs. Adaeze Okonkwo",
    role: "School Admin · Greenfield Primary, Lagos",
    initials: "AO",
    avatarBg: "bg-primary",
    cardBg: "bg-blue-50",
    border: "border-blue-200",
    stars: 5,
  },
  {
    text: "The children genuinely look forward to science class now — that is genuinely rare.",
    author: "Mr. Chukwuemeka Eze",
    role: "Science Teacher · Sunrise STEM Academy, Abuja",
    initials: "CE",
    avatarBg: "bg-secondary",
    cardBg: "bg-indigo-50",
    border: "border-indigo-200",
    stars: 5,
  },
  {
    text: "Parents noticed the difference in their children's enthusiasm immediately. That speaks volumes.",
    author: "Mrs. Funke Adeyemi",
    role: "School Director · Bright Futures, Rivers",
    initials: "FA",
    avatarBg: "bg-emerald-600",
    cardBg: "bg-emerald-50",
    border: "border-emerald-200",
    stars: 5,
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      {/* Decorations */}
      <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-emerald-300/20 pointer-events-none" />
      <div className="absolute top-8 right-14 w-7 h-7 rounded-full bg-blue-300/20 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full border-4 border-amber-300/25 pointer-events-none" />
      <div className="absolute bottom-20 left-16 w-5 h-5 rounded-full bg-violet-400/20 pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2.5 text-white font-extrabold text-sm sm:text-base shadow-[0_5px_0_rgba(0,0,0,0.1)] kid-wobble">
            <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
            Real Stories
          </div>
          <h2 className="font-display font-bold text-secondary text-4xl sm:text-5xl lg:text-6xl">
            Educators <span className="text-grass doodle-underline">Love It</span>
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Stars count={5} />
            <span className="text-gray-600 font-semibold text-sm">5.0 · Early access feedback</span>
          </div>
        </motion.div>

        {/* Speech bubble cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {quotes.map(({ text, author, role, initials, avatarBg, cardBg, border, stars }, i) => (
            <motion.div
              key={author}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col ${cardBg} rounded-3xl p-7 lg:p-8 border-2 ${border} shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              {/* Giant decorative quote mark */}
              <div
                className="absolute top-4 right-6 text-9xl font-serif leading-none select-none pointer-events-none"
                style={{ color: "rgba(0,0,0,0.05)", lineHeight: 1 }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="mb-5">
                <Stars count={stars} />
              </div>

              {/* Quote text — bigger, bolder */}
              <p
                className="text-gray-800 text-lg leading-relaxed mb-8 flex-1 font-semibold relative z-10"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-black/5">
                <div
                  className={`w-12 h-12 rounded-full ${avatarBg} flex items-center justify-center shrink-0 shadow-md`}
                >
                  <span className="text-white font-bold text-sm">{initials}</span>
                </div>
                <div>
                  <p
                    className="text-secondary font-bold text-sm"
                    style={{ fontFamily: "var(--font-jarkata)" }}
                  >
                    {author}
                  </p>
                  <p className="text-gray-500 text-xs leading-snug">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
