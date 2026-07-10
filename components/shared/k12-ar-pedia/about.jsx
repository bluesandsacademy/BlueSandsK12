"use client";

import { motion } from "framer-motion";
import {
  FlaskConical,
  Shapes,
  ClipboardCheck,
  LineChart,
  Cpu,
  Boxes,
  Users,
  Globe,
} from "lucide-react";
import SectionKicker from "./section-kicker";

// The ecosystem, as a flow: from labs → learning → assessment → insight.
const pillars = [
  {
    step: "01",
    name: "Virtual Labs",
    desc: "Safe, hands-on experiments, anywhere.",
    Icon: FlaskConical,
    color: "#0483e2",
  },
  {
    step: "02",
    name: "Interactive Learning",
    desc: "Lessons that come alive in immersive 3D.",
    Icon: Shapes,
    color: "#FF5A5F",
  },
  {
    step: "03",
    name: "Assessments",
    desc: "Measure understanding in real time.",
    Icon: ClipboardCheck,
    color: "#9B5DE5",
  },
  {
    step: "04",
    name: "Analytics",
    desc: "Insights that guide teachers and schools.",
    Icon: LineChart,
    color: "#3DD68C",
  },
];

const meta = [
  { label: "AI-powered", Icon: Cpu },
  { label: "Immersive AR/VR", Icon: Boxes },
  { label: "Students, educators & institutions", Icon: Users },
  { label: "Anywhere in the world", Icon: Globe },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-white">
      {/* Soft brand washes */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <SectionKicker>About Blue Sands K12 AR Pedia</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            A VR/AR STEM Education{" "}
            <span className="text-primary doodle-underline">Ecosystem</span>{" "}
            built for African Classrooms
          </h2>
          <p className="mt-5 text-gray-600 text-lg font-semibold leading-relaxed">
            Blue Sands K12 powers the full STEM education ecosystem, from
            virtual labs and interactive learning to assessments and analytics,
            using AI and immersive AR/VR technology to help students, educators,
            and institutions deliver hands-on, future-ready science, technology,
            engineering, and mathematics education anywhere in the world.
          </p>
        </motion.div>

        {/* Ecosystem pillars */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ step, name, desc, Icon, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl p-6 pt-7 border shadow-[0_10px_30px_-18px_rgba(2,52,90,0.35)] transition-transform duration-300 hover:-translate-y-1.5"
              style={{
                background: `linear-gradient(160deg, ${color}12 0%, #ffffff 60%)`,
                borderColor: `${color}2b`,
              }}
            >
              {/* Colored glow on hover */}
              <div
                className="absolute -bottom-14 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-45 transition-opacity duration-300 pointer-events-none"
                style={{ background: color }}
              />
              {/* Big ghost step number */}
              <span
                className="absolute -top-3 right-3 font-display font-black text-[5rem] leading-none select-none pointer-events-none"
                style={{ color, opacity: 0.12 }}
              >
                {step}
              </span>

              {/* Vibrant icon tile */}
              <span
                className="relative flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  boxShadow: `0 12px 22px -8px ${color}99`,
                }}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
              </span>

              <h3 className="relative mt-6 font-display font-bold text-secondary text-lg leading-tight">
                {name}
              </h3>
              <p className="relative mt-1.5 text-gray-500 text-sm font-medium leading-snug">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
