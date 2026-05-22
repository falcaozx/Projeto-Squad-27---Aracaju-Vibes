import { createFileRoute } from "@tanstack/react-router";
import { Music } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceCard } from "@/components/site/PlaceCard";
import { bars } from "@/data";

export const Route = createFileRoute("/bares")({
  component: BarsPage,
  head: () => ({
    meta: [
      { title: "Bares em Aracaju — Música ao vivo e coquetelaria" },
      { name: "description", content: "Os melhores bares de Aracaju, com forró, sertanejo, rock e coquetelaria autoral." },
    ],
  }),
});

function formatBarHours(hours: string) {
  return hours.replaceAll("; ", " • ");
}

function BarsPage() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Vida noturna"
        title="Bares & Música ao vivo"
        description="Da brisa da Orla à boemia do centro, os melhores endereços para começar — ou terminar — a noite."
      />

      <section className="mx-auto mt-10 grid max-w-7xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {bars.map((bar) => (
          <PlaceCard
            key={bar.id}
            id={bar.id}
            title={bar.name}
            subtitle={`${bar.cuisine} • ${bar.price}`}
            image={bar.image}
            rating={bar.rating}
            address={bar.address}
            hours={formatBarHours(bar.hours)}
            badge={bar.liveMusic ? "Música ao vivo" : "Coquetelaria"}
            coords={bar.coords}
          />
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-secondary p-8 md:flex-row md:items-center md:p-12">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Agenda musical de Aracaju</h3>
              <p className="text-sm text-muted-foreground">Veja os shows da semana e garanta seu ingresso.</p>
            </div>
          </div>
          <a
            href="/shows"
            className="rounded-xl bg-gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent"
          >
            Ver agenda
          </a>
        </div>
      </section>
    </Layout>
  );
}
