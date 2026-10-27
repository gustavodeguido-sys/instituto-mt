import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
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

interface NovoHospedeBtnProps {
  className?: string;
}

export default function NovoHospedeBtn({ className }: NovoHospedeBtnProps) {
  // useState: controla se o modal está aberto. O Dialog avisa as mudanças
  // (clicar fora, ESC, botão fechar) via onOpenChange, que atualiza este estado.
  const [open, setOpen] = useState(false);

  // Por enquanto só fecha o modal. Quando houver backend, enviar os dados
  // do formulário (new FormData(event.currentTarget)) para a API aqui.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" className={className}>
            <Plus />
            Adicionar hóspede
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar hóspede</DialogTitle>
          <DialogDescription>
            Cadastre o paciente e, se houver, o acompanhante hospedado na casa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="hospede-paciente">Nome do paciente</Label>
                <Input
                  id="hospede-paciente"
                  name="paciente"
                  placeholder="Nome completo"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="hospede-transplante">Tipo de transplante</Label>
                <Input
                  id="hospede-transplante"
                  name="tipoTransplante"
                  placeholder="Ex.: Transplante de rim"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="hospede-acompanhante">Acompanhante</Label>
                <Input
                  id="hospede-acompanhante"
                  name="acompanhante"
                  placeholder="Opcional"
                />
              </Field>

              <Field>
                <Label htmlFor="hospede-parentesco">Parentesco</Label>
                <Input
                  id="hospede-parentesco"
                  name="parentesco"
                  placeholder="Ex.: Mãe, Esposa"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field>
                <Label htmlFor="hospede-quarto">Quarto</Label>
                <Input
                  id="hospede-quarto"
                  name="quarto"
                  placeholder="00"
                  inputMode="numeric"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="hospede-entrada">Data de entrada</Label>
                <Input id="hospede-entrada" name="dataEntrada" type="date" required />
              </Field>

              <Field>
                <Label htmlFor="hospede-situacao">Situação</Label>
                <select
                  id="hospede-situacao"
                  name="situacao"
                  defaultValue="pre-transplante"
                  className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm
                    shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3
                    focus-visible:ring-ring/50"
                >
                  <option value="pre-transplante">Pré-transplante</option>
                  <option value="pos-transplante">Pós-transplante</option>
                  <option value="internado-hc">Internado no HC</option>
                </select>
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit">Salvar hóspede</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
