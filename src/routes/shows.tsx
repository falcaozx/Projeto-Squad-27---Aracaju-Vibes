import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { MapModal } from "@/components/site/MapModal";
import { PageHeader } from "@/components/site/PageHeader";
import {
  formatEventDateParts,
  formatEventPrice,
  getCategoryLabel,
  useEventManager,
} from "@/lib/event-manager";

export const Route = createFileRoute("/shows")({
  component: ShowsPage,
  head: () => ({
    meta: [
      { title: "Shows e Eventos em Aracaju - Compre seu ingresso" },
      {
        name: "description",
        content:
          "Forro, sertanejo, pagode e festivais em Aracaju. Compre ingressos com QR Code dinamico.",
      },
    ],
  }),
});

function ShowsPage() {
  const { events } = useEventManager();
  const [mapState, setMapState] = useState<{
    isOpen: boolean;
    coords?: { lat: number; lng: number };
    title?: string;
  }>({ isOpen: false });

  return (
    <Layout>
      <PageHeader
        eyebrow="Hub de entretenimento"
        title="Shows & Eventos"
        description="A agenda cultural de Aracaju em tempo real. Reserve seu lugar nos melhores espetaculos da capital."
      />

      <section className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 md:grid-cols-2">
        {events.map((event, index) => {
          const dateParts = formatEventDateParts(event.date);

          return (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 220, damping: 24, delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <motion.img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-gradient-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-accent">
                  {getCategoryLabel(event.category)}
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-primary-foreground">
                  <div>
                    <div className="text-xs font-medium opacity-90">{event.artist}</div>
                    <h3 className="text-xl font-bold tracking-tight">{event.title}</h3>
                  </div>
                  <div className="glass-strong min-w-[64px] rounded-2xl px-3 py-2 text-center">
                    <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                      {dateParts.month}
                    </div>
                    <div className="text-xl font-bold leading-none">{dateParts.day}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-5">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    {dateParts.day}/{dateParts.month} - {event.time}
                  </span>
                  <button
                    onClick={() => setMapState({ isOpen: true, coords: event.coords, title: event.venue })}
                    className="inline-flex items-center gap-1 text-left transition-colors hover:text-accent"
                  >
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="underline decoration-accent/30 underline-offset-2">{event.venue}</span>
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">A partir de</div>
                  <div className="text-lg font-bold text-primary">{formatEventPrice(event.price)}</div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <Link
                  to="/checkout/$eventId"
                  params={{ eventId: event.id }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-shadow hover:shadow-glow"
                >
                  <Ticket className="h-4 w-4" /> Comprar ingresso
                </Link>
              </div>
            </motion.article>
          );
        })}
      </section>

      {mapState.coords && (
        <MapModal
          isOpen={mapState.isOpen}
          onClose={() => setMapState((current) => ({ ...current, isOpen: false }))}
          title={mapState.title ?? ""}
          coords={mapState.coords}
        />
      )}
    </Layout>
  );
}
