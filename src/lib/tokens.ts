import { randomBytes } from "crypto";

export function generateToken(): string {
  return randomBytes(18).toString("base64url").slice(0, 24);
}
