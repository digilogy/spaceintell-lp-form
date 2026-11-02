import { createHash } from "crypto";

const PIXEL_ID = "2WA6YBUw7xtddDT3vCUvwC";
const EVENT_NAME = "lead_created";
const REQUEST_TIMEOUT_MS = 5000;

type LeadEvent = {
  eventId: string;
  sourceUrl: string;
  oppref?: string;
  obref?: string;
  email?: string;
  phone?: string;
  ipAddress?: string;
  userAgent?: string;
};

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// The form only accepts 10-digit Indian mobile numbers, so add the country code when it is missing
const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length === 10 ? `91${digits}` : digits;
};

const buildUser = ({ email, phone, obref, ipAddress, userAgent }: LeadEvent) => {
  const normalizedEmail = email ? normalizeEmail(email) : "";
  const normalizedPhone = phone ? normalizePhone(phone) : "";

  return {
    ...(normalizedEmail && { emails_sha256: [sha256(normalizedEmail)] }),
    ...(normalizedPhone && { phone_numbers_sha256: [sha256(normalizedPhone)] }),
    ...(obref && { obref }),
    ...(ipAddress && { ip_address: ipAddress }),
    ...(userAgent && { user_agent: userAgent }),
  };
};

// Never store names, emails, phone numbers or IP addresses here
const logDelivery = async (entry: {
  eventId: string;
  eventTimeMs: number;
  hasOppref: boolean;
  delivery: "sent" | "failed" | "skipped";
  httpStatus: number | null;
  detail: string;
}) => {
  console.log("[OPENAI CONVERSION]", JSON.stringify({ eventName: EVENT_NAME, pixelId: PIXEL_ID, ...entry }));

  try {
    const { getDbPool } = await import("@/lib/db");
    const pool = getDbPool();

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS conversion_event_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id VARCHAR(255) NOT NULL,
        event_name VARCHAR(100) NOT NULL,
        pixel_id VARCHAR(100) NOT NULL,
        event_time_ms BIGINT NOT NULL,
        has_oppref BOOLEAN NOT NULL,
        delivery VARCHAR(20) NOT NULL,
        http_status INT,
        detail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.execute(
      `INSERT INTO conversion_event_logs
       (event_id, event_name, pixel_id, event_time_ms, has_oppref, delivery, http_status, detail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.eventId,
        EVENT_NAME,
        PIXEL_ID,
        entry.eventTimeMs,
        entry.hasOppref,
        entry.delivery,
        entry.httpStatus,
        entry.detail,
      ]
    );
  } catch (dbErr) {
    console.error("[OPENAI CONVERSION LOG ERROR]", dbErr);
  }
};

// Never throws: a tracking failure must not affect the lead
export async function sendLeadCreatedEvent(event: LeadEvent) {
  const eventTimeMs = Date.now();
  const hasOppref = Boolean(event.oppref);
  const apiKey = process.env.OPENAI_CONVERSIONS_API_KEY;

  if (!apiKey) {
    await logDelivery({
      eventId: event.eventId,
      eventTimeMs,
      hasOppref,
      delivery: "skipped",
      httpStatus: null,
      detail: "OPENAI_CONVERSIONS_API_KEY is not set",
    });
    return;
  }

  try {
    const res = await fetch(`https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        validate_only: process.env.OPENAI_CONVERSIONS_VALIDATE_ONLY === "true",
        events: [
          {
            id: event.eventId,
            type: EVENT_NAME,
            timestamp_ms: eventTimeMs,
            ...(event.oppref && { oppref: event.oppref }),
            source_url: event.sourceUrl,
            action_source: "web",
            user: buildUser(event),
            data: { type: "customer_action" },
          },
        ],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    await logDelivery({
      eventId: event.eventId,
      eventTimeMs,
      hasOppref,
      delivery: res.ok ? "sent" : "failed",
      httpStatus: res.status,
      detail: (await res.text()).slice(0, 1000),
    });
  } catch (err) {
    await logDelivery({
      eventId: event.eventId,
      eventTimeMs,
      hasOppref,
      delivery: "failed",
      httpStatus: null,
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
