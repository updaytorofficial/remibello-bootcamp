import { promises as fs } from "fs";
import path from "path";
import type { Registration } from "./registration-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<Registration[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Registration[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(rows: Registration[]) {
  await ensureStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export type RegistrationInput = {
  fullName: string;
  phone: string;
  email?: string;
  track: string;
  age?: string;
  experience?: string;
  notes?: string;
};

export class DuplicateRegistrationError extends Error {
  field: "phone" | "email";

  constructor(field: "phone" | "email", message: string) {
    super(message);
    this.name = "DuplicateRegistrationError";
    this.field = field;
  }
}

/** Normalize phone for comparison: digits only (keep leading +). */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listRegistrations(): Promise<Registration[]> {
  const rows = await readAll();
  return rows.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createRegistration(
  input: RegistrationInput
): Promise<Registration> {
  const rows = await readAll();
  const phone = input.phone.trim();
  const email = (input.email || "").trim();
  const phoneKey = normalizePhone(phone);
  const emailKey = email ? normalizeEmail(email) : "";

  if (!phoneKey || phoneKey.replace(/\D/g, "").length < 8) {
    throw new Error("Please enter a valid phone / WhatsApp number.");
  }

  const phoneTaken = rows.some(
    (r) => normalizePhone(r.phone) === phoneKey
  );
  if (phoneTaken) {
    throw new DuplicateRegistrationError(
      "phone",
      "This phone number is already registered."
    );
  }

  if (emailKey) {
    const emailTaken = rows.some(
      (r) => r.email && normalizeEmail(r.email) === emailKey
    );
    if (emailTaken) {
      throw new DuplicateRegistrationError(
        "email",
        "This email address is already registered."
      );
    }
  }

  const registration: Registration = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    phone,
    email: emailKey || email,
    track: input.track.trim(),
    age: (input.age || "").trim(),
    experience: (input.experience || "").trim(),
    notes: (input.notes || "").trim(),
    createdAt: new Date().toISOString(),
  };
  rows.unshift(registration);
  await writeAll(rows);
  return registration;
}

export async function deleteRegistration(id: string): Promise<void> {
  const rows = await readAll();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) throw new Error("Registration not found.");
  await writeAll(next);
}
