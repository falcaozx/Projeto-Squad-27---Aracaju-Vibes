import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { PlaceCard } from "@/components/site/PlaceCard";
import { useFavorites } from "@/lib/favorites";
import { restaurants, bars, beaches, attractions, events, highlights } from "@/data";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoritos")({
  component: FavPage,
  head: () => ({ meta: [{ title: "Meus Favoritos — Aracaju Turismo" }] }),
});

function FavPage() {
  const { ids } = useFavorites();

  const all = [
    ...highlights.map((h) => ({ id: h.id, title: h.title, subtitle: h.subtitle, image: h.image })),
    ...restaurants.map((r) => ({ id: r.id, title: r.name, subtitle: r.cuisine, image: r.image, rating: r.rating, address: r.address, hours: r.hours })),
    ...bars.map((b) => ({ id: b.id, title: b.name, subtitle: b.cuisine, image: b.image, rating: b.rating, address: b.address, hours: b.hours })),
    ...beaches.map((b) => ({ id: b.id, title: b.name, subtitle: b.short, image: b.image })),
    ...attractions.map((a) => ({ id: a.id, title: a.name, subtitle: a.category, image: a.image, hours: a.hours })),
    ...events.map((e) => ({ id: e.id, title: e.title, subtitle: e.artist, image: e.image })),
  ];

  const favs = all.filter((x) => ids.has(x.id));

  return (
    <Layout>
      <PageHeader eyebrow="Sua coleção" title="Meus favoritos" description="Tudo que você salvou para a próxima visita." />
      <section className="mx-auto max-w-7xl px-4 mt-10">
        {favs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-5 text-lg font-bold">Nenhum favorito ainda</h3>
            <p className="mt-1 text-sm text-muted-foreground">Toque no coração de qualquer card para salvar aqui.</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
              Explorar Aracaju
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((f) => <PlaceCard key={f.id} {...f} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
