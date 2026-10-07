"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroStats } from "@/data/stats";
import { CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";

const PERSONAL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "rediffmail.com", "ymail.com", "live.com", "icloud.com",
];

const FloatingInput = ({
  name, label, type = "text", required = false, isTextArea = false, value, onChange, error
}: {
  name: string, label: string, type?: string, required?: boolean, isTextArea?: boolean, value: string, onChange: (val: string) => void, error?: string
}) => {
  return (
    <div className="relative pt-4 pb-1 w-full">
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`peer w-full bg-transparent text-ink font-medium text-[16px] pb-2 border-b transition-colors outline-none resize-none
            ${error ? 'border-red-500 bg-red-50' : 'border-ink/20 focus:border-amber'}
          `}
          placeholder=" "
          rows={1}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`peer w-full bg-transparent text-ink font-medium text-[16px] pb-2 border-b transition-colors outline-none
            ${error ? 'border-red-500 bg-red-50' : 'border-ink/20 focus:border-amber'}
          `}
          placeholder=" "
        />
      )}

      {/* Floating label */}
      <label className={`absolute left-0 transition-all pointer-events-none
        ${value ? '-top-2 text-[12px] font-semibold text-ink/80' : 'top-3 text-[14px] font-medium text-ink/60'}
        peer-focus:-top-2 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-amber
        ${error ? '!text-red-500' : ''}
      `}>
        {label} {required && <span className="text-amber ml-1">*</span>}
      </label>

      {error && (
        <div className="absolute -bottom-3 left-0 text-[10px] font-semibold text-red-500 uppercase tracking-wider">
          {error}
        </div>
      )}
    </div>
  );
};

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  // Form State
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "", designation: "", company: "", email: "", phone: "",
    facilityType: "", model: "", area: "", message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.designation) newErrors.designation = "Required";
    if (!formData.company) newErrors.company = "Required";
    if (!formData.phone) {
      newErrors.phone = "Required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Must be exactly 10 digits";
    } else if (!/^[6-9]/.test(formData.phone)) {
      newErrors.phone = "Invalid Indian mobile number";
    }

    if (!formData.email) {
      newErrors.email = "Required";
    } else {
      const domain = formData.email.split("@")[1]?.toLowerCase();
      if (PERSONAL_DOMAINS.includes(domain)) {
        newErrors.email = "Corporate email required";
      }
    }

    if (!formData.facilityType) newErrors.facilityType = "Required";
    if (!formData.model) newErrors.model = "Required";
    if (!formData.area) newErrors.area = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);

      const custom_metadata: Record<string, string> = {};
      const standardKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_name", "utm_content", "utm_term", "success"];
      for (const [key, value] of Array.from(urlParams.entries())) {
        if (!standardKeys.includes(key)) {
          custom_metadata[key] = value;
        }
      }

      const payload = {
        ...formData,
        utm_source: urlParams.get("utm_source") || "Direct",
        utm_medium: urlParams.get("utm_medium") || "Website",
        utm_campaign: urlParams.get("utm_campaign") || "Landing-Page",
        utm_name: urlParams.get("utm_name") || "Hero-Form",
        is_qr_scan: urlParams.get("_qr") === "1" || urlParams.get("source") === "qrcode",
        custom_metadata
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      setSuccess(true);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "form",
          facility_type: formData.facilityType,
          engagement_model: formData.model,
        });
      }
    } catch {
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <section
        id="enquire"
        ref={containerRef}
        className="relative min-h-[100vh] flex flex-col overflow-hidden bg-ink"
      >
        {/* Deep Parallax Background */}
        <motion.div
          className="absolute inset-0 z-0 w-full h-[120%]"
          style={{ y: yBg }}
        >
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=85&w=2940&auto=format&fit=crop"
            alt="Casagrand Industrial Park interior"
            fill
            unoptimized
            className="object-cover object-center"
            priority
          />
          {/* Aggressive gradient for legibility of scattered stats */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(27,29,31,0.2) 0%, rgba(27,29,31,0.85) 75%, #1B1D1F 100%)",
            }}
          />
        </motion.div>

        {/* Content */}
        <div
          className="relative z-10 flex-1 flex flex-col justify-center w-full px-4 md:px-8 lg:px-12 pt-32 pb-24"
        >
          <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Text */}
            <div className="flex-1 w-full flex flex-col">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 mb-6 lg:mb-8"
              >
                <span className="block w-8 h-[1px] bg-amber" />
                <span className="text-[10px] font-semibold text-white/70 uppercase tracking-[0.2em]">
                  Industrial & Warehousing
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[44px] sm:text-[54px] md:text-[70px] lg:text-[80px] font-light text-white leading-[1.05] md:leading-[0.95] tracking-[-0.04em] mb-6 lg:mb-10 w-full"
              >
                Grade-A space, <br className="hidden sm:block" />
                <span className="text-amber">built around you.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-8"
              >
                <p className="text-[14px] md:text-[15px] font-medium text-white/80 max-w-[40ch] leading-relaxed drop-shadow-md">
                  Delivered under one accountable framework, backed by 22 years of execution discipline.
                </p>
              </motion.div>

              {/* Desktop Stats (Moved to Left Column) */}
              <div className="hidden md:flex flex-col gap-6 mt-10 lg:mt-14 w-full max-w-[640px]">
                {/* Top 3 items: Spaced out cleanly across full width */}
                <div className="flex flex-row items-start justify-between gap-8 lg:gap-10">
                  {heroStats.slice(0, 3).map((stat: { value: string; label: string }, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-start"
                    >
                      <span className="text-[26px] lg:text-[34px] font-bold text-amber leading-none tracking-tight drop-shadow-lg">
                        {stat.value}
                      </span>
                      <span className="text-[10px] lg:text-[11px] font-semibold text-white/90 uppercase mt-2 whitespace-nowrap drop-shadow-md">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* 4th item single line highlighted & centered */}
                {heroStats.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-4 flex items-center justify-center w-full text-center"
                  >
                    <span className="text-[11px] lg:text-[13px] font-semibold text-white/90 uppercase tracking-wider whitespace-nowrap drop-shadow-md flex items-center">
                      <span className="mr-2">{heroStats[3].label}</span>
                      <span className="text-amber font-bold text-[15px] lg:text-[18px] drop-shadow-lg">
                        {heroStats[3].value}
                      </span>
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-[500px] shrink-0"
            >
              {success ? (
                <div
                  className="bg-white p-8 rounded-2xl border border-ink/10 shadow-2xl flex flex-col items-start"
                >
                  <div className="w-12 h-12 border-2 border-ink/20 rounded-full flex items-center justify-center mb-6 bg-green-50">
                    <CheckCircle2 size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-[32px] md:text-[40px] font-medium text-ink mb-4">Request Secured.</h3>
                  <p className="text-[16px] text-ink/70 font-medium max-w-[40ch] mb-8 leading-relaxed">
                    An executive from the industrial team will contact you shortly with preliminary site availability.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({ name: "", designation: "", company: "", email: "", phone: "", facilityType: "", model: "", area: "", message: "" });
                    }}
                    className="px-6 py-3 border border-ink/20 text-ink text-[12px] font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors rounded"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-ink/10 shadow-2xl w-full">
                  <div className="mb-6">
                    <h3 className="text-[20px] font-medium text-ink">Initiate a discussion</h3>
                    <p className="text-[12px] text-ink/60 mt-1 font-medium">Submit your requirements for a bespoke proposal.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                    <FloatingInput name="name" label="Full Name" required value={formData.name} onChange={(v) => handleChange("name", v)} error={errors.name} />
                    <FloatingInput name="email" label="Corporate Email" type="email" required value={formData.email} onChange={(v) => handleChange("email", v)} error={errors.email} />

                    <FloatingInput name="company" label="Company Name" required value={formData.company} onChange={(v) => handleChange("company", v)} error={errors.company} />
                    <FloatingInput name="designation" label="Designation" required value={formData.designation} onChange={(v) => handleChange("designation", v)} error={errors.designation} />

                    <FloatingInput name="phone" label="Phone Number" required value={formData.phone} onChange={(v) => handleChange("phone", v.replace(/\D/g, '').slice(0, 10))} error={errors.phone} />

                    <div className="relative pt-4 pb-1 w-full">
                      <label className={`absolute left-0 -top-2 text-[12px] font-semibold transition-colors ${errors.facilityType ? 'text-red-500' : 'text-ink/80'}`}>
                        Type of Facility <span className="text-amber">*</span>
                      </label>
                      <div className="relative w-full">
                        <select
                          className={`w-full bg-transparent text-ink font-medium text-[16px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.facilityType ? 'border-red-500 bg-red-50' : 'border-ink/20 focus:border-amber'}
                        `}
                          value={formData.facilityType}
                          onChange={(e) => handleChange("facilityType", e.target.value)}
                        >
                          <option value="" className="text-ink/60 bg-white">Select...</option>
                          {["Manufacturing facility", "Warehouse", "Both", "Not sure yet"].map((o) => <option key={o} value={o} className="text-black bg-white">{o}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                      {errors.facilityType && (
                        <div className="absolute -bottom-3 left-0 text-[10px] font-semibold text-red-500 uppercase tracking-wider">
                          {errors.facilityType}
                        </div>
                      )}
                    </div>

                    <div className="relative pt-4 pb-1 w-full">
                      <label className={`absolute left-0 -top-2 text-[12px] font-semibold transition-colors ${errors.model ? 'text-red-500' : 'text-ink/80'}`}>
                        Engagement Model <span className="text-amber">*</span>
                      </label>
                      <div className="relative w-full">
                        <select
                          className={`w-full bg-transparent text-ink font-medium text-[16px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.model ? 'border-red-500 bg-red-50' : 'border-ink/20 focus:border-amber'}
                        `}
                          value={formData.model}
                          onChange={(e) => handleChange("model", e.target.value)}
                        >
                          <option value="" className="text-ink/60 bg-white">Select...</option>
                          {["Ready to move in", "Built-to-suit (BTS)", "Plug & play", "No preferences"].map((o) => <option key={o} value={o} className="text-black bg-white">{o}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                      {errors.model && (
                        <div className="absolute -bottom-3 left-0 text-[10px] font-semibold text-red-500 uppercase tracking-wider">{errors.model}</div>
                      )}
                    </div>

                    <div className="relative pt-4 pb-1 w-full">
                      <label className={`absolute left-0 -top-2 text-[12px] font-semibold transition-colors ${errors.area ? 'text-red-500' : 'text-ink/80'}`}>
                        Size Requirement <span className="text-amber">*</span>
                      </label>
                      <div className="relative w-full">
                        <select
                          className={`w-full bg-transparent text-ink font-medium text-[16px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.area ? 'border-red-500 bg-red-50' : 'border-ink/20 focus:border-amber'}
                        `}
                          value={formData.area}
                          onChange={(e) => handleChange("area", e.target.value)}
                        >
                          <option value="" className="text-ink/60 bg-white">Select...</option>
                          {["25,000 - 50,000 sq. ft.", "50,000 - 75,000 sq. ft.", "75,000 - 1,00,000 sq. ft.", "1,00,000 above sq. ft."].map((o) => <option key={o} value={o} className="text-black bg-white">{o}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                      {errors.area && (
                        <div className="absolute -bottom-3 left-0 text-[10px] font-semibold text-red-500 uppercase tracking-wider">{errors.area}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2 pt-1">
                      <FloatingInput name="message" label="Any specific infrastructure requirements?" isTextArea value={formData.message} onChange={(v) => handleChange("message", v)} />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 flex justify-between items-center gap-4 border-t border-ink/5">
                    <p className="text-[10px] text-ink/50 leading-tight hidden sm:block w-1/2 font-medium">
                      An executive will reach out to discuss availability and next steps.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex flex-row justify-center items-center bg-amber text-ink hover:bg-ink hover:text-white transition-colors px-6 py-3 w-full sm:w-auto disabled:opacity-50 rounded-md"
                    >
                      <span className="text-[11px] uppercase tracking-widest font-bold mr-3">{submitting ? "Sending…" : "Request Callback"}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>

      </section>

      {/* Mobile Stats Strip (Rendered sequentially below Hero) */}
      <div className="md:hidden w-full bg-ink py-8 px-4 border-b border-white/5 relative z-20">
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {/* Top 3 Stats in a clean 3-column row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {heroStats.slice(0, 3).map((stat: { value: string; label: string }, i: number) => (
              <motion.div
                key={`mob-strip-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center px-1"
              >
                <span className="text-[22px] sm:text-[26px] font-bold text-amber leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-white/70 uppercase mt-2 leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 4th Stat: Single Line Highlighted */}
          {heroStats.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="pt-3 border-t border-white/10 flex justify-center text-center"
            >
              <div className="inline-flex items-center flex-wrap justify-center gap-1.5 px-3 py-1.5 text-center">
                <span className="text-[11px] sm:text-[12px] font-semibold text-white/90 uppercase tracking-wider">
                  {heroStats[3].label}
                </span>
                <span className="text-[15px] sm:text-[17px] font-bold text-amber drop-shadow-md">
                  {heroStats[3].value}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
