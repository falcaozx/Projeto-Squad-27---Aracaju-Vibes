import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { attractions } from "@/data";
import { Clock, Ticket, Navigation } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { Heart } from "lucide-react";
import { useState } from "react";
import { MapModal } from "@/components/site/MapModal";

export const Route = createFileRoute("/pontos-turisticos")({
  component: AttractionsPage,
  head: () => ({
    meta: [
      { title: "Pontos Turísticos de Aracaju — Arcos da Orla, Oceanário e mais" },
      { name: "description", content: "Os pontos turísticos imperdíveis de Aracaju com horários, valores e como chegar." },
    ],
  }),
});

function AttractionsPage() {
  const { has, toggle } = useFavorites();
  const [mapState, setMapState] = useState<{isOpen: boolean; coords?: {lat: number; lng: number}; title?: string}>({isOpen: false});
  return (
    <Layout>
      <PageHeader
        eyebrow="Exploração"
        title="Pontos turísticos"
        description="Cartões-postais, museus e experiências naturais que contam a história de Aracaju."
      />

      <section className="mx-auto max-w-7xl px-4 mt-10 grid gap-6 md:grid-cols-2">
        {attractions.map((a, i) => {
          const fav = has(a.id);
          return (
            <motion.article
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft hover:shadow-elevated transition-shadow flex flex-col sm:flex-row"
            >
              <div className="relative sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden">
                <motion.img
                  src={a.image} alt={a.name} loading="lazy"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
                <span className="absolute left-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{a.category}</span>
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight">{a.name}</h3>
                  <button onClick={() => toggle(a.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary">
                    <Heart className={`h-4 w-4 ${fav ? "fill-accent text-accent" : ""}`} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.description}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{a.hours}</span>
                  <span className="inline-flex items-center gap-1"><Ticket className="h-3 w-3" />{a.price}</span>
                </div>

                <button 
                  onClick={() => setMapState({isOpen: true, coords: a.coords, title: a.name})}
                  className="mt-5 self-start inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
                >
                  <Navigation className="h-4 w-4" /> Como chegar
                </button>
              </div>
            </motion.article>
          );
        })}
      </section>

      {mapState.coords && (
        <MapModal 
          isOpen={mapState.isOpen} 
          onClose={() => setMapState({...mapState, isOpen: false})} 
          title={mapState.title || ""} 
          coords={mapState.coords} 
        />
      )}
    </Layout>
  );
}
