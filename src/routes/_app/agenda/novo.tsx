import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp, hasConflict, suggestTimes } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { AlertCircle, Sparkles, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/agenda/novo")({
  component: NovoAgendamento,
});

function NovoAgendamento() {
  const navigate = useNavigate();
  const {
    patients,
    professionals,
    services,
    appointments,
    settings,
    addAppointment,
    addPatient,
  } = useApp();

  const [patientId, setPatientId] = useState("");
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  const professional = professionals.find((p) => p.id === professionalId);

  const conflict = useMemo(() => {
    if (!serviceId || !professionalId || !date || !time) return false;
    return hasConflict(appointments, services, {
      professionalId,
      serviceId,
      date,
      time,
    });
  }, [appointments, services, professionalId, serviceId, date, time]);

  const suggestions = useMemo(() => {
    if (!serviceId || !professional || !date) return [];
    return suggestTimes(appointments, services, professional, date, serviceId, settings.slotMinutes).slice(0, 8);
  }, [appointments, services, professional, date, serviceId, settings.slotMinutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalPatientId = patientId;
    if (creatingPatient) {
      if (!newPatientName.trim()) {
        toast.error("Informe o nome do paciente");
        return;
      }
      const p = addPatient({ name: newPatientName.trim(), phone: newPatientPhone.trim() });
      finalPatientId = p.id;
    }

    if (!finalPatientId || !serviceId || !professionalId) {
      toast.error("Preencha paciente, serviço e profissional");
      return;
    }
    if (conflict) {
      toast.error("Conflito de horário. Escolha outro horário sugerido.");
      return;
    }

    addAppointment({
      patientId: finalPatientId,
      serviceId,
      professionalId,
      date,
      time,
      notes,
    });
    toast.success("Agendamento criado com sucesso!");
    navigate({ to: "/agenda" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/agenda" })}>
        <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para agenda
      </Button>

      <Card className="p-6 shadow-soft border-border/60">
        <h2 className="font-display text-2xl font-bold mb-1">Novo agendamento</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Preencha os dados abaixo. Conflitos e sugestões aparecem automaticamente.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Paciente</Label>
              <button
                type="button"
                onClick={() => {
                  setCreatingPatient(!creatingPatient);
                  setPatientId("");
                }}
                className="text-xs text-primary hover:underline"
              >
                {creatingPatient ? "Selecionar existente" : "+ Novo paciente"}
              </button>
            </div>
            {creatingPatient ? (
              <div className="grid sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Nome completo"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                />
                <Input
                  placeholder="Telefone (opcional)"
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                />
              </div>
            ) : (
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.durationMin}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          {conflict && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Conflito de horário</p>
                <p className="text-muted-foreground">
                  Este profissional já tem um atendimento que se sobrepõe a este horário.
                </p>
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-secondary-soft border border-secondary/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
                <p className="text-sm font-medium">Horários disponíveis sugeridos</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      time === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: "/agenda" })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={conflict}
            >
              Salvar agendamento
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
