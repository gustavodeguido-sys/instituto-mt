import { PartyPopper } from 'lucide-react'
import { EstadoVazio } from '@/components/EstadoVazio'
import type { EventoBeneficente } from '@/types/financeiro'
import { formatarDiaMes, formatarReais } from '../utils'

/**
 * Card "Lucro com eventos": um bloco por evento beneficente do mês
 * com arrecadado, custos e lucro (arrecadado - custos).
 */
export function EventosCard({
  eventos,
  lucroTotal,
}: {
  eventos: EventoBeneficente[]
  lucroTotal: number | undefined // undefined = sem dados da API
}) {
  return (
    <section
      className="flex flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
      aria-labelledby="titulo-eventos"
    >
      <div className="mb-[1.2vh] flex items-center justify-between gap-2">
        <h2 id="titulo-eventos" className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
          Lucro com eventos
        </h2>
        <strong className="text-[clamp(9px,0.75vw,13px)] text-slate-900">
          {lucroTotal === undefined ? '—' : formatarReais(lucroTotal)}
        </strong>
      </div>

      {eventos.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-[1vh] text-[clamp(8px,0.65vw,11px)]">
          <EstadoVazio
            icone={PartyPopper}
            titulo="Nenhum evento no mês"
            descricao="Bazares, feijoadas e outros eventos aparecerão aqui."
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-[1vh]">
          {eventos.map((evento) => {
            const numeros = [
              { label: 'Arrecadado', valor: evento.arrecadado, destaque: false },
              { label: 'Custos', valor: evento.custos, destaque: false },
              { label: 'Lucro', valor: evento.arrecadado - evento.custos, destaque: true },
            ]
            return (
              <li
                key={evento.id}
                className="rounded-lg border border-slate-200 px-[0.8vw] py-[1vh]"
              >
                <h3 className="text-[clamp(9px,0.75vw,12px)] text-slate-900">{evento.nome}</h3>
                <p className="text-[clamp(7px,0.58vw,9px)] text-slate-500">
                  {formatarDiaMes(evento.data)} · {evento.local}
                </p>

                <dl className="mt-[0.8vh] grid grid-cols-3 gap-2">
                  {numeros.map(({ label, valor, destaque }) => (
                    <div key={label}>
                      <dt className="text-[clamp(7px,0.55vw,9px)] text-slate-500">{label}</dt>
                      <dd
                        className={`text-[clamp(8px,0.68vw,11px)] font-bold ${
                          destaque ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {formatarReais(valor)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
