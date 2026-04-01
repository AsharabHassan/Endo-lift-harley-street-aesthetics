import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/*  Simple in-memory rate limiter for portal pages                     */
/*  30 requests per minute per IP                                      */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getRateLimitEntry(ip: string): RateLimitEntry {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (existing && existing.resetAt > now) {
    return existing;
  }

  // Create new window
  const entry: RateLimitEntry = { count: 0, resetAt: now + WINDOW_MS };
  rateLimitMap.set(ip, entry);
  return entry;
}

/** Periodically clean up expired entries to prevent memory leaks */
function cleanup() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

export function proxy(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Periodic cleanup
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanup();
    lastCleanup = now;
  }

  const entry = getRateLimitEntry(ip);
  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/p/:path*",
};
