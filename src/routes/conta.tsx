import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarClock, Heart, LogOut, ShieldCheck, Ticket, UserRound, UtensilsCrossed, Waves } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { EventCreatorDashboard } from "@/components/site/creator/EventCreatorDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { useEventManager } from "@/lib/event-manager";

export const Route = createFileRoute("/conta")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Minha Conta - Aracaju Turismo" },
      {
        name: "description",
        content: "Dashboard do usuário com área pessoal e espaço de organizador para criação e gestão de eventos.",
      },
    ],
  }),
});

function AccountPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { events } = useEventManager();

  if (!user) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 pt-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Entre para acessar sua conta</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Seu dashboard pessoal aparece aqui depois do login ou cadastro.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Ir para entrar
          </Link>
        </div>
      </Layout>
    );
  }

  const organizerEvents = user.isOrganizer ? events : [];

  return (
    <Layout>
      <PageHeader
        eyebrow="Minha conta"
        title={`Olá, ${user.name}`}
        description="Seu dashboard reúne perfil, ingressos e, se você for organizador, também a operação dos seus eventos."
      />

      <section className="mx-auto mt-10 max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="overflow-hidden rounded-[2rem] bg-card shadow-elevated"
        >
          <div className="relative overflow-hidden bg-gradient-primary px-6 py-8 text-primary-foreground md:px-8">
            <div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-white/15 px-3 py-1 text-white">
                    <UserRound className="mr-1 h-3.5 w-3.5" /> Conta ativa
                  </Badge>
                  {user.isOrganizer && (
                    <Badge className="rounded-full bg-white/15 px-3 py-1 text-white">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Organizador
                    </Badge>
                  )}
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{user.email}</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/82">
                  Aqui você acompanha sua área pessoal e, quando aplicável, gerencia eventos criados por você.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {user.isOrganizer && (
                  <a
                    href="#meus-eventos"
                    className="inline-flex items-center rounded-xl bg-white/95 px-5 py-3 text-sm font-semibold text-primary-deep shadow-soft"
                  >
                    Ver meus eventos
                  </a>
                )}
                <Button
                  variant="secondary"
                  className="rounded-xl bg-white/15 text-white hover:bg-white/20"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sair
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-secondary/55 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ingressos</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-muted-foreground">Compras recentes</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-secondary/55 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Favoritos</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Lugares salvos</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-secondary/55 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Criação</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.isOrganizer ? organizerEvents.length : 0}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.isOrganizer ? "Eventos no painel" : "Conta de visitante"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {!user.isOrganizer && (
        <section className="mx-auto mt-8 max-w-7xl px-4">
          <div className="rounded-[2rem] bg-card p-6 shadow-soft md:p-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-deep">
                Descubra Aracaju
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Aproveite sua conta para conhecer o melhor do turismo local.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                Explore as praias mais queridas da cidade e descubra restaurantes que fazem a experiência em Aracaju ficar ainda melhor.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Link
                to="/praias"
                className="group rounded-[1.5rem] bg-secondary/55 p-5 transition-all hover:bg-secondary/75"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                    <Waves className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Praias de Aracaju</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Veja opções para relaxar, caminhar na orla e aproveitar o litoral sergipano.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/restaurantes"
                className="group rounded-[1.5rem] bg-secondary/55 p-5 transition-all hover:bg-secondary/75"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Restaurantes</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Descubra sabores locais, frutos do mar e lugares especiais para comer bem em Aracaju.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {user.isOrganizer && (
        <div id="meus-eventos">
          <EventCreatorDashboard />
        </div>
      )}
    </Layout>
  );
}
