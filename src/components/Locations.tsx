"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { corridors } from "@/data/corridors";

export default function Locations() {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="locations" className="bg-ink py-[150px] overflow-hidden relative">
      {/* Background ambient glow effect based on active state */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: active ? "radial-gradient(circle at 50% 50%, rgba(226,166,59,0.03) 0%, transparent 70%)" : "transparent"
        }}
      />

      <div className="section-wrap relative z-10">

        <div className="flex items-center gap-4 mb-24 opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white">
            Strategic Corridors
          </span>
        </div>

        {/* Massive Typographic Interactive List */}
        <div className="flex flex-col border-b border-white/10">
          {corridors.map((corridor, idx) => {
            const isActive = active === corridor.id;

            return (
              <div
                key={corridor.id}
                className="group border-t border-white/10 py-8 md:py-12 cursor-pointer relative"
                onMouseEnter={() => !isMobile && setActive(corridor.id)}
                onMouseLeave={() => !isMobile && setActive(null)}
                onClick={() => isMobile && setActive(isActive ? null : corridor.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  {/* Name — Outline Text */}
                  <h3
                    className={`text-[34px] sm:text-[50px] md:text-[50px] font-bold tracking-tight uppercase leading-tight md:leading-none transition-all duration-500 break-words
                      ${isActive ? 'text-amber' : 'text-outline'}
                    `}
                    style={isActive ? { WebkitTextStroke: "0px transparent" } : {}}
                  >
                    {corridor.name.split(" / ")[0]}
                  </h3>

                  {/* Metadata block */}
                  <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'} text-right`}>
                    <p className="text-[14px] text-white/80 font-medium mb-1">
                      {corridor.city}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">
                      {corridor.parks} {corridor.parks === 1 ? "Park" : "Parks"}
                    </p>
                  </div>
                </div>

                {/* Details Reveal (Inline for Mobile, Absolute/Floating for Desktop if desired, but inline is clean for both here given the scale) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 md:pt-12 pb-4">
                        <div className="max-w-[600px] border-l-2 border-amber pl-6">
                          <p className="text-[18px] md:text-[22px] font-light text-white/80 leading-relaxed text-balance">
                            {corridor.highlight}
                          </p>
                          <a
                            href="#inventory"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-amber hover:text-white transition-colors"
                          >
                            View Available Assets →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
