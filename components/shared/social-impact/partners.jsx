"use client";

import { motion } from "framer-motion";
import { Building2, Cpu, Users2 } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

const partners = [
  {
    name: "Blue Sands Academy",
    role: "Centre of excellence",
    desc: "Where the AR Pedia model is piloted, refined and proven, and where teachers are trained before scaling to classrooms North and South.",
    Icon: Building2,
    color: "#0483e2",
  },
  {
    name: "CC-HUB Africa",
    role: "Technology & social innovation",
    desc: "One of Africa's foremost technology and social-innovation hubs, strengthening AR Pedia's innovation, design and ecosystem reach across Nigeria.",
    Icon: Cpu,
    color: "#9B5DE5",
  },
  {
    name: "And more",
    role: "Government, CSR & development partners",
    desc: "We also work with NITDA, CSR foundations, NGOs and development partners to reach the communities that need it most.",
    Icon: Users2,
    color: "#3DD68C",
  },
];

export default function ImpactPartners() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <SectionKicker>Our partners</SectionKicker>
          <h2 className="mt-3 font-display font-bold text-secondary leading-tight text-3xl sm:text-4xl lg:text-5xl">
            Built with partners who share the{" "}
            <span className="text-primary doodle-underline">mission</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {partners.map(({ name, role, desc, Icon, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl bg-cream p-7 lg:p-8 border-2 shadow-sm hover:shadow-lg transition-shadow"
              style={{ borderColor: `${color}22` }}
            >
              <span
                className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ background: `${color}1a`, color }}
              >
                <Icon className="w-7 h-7" strokeWidth={2.1} />
              </span>
              <h3 className="mt-5 font-display font-bold text-secondary text-xl leading-tight">
                {name}
              </h3>
              <p
                className="mt-1 text-xs font-bold uppercase tracking-wide"
                style={{ color }}
              >
                {role}
              </p>
              <p className="mt-3 text-gray-600 text-sm font-semibold leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
