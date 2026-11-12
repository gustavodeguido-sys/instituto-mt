import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReuniaoPassada, StatusAta } from "@/types/reunioes";
import { partesDaData } from "../utils";

const ATA: Record<StatusAta, { selo: string; cor: string; acao: string }> = {
    disponivel: { selo: 'Ata disponivel', cor: 'bg-emerald-50 text emerald-700', acao: 'Ver ata' },
    pendente: { selo: 'Ata pendente', cor: 'bg-amber-50 text-amber-700', acao: 'Enviar ata'},
}

interface ReuniaoPassadaItemProps {
    reuniao: ReuniaoPassada
    onAbrirAta: (reuniao: ReuniaoPassada) => void
}

export function ReuniaoPassadaItem({ reuniao, onAbrirAta}: ReuniaoPassadaItemProps) {
    const { dia, mesCurto } = partesDaData(reuniao.data)
    const ata = ATA[reuniao.ata]

    return (
        <li className="flex items-center gap-[1vw] rounded-[1vw] bg-white px-[1.4vw] py-[1.2vh] shadow-sm">
      <div className="flex size-11 flex-none flex-col items-center justify-center rounded-lg
        bg-emerald-50 uppercase text-emerald-700">
        <span className="text-base font-bold leading-none">{dia}</span>
        <span className="text-[9px]">{mesCurto}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[clamp(12px,1vw,16px)] font-bold text-slate-900">
          {reuniao.titulo}
        </h3>
        <p className="text-[clamp(10px,0.82vw,13px)] text-slate-500">
          {reuniao.horaInicio} – {reuniao.horaFim} · {reuniao.totalParticipantes} participantes · {reuniao.local}
        </p>
      </div>

      <span className={`rounded-md px-2 py-0.5 text-[clamp(10px,0.76vw,12px)] font-medium ${ata.cor}`}>
        {ata.selo}
      </span>
      <Button type="button" variant="link" size="xs" onClick={() => onAbrirAta(reuniao)}
        className="text-blue-600">
        {ata.acao} <ArrowRight />
      </Button>
    </li>
    )
}