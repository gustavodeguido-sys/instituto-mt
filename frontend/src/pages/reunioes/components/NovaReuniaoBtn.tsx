import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { agendarReuniao } from "@/services/ReuniaoService";
import { useState, type FormEvent } from "react";

interface NovaReuniaoProps {
    className?: string;
    onAgendada?: () => void;
}

const classeSelect = `h-9 w-full rounded-lg border border-input bg-white px-3 text-sm
  shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3
  focus-visible:ring-ring/50`

export default function NovaReuniaoBtn({ className, onAgendada }: NovaReuniaoProps) {
    const [open, setOpen] = useState(false)
    const [agendando, setAgendando] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setAgendando(true)
        try {
            // TODO: montar o objeto NovaReuniao a partir do `form` e chamar agendarReuniao(...)
            void form
            void agendarReuniao
            onAgendada?.()
            setOpen(false)
        } finally {
            setAgendando(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={<Button type="button" className={className} />}
            >
                Nova reunião
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="font-bold">Agendar nova reunião</DialogTitle>
                        <DialogDescription>Organize o próximo encontro entre os gestores da casa</DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="mt-4">
                        <Field>
                            <Label htmlFor="titulo-reuniao">Título da reunião</Label>
                            <Input id="titulo-reuniao" name="tituloReuniao" type="text" required />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="data-reuniao">Data</Label>
                                <Input id="data-reuniao" name="dataReuniao" type="date" required />
                            </Field>
                            <Field>
                                <Label htmlFor="hora-reuniao">Horário de início</Label>
                                <Input id="hora-reuniao" name="horaReuniao" type="time" required />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="formato-reuniao">Formato</Label>
                                <select
                                    id="formato-reuniao"
                                    name="formatoReuniao"
                                    defaultValue="online"
                                    className={classeSelect}
                                >
                                    <option value="online">Online</option>
                                    <option value="presencial">Presencial</option>
                                </select>
                            </Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter className="mt-6">
                        <DialogClose render={<Button type="button" variant="outline" />}>
                            Cancelar
                        </DialogClose>
                        <Button type="submit" disabled={agendando}>
                            {agendando ? "Agendando..." : "Agendar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
