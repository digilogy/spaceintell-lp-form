"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

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
          className={`peer w-full bg-transparent text-ink font-light text-[15px] pb-2 border-b transition-colors outline-none resize-none
            ${error ? 'border-red-600 bg-red-50/50' : 'border-ink/20 focus:border-amber'}
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
          className={`peer w-full bg-transparent text-ink font-light text-[15px] pb-2 border-b transition-colors outline-none
            ${error ? 'border-red-600 bg-red-50/50' : 'border-ink/20 focus:border-amber'}
          `}
          placeholder=" "
        />
      )}

      {/* Floating label */}
      <label className={`absolute left-0 transition-all pointer-events-none
        ${value ? '-top-1 text-[10px] font-medium text-ink/60' : 'top-3 text-[14px] font-light text-ink/40'}
        peer-focus:-top-1 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-amber
        ${error ? '!text-red-600' : ''}
      `}>
        {label} {required && <span className="text-amber ml-1">*</span>}
      </label>

      {error && (
        <div className="absolute -bottom-3 left-0 text-[10px] font-medium text-red-600 uppercase tracking-wider">
          {error}
        </div>
      )}
    </div>
  );
};

export default function ConversionSection() {
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "", designation: "", company: "", email: "", phone: "",
    facilityType: "", model: "", area: "", message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "true") {
        setSuccess(true);
      }
    }
  }, []);

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
        utm_source: urlParams.get("utm_source") || "Organic",
        utm_medium: urlParams.get("utm_medium") || "Website",
        utm_campaign: urlParams.get("utm_campaign") || "Landing Page",
        utm_name: urlParams.get("utm_name") || "Enquiry Form",
        utm_content: urlParams.get("utm_content") || "",
        utm_term: urlParams.get("utm_term") || "",
        custom_metadata
      };

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      
      try {
        if (typeof window !== "undefined") {
          if ((window as any).gtag) {
            (window as any).gtag("event", "generate_lead", {
              event_category: "form",
              facility_type: formData.facilityType,
              engagement_model: formData.model,
            });
          }
          window.location.href = "/thank-you";
        }
      } catch (err) {
        console.warn("Non-critical error during success tracking:", err);
        setSuccess(true);
      }
      
    } catch (err: any) {
      console.error("[FORM SUBMISSION ERROR]", err);
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
    <section id="enquire" className="bg-paper border-t border-line min-h-screen flex items-center justify-center py-12 md:py-20 relative">
      <div className="section-wrap w-full">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

          {/* Left Context Column - Merged Header and Text */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink/40">Proposal Request</span>
              <div className="w-2 h-2 rounded-full bg-amber" />
            </div>

            <h2 className="text-[48px] lg:text-[72px] font-light text-ink leading-[0.95] tracking-tighter mb-8">
              Initiate a <br className="hidden lg:block" />discussion.
            </h2>

            <p className="text-[16px] md:text-[18px] font-light text-ink/70 leading-snug max-w-[30ch]">
              Submit your requirements. Our industrial team will assemble a bespoke facility proposal aligned to your operation.
            </p>
          </div>

          {/* Right Form Column - Hyper Compact Grid */}
          <div className="w-full lg:w-[60%]">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start"
              >
                <div className="w-12 h-12 border-2 border-ink rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={24} className="text-ink" />
                </div>
                <h3 className="text-[32px] md:text-[40px] font-light text-ink mb-4">Request Secured.</h3>
                <p className="text-[16px] text-steel font-light max-w-[40ch] mb-8 leading-relaxed">
                  An executive from the industrial team will contact you shortly with preliminary site availability.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ name: "", designation: "", company: "", email: "", phone: "", facilityType: "", model: "", area: "", message: "" });
                  }}
                  className="btn-ghost !border-line !text-ink hover:!border-ink hover:!bg-transparent text-[12px] py-3 px-6"
                >
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="w-full block bg-white/50 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-ink/5 shadow-sm">

                {/* Ultra tightly packed 2-column grid */}
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">

                  <FloatingInput name="name" label="Full Name" required value={formData.name} onChange={(v) => handleChange("name", v)} error={errors.name} />
                  <FloatingInput name="email" label="Corporate Email" type="email" required value={formData.email} onChange={(v) => handleChange("email", v)} error={errors.email} />

                  <FloatingInput name="company" label="Company Name" required value={formData.company} onChange={(v) => handleChange("company", v)} error={errors.company} />
                  <FloatingInput name="designation" label="Designation" required value={formData.designation} onChange={(v) => handleChange("designation", v)} error={errors.designation} />

                  <FloatingInput name="phone" label="Phone Number" required value={formData.phone} onChange={(v) => handleChange("phone", v.replace(/\D/g, '').slice(0, 10))} error={errors.phone} />

                  {/* Select: Type of Facility */}
                  <div className="relative pt-4 pb-1 w-full">
                    <label className={`absolute left-0 -top-1 text-[10px] font-medium transition-colors ${errors.facilityType ? 'text-red-600' : 'text-ink/40'}`}>
                      Type of Facility <span className="text-amber">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        className={`w-full bg-transparent text-ink font-light text-[15px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.facilityType ? 'border-red-600 bg-red-50/50' : 'border-ink/20 focus:border-amber'}
                        `}
                        value={formData.facilityType}
                        onChange={(e) => handleChange("facilityType", e.target.value)}
                      >
                        <option value="" className="text-ink/30">Select...</option>
                        {["Manufacturing facility", "Warehouse", "Both", "Not sure yet"].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    {errors.facilityType && (
                      <div className="absolute -bottom-3 left-0 text-[10px] font-medium text-red-600 uppercase tracking-wider">
                        {errors.facilityType}
                      </div>
                    )}
                  </div>

                  {/* Select: Engagement Model */}
                  <div className="relative pt-4 pb-1 w-full">
                    <label className={`absolute left-0 -top-1 text-[10px] font-medium transition-colors ${errors.model ? 'text-red-600' : 'text-ink/40'}`}>
                      Engagement Model <span className="text-amber">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        className={`w-full bg-transparent text-ink font-light text-[15px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.model ? 'border-red-600 bg-red-50/50' : 'border-ink/20 focus:border-amber'}
                        `}
                        value={formData.model}
                        onChange={(e) => handleChange("model", e.target.value)}
                      >
                        <option value="" className="text-ink/30">Select...</option>
                        {["Ready to move in", "Built-to-suit (BTS)", "Plug & play", "No preferences"].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    {errors.model && (
                      <div className="absolute -bottom-3 left-0 text-[10px] font-medium text-red-600 uppercase tracking-wider">{errors.model}</div>
                    )}
                  </div>

                  {/* Select: Size Requirement */}
                  <div className="relative pt-4 pb-1 w-full">
                    <label className={`absolute left-0 -top-1 text-[10px] font-medium transition-colors ${errors.area ? 'text-red-600' : 'text-ink/40'}`}>
                      Size Requirement <span className="text-amber">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        className={`w-full bg-transparent text-ink font-light text-[15px] pb-2 border-b outline-none transition-colors cursor-pointer appearance-none
                          ${errors.area ? 'border-red-600 bg-red-50/50' : 'border-ink/20 focus:border-amber'}
                        `}
                        value={formData.area}
                        onChange={(e) => handleChange("area", e.target.value)}
                      >
                        <option value="" className="text-ink/30">Select...</option>
                        {["25,000 - 50,000 sq. ft.", "50,000 - 75,000 sq. ft.", "75,000 - 1,00,000 sq. ft.", "1,00,000 above sq. ft."].map((o) => <option key={o} value={o}>{o}</option>)}

                        {/* {["Below 10,000 sq. ft.", "10,000–30,000 sq. ft.", "30,000–1,00,000 sq. ft.", "Above 1,00,000 sq. ft."].map((o) => <option key={o} value={o}>{o}</option>)} */}
                      </select>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                    {errors.area && (
                      <div className="absolute -bottom-3 left-0 text-[10px] font-medium text-red-600 uppercase tracking-wider">{errors.area}</div>
                    )}
                  </div>

                  {/* Full width Message */}
                  <div className="md:col-span-2 pt-1">
                    <FloatingInput name="message" label="Any specific infrastructure requirements?" isTextArea value={formData.message} onChange={(v) => handleChange("message", v)} />
                  </div>
                </div>

                {/* Tightly packed CTA row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6 border-t border-ink/5">
                  <p className="text-[9px] text-ink/40 uppercase tracking-widest max-w-[35ch] text-center sm:text-left order-2 sm:order-1">
                    An executive will reach out to discuss availability and next steps.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="group order-1 sm:order-2 flex flex-row justify-between items-center bg-ink text-white hover:bg-amber transition-colors px-6 py-3 w-full sm:w-auto min-w-[200px] disabled:opacity-50 rounded-md"
                  >
                    <span className="text-[11px] uppercase tracking-widest font-semibold">{submitting ? "Sending Request…" : "Request a Callback"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
