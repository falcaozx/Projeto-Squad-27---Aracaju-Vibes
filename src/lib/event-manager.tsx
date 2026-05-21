import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { events as seedEvents } from "@/data";

export type EventCategory = "Forró" | "Sertanejo" | "Pagode" | "Eletrônica" | "Festival";

export type ManagedEvent = {
  id: string;
  title: string;
  artist: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  price: number;
  ticketsTotal: number;
  ticketsSold: number;
  image: string;
  coords: { lat: number; lng: number };
};

export type EventDraft = Omit<ManagedEvent, "id" | "ticketsSold"> & {
  ticketsSold?: number;
};

type EventManagerContextValue = {
  events: ManagedEvent[];
  createEvent: (draft: EventDraft) => void;
  updateEvent: (eventId: string, draft: EventDraft) => void;
  deleteEvent: (eventId: string) => void;
};

const ARACAJU_CENTER = { lat: -10.9472, lng: -37.0731 };
const STORAGE_KEY = "aracaju-promoter-events";

const categoryLabels: Record<EventCategory, string> = {
  "Forró": "Forró",
  Sertanejo: "Sertanejo",
  Pagode: "Pagode",
  "Eletrônica": "Eletrônica",
  Festival: "Festival",
};

const eventMetadata: Record<string, Partial<ManagedEvent>> = {
  e1: {
    date: "2026-06-14",
    description:
      "Uma noite de forró contemporâneo com atmosfera regional, setores premium e ativações gastronômicas.",
    address: "Av. Tancredo Neves, Centro de Eventos de Sergipe",
    ticketsTotal: 1400,
    ticketsSold: 920,
  },
  e2: {
    date: "2026-06-20",
    description:
      "Festival ao ar livre na orla com palco principal, feira criativa e experiência completa de São João.",
    address: "Orla de Atalaia, Aracaju",
    ticketsTotal: 4000,
    ticketsSold: 2600,
  },
  e3: {
    date: "2026-07-05",
    description:
      "Show sertanejo em formato arena, com lounges laterais, bares temáticos e operação de ingresso digital.",
    address: "Av. Adélia Franco, Arena Batistão",
    ticketsTotal: 2400,
    ticketsSold: 1260,
  },
  e4: {
    date: "2026-07-12",
    description:
      "Evento sunset com pagode na faixa litorânea, lounges, ativações de marca e food trucks curados.",
    address: "Atalaia Sul, Beach Stage",
    ticketsTotal: 1800,
    ticketsSold: 980,
  },
  e5: {
    date: "2026-07-26",
    description:
      "Experiência noturna de música eletrônica com cenografia imersiva, open area e setores com vista frontal.",
    address: "Hangar Sergipe, Aracaju",
    ticketsTotal: 2200,
    ticketsSold: 1175,
  },
};

function normalizeCategory(value: string): EventCategory {
  const normalized = value
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("festival")) return "Festival";
  if (normalized.includes("sertanejo")) return "Sertanejo";
  if (normalized.includes("pagode")) return "Pagode";
  if (normalized.includes("eletron")) return "Eletrônica";
  return "Forró";
}

function buildSeedEvents(): ManagedEvent[] {
  return seedEvents.map((event) => {
    const metadata = eventMetadata[event.id] ?? {};
    const ticketsTotal = metadata.ticketsTotal ?? 1200;
    return {
      id: event.id,
      title: event.title,
      artist: event.artist,
      description:
        metadata.description ??
        "Evento especial em Aracaju com operação completa de ingressos, mapa e destaque visual dentro da plataforma.",
      category: normalizeCategory(event.category),
      date: metadata.date ?? "2026-06-01",
      time: event.time,
      venue: event.venue,
      address: metadata.address ?? `${event.venue}, ${event.city}`,
      city: event.city,
      price: event.price,
      ticketsTotal,
      ticketsSold: metadata.ticketsSold ?? Math.floor(ticketsTotal * 0.45),
      image: event.image,
      coords: event.coords ?? ARACAJU_CENTER,
    };
  });
}

const EventManagerContext = createContext<EventManagerContextValue | null>(null);

export function EventManagerProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ManagedEvent[]>(() => buildSeedEvents());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ManagedEvent[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setEvents(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const createEvent = useCallback((draft: EventDraft) => {
    setEvents((current) =>
      [...current, { ...draft, id: `event-${Date.now()}`, ticketsSold: draft.ticketsSold ?? 0 }].sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      ),
    );
  }, []);

  const updateEvent = useCallback((eventId: string, draft: EventDraft) => {
    setEvents((current) =>
      current
        .map((event) =>
          event.id === eventId ? { ...event, ...draft, ticketsSold: draft.ticketsSold ?? event.ticketsSold } : event,
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    );
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((current) => current.filter((event) => event.id !== eventId));
  }, []);

  const value = useMemo(
    () => ({ events, createEvent, updateEvent, deleteEvent }),
    [createEvent, deleteEvent, events, updateEvent],
  );

  return <EventManagerContext.Provider value={value}>{children}</EventManagerContext.Provider>;
}

export function useEventManager() {
  const context = useContext(EventManagerContext);

  if (!context) {
    throw new Error("useEventManager must be used within EventManagerProvider");
  }

  return context;
}

export function formatEventDateParts(date: string) {
  const parsed = parseISO(date);
  return {
    day: format(parsed, "dd"),
    month: format(parsed, "MMM", { locale: ptBR }),
  };
}

export function formatEventDateLong(date: string) {
  return format(parseISO(date), "dd 'de' MMMM", { locale: ptBR });
}

export function formatEventPrice(price: number) {
  if (price === 0) return "Gratuito";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getCategoryLabel(category: EventCategory) {
  return categoryLabels[category];
}

export function getRemainingTickets(event: ManagedEvent) {
  return Math.max(event.ticketsTotal - event.ticketsSold, 0);
}

export function calculateDistanceKm(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(origin.lat)) *
      Math.cos(toRadians(destination.lat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export { ARACAJU_CENTER };
