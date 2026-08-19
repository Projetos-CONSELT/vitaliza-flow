import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/vitaliza-logo.png";
import type { UserRole } from "@/lib/types";
import { Stethoscope, UserCircle2, Briefcase, KeyRound, Info, X, Check, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitaliza Fisioterapia — Acesso" },
      { name: "description", content: "Sistema de gestão da Clínica Vitaliza Fisioterapia." },
    ],
  }),
  component: LoginPage,
});

const demoAccounts: {
  role: UserRole;
  label: string;
  name: string;
  email: string;
  pass: string;
  desc: string;
  icon: typeof UserCircle2;
}[] = [
  {
    role: "recepcionista",
    label: "Recepcionista",
    name: "Mariana Silva",
    email: "mariana@vitaliza.com",
    pass: "vitaliza",
    desc: "Acesso à agenda, marcação de consultas e cadastro de pacientes",
    icon: UserCircle2,
  },
  {
    role: "fisioterapeuta",
    label: "Fisioterapeuta",
    name: "Dra. Juliana Costa",
    email: "juliana@vitaliza.com",
    pass: "vitaliza",
    desc: "Visualização de atendimentos, histórico clínico e horários",
    icon: Stethoscope,
  },
  {
    role: "gestor",
    label: "Gestor",
    name: "Roberto Almeida",
    email: "roberto@vitaliza.com",
    pass: "vitaliza",
    desc: "Acesso a relatórios financeiros, estatísticas e configurações",
    icon: Briefcase,
  },
];

function LoginPage() {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("recepcionista");
  const [email, setEmail] = useState("mariana@vitaliza.com");
  const [password, setPassword] = useState("vitaliza");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      navigate({ to: "/dashboard" });
    }
  }, [currentUser, navigate]);

  const selectAccount = (account: typeof demoAccounts[0]) => {
    setRole(account.role);
    setEmail(account.email);
    setPassword(account.pass);
    setCopiedRole(account.role);
    setTimeout(() => setCopiedRole(null), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft via-background to-secondary-soft px-4 py-10 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Vitaliza Fisioterapia"
            className="h-20 w-20 mx-auto mb-3 object-contain"
            width={80}
            height={80}
          />
          <h1 className="font-display font-bold text-2xl text-foreground">Bem-vindo(a)!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Botão de Destaque para Ver Credenciais da Demo */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowCredsModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold border border-primary/30 transition-all shadow-sm group"
          >
            <KeyRound className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>Ver Usuários & Senhas de Demonstração</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl shadow-card p-6 sm:p-8 space-y-5 border border-border"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tipo de acesso
              </Label>
              <button
                type="button"
                onClick={() => setShowCredsModal(true)}
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                <Info className="h-3 w-3" /> Ver credenciais
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const active = role === acc.role;
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => selectAccount(acc)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary-soft text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-medium leading-tight text-center">
                      {acc.label}
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors rounded-md focus:outline-none"
                tabIndex={-1}
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border accent-primary" defaultChecked />
              Lembrar de mim
            </label>
            <button
              type="button"
              onClick={() => setShowCredsModal(true)}
              className="text-primary hover:underline font-medium text-xs"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-primary hover:opacity-90 font-display font-semibold text-base shadow-soft"
          >
            Entrar no Painel
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-1">
            Selecione qualquer perfil acima para preencher automaticamente
          </p>
        </form>
      </div>

      {/* POP-UP MODAL COM TODAS AS CREDENCIAIS DE ACESSO */}
      {showCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowCredsModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Credenciais de Acesso</h3>
                <p className="text-xs text-muted-foreground">Clique em um perfil para utilizá-lo no login</p>
              </div>
            </div>

            <div className="space-y-3 my-5">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = role === acc.role;
                return (
                  <div
                    key={acc.role}
                    onClick={() => {
                      selectAccount(acc);
                      setShowCredsModal(false);
                    }}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-soft/50 shadow-sm"
                        : "border-border hover:border-primary/50 bg-background/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-display font-semibold text-sm text-foreground">
                          {acc.label} ({acc.name})
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="text-[11px] font-medium text-primary flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Selecionado
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground group-hover:text-primary">
                          Usar este
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{acc.desc}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-muted/50 p-2 rounded-lg font-mono">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">E-mail:</span>
                        <span className="text-foreground select-all">{acc.email}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Senha:</span>
                        <span className="text-foreground select-all">{acc.pass}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCredsModal(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
