"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { featuredParks, secondaryParks, type Park } from "@/data/parks";

const featuredImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop",
];

export default function InventoryAcrossCorridor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredPark, setHoveredPark] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <section id="inventory" className="bg-ink pt-[100px] pb-[150px] overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="section-wrap mb-16">
        <h2 className="text-[40px] md:text-[60px] font-light text-white leading-tight tracking-tight">
          Inventory Across Corridor
        </h2>
      </div>
      {/* ── Featured Parks (Asymmetric Masonry & Layered Typography) ── */}
      <div className="w-full relative">
        {featuredParks.map((park, idx) => {
          const isEven = idx % 2 === 0;

          // Use framer-motion hooks for scroll parallax per image
          const { scrollYProgress } = useScroll();
          // We will just use standard framer-motion props here to keep it clean

          return (
            <div key={park.id} className="relative w-full py-[100px] md:py-[200px] min-h-[80vh] flex items-center">

              {/* Massive Background Typography Layer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20 overflow-hidden">
                <h3 className="text-[120px] md:text-[220px] font-bold text-white whitespace-nowrap tracking-tighter leading-none select-none">
                  {park.name.replace("Casagrand Industrial Park — ", "").toUpperCase()}
                </h3>
              </div>

              {/* Foreground Image & Content */}
              <div className={`relative z-10 w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-0`}>

                {/* Image bleeding off the edge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, margin: "-10%" }}
                  className={`relative w-full md:w-[65%] h-[500px] md:h-[700px] ${isEven ? 'md:-ml-12 lg:-ml-24' : 'md:-mr-12 lg:-mr-24'}`}
                >
                  <Image
                    src={featuredImages[idx]}
                    alt={park.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {/* Legibility Guardrail: Dark scrim at bottom/edges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Content Block overlapping the image */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`w-full md:w-[45%] px-6 md:px-0 ${isEven ? 'md:-ml-[10%]' : 'md:-mr-[10%] z-20'}`}
                >
                  <div className="bg-ink/80 backdrop-blur-md border border-white/10 p-8 md:p-12 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`w-2 h-2 rounded-full bg-${park.statusColor}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        {park.status}
                      </span>
                    </div>

                    <h4 className="text-[32px] md:text-[44px] font-light text-white leading-[1.1] tracking-tight mb-2">
                      {park.name.replace("Casagrand Industrial Park — ", "")}
                    </h4>

                    {park.subtitle && (
                      <p className="text-[14px] md:text-[15px] italic text-amber/90 font-light mb-6">
                        {park.subtitle}
                      </p>
                    )}

                    <div className="space-y-3.5 mb-8 text-[14px] text-white/70 font-light">
                      {park.highlights && (
                        <p><strong className="text-white/90 font-medium">Highlights:</strong> {park.highlights}</p>
                      )}
                      {/* {park.area && <p><strong className="text-white/90 font-medium">Size:</strong> {park.area}</p>} */}
                      {park.type && <p><strong className="text-white/90 font-medium">Type:</strong> {park.type}</p>}
                      {park.industries && <p><strong className="text-white/90 font-medium">Fit for:</strong> {park.industries}</p>}
                    </div>

                    <a
                      href="#enquire"
                      className="inline-flex items-center gap-3 text-[12px] font-semibold text-amber hover:text-white transition-colors uppercase tracking-[0.15em]"
                    >
                      Request Details <ChevronRight size={14} />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Secondary Parks (Dense Typographic List + Hover Image) ── */}
      <div className="section-wrap mt-[100px] relative">
        <h3 className="text-[18px] font-light text-white/50 mb-12 border-b border-white/20 pb-6">
          Further Availability
        </h3>

        <div className="flex flex-col border-b border-white/10">
          {secondaryParks.map((park) => (
            <div
              key={park.id}
              className="group border-t border-white/10 py-6 md:py-10 flex flex-col md:flex-row md:items-center justify-between cursor-pointer transition-colors hover:bg-white/[0.02]"
              onMouseEnter={() => !isMobile && setHoveredPark(park.id)}
              onMouseLeave={() => !isMobile && setHoveredPark(null)}
              onClick={() => isMobile && setHoveredPark(hoveredPark === park.id ? null : park.id)}
            >
              <div className="flex-1">
                <h4 className={`text-[24px] md:text-[36px] font-light transition-colors ${hoveredPark === park.id ? 'text-amber' : 'text-white'}`}>
                  {park.name.replace("Casagrand Industrial Park — ", "")}
                </h4>
                <div className="flex items-center gap-4 mt-3 text-[12px] text-white/50 uppercase tracking-wider">
                  <span>{park.corridor}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className={`text-${park.statusColor}`}>{park.status}</span>
                </div>
              </div>

              {/* Desktop text */}
              <div className="hidden md:block text-[14px] text-white/70 font-light max-w-[300px] text-right">
                {park.industries}
              </div>

              {/* Mobile Fallback: Tap to reveal */}
              {isMobile && (
                <AnimatePresence>
                  {hoveredPark === park.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4 text-[14px] text-white/60 font-light"
                    >
                      <p className="mb-2"><strong className="text-white">Access:</strong> {park.access}</p>
                      <p><strong className="text-white">Fit for:</strong> {park.industries}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hover Image (Desktop Only) */}
      <AnimatePresence>
        {!isMobile && hoveredPark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed pointer-events-none z-50 overflow-hidden border border-white/20 shadow-2xl"
            style={{
              width: 320,
              height: 200,
              left: mousePos.x + 20,
              top: mousePos.y - 100,
            }}
          >
            {/* Generic preview image */}
            <Image
              src="/asset/img/project_1.jpg"
              alt="Preview"
              fill
              className="object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
