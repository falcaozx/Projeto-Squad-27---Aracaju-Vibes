import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  MapPinned,
  Pencil,
  Plus,
  Ticket,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventFormDialog } from "@/components/site/creator/EventFormDialog";
import {
  formatEventDateLong,
  formatEventPrice,
  getCategoryLabel,
  getRemainingTickets,
  useEventManager,
  type ManagedEvent,
} from "@/lib/event-manager";

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarClock;
}) {
  return (
    <div className="rounded-[1.75rem] bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: ManagedEvent;
  onEdit: (event: ManagedEvent) => void;
  onDelete: (event: ManagedEvent) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-[1.85rem] bg-card shadow-soft"
    >
      <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
        <div className="relative h-full min-h-64 overflow-hidden">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 via-transparent" />
          <Badge className="absolute left-4 top-4 rounded-full bg-gradient-accent px-3 py-1 text-accent-foreground shadow-accent">
            {getCategoryLabel(event.category)}
          </Badge>
          <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
            <div className="text-xs uppercase tracking-[0.18em] text-white/80">{formatEventDateLong(event.date)}</div>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{event.title}</h3>
          </div>
        </div>

        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                {event.artist}
              </Badge>
              <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]">
                {event.time}
              </Badge>
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{event.description}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-secondary/55 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Local</div>
                <div className="mt-2 text-sm font-semibold">{event.venue}</div>
                <div className="mt-1 text-xs text-muted-foreground">{event.address}</div>
              </div>
              <div className="rounded-2xl bg-secondary/55 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ingressos</div>
                <div className="mt-2 text-sm font-semibold">{event.ticketsTotal} totais</div>
                <div className="mt-1 text-xs text-muted-foreground">{getRemainingTickets(event)} disponiveis</div>
              </div>
              <div className="rounded-2xl bg-secondary/55 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Preco</div>
                <div className="mt-2 text-sm font-semibold text-primary">{formatEventPrice(event.price)}</div>
                <div className="mt-1 text-xs text-muted-foreground">{event.city}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-xl" onClick={() => onEdit(event)}>
              <Pencil className="h-4 w-4" /> Editar
            </Button>
            <Button variant="destructive" className="rounded-xl" onClick={() => onDelete(event)}>
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function EventCreatorDashboard() {
  const { events, createEvent, updateEvent, deleteEvent } = useEventManager();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | undefined>();
  const [eventToDelete, setEventToDelete] = useState<ManagedEvent | undefined>();

  const upcomingEvents = useMemo(() => events.filter((event) => new Date(event.date).getTime() >= Date.now() - 86400000), [events]);
  const soldTickets = useMemo(() => events.reduce((total, event) => total + event.ticketsSold, 0), [events]);
  const remainingTickets = useMemo(() => events.reduce((total, event) => total + getRemainingTickets(event), 0), [events]);
  const projectedRevenue = useMemo(() => events.reduce((total, event) => total + event.price * event.ticketsTotal, 0), [events]);

  return (
    <>
      <section className="mx-auto mt-10 max-w-7xl px-4">
        <div className="overflow-hidden rounded-[2rem] bg-card shadow-elevated">
          <div className="relative overflow-hidden bg-gradient-primary px-6 py-8 text-primary-foreground md:px-8 md:py-10">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/14 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  <CalendarClock className="h-3.5 w-3.5" /> Painel do promotor
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                  Dashboard completo para criar, operar e acompanhar eventos.
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-white/84 md:text-base">
                  Gerencie agenda, capacidade, imagem, localização e precificação sem sair do padrão visual do produto.
                </p>
              </div>

              <Button
                className="rounded-2xl bg-white text-primary-deep shadow-soft hover:bg-white/95"
                onClick={() => {
                  setEditingEvent(undefined);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Criar novo evento
              </Button>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Eventos ativos" value={String(upcomingEvents.length)} icon={CalendarClock} />
            <MetricCard label="Ingressos vendidos" value={String(soldTickets)} icon={Ticket} />
            <MetricCard label="Disponíveis" value={String(remainingTickets)} icon={Wallet} />
            <MetricCard label="Receita potencial" value={formatEventPrice(projectedRevenue)} icon={MapPinned} />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4">
        <Tabs defaultValue="upcoming">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Operação de eventos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Edite rapidamente os cards já publicados, mantenha lotes e atualize dados do mapa.
              </p>
            </div>
            <TabsList className="h-11 rounded-xl bg-secondary p-1">
              <TabsTrigger className="rounded-lg px-4" value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger className="rounded-lg px-4" value="all">Todos</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="mt-6 space-y-5">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(selectedEvent) => {
                  setEditingEvent(selectedEvent);
                  setDialogOpen(true);
                }}
                onDelete={setEventToDelete}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="mt-6 space-y-5">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(selectedEvent) => {
                  setEditingEvent(selectedEvent);
                  setDialogOpen(true);
                }}
                onDelete={setEventToDelete}
              />
            ))}
          </TabsContent>
        </Tabs>
      </section>

      <EventFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(undefined);
        }}
        initialEvent={editingEvent}
        onSubmit={(values) => {
          if (editingEvent) {
            updateEvent(editingEvent.id, { ...values, ticketsSold: editingEvent.ticketsSold });
            return;
          }

          createEvent(values);
        }}
      />

      <AlertDialog open={Boolean(eventToDelete)} onOpenChange={(open) => !open && setEventToDelete(undefined)}>
        <AlertDialogContent className="rounded-[1.75rem] border-0 shadow-elevated">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evento</AlertDialogTitle>
            <AlertDialogDescription>
              {eventToDelete
                ? `Você está removendo "${eventToDelete.title}" da agenda e do mapa de eventos próximos.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (eventToDelete) {
                  deleteEvent(eventToDelete.id);
                }
                setEventToDelete(undefined);
              }}
            >
              Excluir agora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
