import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { addDays, format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

export const Route = createFileRoute("/_app/relatorios")({
  component: RelatoriosPage,
});

const COLORS = ["#6FBF8F", "#A7D8F0", "#F2C879", "#B79CED", "#F09494"];

function RelatoriosPage() {
  const { appointments, services } = useApp();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(weekStart, i);
        const ds = format(d, "yyyy-MM-dd");
        const day = appointments.filter((a) => a.date === ds && a.status !== "cancelado");
        return {
          dia: format(d, "EEE", { locale: ptBR }),
          atendimentos: day.length,
          faltas: day.filter((a) => a.status === "falta").length,
        };
      }),
    [appointments, weekStart]
  );

  const totalAtendimentos = appointments.filter((a) => a.status === "realizado").length;
  const totalFaltas = appointments.filter((a) => a.status === "falta").length;
  const taxaFaltas =
    totalAtendimentos + totalFaltas > 0
      ? Math.round((totalFaltas / (totalAtendimentos + totalFaltas)) * 100)
      : 0;

  const serviceCount = useMemo(() => {
    const map = new Map<string, number>();
    appointments
      .filter((a) => a.status !== "cancelado")
      .forEach((a) => map.set(a.serviceId, (map.get(a.serviceId) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([id, count]) => ({
        name: services.find((s) => s.id === id)?.name ?? "—",
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [appointments, services]);

  const topService = serviceCount[0];

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold">Relatórios</h2>
        <p className="text-sm text-muted-foreground">
          Visão geral do desempenho da clínica
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-soft border-border/60">
          <p className="text-sm text-muted-foreground">Atendimentos realizados</p>
          <p className="font-display text-3xl font-bold mt-1">{totalAtendimentos}</p>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="h-3.5 w-3.5" /> +12% em relação ao mês passado
          </div>
        </Card>
        <Card className="p-5 shadow-soft border-border/60">
          <p className="text-sm text-muted-foreground">Taxa de faltas</p>
          <p className="font-display text-3xl font-bold mt-1">{taxaFaltas}%</p>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingDown className="h-3.5 w-3.5" /> -2% em relação ao mês passado
          </div>
        </Card>
        <Card className="p-5 shadow-soft border-border/60">
          <p className="text-sm text-muted-foreground">Serviço mais realizado</p>
          <p className="font-display text-lg font-bold mt-1 leading-tight">
            {topService?.name ?? "—"}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Award className="h-3.5 w-3.5 text-warning-foreground" />{" "}
            {topService?.value ?? 0} atendimentos
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 shadow-soft border-border/60">
          <h3 className="font-display font-semibold mb-4">Atendimentos da semana</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="atendimentos" fill="#6FBF8F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="faltas" fill="#F09494" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-soft border-border/60">
          <h3 className="font-display font-semibold mb-4">Serviços mais realizados</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceCount}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {serviceCount.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-xs space-y-1 mt-2">
            {serviceCount.slice(0, 5).map((s, i) => (
              <li key={s.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="text-muted-foreground">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
