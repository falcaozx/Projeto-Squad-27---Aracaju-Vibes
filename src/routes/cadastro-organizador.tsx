import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, FileBadge2, LoaderCircle, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/cadastro-organizador")({
  component: OrganizerSignUpPage,
  head: () => ({ meta: [{ title: "Cadastro de Organizador - Aracaju Turismo" }] }),
});

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function OrganizerSignUpPage() {
  const navigate = useNavigate();
  const {
    user,
    pendingOrganizerSignUp,
    completeOrganizerSignUp,
    clearPendingOrganizerSignUp,
  } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [step, setStep] = useState<"form" | "verifying" | "approved">("form");

  useEffect(() => {
    if (user?.isOrganizer && step === "form") {
      navigate({ to: "/conta" });
      return;
    }

    if (!pendingOrganizerSignUp && step === "form") {
      navigate({ to: "/login" });
    }
  }, [navigate, pendingOrganizerSignUp, step, user]);

  useEffect(() => {
    if (step !== "verifying" || !pendingOrganizerSignUp) return;

    const approvalTimeout = window.setTimeout(() => {
      completeOrganizerSignUp({
        companyName,
        cnpj,
        status: "approved",
      });
      setStep("approved");
    }, 2200);

    return () => {
      window.clearTimeout(approvalTimeout);
    };
  }, [cnpj, companyName, completeOrganizerSignUp, pendingOrganizerSignUp, step]);

  useEffect(() => {
    if (step !== "approved") return;

    const redirectTimeout = window.setTimeout(() => {
      navigate({ to: "/conta" });
    }, 3000);

    return () => {
      window.clearTimeout(redirectTimeout);
    };
  }, [navigate, step]);

  const pendingName = useMemo(() => pendingOrganizerSignUp?.name || "Organizador", [pendingOrganizerSignUp]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyName.trim() || cnpj.replace(/\D/g, "").length < 14) return;

    setStep("verifying");
  };

  if (!pendingOrganizerSignUp && !user?.isOrganizer) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 pt-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="overflow-hidden rounded-[2rem] bg-card shadow-elevated"
        >
          <div className="relative overflow-hidden bg-gradient-primary px-6 py-8 text-primary-foreground md:px-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                <ShieldCheck className="h-3.5 w-3.5" /> Cadastro de organizador
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {step === "form" ? "Agora vamos validar sua empresa" : "Estamos validando seu acesso"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/82 md:text-base">
                {step === "form"
                  ? `${pendingName}, preencha os dados da sua empresa para liberar a área de criação de shows e eventos.`
                  : "Falta só um instante para concluir sua aprovação como organizador na plataforma."}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {step === "form" && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="Nome da empresa"
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="relative">
                    <FileBadge2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={cnpj}
                      onChange={(event) => setCnpj(formatCnpj(event.target.value))}
                      inputMode="numeric"
                      placeholder="CNPJ"
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button className="inline-flex items-center rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
                      Enviar para verificação
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        clearPendingOrganizerSignUp();
                        navigate({ to: "/login" });
                      }}
                      className="inline-flex items-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground"
                    >
                      Voltar
                    </button>
                  </div>
                </form>

                <div className="rounded-[1.75rem] bg-secondary/45 p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Triagem do organizador
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p>Coletamos os dados da empresa para separar perfis pessoais de criadores de eventos.</p>
                    <p>Depois da aprovação, sua conta entra com acesso ao dashboard de criação e gestão de shows.</p>
                    <p>Esse fluxo também ajuda a manter a área de promotores mais organizada e confiável.</p>
                  </div>
                </div>
              </div>
            )}

            {step !== "form" && (
              <div className="flex min-h-[320px] items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-xl rounded-[1.75rem] bg-secondary/45 p-8 text-center shadow-soft"
                >
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-card shadow-soft">
                    {step === "verifying" ? (
                      <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                    ) : (
                      <BadgeCheck className="h-10 w-10 text-emerald-600" />
                    )}
                  </div>

                  <h2 className="mt-6 text-2xl font-bold tracking-tight">
                    {step === "verifying"
                      ? "Estamos verificando sua empresa"
                      : "Empresa aprovada com sucesso"}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                    {step === "verifying"
                      ? "Estamos analisando as informações enviadas para liberar seu acesso como criador de shows e eventos."
                      : "Sua empresa foi aprovada e sua conta já está sendo liberada para atuar como criador de shows e eventos no site."}
                  </p>

                  {step === "approved" && (
                    <p className="mt-4 text-sm font-semibold text-primary">
                      Redirecionando para o dashboard...
                    </p>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Se preferir revisar os dados depois, volte para <Link to="/login" className="font-semibold text-primary">entrar</Link>.
        </p>
      </div>
    </Layout>
  );
}
