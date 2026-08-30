import { Router, type IRouter, type Request } from "express";
import { desc } from "drizzle-orm";
import { db, hostingInquiriesTable } from "@workspace/db";
import {
  ListHostingInquiriesResponse,
  SubmitHostingInquiryBody,
  SubmitHostingInquiryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_INQUIRIES_PER_WINDOW = 5;
const inquiryAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(req: Request): string {
  return req.ip || "unknown";
}

router.post("/hosting-inquiries", async (req, res): Promise<void> => {
  const clientKey = getClientKey(req);
  const now = Date.now();
  const current = inquiryAttempts.get(clientKey);
  if (current && current.resetAt > now && current.count >= MAX_INQUIRIES_PER_WINDOW) {
    req.log.warn("Hosting inquiry rate limit exceeded");
    res.status(429).json({ error: "Please wait before sending another inquiry." });
    return;
  }
  if (!current || current.resetAt <= now) {
    inquiryAttempts.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    current.count += 1;
  }

  const body =
    req.body && typeof req.body === "object"
      ? {
          ...req.body,
          name:
            typeof req.body.name === "string"
              ? req.body.name.trim()
              : req.body.name,
          email:
            typeof req.body.email === "string"
              ? req.body.email.trim().toLowerCase()
              : req.body.email,
          room:
            typeof req.body.room === "string"
              ? req.body.room.trim()
              : req.body.room,
        }
      : req.body;
  const parsed = SubmitHostingInquiryBody.safeParse(body);

  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues.length }, "Invalid hosting inquiry");
    res.status(400).json({ error: "Please check your name, email, and event details." });
    return;
  }

  try {
    await db.insert(hostingInquiriesTable).values(parsed.data);
  } catch (error) {
    req.log.error({ err: error }, "Unable to store hosting inquiry");
    res.status(500).json({ error: "We could not receive your inquiry right now. Please try again." });
    return;
  }

  res.status(201).json(SubmitHostingInquiryResponse.parse({ received: true }));
});

router.get("/hosting-inquiries", async (req, res): Promise<void> => {
  const adminKey = req.get("x-admin-key");
  const configuredAdminKey = process.env.SESSION_SECRET;

  if (!configuredAdminKey) {
    req.log.error("Hosting inquiry team access is not configured");
    res.status(503).json({ error: "Team inquiry access is not configured." });
    return;
  }
  if (!adminKey || adminKey !== configuredAdminKey) {
    req.log.warn("Unauthorized hosting inquiry queue access");
    res.status(401).json({ error: "Team access is required." });
    return;
  }

  const inquiries = await db
    .select()
    .from(hostingInquiriesTable)
    .orderBy(desc(hostingInquiriesTable.createdAt));
  res.json(
    ListHostingInquiriesResponse.parse(
      inquiries.map((inquiry) => ({
        ...inquiry,
        createdAt: inquiry.createdAt.toISOString(),
      })),
    ),
  );
});

export default router;