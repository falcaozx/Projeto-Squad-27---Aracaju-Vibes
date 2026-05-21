import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { EventMapSection } from "@/components/site/EventMapSection";

export const Route = createFileRoute("/mapa")({
  component: MapPage,
  head: () => ({ meta: [{ title: "Mapa de Aracaju - Eventos próximos" }] }),
});

function MapPage() {
  return (
    <Layout>
      <EventMapSection
        mapOnly
        title="Mapa de Aracaju"
        description="Mapa completo"
      />
    </Layout>
  );
}
