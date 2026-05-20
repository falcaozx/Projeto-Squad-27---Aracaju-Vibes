import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Entrar - Aracaju Turismo" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "login") {
      signIn({ email: email || "visitante@aju.com", password });
      navigate({ to: "/conta" });
      return;
    }

    signUp({
      name: name || "Novo usuario",
      email: email || "visitante@aju.com",
      password,
      isOrganizer,
    });
    navigate({ to: "/conta" });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 pt-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="rounded-3xl bg-card p-7 shadow-soft"
        >
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Digite qualquer e-mail e senha para entrar no dashboard normal."
                : "Cadastre uma conta pessoal e marque se voce tambem organiza eventos."}
            </p>
          </div>

          <div className="mt-6 flex rounded-xl bg-secondary p-1">
            {(["login", "signup"] as const).map((currentMode) => (
              <button
                key={currentMode}
                onClick={() => setMode(currentMode)}
                className="relative flex-1 rounded-lg py-2 text-sm font-semibold"
                type="button"
              >
                {mode === currentMode && (
                  <motion.span
                    layoutId="auth-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-card shadow-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={mode === currentMode ? "text-primary-deep" : "text-muted-foreground"}>
                  {currentMode === "login" ? "Entrar" : "Cadastrar"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Senha"
                className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {mode === "signup" && (
              <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="is-organizer"
                    checked={isOrganizer}
                    onCheckedChange={(checked) => setIsOrganizer(Boolean(checked))}
                    className="mt-0.5"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="is-organizer" className="text-sm font-semibold">
                      Sou organizador ou criador de eventos
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Se marcar esta opcao, sua conta entra no dashboard pessoal e tambem ganha a area de criacao e edicao de eventos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button className="w-full rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow">
              {mode === "login" ? "Entrar no dashboard" : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Ao continuar, voce aceita os <Link to="/" className="font-semibold text-primary">Termos</Link>.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
