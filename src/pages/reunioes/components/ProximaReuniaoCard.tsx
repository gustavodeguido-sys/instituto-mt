// components/ProximaReuniaoCard.tsx
import { Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Reuniao } from '@/types/reunioes'
import { contagemRegressiva, iniciais, partesDaData } from '../utils'

const CORES_AVATAR = ['bg-teal-500', 'bg-blue-600', 'bg-amber-700', 'bg-emerald-800']
const MAX_AVATARES = 4

interface ProximaReuniaoCardProps {
  reuniao: Reuniao 
  onVerDetalhes: (id: string) => void
  onEditar: (id: string) => void
}

export function ProximaReuniaoCard({ reuniao, onVerDetalhes, onEditar }: ProximaReuniaoCardProps) {
  const { dia, semana, mes } = partesDaData(reuniao.data)
  const visiveis = reuniao.participantes.slice(0, MAX_AVATARES)
  const restantes = reuniao.participantes.length - visiveis.length

  return (
    <article
      className="grid grid-cols-[auto_1fr_auto] gap-[1.5vw] rounded-[1.2vw] border-2
        border-emerald-400 bg-white p-[1.2vw] shadow-sm"
    >
      {/* Coluna 1 — bloco da data */}
      <div
        className="flex min-w-16 flex-col items-center self-start rounded-xl
          bg-gradient-to-b from-emerald-500 to-emerald-800 px-[1.2vw] py-[1.5vh]
          uppercase text-white"
      >
        <span className="text-[clamp(7px,0.6vw,10px)]">{semana}</span>
        <span className="text-[clamp(20px,2vw,32px)] font-semibold leading-tight">{dia}</span>
        <span className="text-[clamp(7px,0.6vw,10px)]">{mes}</span>
      </div>

      {/* Coluna 2 — informações */}
      <div className="min-w-0">
        <p className="text-[clamp(7px,0.6vw,10px)] font-semibold uppercase tracking-wide text-emerald-600">
          Próxima reunião · {contagemRegressiva(reuniao.data)}
        </p>
        <h2 className="mt-1 text-[clamp(12px,1.1vw,18px)] font-semibold text-slate-900">
          {reuniao.titulo}
        </h2>

        <ul className="mt-1 flex flex-wrap gap-x-4 text-[clamp(8px,0.65vw,11px)] text-slate-600">
          <li className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {reuniao.horaInicio} – {reuniao.horaFim}
          </li>
          <li className="flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {reuniao.local}
          </li>
          <li className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {reuniao.participantes.length} participantes
          </li>
        </ul>

        <h3 className="mt-[1.2vh] text-[clamp(7px,0.55vw,9px)] font-semibold uppercase text-slate-500">
          Pauta
        </h3>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[clamp(8px,0.65vw,11px)]
          text-slate-700 marker:text-emerald-500">
          {reuniao.pauta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Coluna 3 — participantes e ações */}
      <div className="flex w-[11vw] min-w-36 flex-col">
        <p className="text-[clamp(7px,0.55vw,9px)] font-semibold uppercase text-slate-500">
          Participantes
        </p>
        <div className="mt-1 flex -space-x-1.5">
          {visiveis.map((p, i) => (
            <span
              key={p.id}
              title={p.nome}
              className={`flex size-7 items-center justify-center rounded-full border-2
                border-white text-[10px] font-semibold text-white
                ${CORES_AVATAR[i % CORES_AVATAR.length]}`}
            >
              {iniciais(p.nome)}
            </span>
          ))}
          {restantes > 0 && (
            <span className="flex size-7 items-center justify-center rounded-full border-2
              border-white bg-slate-500 text-[10px] font-semibold text-white">
              +{restantes}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-[1.5vh]">
          <Button type="button" onClick={() => onVerDetalhes(reuniao.id)}
            className="bg-blue-600 text-white hover:bg-blue-700">
            Ver detalhes
          </Button>
          <Button type="button" variant="outline" onClick={() => onEditar(reuniao.id)}>
            Editar reunião
          </Button>
        </div>
      </div>
    </article>
  )
}
