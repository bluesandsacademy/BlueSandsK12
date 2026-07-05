"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "Students became instantly more engaged. The curiosity AR Pedia sparked was something we had never seen before.",
    author: "Mrs. Adaeze Okonkwo",
    role: "School Admin · Greenfield Primary, Lagos",
    tag: "Institution",
    initials: "AO",
    avatarBg: "bg-primary",
    stars: 5,
  },
  {
    text: "The children genuinely look forward to science class now, which is genuinely rare.",
    author: "Mr. Chukwuemeka Eze",
    role: "Science Teacher · Sunrise STEM Academy, Abuja",
    tag: "Educator",
    initials: "CE",
    avatarBg: "bg-grape",
    stars: 5,
  },
  {
    text: "Parents noticed the difference in their children's enthusiasm immediately. That speaks volumes.",
    author: "Mrs. Funke Adeyemi",
    role: "School Director · Bright Futures, Rivers",
    tag: "Institution",
    initials: "FA",
    avatarBg: "bg-grass",
    stars: 5,
  },
];

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* Refined, headerless testimonial wall — unified white cards so the voices
   read as one community. Composed inside the ecosystem section. */
export default function TestimonialWall() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {quotes.map(({ text, author, role, tag, initials, avatarBg, stars }, i) => (
        <motion.figure
          key={author}
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ y: -6 }}
          className="relative flex flex-col rounded-3xl bg-white p-7 lg:p-8 border-2 border-secondary/10 shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          {/* Quote mark + role tag */}
          <div className="flex items-center justify-between mb-5">
            <Quote className="w-8 h-8 text-primary/25 fill-primary/10" strokeWidth={1.5} />
            <span className="inline-flex items-center rounded-full bg-secondary/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary/60">
              {tag}
            </span>
          </div>

          <div className="mb-5">
            <Stars count={stars} />
          </div>

          <blockquote className="text-secondary/90 text-lg leading-relaxed flex-1 font-semibold">
            {text}
          </blockquote>

          <figcaption className="flex items-center gap-3.5 pt-5 mt-6 border-t border-secondary/10">
            <div
              className={`w-11 h-11 rounded-full ${avatarBg} flex items-center justify-center shrink-0 shadow-md`}
            >
              <span className="text-white font-bold text-sm">{initials}</span>
            </div>
            <div>
              <p className="text-secondary font-bold text-sm">{author}</p>
              <p className="text-gray-500 text-xs leading-snug">{role}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
