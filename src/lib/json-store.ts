import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

function isNetlifyRuntime() {
  return Boolean(
    process.env.NETLIFY === "true" || process.env.NETLIFY_BLOBS_CONTEXT
  );
}

async function readFileJson<T>(filePath: string, fallback: T): Promise<T> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
      return fallback;
    }
    // Read-only filesystem (e.g. Netlify without blobs available)
    if (code === "EROFS" || code === "EACCES") {
      return fallback;
    }
    throw err;
  }
}

async function writeFileJson<T>(filePath: string, data: T): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Persistent JSON array store.
 * - Local: data/*.json on disk
 * - Netlify: Blobs (survives serverless deploys)
 */
export async function readJsonArray<T>(
  storeName: string,
  key: string,
  localFile: string
): Promise<T[]> {
  if (isNetlifyRuntime()) {
    try {
      const store = getStore(storeName);
      const data = await store.get(key, { type: "json" });
      return Array.isArray(data) ? (data as T[]) : [];
    } catch (err) {
      console.error(`Blob read failed for ${storeName}/${key}:`, err);
      return [];
    }
  }

  const filePath = path.join(process.cwd(), localFile);
  const data = await readFileJson<T[]>(filePath, []);
  return Array.isArray(data) ? data : [];
}

export async function writeJsonArray<T>(
  storeName: string,
  key: string,
  localFile: string,
  data: T[]
): Promise<void> {
  if (isNetlifyRuntime()) {
    const store = getStore(storeName);
    await store.setJSON(key, data);
    return;
  }

  const filePath = path.join(process.cwd(), localFile);
  await writeFileJson(filePath, data);
}
