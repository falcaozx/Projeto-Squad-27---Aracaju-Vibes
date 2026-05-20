import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { beaches } from "@/data";
import { MapPin, Waves, Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { MapModal } from "@/components/site/MapModal";

export const Route = createFileRoute("/praias")({
  component: BeachesPage,
  head: () => ({
    meta: [
      { title: "Praias de Aracaju — Atalaia, Aruana, Mosqueiro e mais" },
      { name: "description", content: "Guia completo das praias de Aracaju com infraestrutura, fotos e dicas para curtir o melhor do litoral sergipano." },
    ],
  }),
});

function BeachesPage() {
  const [active, setActive] = useState(beaches[0].id);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const beach = beaches.find((b) => b.id === active)!;
  const { has, toggle } = useFavorites();
  const fav = has(beach.id);

  return (
    <Layout>
      <PageHeader
        eyebrow="Litoral sergipano"
        title="Praias de Aracaju"
        description="Águas mornas, ondas para todos os gostos e um pôr do sol que ninguém esquece."
      />

      <div className="mx-auto max-w-7xl px-4 mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {beaches.map((b) => {
          const isActive = active === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActive(b.id)}
              className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold"
            >
              {isActive && <motion.span layoutId="beach-pill" className="absolute inset-0 -z-10 rounded-full bg-gradient-primary shadow-soft" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className={isActive ? "text-primary-foreground" : "text-foreground/70"}>{b.name.replace("Praia de ", "").replace("Praia do ", "").replace("Praia dos ", "")}</span>
            </button>
          );
        })}
      </div>

      <section className="mx-auto max-w-7xl px-4 mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={beach.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="grid lg:grid-cols-5 gap-6"
          >
            <div className="lg:col-span-3 relative overflow-hidden rounded-3xl shadow-elevated aspect-[4/3]">
              <img src={beach.image} alt={beach.name} className="h-full w-full object-cover" />
              <button
                onClick={() => toggle(beach.id)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full glass-strong hover:scale-110 transition-transform"
              >
                <Heart className={`h-4 w-4 ${fav ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>

            <div className="lg:col-span-2 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1">
                <Waves className="h-3 w-3" /> {beach.short}
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{beach.name}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{beach.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {beach.features.map((f) => (
                  <span key={f} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary-deep">{f}</span>
                ))}
              </div>

              <div className="mt-6 glass rounded-2xl p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Como chegar</div>
                  <div className="text-xs text-muted-foreground">Estacionamento gratuito ao longo da orla</div>
                </div>
                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="rounded-xl bg-gradient-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-accent transition-transform hover:scale-105 active:scale-95"
                >
                  Abrir mapa
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        title={beach.name} 
        coords={beach.coords} 
      />
    </Layout>
  );
}
