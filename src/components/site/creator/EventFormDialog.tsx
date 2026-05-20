import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, LoaderCircle, MapPinned } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryLabel, type EventCategory, type EventDraft, type ManagedEvent } from "@/lib/event-manager";

const eventFormSchema = z.object({
  title: z.string().min(3, "Informe um nome com pelo menos 3 caracteres."),
  artist: z.string().min(2, "Informe a atracao principal."),
  description: z.string().min(20, "Descreva melhor o evento para o publico."),
  category: z.enum(["Forro", "Sertanejo", "Pagode", "Eletronica", "Festival"]),
  date: z.string().min(1, "Selecione a data do evento."),
  time: z.string().min(1, "Informe o horario."),
  venue: z.string().min(3, "Informe o local do evento."),
  address: z.string().min(6, "Informe um endereco mais completo."),
  city: z.string().min(2, "Informe a cidade."),
  price: z.coerce.number().min(0, "O preco nao pode ser negativo."),
  ticketsTotal: z.coerce.number().int().min(1, "Adicione pelo menos 1 ingresso."),
  image: z.string().min(1, "Adicione um banner ou imagem para o evento."),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const categories: EventCategory[] = ["Forro", "Festival", "Pagode", "Sertanejo", "Eletronica"];

function getDefaultValues(event?: ManagedEvent): EventFormValues {
  return {
    title: event?.title ?? "",
    artist: event?.artist ?? "",
    description: event?.description ?? "",
    category: event?.category ?? "Forro",
    date: event?.date ?? "",
    time: event?.time ?? "",
    venue: event?.venue ?? "",
    address: event?.address ?? "",
    city: event?.city ?? "Aracaju",
    price: event?.price ?? 0,
    ticketsTotal: event?.ticketsTotal ?? 300,
    image: event?.image ?? "",
    lat: event?.coords.lat ?? -10.9472,
    lng: event?.coords.lng ?? -37.0731,
  };
}

export function EventFormDialog({
  open,
  onOpenChange,
  initialEvent,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEvent?: ManagedEvent;
  onSubmit: (values: EventDraft) => void;
}) {
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [preview, setPreview] = useState(initialEvent?.image ?? "");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: getDefaultValues(initialEvent),
  });

  useEffect(() => {
    if (!open) return;
    const values = getDefaultValues(initialEvent);
    form.reset(values);
    setPreview(values.image);
  }, [form, initialEvent, open]);

  const handleFileChange = (file?: File) => {
    if (!file) return;

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      form.setValue("image", result, { shouldDirty: true, shouldValidate: true });
      setPreview(result);
      setIsReadingFile(false);
    };
    reader.onerror = () => setIsReadingFile(false);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (values: EventFormValues) => {
    onSubmit({
      title: values.title,
      artist: values.artist,
      description: values.description,
      category: values.category,
      date: values.date,
      time: values.time,
      venue: values.venue,
      address: values.address,
      city: values.city,
      price: values.price,
      ticketsTotal: values.ticketsTotal,
      image: values.image,
      coords: {
        lat: values.lat,
        lng: values.lng,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto rounded-[2rem] border-0 p-0 shadow-elevated">
        <div className="grid lg:grid-cols-[1.1fr_1.4fr]">
          <div className="bg-gradient-primary p-8 text-primary-foreground">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                {initialEvent ? "Editar evento" : "Novo evento"}
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Monte o evento completo com visual, capacidade, localizacao e informacoes para a agenda e o mapa.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] bg-white/12 p-3 backdrop-blur-md">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/10">
                {preview ? (
                  <img src={preview} alt="Preview do evento" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-white/78">
                    <ImagePlus className="h-10 w-10" />
                    <p className="mt-4 text-sm">Adicione uma imagem para visualizar o banner aqui.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPinned className="h-4 w-4" /> Dica de mapa
              </div>
              <p className="mt-2 text-sm text-white/80">
                Preencha latitude e longitude corretamente para o evento aparecer no mapa principal e na busca por proximidade.
              </p>
            </div>
          </div>

          <div className="bg-background p-6 md:p-8">
            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nome do evento</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11 rounded-xl" placeholder="Ex.: Sunset na Orla" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atracao principal</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11 rounded-xl" placeholder="Nome do artista ou headline" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {getCategoryLabel(category)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descricao</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-28 rounded-xl"
                            placeholder="Resumo do conceito do evento, clima, publico e proposta."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horario</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11 rounded-xl" placeholder="Espaco ou arena" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11 rounded-xl" placeholder="Aracaju" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Localizacao</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11 rounded-xl" placeholder="Endereco completo para mapa e agenda" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Banner ou imagem</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-11 rounded-xl"
                            placeholder="Cole a URL da imagem ou use o upload abaixo"
                            onChange={(event) => {
                              field.onChange(event);
                              setPreview(event.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          URLs externas e imagens carregadas do dispositivo funcionam para o preview.
                        </FormDescription>
                        <div className="mt-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
                          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-card shadow-soft">
                              {isReadingFile ? (
                                <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                              ) : (
                                <ImagePlus className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <div>Enviar do dispositivo</div>
                              <div className="text-xs text-muted-foreground">
                                Gere um preview imediato para o card e o mapa.
                              </div>
                            </div>
                            <input
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={(event) => handleFileChange(event.target.files?.[0])}
                            />
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ticketsTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de ingressos</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={1} className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preco</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step="1" className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.0001" className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.0001" className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                    {initialEvent ? "Salvar alteracoes" : "Criar evento"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
