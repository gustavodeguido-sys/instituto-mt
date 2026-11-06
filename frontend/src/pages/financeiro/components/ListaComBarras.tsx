import { formatarReais, porcentagemDe } from '../utils'

export interface ItemBarra {
  id: string
  label: string
  valor: number // centavos
  cor: string // classe Tailwind de fundo da barra (ex.: 'bg-teal-500')
}

/**
 * Card com título, total e uma barra por item, proporcional ao total.
 * Usado em "Arrecadação por origem" e "Despesas por categoria".
 * Sem dados (total undefined), os itens aparecem zerados e o total como "—".
 */
export function ListaComBarras({
  id,
  titulo,
  total,
  itens,
}: {
  id: string
  titulo: string
  total: number | undefined
  itens: ItemBarra[]
}) {
  return (
    <section
      className="flex flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
      aria-labelledby={id}
    >
      <div className="mb-[1.4vh] flex items-center justify-between gap-2">
        <h2 id={id} className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
          {titulo}
        </h2>
        <strong className="text-[clamp(9px,0.75vw,13px)] text-slate-900">
          {total === undefined ? '—' : formatarReais(total)}
        </strong>
      </div>

      <ul className="flex flex-col gap-[1.4vh] text-[clamp(8px,0.65vw,11px)]">
        {itens.map(({ id: itemId, label, valor, cor }) => {
          const largura = porcentagemDe(valor, total ?? 0)
          return (
            <li key={itemId} className="flex flex-col gap-[0.5vh]">
              <div className="flex items-center justify-between gap-2 text-slate-700">
                <span className="truncate">{label}</span>
                <span className="shrink-0 font-bold text-slate-800">
                  {formatarReais(valor)}
                </span>
              </div>
              {/* Barra: trilho cinza + preenchimento com a % do total */}
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                role="presentation"
              >
                <span
                  className={`block h-full rounded-full transition-all ${cor}`}
                  style={{ width: `${largura}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
