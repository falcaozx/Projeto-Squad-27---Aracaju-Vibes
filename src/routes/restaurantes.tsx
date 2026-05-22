import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceCard } from "@/components/site/PlaceCard";
import { restaurants } from "@/data";

export const Route = createFileRoute("/restaurantes")({
  component: RestaurantsPage,
  head: () => ({
    meta: [
      { title: "Cult+ - Restaurantes" },
      {
        name: "description",
        content:
          "Os melhores restaurantes de Aracaju: frutos do mar, comida regional, pizzarias e cozinha autoral.",
      },
    ],
  }),
});

const cats = ["Todos", "Frutos do Mar", "Regional", "Pizzaria", "Destaques"] as const;

function formatRestaurantAddress(address: string) {
  return address.split(" - ")[0] ?? address;
}

function formatRestaurantHours(hours: string) {
  return hours.replaceAll("; ", " • ");
}

function RestaurantsPage() {
  const [active, setActive] = useState<(typeof cats)[number]>("Todos");
  const list = useMemo(
    () => (active === "Todos" ? restaurants : restaurants.filter((restaurant) => restaurant.category === active)),
    [active],
  );

  return (
    <Layout>
      <PageHeader
        eyebrow="Guia Gastronômico"
        title="Onde comer em Aracaju"
        description="Da Passarela do Caranguejo aos bistrôs autorais, descubra os sabores que fazem Sergipe inesquecível."
      />

      <div className="mx-auto mt-8 flex max-w-7xl gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
        {cats.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              onClick={() => setActive(category)}
              className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-primary shadow-soft"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={isActive ? "text-primary-foreground" : "text-foreground/70"}>{category}</span>
            </button>
          );
        })}
      </div>

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((restaurant) => (
          <PlaceCard
            key={restaurant.id}
            id={restaurant.id}
            title={restaurant.name}
            subtitle={`${restaurant.cuisine} • ${restaurant.price}`}
            image={restaurant.image}
            rating={restaurant.rating}
            address={formatRestaurantAddress(restaurant.address)}
            hours={formatRestaurantHours(restaurant.hours)}
            badge={restaurant.category}
            coords={restaurant.coords}
          />
        ))}
      </section>
    </Layout>
  );
}
