import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import logo from "@/assets/vitaliza-logo.png";
import type { UserRole } from "@/lib/types";
import { Stethoscope, UserCircle2, Briefcase } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitaliza Fisioterapia — Acesso" },
      { name: "description", content: "Sistema de gestão da Clínica Vitaliza Fisioterapia." },
    ],
  }),
  component: LoginPage,
});

const roleOptions: { role: UserRole; label: string; icon: typeof UserCircle2 }[] = [
  { role: "recepcionista", label: "Recepcionista", icon: UserCircle2 },
  { role: "fisioterapeuta", label: "Fisioterapeuta", icon: Stethoscope },
  { role: "gestor", label: "Gestor", icon: Briefcase },
];

function LoginPage() {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("recepcionista");
  const [email, setEmail] = useState("mariana@vitaliza.com");
  const [password, setPassword] = useState("vitaliza");

  if (currentUser) {
    // Already logged in
    setTimeout(() => navigate({ to: "/dashboard" }), 0);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Vitaliza Fisioterapia"
            className="h-24 w-24 mx-auto mb-4 object-contain"
            width={96}
            height={96}
          />
          <h1 className="font-display font-bold text-2xl text-foreground">Bem-vindo(a)!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faça login para acessar o sistema
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl shadow-card p-6 sm:p-8 space-y-5 border border-border"
        >
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tipo de acesso
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {roleOptions.map(({ role: r, label, icon: Icon }) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-medium leading-tight text-center">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded border-border accent-primary" />
              Lembrar de mim
            </label>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-primary hover:opacity-90 font-display font-semibold text-base shadow-soft"
          >
            Entrar
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Demonstração — qualquer e-mail/senha funciona
          </p>
        </form>
      </div>
    </div>
  );
}
