"use client";

import { motion } from "framer-motion";

const chatMessages = [
  {
    from: "user",
    text: "Hi! I'd like to learn more about K12 AR Pedia for our primary school.",
    time: "10:32 AM",
  },
  {
    from: "team",
    text: "Hello! Great to hear from you. We'd love to set up a free demo. Which state are you in?",
    time: "10:33 AM",
    read: true,
  },
  {
    from: "user",
    text: "We're in Lagos. When can we get started?",
    time: "10:34 AM",
  },
  {
    from: "team",
    text: "We have coordinators in Lagos. I can arrange a full school demo within 48 hours. Let me connect you now!",
    time: "10:34 AM",
    read: true,
  },
];

function ChatBubble({ msg }) {
  const isUser = msg.from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[82%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser ? "bg-[#25D366] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
          }`}
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-gray-400 text-[10px]">{msg.time}</span>
          {msg.read && (
            <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 7l-1.4-1.4-6.6 6.6-2.6-2.6L6 11l4 4zm-2 0l-1.4-1.4-4.2 4.2 1.4 1.4zM1 11l4 4 1.4-1.4-4-4zm10.5 0.5l-1.4-1.4-1.6 1.6 1.4 1.4z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppSection() {
  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Scattered dots */}
      <div className="absolute top-10 left-12 w-6 h-6 rounded-full bg-green-400/25 pointer-events-none" />
      <div className="absolute top-20 left-24 w-4 h-4 rounded-full bg-emerald-500/20 pointer-events-none" />
      <div className="absolute bottom-12 right-14 w-8 h-8 rounded-full border-2 border-green-400/30 pointer-events-none" />
      <div className="absolute bottom-24 right-28 w-5 h-5 rounded-full bg-green-500/20 pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left – text & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="space-y-7"
          >
            <div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary leading-tight mb-4"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Questions?{" "}
                <span className="text-[#25D366]">Let&apos;s Chat.</span>
              </h2>
              <p
                className="text-gray-700 text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Talk directly with our team — from first question to full school deployment, all on WhatsApp.
              </p>
            </div>

            {/* Big WhatsApp CTA */}
            <div className="space-y-3">
              <a
                href="https://wa.me/2348139622583?text=Hi%2C%20I%27m%20interested%20in%20the%20Blue%20Sands%20K12%20AR%20Pedia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-black rounded-2xl shadow-xl hover:bg-[#1fb558] hover:shadow-2xl transition-all duration-300 text-lg w-full sm:w-auto"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L.057 23.57a.5.5 0 00.603.632l5.913-1.547A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.87 9.87 0 01-5.032-1.375l-.36-.214-3.735.978.995-3.634-.235-.376A9.862 9.862 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z" />
                </svg>
                Chat on WhatsApp
              </a>
              <p className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Typically replies within minutes
              </p>
            </div>
          </motion.div>

          {/* Right – Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative w-72 sm:w-80">
              <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-8 border-gray-800">
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-2xl z-10" />
                <div className="rounded-[1.75rem] overflow-hidden" style={{ background: "#E5DDD5" }}>
                  {/* WhatsApp header */}
                  <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L.057 23.57a.5.5 0 00.603.632l5.913-1.547A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">Blue Sands Team</p>
                      <p className="text-green-300 text-xs">Online</p>
                    </div>
                    <svg className="w-5 h-5 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>

                  {/* Chat area */}
                  <div className="px-3 py-4 space-y-3 min-h-[280px]">
                    <div className="flex justify-center">
                      <span className="bg-white/60 text-gray-500 text-[9px] px-2.5 py-0.5 rounded-full">Today</span>
                    </div>
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                      >
                        <ChatBubble msg={msg} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5">
                      <span className="text-gray-400 text-xs">Type a message…</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-700 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
