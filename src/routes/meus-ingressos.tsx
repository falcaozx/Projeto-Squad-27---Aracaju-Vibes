import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { events } from "@/data";
import { QrCode } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/meus-ingressos")({
  component: TicketsPage,
  head: () => ({ meta: [{ title: "Meus Ingressos — Aracaju Turismo" }] }),
});

function TicketsPage() {
  const owned = events.slice(0, 2);
  return (
    <Layout>
      <PageHeader eyebrow="Sua área" title="Meus ingressos" description="Apresente o QR Code na entrada do evento." />

      <section className="mx-auto max-w-3xl px-4 mt-10 space-y-5">
        {owned.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.06 }}
            className="overflow-hidden rounded-3xl shadow-soft bg-card flex flex-col sm:flex-row"
          >
            <img src={e.image} alt={e.title} className="sm:w-1/3 aspect-[4/3] sm:aspect-auto object-cover" />
            <div className="flex-1 p-5 flex justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{e.category}</span>
                <h3 className="mt-1 text-lg font-bold">{e.title}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{e.date} • {e.time}</div>
                <div className="text-xs text-muted-foreground">{e.venue}</div>
                <div className="mt-4 text-xs font-semibold rounded-full bg-secondary px-3 py-1 inline-block text-primary-deep">Válido • 1 ingresso</div>
              </div>
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <QrCode className="h-10 w-10" />
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </Layout>
  );
}
