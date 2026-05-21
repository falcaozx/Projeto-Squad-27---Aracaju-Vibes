import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import arcosOrlaHero from "../../assests/image copy 3.png";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { EventMapSection } from "@/components/site/EventMapSection";
import { Layout } from "@/components/site/Layout";
import { PlaceCard } from "@/components/site/PlaceCard";
import { attractions, highlights } from "@/data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aracaju Turismo - Praias, Cultura e Experiencias em Sergipe" },
      {
        name: "description",
        content:
          "Tudo o que voce precisa para viver Aracaju como ninguem. Descubra praias, restaurantes e os melhores shows.",
      },
    ],
  }),
});

const quick = [
  { to: "/praias", label: "Praias", icon: Waves },
  { to: "/restaurantes", label: "Gastronomia", icon: UtensilsCrossed },
  { to: "/pontos-turisticos", label: "Pontos turisticos", icon: MapPin },
  { to: "/shows", label: "Shows", icon: Ticket },
] as const;

function Index() {
  return (
    <Layout>
      <section className="relative px-4 pt-4 md:pt-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] shadow-elevated md:rounded-[2.5rem]">
          <img
            src={arcosOrlaHero}
            alt="Arcos da Orla de Aracaju"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />

          <div className="relative px-6 py-16 text-primary-foreground md:px-16 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full glass-strong px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                <Sparkles className="h-3 w-3" /> Capital do Sol
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
                Sinta Aracaju
                <br />
                <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
                  como ela merece
                </span>
                .
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
                Roteiros, gastronomia e cultura em um so lugar. As melhores experiencias de Sergipe a distancia de um clique.
              </p>

              <motion.form
                onSubmit={(event) => event.preventDefault()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 22 }}
                className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl glass-strong p-2 shadow-glow"
              >
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Search className="h-4 w-4 text-white/70" />
                  <input
                    placeholder="Buscar destinos, praias, restaurantes..."
                    className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/60"
                  />
                </div>
                <button className="rounded-xl bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent transition-all hover:opacity-95 active:scale-95">
                  Explorar
                </button>
              </motion.form>

              <div className="mt-8 flex flex-wrap gap-2">
                {quick.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                    >
                      <Icon className="h-4 w-4" /> {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <EventMapSection
        compact
        title="Mapa vivo de eventos pela cidade"
        description="A descoberta por localizacao agora fica em destaque na experiencia principal, com mapa responsivo, eventos proximos e filtros inteligentes."
      />

      <section className="mx-auto mt-20 max-w-7xl px-4 md:mt-28">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Em destaque</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Experiencias <span className="text-gradient">imperdiveis</span>
            </h2>
          </div>
          <Link
            to="/pontos-turisticos"
            className="hidden items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2 md:inline-flex"
          >
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((highlight) => (
            <PlaceCard
              key={highlight.id}
              id={highlight.id}
              title={highlight.title}
              subtitle={highlight.subtitle}
              image={highlight.image}
              badge={highlight.tag}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:mt-28">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recomendado para voce</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            Mais amados <span className="text-gradient">pelos viajantes</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.slice(0, 6).map((attraction) => (
            <PlaceCard
              key={attraction.id}
              id={attraction.id}
              title={attraction.name}
              subtitle={attraction.category}
              image={attraction.image}
              address={attraction.price}
              hours={attraction.hours}
              rating={4.7}
              coords={attraction.coords}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-10 text-primary-foreground shadow-glow md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Planeje sua viagem em minutos.</h2>
            <p className="mt-4 text-white/85">
              Salve favoritos, compre ingressos e organize seu roteiro perfeito por Aracaju.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-6 py-3 font-semibold text-primary-deep shadow-soft transition-colors hover:bg-white"
              >
                Criar conta gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/criador-eventos"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
              >
                Area do promotor <MapPin className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
