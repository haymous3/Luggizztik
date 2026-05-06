import { randomBytes } from "crypto";

function randomToken(length: number): string {
  return randomBytes(length).toString("hex").slice(0, length).toUpperCase();
}

export function generateTrackingId(): string {
  return `TRK-${randomToken(10)}`;
}

export function generateDriverAccessCode(): string {
  return `DRV-${randomToken(8)}`;
}
