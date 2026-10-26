import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

interface AddCheckInProps {
  className?: string;
}


export default function AddCheckIn({className}: AddCheckInProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button type="button" className={className}>Novo check-in</Button>}
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo check-in</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para registrar a chegada do paciente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="patient-name">Nome do paciente</Label>
              <Input
                id="patient-name"
                name="patientName"
                placeholder="Digite o nome completo"
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="patient-document">CPF</Label>
                <Input
                  id="patient-document"
                  name="patientDocument"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="check-in-date">Data do check-in</Label>
                <Input id="check-in-date" name="checkInDate" type="date" required />
              </Field>
            </div>

            <Field>
              <Label htmlFor="check-in-notes">Observações</Label>
              <Input
                id="check-in-notes"
                name="notes"
                placeholder="Adicione uma observação (opcional)"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Confirmar check-in</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );


}
