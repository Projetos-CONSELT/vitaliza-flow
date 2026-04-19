import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Edit3,
} from "lucide-react";
import { addDays, format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const Route = createFileRoute("/_app/agenda/")({
  component: AgendaPage,
});

const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 07..19

function AgendaPage() {
  const { appointments, professionals, patients, services, cancelAppointment } = useApp();
  const [view, setView] = useState<"dia" | "semana">("semana");
  const [profFilter, setProfFilter] = useState<string>("all");
  const [anchor, setAnchor] = useState<Date>(new Date());

  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = view === "semana" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [anchor];

  const filtered = appointments.filter(
    (a) => (profFilter === "all" || a.professionalId === profFilter) && a.status !== "cancelado"
  );

  const move = (delta: number) => {
    setAnchor(addDays(anchor, view === "semana" ? delta * 7 : delta));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Agenda</h2>
          <p className="text-sm text-muted-foreground">
            {view === "semana"
              ? `Semana de ${format(weekStart, "d 'de' MMM", { locale: ptBR })} a ${format(addDays(weekStart, 6), "d 'de' MMM, yyyy", { locale: ptBR })}`
              : format(anchor, "EEEE, d 'de' MMMM yyyy", { locale: ptBR })}
          </p>
        </div>
        <Link to="/agenda/novo">
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-1.5" /> Novo agendamento
          </Button>
        </Link>
      </div>

      <Card className="p-4 shadow-soft border-border/60">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => move(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setAnchor(new Date())}>
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => move(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex bg-muted rounded-lg p-1">
            {(["dia", "semana"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 h-8 rounded-md text-sm font-medium capitalize transition-colors ${
                  view === v ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Select value={profFilter} onValueChange={setProfFilter}>
            <SelectTrigger className="w-[220px] ml-auto">
              <SelectValue placeholder="Filtrar por profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os profissionais</SelectItem>
              {professionals.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div
            className="grid border-t border-border min-w-[700px]"
            style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {/* Header row */}
            <div />
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className="text-center py-2 border-l border-border"
              >
                <p className="text-xs uppercase text-muted-foreground">
                  {format(d, "EEE", { locale: ptBR })}
                </p>
                <p
                  className={`font-display font-bold text-lg ${
                    format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                      ? "text-primary"
                      : ""
                  }`}
                >
                  {format(d, "d")}
                </p>
              </div>
            ))}

            {/* Hour rows */}
            {HOURS.map((h) => (
              <div key={h} className="contents">
                <div className="text-xs text-muted-foreground py-2 pr-2 text-right border-t border-border">
                  {String(h).padStart(2, "0")}:00
                </div>
                {days.map((d) => {
                  const dateStr = format(d, "yyyy-MM-dd");
                  const cellAppts = filtered.filter(
                    (a) => a.date === dateStr && parseInt(a.time.split(":")[0]) === h
                  );
                  return (
                    <div
                      key={d.toISOString() + h}
                      className="border-l border-t border-border min-h-[64px] p-1 space-y-1 relative group"
                    >
                      {cellAppts.map((a) => {
                        const p = patients.find((x) => x.id === a.patientId);
                        const s = services.find((x) => x.id === a.serviceId);
                        const pr = professionals.find((x) => x.id === a.professionalId);
                        return (
                          <div
                            key={a.id}
                            className="rounded-md bg-primary-soft border border-primary/30 p-1.5 text-[11px] leading-tight"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-semibold text-foreground truncate">
                                {a.time} {p?.name}
                              </p>
                              <button
                                onClick={() => cancelAppointment(a.id)}
                                className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                                title="Cancelar"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-muted-foreground truncate">{s?.name}</p>
                            <p className="text-muted-foreground truncate text-[10px]">
                              {pr?.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-soft border-border/60">
        <h3 className="font-display font-semibold mb-3">Legenda de status</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary-soft text-primary hover:bg-primary-soft">Confirmado</Badge>
          <Badge variant="secondary">Pendente</Badge>
          <Badge variant="outline">Realizado</Badge>
          <Badge variant="destructive">Falta</Badge>
        </div>
      </Card>
    </div>
  );
}
