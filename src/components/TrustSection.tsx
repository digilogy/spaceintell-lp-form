"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { tenantLogos } from "@/data/logos";
import { trustStats } from "@/data/stats";

// Helper component for count-up animation with consistent color
const CountUpNumeral = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const prefixMatch = value.match(/^[^0-9]+/);
  const prefix = prefixMatch ? prefixMatch[0] : "";
  const suffix = value.replace(/^[^0-9]+|[0-9,]/g, "");
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);

  useEffect(() => {
    if (isInView && !isNaN(numericValue) && ref.current) {
      const controls = animate(0, numericValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value).toLocaleString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, numericValue]);

  if (isNaN(numericValue)) return <span>{value}</span>;

  return (
    <span>
      {prefix && <span className="font-light tracking-tight pr-[1px]">{prefix}</span>}
      <span ref={ref}>0</span>
      {suffix && <span className="text-amber font-light tracking-tight ml-[2px]">{suffix}</span>}
    </span>
  );
};

export default function TrustSection() {
  return (
    <section className="bg-paper py-[150px] overflow-hidden">

      {/* BESPOKE SINGLE-ROW ANCHORED STATS */}
      {/* <div className="w-full mb-[200px]">
        <div className="section-wrap">
          
          <div className="hidden md:grid grid-cols-[auto_auto_auto_auto] justify-between border-b border-ink/10 pb-16 gap-y-4">
            
            {trustStats.map((_, i) => (
              <motion.div 
                key={`tick-${i}`} 
                className="self-end mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="w-6 h-[2px] bg-amber" />
              </motion.div>
            ))}

            {trustStats.map((stat, i) => {
              const isAnchor = i === 1; // 6M+
              
              return (
                <motion.div
                  key={`num-${i}`}
                  className={`self-baseline text-ink leading-[0.85] tracking-tighter font-sans whitespace-nowrap
                    ${isAnchor ? 'text-[80px] lg:text-[130px] font-medium' : 'text-[50px] lg:text-[70px] font-light'}
                  `}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                >
                  <CountUpNumeral value={stat.value} />
                </motion.div>
              );
            })}

            {trustStats.map((stat, i) => (
              <motion.div
                key={`label-${i}`}
                className="self-start mt-4 text-[10px] font-semibold text-ink/60 uppercase tracking-[0.2em] leading-relaxed max-w-[15ch]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
              >
                {stat.label}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col md:hidden gap-16 border-b border-ink/10 pb-16">
            {trustStats.map((stat, i) => {
              const isAnchor = i === 1;
              return (
                <motion.div
                  key={`mob-${i}`}
                  className="flex flex-col items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="w-6 h-[2px] bg-amber mb-6" />
                  <div className={`text-ink leading-[0.85] tracking-tighter font-sans whitespace-nowrap mb-4 ${isAnchor ? 'text-[80px] font-medium' : 'text-[50px] font-light'}`}>
                    <CountUpNumeral value={stat.value} />
                  </div>
                  <div className="text-[10px] font-semibold text-ink/60 uppercase tracking-[0.2em] leading-relaxed max-w-[15ch]">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div> */}

      <div className="section-wrap">
        {/* Occupants Logo Lockups */}
        <div className="border-t border-line pt-24">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <h2 className="text-[32px] md:text-[44px] font-light text-ink leading-tight max-w-[20ch]">
              Trusted by India's Leading Manufacturers &amp; Logistics Operation
            </h2>
            <p className="text-[14px] text-steel/70 max-w-[40ch] font-light">
              From Fortune 500 electronics manufacturers to leading 3PL providers, Casagrand delivers the infrastructure required for seamless, scalable operations.
            </p>
          </div>

          {/* TABS */}
          {/* KINETIC MARQUEE LAYOUT */}
          <div className="w-full relative py-12 overflow-hidden flex flex-col gap-8 md:gap-12">
            <style>{`
              @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes marquee-right {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
              }
              .animate-marquee-left {
                animation: marquee-left 40s linear infinite;
              }
              .animate-marquee-right {
                animation: marquee-right 40s linear infinite;
              }
              .pause-on-hover:hover {
                animation-play-state: paused;
              }
            `}</style>

            {tenantLogos.map((cat, idx) => {
              // Duplicate the array multiple times to ensure the marquee never runs out of content
              const repeatedCompanies = [...cat.companies, ...cat.companies, ...cat.companies, ...cat.companies];
              const isLeft = idx % 2 === 0;

              return (
                <div key={cat.category} className="flex flex-col relative w-full overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

                  <div className="mb-4 md:mb-6 pl-4 md:pl-8 flex items-center gap-4 relative z-20">
                    <h4 className="text-[13px] md:text-[15px] font-bold tracking-[0.15em] uppercase text-ink/70">
                      {cat.category}
                    </h4>
                    <div className="h-px bg-line flex-1 max-w-[200px]" />
                  </div>

                  <div className={`flex w-max ${isLeft ? 'animate-marquee-left' : 'animate-marquee-right'} pause-on-hover`}>
                    {repeatedCompanies.map((company, cIdx) => {
                      return (
                        <div key={`${company.name}-${cIdx}`} className="flex items-center group cursor-default px-2 md:px-3">
                          <div className="border border-line bg-white px-4 md:px-6 py-2 rounded-[2px] transition-all duration-500 group-hover:border-amber group-hover:shadow-md flex items-center justify-center min-w-[160px] md:min-w-[200px] h-[70px] md:h-[90px]">
                            <Image
                              src={company.image}
                              alt={company.name}
                              width={160}
                              height={60}
                              className="object-contain max-h-[35px] md:max-h-[50px] w-auto  transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
