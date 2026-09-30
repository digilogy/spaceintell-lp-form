import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Lead routing ─────────────────────────────────────────────────────────
    // Target is configurable via environment variable: LEAD_ROUTING_TARGET
    // Supported values: "resend" (default), "webhook", "log", "mysql"
    // Set the target and credentials in .env.local before deploying.
    // ─────────────────────────────────────────────────────────────────────────

    const target = process.env.LEAD_ROUTING_TARGET ?? "log";

    if (target === "mysql") {
      const { getDbPool } = await import("@/lib/db");
      const pool = getDbPool();
      
      const query = `
        INSERT INTO leads 
        (name, email, company, designation, phone, facility_type, engagement_model, area_requirement, message, utm_source, utm_medium, utm_campaign, utm_name, custom_metadata) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        body.name, 
        body.email, 
        body.company, 
        body.designation, 
        body.phone, 
        body.facilityType, 
        body.model, 
        body.area, 
        body.message || "",
        body.utm_source || null,
        body.utm_medium || null,
        body.utm_campaign || null,
        body.utm_name || null,
        body.custom_metadata ? JSON.stringify(body.custom_metadata) : null
      ];
      
      await pool.execute(query, values);
      
    } else if (target === "resend") {
      // Resend email notification
      // Required env vars: RESEND_API_KEY, LEAD_EMAIL_TO
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "leads@casagrnd.in",
        to: process.env.LEAD_EMAIL_TO ?? "industrial@casagrand.co.in",
        subject: `New Enquiry — ${body.company} (${body.facilityType})`,
        html: `
          <h2>New Industrial Enquiry</h2>
          <table>
            ${Object.entries(body)
              .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`)
              .join("")}
          </table>
        `,
      });

    } else if (target === "webhook") {
      // Generic webhook (CRM, Zapier, Make, etc.)
      // Required env vars: WEBHOOK_URL
      const webhookUrl = process.env.WEBHOOK_URL;
      if (!webhookUrl) throw new Error("WEBHOOK_URL env var not set");
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "casagrand-industrial-landing", ...body }),
      });

    } else {
      // "log" — safe fallback, logs to server console
      console.log("[ENQUIRY]", JSON.stringify(body, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ENQUIRY ERROR]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
