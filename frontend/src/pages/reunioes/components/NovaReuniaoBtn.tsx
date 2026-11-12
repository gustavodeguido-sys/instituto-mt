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
import { Textarea } from "@/components/ui/textarea";
import type { FormatoReuniao, NovaReuniao } from "@/types/reunioes";
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
    const [erro, setErro] = useState<String | null>(null)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const dados: NovaReuniao = {
            titulo: String(form.get('titulo')).trim(),
            data: String(form.get('data')),
            horaInicio: String(form.get('horaInicio')),
            horaFim: String(form.get('horaFim')),
            formato: form.get('formato') as FormatoReuniao,
            local: String(form.get('local')).trim(),
            participantes: [],
            pauta: String(form.get('pauta') ?? '')
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
        }

        setAgendando(true)
        setErro(null)
        try {
            await agendarReuniao(dados)
            onAgendada?.()
            setOpen(false)
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Não foi possível agendar a reunião.')
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
                            <Input id="titulo-reuniao" name="titulo" type="text" required />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="data-reuniao">Data</Label>
                                <Input id="data-reuniao" name="data" type="date" required />
                            </Field>
                            <Field>
                                <Label htmlFor="hora-inicio">Horário de início</Label>
                                <Input id="hora-inicio" name="horaInicio" type="time" required />
                            </Field>
                            <Field>
                                <Label htmlFor="hora-fim">Término</Label>
                                <Input id="hora-fim" name="horaFim" type="time" required />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="formato-reuniao">Formato</Label>
                                <select
                                    id="formato-reuniao"
                                    name="formato"
                                    defaultValue="online"
                                    className={classeSelect}
                                >
                                    <option value="online">Online</option>
                                    <option value="presencial">Presencial</option>
                                </select>
                            </Field>
                        </div>
                        <Field>
                            <Label htmlFor="pauta-reuniao">Pauta (um item por linha)</Label>
                            <Textarea id="pauta-reuniao" name="pauta" rows={4} />
                            </Field>
                    </FieldGroup>
                    {erro && (
                        <p role="alert" className="mt-4 text-sm text-red-600">{erro}</p>
                    )}

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
