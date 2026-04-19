import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { settings, updateSettings, users, resetData } = useApp();
  const [opening, setOpening] = useState(settings.openingTime);
  const [closing, setClosing] = useState(settings.closingTime);
  const [slot, setSlot] = useState(settings.slotMinutes);
  const [clinicName, setClinicName] = useState(settings.clinicName);

  const save = () => {
    updateSettings({
      openingTime: opening,
      closingTime: closing,
      slotMinutes: Number(slot) || 30,
      clinicName,
    });
    toast.success("Configurações salvas!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Ajuste preferências do sistema, horários e usuários
        </p>
      </div>

      <Card className="p-6 shadow-soft border-border/60 space-y-4">
        <h3 className="font-display font-semibold text-lg">Horários de funcionamento</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Nome da clínica</Label>
            <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
          </div>
          <div>
            <Label>Intervalo entre slots (minutos)</Label>
            <Input
              type="number"
              value={slot}
              onChange={(e) => setSlot(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Abertura</Label>
            <Input type="time" value={opening} onChange={(e) => setOpening(e.target.value)} />
          </div>
          <div>
            <Label>Fechamento</Label>
            <Input type="time" value={closing} onChange={(e) => setClosing(e.target.value)} />
          </div>
        </div>
        <Button onClick={save} className="bg-gradient-primary hover:opacity-90">
          Salvar preferências
        </Button>
      </Card>

      <Card className="p-6 shadow-soft border-border/60">
        <h3 className="font-display font-semibold text-lg mb-4">Usuários do sistema</h3>
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge
                className={
                  u.role === "gestor"
                    ? "bg-warning/20 text-warning-foreground hover:bg-warning/20"
                    : u.role === "fisioterapeuta"
                    ? "bg-primary-soft text-primary hover:bg-primary-soft"
                    : "bg-secondary-soft text-secondary-foreground hover:bg-secondary-soft"
                }
              >
                {u.role}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-soft border-border/60 border-warning/20 bg-warning/5">
        <h3 className="font-display font-semibold text-lg mb-1">Restaurar dados de demonstração</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Reverte pacientes, profissionais, serviços e agendamentos para os valores iniciais.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            resetData();
            toast.success("Dados restaurados!");
          }}
        >
          <RotateCcw className="h-4 w-4 mr-1.5" /> Resetar dados
        </Button>
      </Card>
    </div>
  );
}
