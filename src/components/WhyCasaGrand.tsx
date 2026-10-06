"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WhyCasaGrand() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section 
      ref={containerRef}
      id="why" 
      className="bg-paper py-[100px] md:py-[150px] overflow-hidden"
    >
      <div className="section-wrap grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Architectural Image (Fills the empty space) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[400px] lg:h-[600px]"
        >
          <Image
            src="/asset/img/industrial_banner.jpg"
            alt="Casagrand Framework"
            fill
            unoptimized
            className="object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-paper/20 mix-blend-overlay" />
        </motion.div>

        {/* Right: Editorial Text */}
        <motion.div 
          style={{ y, opacity }}
          className="flex flex-col gap-10"
        >
          <div className="flex items-center gap-4 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-ink" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ink">
              The CasaGrand Framework
            </span>
          </div>

          <p className="text-[28px] md:text-[36px] lg:text-[42px] font-light text-ink leading-[1.2] tracking-tight text-balance">
            The industrial vertical of the Casagrand Group - bringing the execution discipline of 12 industrial parks to South India’s premier manufacturing corridors.
          </p>

          <p className="text-[16px] md:text-[18px] text-steel font-light leading-relaxed">
            Facilities delivered for <strong className="font-medium text-ink">Pegatron, VinFast, Royal Enfield, BYD,</strong> and 25+ other occupants. Every park has been planned, delivered and managed under one framework since 2014.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
