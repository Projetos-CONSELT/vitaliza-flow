import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  UserCog,
  Users,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { appointments, patients, professionals, services, currentUser } = useApp();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppts = appointments
    .filter((a) => a.date === todayStr && a.status !== "cancelado")
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcoming = todayAppts.slice(0, 5);
  const faltas = appointments.filter((a) => a.date === todayStr && a.status === "falta").length;

  const stats = [
    {
      label: "Agendamentos hoje",
      value: todayAppts.length,
      hint: "+2 em relação a ontem",
      icon: CalendarCheck,
      tone: "primary" as const,
    },
    {
      label: "Profissionais ativos",
      value: professionals.length,
      hint: "Todos disponíveis",
      icon: UserCog,
      tone: "secondary" as const,
    },
    {
      label: "Pacientes cadastrados",
      value: patients.length,
      hint: "+5 este mês",
      icon: Users,
      tone: "success" as const,
    },
    {
      label: "Faltas hoje",
      value: faltas,
      hint: "Ver detalhes",
      icon: AlertTriangle,
      tone: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-display text-2xl font-bold">
          Olá, {currentUser?.name.split(" ")[0]}! 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bem-vinda de volta à Vitaliza Fisioterapia ·{" "}
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 shadow-soft border-border/60">
            <div className="flex items-start justify-between mb-3">
              <span
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  s.tone === "primary"
                    ? "bg-primary-soft text-primary"
                    : s.tone === "secondary"
                    ? "bg-secondary-soft text-secondary-foreground"
                    : s.tone === "success"
                    ? "bg-primary-soft text-success"
                    : "bg-warning/15 text-warning-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="font-display text-3xl font-bold leading-none">{s.value}</p>
            <p className="text-sm font-medium mt-2">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 shadow-soft border-border/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Próximos atendimentos</h3>
            <Link to="/agenda" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver agenda completa <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              Nenhum atendimento restante para hoje.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {upcoming.map((a) => {
                const patient = patients.find((p) => p.id === a.patientId);
                const service = services.find((s) => s.id === a.serviceId);
                const prof = professionals.find((p) => p.id === a.professionalId);
                return (
                  <div key={a.id} className="flex items-center gap-4 py-3">
                    <div className="w-14 text-center">
                      <p className="font-display font-bold text-primary">{a.time}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {service?.name} · {prof?.name}
                      </p>
                    </div>
                    <Badge
                      variant={a.status === "confirmado" ? "default" : "secondary"}
                      className={
                        a.status === "confirmado"
                          ? "bg-primary-soft text-primary hover:bg-primary-soft"
                          : ""
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-soft border-border/60">
          <h3 className="font-display font-semibold text-lg mb-4">Horários livres hoje</h3>
          <div className="space-y-2">
            {professionals.slice(0, 4).map((p) => {
              const busyCount = appointments.filter(
                (a) => a.date === todayStr && a.professionalId === p.id && a.status !== "cancelado"
              ).length;
              const totalSlots = 10;
              const free = Math.max(totalSlots - busyCount, 0);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-display font-semibold text-sm">{free}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/agenda/novo" className="block mt-4">
            <Button className="w-full bg-gradient-primary hover:opacity-90">Novo agendamento</Button>
          </Link>
        </Card>
      </div>

      {isToday(new Date()) && faltas > 0 && (
        <Card className="p-4 border-warning/30 bg-warning/5 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground shrink-0" />
          <p className="text-sm">
            <strong>{faltas} faltas</strong> registradas hoje. Considere ligar para confirmar próximos pacientes.
          </p>
        </Card>
      )}
    </div>
  );
}
