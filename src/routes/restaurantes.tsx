import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceCard } from "@/components/site/PlaceCard";
import { restaurants } from "@/data";

export const Route = createFileRoute("/restaurantes")({
  component: RestaurantsPage,
  head: () => ({
    meta: [
      { title: "Restaurantes em Aracaju — Guia Gastronômico" },
      { name: "description", content: "Os melhores restaurantes de Aracaju: frutos do mar, comida regional, pizzarias e cozinha autoral." },
    ],
  }),
});

const cats = ["Todos", "Frutos do Mar", "Regional", "Pizzaria", "Internacional"] as const;

function RestaurantsPage() {
  const [active, setActive] = useState<(typeof cats)[number]>("Todos");
  const list = useMemo(
    () => (active === "Todos" ? restaurants : restaurants.filter((r) => r.category === active)),
    [active]
  );

  return (
    <Layout>
      <PageHeader
        eyebrow="Guia Gastronômico"
        title="Onde comer em Aracaju"
        description="Da Passarela do Caranguejo aos bistrôs autorais, descubra os sabores que fazem Sergipe inesquecível."
      />

      <div className="mx-auto max-w-7xl px-4 mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {cats.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              {isActive && (
                <motion.span layoutId="cat-pill" className="absolute inset-0 -z-10 rounded-full bg-gradient-primary shadow-soft" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className={isActive ? "text-primary-foreground" : "text-foreground/70"}>{c}</span>
            </button>
          );
        })}
      </div>

      <section className="mx-auto max-w-7xl px-4 mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <PlaceCard
            key={r.id}
            id={r.id}
            title={r.name}
            subtitle={`${r.cuisine} • ${r.price}`}
            image={r.image}
            rating={r.rating}
            address={r.address}
            hours={r.hours}
            badge={r.category}
            coords={r.coords}
          />
        ))}
      </section>
    </Layout>
  );
}
