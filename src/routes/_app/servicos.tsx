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
import { Plus, Trash2, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/servicos")({
  component: ServicosPage,
});

function ServicosPage() {
  const { services, addService, removeService } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(50);
  const [price, setPrice] = useState<number | "">("");

  const save = () => {
    if (!name.trim()) {
      toast.error("Informe o nome");
      return;
    }
    addService({
      name,
      durationMin: Number(duration) || 50,
      price: price === "" ? undefined : Number(price),
    });
    toast.success("Serviço cadastrado!");
    setOpen(false);
    setName("");
    setDuration(50);
    setPrice("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Serviços</h2>
          <p className="text-sm text-muted-foreground">
            {services.length} serviços oferecidos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-1.5" /> Novo serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Cadastrar serviço</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nome do serviço</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Duração (minutos)</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Valor (R$) — opcional</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  />
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
        {services.map((s) => (
          <Card key={s.id} className="p-5 shadow-soft border-border/60">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold">{s.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  removeService(s.id);
                  toast.success("Removido");
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
              </span>
              {s.price != null && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> R$ {s.price.toFixed(2)}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
