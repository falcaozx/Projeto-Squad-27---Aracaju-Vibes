import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceCard } from "@/components/site/PlaceCard";
import { bars } from "@/data";
import { Music } from "lucide-react";

export const Route = createFileRoute("/bares")({
  component: BarsPage,
  head: () => ({
    meta: [
      { title: "Bares em Aracaju — Música ao vivo e coquetelaria" },
      { name: "description", content: "Os melhores bares de Aracaju, com forró, sertanejo, rock e coquetelaria autoral." },
    ],
  }),
});

function BarsPage() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Vida noturna"
        title="Bares & Música ao vivo"
        description="Da brisa da Orla à boemia do centro, os melhores endereços para começar — ou terminar — a noite."
      />

      <section className="mx-auto max-w-7xl px-4 mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bars.map((b) => (
          <PlaceCard
            key={b.id}
            id={b.id}
            title={b.name}
            subtitle={b.cuisine}
            image={b.image}
            rating={b.rating}
            address={b.address}
            hours={b.hours}
            badge={b.liveMusic ? "🎵 Música ao vivo" : "Coquetelaria"}
            coords={b.coords}
          />
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="rounded-3xl bg-secondary p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Agenda musical de Aracaju</h3>
              <p className="text-sm text-muted-foreground">Veja os shows da semana e garanta seu ingresso.</p>
            </div>
          </div>
          <a href="/shows" className="rounded-xl bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent">
            Ver agenda
          </a>
        </div>
      </section>
    </Layout>
  );
}
