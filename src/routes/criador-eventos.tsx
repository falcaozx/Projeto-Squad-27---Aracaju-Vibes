import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHeader } from "@/components/site/PageHeader";
import { EventCreatorDashboard } from "@/components/site/creator/EventCreatorDashboard";

export const Route = createFileRoute("/criador-eventos")({
  component: EventCreatorPage,
  head: () => ({
    meta: [
      { title: "Criador de Eventos - Dashboard do Promotor" },
      {
        name: "description",
        content:
          "Crie, edite e publique eventos em Aracaju com dashboard responsiva, formularios validados e integracao com o mapa.",
      },
    ],
  }),
});

function EventCreatorPage() {
  return (
    <Layout>
      <PageHeader
        eyebrow="Area do criador"
        title="Dashboard do Promotor"
        description="Uma operacao completa para criar, editar e excluir eventos sem sair do ecossistema visual ja existente."
      />
      <EventCreatorDashboard />
    </Layout>
  );
}
