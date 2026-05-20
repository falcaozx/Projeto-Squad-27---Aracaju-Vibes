import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Minus, Plus, QrCode } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { formatEventPrice, useEventManager } from "@/lib/event-manager";

export const Route = createFileRoute("/checkout/$eventId")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { eventId } = Route.useParams();
  const { events } = useEventManager();
  const event = events.find((item) => item.id === eventId);
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState<"pix" | "card">("pix");

  if (!event) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl p-10 text-center">
          <h1 className="text-2xl font-bold">Evento nao encontrado</h1>
          <Link to="/shows" className="mt-4 inline-block text-primary font-semibold">
            Voltar para shows
          </Link>
        </div>
      </Layout>
    );
  }

  const total = event.price * qty;

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <button
          onClick={() => navigate({ to: "/shows" })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3].map((currentStep) => (
            <div key={currentStep} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  currentStep <= step ? "bg-gradient-primary" : "bg-secondary"
                }`}
              />
              <div
                className={`mt-2 text-xs font-semibold ${
                  currentStep <= step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {currentStep === 1 ? "Ingressos" : currentStep === 2 ? "Pagamento" : "Confirmacao"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
              >
                <div className="flex items-center gap-4">
                  <img src={event.image} alt={event.title} className="h-20 w-20 rounded-2xl object-cover" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {event.date} - {event.time}
                    </div>
                    <h2 className="text-xl font-bold">{event.title}</h2>
                    <div className="text-sm text-muted-foreground">{event.venue}</div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-secondary p-5">
                  <div>
                    <div className="font-semibold">Pista</div>
                    <div className="text-xs text-muted-foreground">Acesso geral</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold text-gradient">{formatEventPrice(total)}</div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow"
                >
                  Ir para pagamento
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
              >
                <h2 className="text-xl font-bold">Forma de pagamento</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {(["pix", "card"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setMethod(item)}
                      className={`rounded-2xl p-4 text-left transition-all ${
                        method === item
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item === "pix" ? <QrCode className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                        <span className="font-semibold">{item === "pix" ? "Pix" : "Cartao"}</span>
                      </div>
                      <div className={`mt-1 text-xs ${method === item ? "text-white/80" : "text-muted-foreground"}`}>
                        {item === "pix" ? "Aprovacao imediata" : "Credito ou debito"}
                      </div>
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="mt-5 space-y-3">
                    <input
                      placeholder="Numero do cartao"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        placeholder="MM/AA"
                        className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        placeholder="CVV"
                        className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(3)}
                  className="mt-6 w-full rounded-xl bg-gradient-accent py-3 font-semibold text-accent-foreground shadow-accent"
                >
                  Pagar {event.price === 0 ? "" : formatEventPrice(total)}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-primary shadow-glow"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h2 className="mt-5 text-2xl font-bold">Ingresso confirmado!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Apresente o QR Code na portaria para acessar o evento.
                </p>

                <div className="mx-auto mt-8 max-w-xs rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
                  <div className="rounded-2xl bg-white p-4">
                    <svg viewBox="0 0 100 100" className="h-auto w-full text-primary-deep">
                      <rect width="100" height="100" fill="#fff" />
                      {Array.from({ length: 100 }).map((_, index) => {
                        const x = (index % 10) * 10;
                        const y = Math.floor(index / 10) * 10;
                        return Math.random() > 0.5 ? (
                          <rect key={index} x={x} y={y} width="10" height="10" fill="currentColor" />
                        ) : null;
                      })}
                    </svg>
                  </div>
                  <div className="mt-4 text-left">
                    <div className="text-xs uppercase tracking-wider opacity-80">{event.date}</div>
                    <div className="font-bold">{event.title}</div>
                    <div className="mt-1 text-xs opacity-80">
                      {event.venue} - {qty}x
                    </div>
                  </div>
                </div>

                <Link to="/meus-ingressos" className="mt-8 inline-block text-sm font-semibold text-primary hover:underline">
                  Ver meus ingressos →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
