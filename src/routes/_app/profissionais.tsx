import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profissionais")({
  component: ProfissionaisPage,
});

function ProfissionaisPage() {
  const { professionals, addProfessional, removeProfessional } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");

  const save = () => {
    if (!name.trim() || !specialty.trim()) {
      toast.error("Preencha nome e especialidade");
      return;
    }
    addProfessional({ name, specialty, workingHours: { start, end }, color: "primary" });
    toast.success("Profissional cadastrado!");
    setOpen(false);
    setName("");
    setSpecialty("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Profissionais</h2>
          <p className="text-sm text-muted-foreground">
            {professionals.length} profissionais ativos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-1.5" /> Novo profissional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Cadastrar profissional</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Especialidade</Label>
                <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Início</Label>
                  <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-primary" onClick={save}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.map((p) => (
          <Card key={p.id} className="p-5 shadow-soft border-border/60">
            <div className="flex items-start justify-between mb-3">
              <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-display font-semibold">
                {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  removeProfessional(p.id);
                  toast.success("Removido");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <h3 className="font-display font-semibold">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.specialty}</p>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {p.workingHours.start} – {p.workingHours.end}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
