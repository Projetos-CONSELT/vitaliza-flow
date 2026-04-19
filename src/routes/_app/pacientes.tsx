import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Phone, Search, Plus, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pacientes")({
  component: PacientesPage,
});

function PacientesPage() {
  const { patients, appointments, services, addPatient, removePatient } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q)
  );

  const selected = patients.find((p) => p.id === selectedId);
  const history = selected
    ? appointments
        .filter((a) => a.patientId === selected.id)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .reverse()
    : [];

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Informe o nome");
      return;
    }
    addPatient({ name: name.trim(), phone, notes });
    toast.success("Paciente cadastrado!");
    setOpen(false);
    setName("");
    setPhone("");
    setNotes("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Pacientes</h2>
          <p className="text-sm text-muted-foreground">{patients.length} pacientes cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-1.5" /> Novo paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Cadastrar paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nome completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(34) 99999-9999" />
              </div>
              <div>
                <Label>Observações clínicas</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Hérnia, lesão, queixa principal..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-primary" onClick={handleSave}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-4 shadow-soft border-border/60">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="pl-9"
            />
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left flex items-center gap-3 p-3 hover:bg-muted/50 transition rounded-md ${
                  selectedId === p.id ? "bg-primary-soft/40" : ""
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-semibold text-sm">
                  {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {p.phone || "—"}
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center py-10 text-sm text-muted-foreground">
                Nenhum paciente encontrado.
              </p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 shadow-soft border-border/60">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3.5 w-3.5" /> {selected.phone || "Sem telefone"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    removePatient(selected.id);
                    setSelectedId(null);
                    toast.success("Paciente removido");
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {selected.notes && (
                <div className="p-3 rounded-lg bg-secondary-soft text-sm">
                  <p className="font-medium mb-1 text-secondary-foreground">Observações clínicas</p>
                  <p className="text-muted-foreground">{selected.notes}</p>
                </div>
              )}

              <div>
                <p className="font-display font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Histórico de atendimentos
                </p>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem atendimentos registrados.</p>
                ) : (
                  <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                    {history.map((a) => {
                      const s = services.find((x) => x.id === a.serviceId);
                      return (
                        <li
                          key={a.id}
                          className="flex items-center justify-between text-sm border-l-2 border-primary/40 bg-muted/30 pl-3 pr-2 py-2 rounded-r-md"
                        >
                          <div>
                            <p className="font-medium">{s?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {a.date} · {a.time}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-card border border-border capitalize">
                            {a.status}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-sm text-muted-foreground">
              Selecione um paciente para ver detalhes.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
