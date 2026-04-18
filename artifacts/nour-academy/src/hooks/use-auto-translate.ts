import { useState, useEffect, useRef } from "react";
import { translateObject } from "@/lib/translate";
import { useLang } from "@/contexts/LanguageContext";

/**
 * Automatically translates an array of objects whenever the active language changes.
 * - Arabic: returns original items immediately (no API call).
 * - Other languages: translates the specified fields, shows originals while loading.
 * - Results are cached, so each unique phrase is only ever fetched once.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAutoTranslate<T extends Record<string, any>>(
  items: T[],
  fields: (keyof T & string)[]
): { data: T[]; isTranslating: boolean } {
  const { lang } = useLang();
  const [data, setData] = useState<T[]>(items);
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    setData(items);

    if (lang === "ar" || items.length === 0) {
      setIsTranslating(false);
      return;
    }

    abortRef.current = false;
    setIsTranslating(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyItems: Record<string, unknown>[] = items as any;
    Promise.all(
      anyItems.map((item) => translateObject(item, fields as string[], lang))
    ).then((translated) => {
      if (!abortRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setData(translated as any);
        setIsTranslating(false);
      }
    });

    return () => {
      abortRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, lang, fields.join(",")]);

  return { data, isTranslating };
}
