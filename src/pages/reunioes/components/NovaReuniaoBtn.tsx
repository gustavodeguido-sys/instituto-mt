import { Button } from "@/components/ui/button";
import { Dialog, 
     DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
 } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEvent } from "react";

interface NovaReuniaoProps {
    className?: string;
    formato: 'presencial' | 'online';
}

const classeSelect = `h-9 w-full rounded-lg border border-input bg-white px-3 text-sm
  shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3
  focus-visible:ring-ring/50`

export default function NovaReuniaoBtn ({ className }: NovaReuniaoProps) {
    const [open, setOpen] = useState(false)
    const [agendando, setAgendando] = useState(false)

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button type="button" className={className}
                >Nova reunião
                </Button>
            }
            />
            <DialogContent className="sm:max-2-lg">
            <DialogHeader>
                <DialogTitle>Agendar nova reunião</DialogTitle>
                <DialogDescription>Organize o próximo encontro entre os gestores da casa</DialogDescription>
            </DialogHeader>
            </DialogContent>

            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                       <Label htmlFor="tituto-reuniao">Titulo da reunião</Label>
                       <Input id="titulo-reuniao" name="tituloReuniao" type="string" required />
                    </Field>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                    <Field>
                        <Label htmlFor="data-reuniao">Data</Label>
                        <Input id="data-reuniao" name="dataReuniao" type="date" required />
                    </Field>
                    <Field>
                        <Label htmlFor="hora-reuniao">Horario de inicio</Label>
                        <Input id="hora-reuniao" name="horaReuniao" type="time" required />
                    </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="formato-reuniao">Formato</Label>
                            <select 
                              id="opcao-formato"
                              name="opcaoFormato"
                              defaultValue="Online"
                              className={classeSelect}
                            >
                                <option value="online">Online</option>
                                <option value="presencial">Presencial</option>
                            </select>
                            </Field>
                    </div>
                </FieldGroup>
                <DialogFooter className="mt-6">
                    <DialogClose render={<Button type="button" variant="outline"/>}>
                    Cancelar
                    </DialogClose>
                    <Button type="submit" disabled={agendando}>
                        {agendando ? "Gerando" : "Gerar relatório"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    )
}
}