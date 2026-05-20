import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type FavoritesCtx = {
  ids: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const Ctx = createContext<FavoritesCtx | null>(null);
const KEY = "aju.favs";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const persist = (next: Set<string>) => {
    setIds(new Set(next));
    try { localStorage.setItem(KEY, JSON.stringify([...next])); } catch {}
  };

  return (
    <Ctx.Provider value={{
      ids,
      has: (id) => ids.has(id),
      toggle: (id) => {
        const next = new Set(ids);
        if (next.has(id)) next.delete(id); else next.add(id);
        persist(next);
      },
    }}>{children}</Ctx.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
