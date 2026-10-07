import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Standardize UTM parameter defaults
    body.utm_source = body.utm_source || "Organic";
    body.utm_medium = body.utm_medium || "Website";
    body.utm_campaign = body.utm_campaign || "Landing Page";
    body.utm_name = body.utm_name || "Enquiry Form";
    body.utm_content = body.utm_content || "";
    body.utm_term = body.utm_term || "";

    // ── Dynamic Subdomain / QR Scan Detection ────────────────────────────────
    // Detects whether the enquiry is:
    // 1. "QRCODE" - if scanned from QR shortlink (_qr=1), or payload includes is_qr_scan,
    //    or request comes from qrcode.casagrandindustrial.co.in,
    //    or incoming UTM parameters match a registered QR Code destination URL in DB.
    // 2. "QRCAMP" - if request host is qrcamp.casagrandindustrial.co.in or default campaign.
    // 3. "CIP" - if request host is cip.casagrandindustrial.co.in.
    // 4. "LP" - if request host is lp.casagrandindustrial.co.in.
    // ─────────────────────────────────────────────────────────────────────────

    const detectAppTag = async (): Promise<string> => {
      // 1. Direct explicit QR scan flag (set via QR shortlink redirect marker _qr=1)
      if (body.is_qr_scan || body._qr === "1" || body._qr === 1) {
        return "QRCODE";
      }

      const hostHeader = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
      const refererHeader = (request.headers.get("referer") || "").toLowerCase();
      const sourceDomain = (body.source_domain || "").toLowerCase();

      // 2. Specific Subdomain / Host Header Checks
      if (
        hostHeader.startsWith("qrcode.") ||
        sourceDomain.startsWith("qrcode.") ||
        refererHeader.includes("qrcode.casagrandindustrial")
      ) {
        return "QRCODE";
      }

      if (
        hostHeader.startsWith("cip.") ||
        sourceDomain.startsWith("cip.") ||
        refererHeader.includes("cip.casagrandindustrial")
      ) {
        return "CIP";
      }

      if (
        hostHeader.startsWith("lp.") ||
        sourceDomain.startsWith("lp.") ||
        refererHeader.includes("lp.casagrandindustrial")
      ) {
        return "LP";
      }

      // 3. Dynamic Database Match against registered QR Codes
      try {
        const { getDbPool } = await import("@/lib/db");
        const pool = getDbPool();
        
        let qrRows: Array<{ destinationUrl: string }> = [];
        try {
          const [rows] = await pool.query("SELECT destinationUrl FROM QRCode");
          qrRows = rows as Array<{ destinationUrl: string }>;
        } catch {
          try {
            const [rows] = await pool.query("SELECT destinationUrl FROM qrcode");
            qrRows = rows as Array<{ destinationUrl: string }>;
          } catch {
            const [rows] = await pool.query("SELECT destinationUrl FROM qrcodes");
            qrRows = rows as Array<{ destinationUrl: string }>;
          }
        }

        if (qrRows && qrRows.length > 0) {
          const isMatched = qrRows.some((qr) => {
            try {
              const u = new URL(qr.destinationUrl);
              let paramMatch = false;

              for (const [key, val] of Array.from(u.searchParams.entries())) {
                let leadVal = body[key];
                if (leadVal === undefined && body.custom_metadata) {
                  leadVal = body.custom_metadata[key];
                }
                if (leadVal === undefined || leadVal === null || leadVal === "") {
                  return false;
                }
                if (String(leadVal).toLowerCase() !== String(val).toLowerCase()) {
                  return false;
                }
                paramMatch = true;
              }

              return paramMatch;
            } catch {
              return false;
            }
          });

          if (isMatched) {
            return "QRCODE";
          }
        }
      } catch (dbErr) {
        console.error("[QR DB MATCH ERROR]", dbErr);
      }

      // 4. Default to QRCAMP for direct campaign visits
      return "QRCAMP";
    };

    const appTag = await detectAppTag();
    const target = process.env.LEAD_ROUTING_TARGET ?? "log";

    // Prepare all fields for email notification table (standard fields + custom metadata fields)
    const displayFields: Array<[string, any]> = [];
    const internalKeys = ["custom_metadata", "source_domain", "page_url", "is_qr_scan", "_qr", "appTag", "success"];

    for (const [k, v] of Object.entries(body)) {
      if (!internalKeys.includes(k)) {
        displayFields.push([k, v]);
      }
    }

    if (body.custom_metadata && typeof body.custom_metadata === "object") {
      for (const [k, v] of Object.entries(body.custom_metadata)) {
        if (!internalKeys.includes(k) && !displayFields.some(([existingKey]: [string, any]) => existingKey === k)) {
          displayFields.push([k, v]);
        }
      }
    }

    // Helper to send email notification using Nodemailer / SMTP credentials from .env
    const sendSmtpEmail = async () => {
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        console.warn("[SMTP SKIPPED] SMTP_USER or SMTP_PASS environment variable is missing.");
        return;
      }

      const nodemailer = require("nodemailer");
      const port = Number(process.env.SMTP_PORT) || 465;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const tagDomainMap: Record<string, string> = {
        QRCODE: "qrcode.casagrandindustrial.co.in",
        QRCAMP: "qrcamp.casagrandindustrial.co.in",
        CIP: "cip.casagrandindustrial.co.in",
        LP: "lp.casagrandindustrial.co.in",
      };
      const appDomain =
        body.source_domain && body.source_domain.includes("casagrandindustrial.co.in")
          ? body.source_domain
          : tagDomainMap[appTag] || "qrcamp.casagrandindustrial.co.in";

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Enquiry - ${appTag}</h2>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              ${displayFields
                .filter(([_, v]: [string, any]) => {
                  if (v === null || v === undefined) return false;
                  const str = String(v).trim();
                  return str !== "" && str !== "-";
                })
                .map(
                  ([k, v]: [string, any]) => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; color: #666; font-weight: bold; width: 35%; text-transform: capitalize;">${k.replace(/_/g, " ")}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; color: #111;">${v}</td>
                </tr>
                `
                )
                .join("")}
            </table>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 13px; color: #9ca3af;">
            Sent automatically from ${appTag} (<a href="https://${appDomain}" style="color: #9ca3af; text-decoration: underline;" target="_blank">${appDomain}</a>).
          </div>
        </div>
      `;

      const recipientTo = process.env.SMTP_TO ? process.env.SMTP_TO.split(",") : [smtpUser];
      const recipientBcc = process.env.SMTP_BCC ? process.env.SMTP_BCC.split(",") : undefined;

      await transporter.sendMail({
        from: `"Casagrand Industrial" <${process.env.SMTP_FROM || smtpUser}>`,
        to: recipientTo,
        bcc: recipientBcc,
        subject: `Enquiry - ${appTag} — ${body.company || body.name || "Client"} (${body.facilityType || "Facility"})`,
        html: emailHtml,
      });
      console.log(`[SMTP EMAIL SENT SUCCESSFULLY - TAG: ${appTag}]`);
    };

    if (target === "mysql") {
      // 1. Try DB insertion (gracefully caught so DB offline/missing col doesn't stop email)
      try {
        const { getDbPool } = await import("@/lib/db");
        const pool = getDbPool();

        // Dynamically ensure app_tag and custom_metadata columns exist
        try {
          await pool.execute("ALTER TABLE leads ADD COLUMN app_tag VARCHAR(50)");
        } catch {}
        try {
          await pool.execute("ALTER TABLE leads ADD COLUMN custom_metadata LONGTEXT");
        } catch {}

        const metadataObj = {
          appTag,
          source_domain: body.source_domain,
          page_url: body.page_url,
          ...(body.custom_metadata || {})
        };

        try {
          const queryWithTag = `
            INSERT INTO leads 
            (name, email, company, designation, phone, facility_type, engagement_model, area_requirement, message, utm_source, utm_medium, utm_campaign, utm_name, app_tag, custom_metadata) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const valuesWithTag = [
            body.name,
            body.email,
            body.company,
            body.designation,
            body.phone,
            body.facilityType,
            body.model,
            body.area,
            body.message || "",
            body.utm_source,
            body.utm_medium,
            body.utm_campaign,
            body.utm_name,
            appTag,
            JSON.stringify(metadataObj)
          ];

          await pool.execute(queryWithTag, valuesWithTag);
          console.log(`[MYSQL DB INSERT SUCCESS - TAG: ${appTag}]`);
        } catch (insertErr) {
          // Standard query fallback if app_tag column cannot be added
          const query = `
            INSERT INTO leads 
            (name, email, company, designation, phone, facility_type, engagement_model, area_requirement, message, utm_source, utm_medium, utm_campaign, utm_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            body.utm_source,
            body.utm_medium,
            body.utm_campaign,
            body.utm_name,
          ];

          await pool.execute(query, values);
          console.log("[MYSQL DB INSERT SUCCESS (FALLBACK)]");
        }
      } catch (dbErr) {
        console.error("[MYSQL DB ERROR]", dbErr);
      }

      // 2. Send email notification via SMTP
      try {
        await sendSmtpEmail();
      } catch (emailErr) {
        console.error("[SMTP EMAIL ERROR]", emailErr);
      }

    } else if (target === "resend") {
      // Resend email notification
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.SMTP_FROM ?? "leads@casagrnd.in",
        to: process.env.LEAD_EMAIL_TO ?? process.env.SMTP_TO ?? "industrial@casagrand.co.in",
        subject: `Enquiry - ${appTag} — ${body.company} (${body.facilityType})`,
        html: `
          <h2>Enquiry - ${appTag}</h2>
          <table>
            ${displayFields
              .filter(([_, v]: [string, any]) => {
                if (v === null || v === undefined) return false;
                const str = String(v).trim();
                return str !== "" && str !== "-";
              })
              .map(([k, v]: [string, any]) => `<tr><td><strong>${k.replace(/_/g, " ")}</strong></td><td>${v}</td></tr>`)
              .join("")}
          </table>
        `,
      });

    } else if (target === "webhook") {
      const webhookUrl = process.env.WEBHOOK_URL;
      if (!webhookUrl) throw new Error("WEBHOOK_URL env var not set");
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "casagrand-industrial-landing", ...body }),
      });

    } else {
      // "log" — safe fallback: logs to server console and sends email if SMTP is configured
      console.log("[ENQUIRY LOG]", JSON.stringify(body, null, 2));
      try {
        await sendSmtpEmail();
      } catch (emailErr) {
        console.error("[SMTP EMAIL ERROR]", emailErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[ENQUIRY ERROR]", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}

