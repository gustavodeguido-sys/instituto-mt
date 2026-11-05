import { HandHeart } from 'lucide-react'
import { EstadoVazio } from '@/components/EstadoVazio'
import type { PainelFinanceiro } from '@/types/financeiro'
import { formatarDiaMes, formatarReais, porcentagemDe } from '../utils'

/**
 * Card "Doações": total doado no mês (pessoas físicas + empresas parceiras),
 * a divisão entre os dois e as últimas doações recebidas.
 */
export function DoacoesCard({ painel }: { painel: PainelFinanceiro | null }) {
  const pessoasFisicas = painel?.porOrigem['pessoas-fisicas'] ?? 0
  const empresas = painel?.porOrigem.empresas ?? 0
  const total = pessoasFisicas + empresas
  const partePercentual = Math.round(porcentagemDe(total, painel?.arrecadacao ?? 0))
  const ultimasDoacoes = painel?.ultimasDoacoes ?? []

  const subtotais = [
    { label: 'Pessoas físicas', valor: pessoasFisicas },
    { label: 'Empresas parceiras', valor: empresas },
  ]

  return (
    <section
      className="flex flex-col rounded-[1.2vw] bg-white p-[1vw] shadow-sm"
      aria-labelledby="titulo-doacoes"
    >
      <h2 id="titulo-doacoes" className="text-[clamp(10px,0.85vw,14px)] text-slate-900">
        Doações
      </h2>

      <strong className="valor-destaque mt-[0.8vh]">
        {painel ? formatarReais(total) : '—'}
      </strong>
      <p className="text-[clamp(7px,0.6vw,10px)] text-slate-500">
        {painel
          ? `${painel.quantidadeDoacoes} ${painel.quantidadeDoacoes === 1 ? 'doação' : 'doações'} no mês · ${partePercentual}% da arrecadação`
          : 'Sem doações registradas no mês'}
      </p>

      <div className="mt-[1.2vh] grid grid-cols-2 gap-[0.6vw]">
        {subtotais.map(({ label, valor }) => (
          <div key={label} className="rounded-lg bg-slate-50 px-[0.7vw] py-[0.8vh]">
            <p className="text-[clamp(7px,0.58vw,9px)] text-slate-500">{label}</p>
            <strong className="text-[clamp(9px,0.8vw,13px)] text-slate-900">
              {painel ? formatarReais(valor) : '—'}
            </strong>
          </div>
        ))}
      </div>

      <h3
        className="mt-[1.4vh] mb-[0.6vh] text-[clamp(7px,0.55vw,9px)] font-semibold
          tracking-wide text-slate-500 uppercase"
      >
        Últimas doações
      </h3>

      {ultimasDoacoes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-[1vh] text-[clamp(8px,0.65vw,11px)]">
          <EstadoVazio
            icone={HandHeart}
            titulo="Nenhuma doação recente"
            descricao='Registre doações em "Novo lançamento".'
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-[0.6vh] text-[clamp(8px,0.65vw,11px)]">
          {ultimasDoacoes.map((doacao) => (
            <li key={doacao.id} className="flex items-center justify-between gap-2">
              <span className="truncate text-slate-700">
                {doacao.descricao} · {formatarDiaMes(doacao.data)}
              </span>
              <span className="shrink-0 font-semibold text-emerald-600">
                {formatarReais(doacao.valor)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
