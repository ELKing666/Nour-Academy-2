const STORAGE_KEY = "na_trans_cache_v1";
const MAX_CACHE_ENTRIES = 2000;

// --- In-memory cache (fast lookups this session) ---
const memCache = new Map<string, string>();

function loadFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(obj)) memCache.set(k, v);
  } catch {}
}

function persistToStorage(): void {
  try {
    const entries = [...memCache.entries()].slice(-MAX_CACHE_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {}
}

loadFromStorage();

function cacheKey(lang: string, text: string): string {
  return `${lang}::${text}`;
}

// --- In-flight dedup: same text requested concurrently shares one fetch ---
const inFlight = new Map<string, Promise<string>>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || targetLang === "ar") return trimmed;

  const key = cacheKey(targetLang, trimmed);

  // 1. memory hit
  if (memCache.has(key)) return memCache.get(key)!;

  // 2. in-flight dedup
  if (inFlight.has(key)) return inFlight.get(key)!;

  const promise = (async () => {
    try {
      const url =
        `https://translate.googleapis.com/translate_a/single` +
        `?client=gtx&sl=ar&tl=${encodeURIComponent(targetLang)}` +
        `&dt=t&q=${encodeURIComponent(trimmed)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("translate error");
      const data = await res.json();
      const translated: string = data[0]
        .map((chunk: [string]) => chunk[0])
        .join("");

      memCache.set(key, translated);
      persistToStorage();
      return translated;
    } catch {
      // fallback: return original
      return trimmed;
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

/** Translate multiple fields of an object in one pass. */
export async function translateObject(
  obj: Record<string, unknown>,
  fields: string[],
  targetLang: string
): Promise<Record<string, unknown>> {
  if (targetLang === "ar") return obj;
  const results = await Promise.all(
    fields.map((f) =>
      typeof obj[f] === "string"
        ? translateText(obj[f] as string, targetLang).then((v) => [f, v] as const)
        : Promise.resolve([f, obj[f]] as const)
    )
  );
  return { ...obj, ...Object.fromEntries(results) };
}

/** Translate an array of strings. */
export async function translateStrings(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  if (targetLang === "ar") return texts;
  return Promise.all(texts.map((t) => translateText(t, targetLang)));
}
