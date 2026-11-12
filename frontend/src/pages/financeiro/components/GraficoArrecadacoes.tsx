import { Bar, BarChart, XAxis } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { EstadoVazio } from '@/components/EstadoVazio'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { nomeDoMes, nomeDoMesSemAno } from '@/lib/mes'
import type { TotalMensal } from '@/types/financeiro'
import { COR_ARRECADACAO, COR_DESPESA } from '../rotulos'
import { formatarReais } from '../utils'

// ChartConfig: diz ao ChartContainer o nome e a cor de cada série.
// Ele cria as variáveis CSS --color-arrecadacao e --color-despesas.
const config = {
  arrecadacao: { label: 'Arrecadações', color: COR_ARRECADACAO },
  despesas: { label: 'Despesas', color: COR_DESPESA },
} satisfies ChartConfig

type Serie = keyof typeof config

// '2026-10' -> 'Out'
function mesCurto(mes: string) {
  const nome = nomeDoMesSemAno(mes, true)
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

// Rótulo do eixo X. O mês selecionado aparece em negrito, como no layout.
function TickMes({
  x,
  y,
  payload,
  mesSelecionado,
}: {
  x?: number | string
  y?: number | string
  payload?: { value?: unknown }
  mesSelecionado: string
}) {
  const mes = String(payload?.value ?? '')
  const destaque = mes === mesSelecionado
  return (
    <text
      x={x}
      y={y}
      dy={12}
      textAnchor="middle"
      fontSize={11}
      fontWeight={destaque ? 700 : 400}
      // style (e não className) para vencer a cor padrão que o ChartContainer aplica
      style={{ fill: destaque ? '#0f172a' : '#64748b' }}
    >
      {mesCurto(mes)}
    </text>
  )
}

/**
 * Gráfico de barras "Arrecadações x despesas" dos últimos meses.
 * Os valores chegam em centavos; só o tooltip formata em reais,
 * porque a altura das barras é proporcional de qualquer jeito.
 */
export function GraficoArrecadacoes({
  historico,
  mesSelecionado,
  className = '',
}: {
  historico: TotalMensal[]
  mesSelecionado: string
  className?: string
}) {
  const primeiro = historico[0]?.mes
  const ultimo = historico[historico.length - 1]?.mes

  return (
    <section
      className={`flex flex-col rounded-[1.2vw] bg-white p-[1.4vw] shadow-sm ${className}`}
      aria-labelledby="titulo-grafico-financeiro"
    >
      <div className="flex items-center justify-between gap-2">
        <h2
          id="titulo-grafico-financeiro"
          className="text-[clamp(14px,1.15vw,20px)] text-slate-900"
        >
          Arrecadações x despesas
        </h2>

        {/* Legenda própria no cabeçalho, como no layout */}
        <ul className="flex items-center gap-[0.8vw] text-[clamp(10px,0.82vw,13px)] text-slate-600">
          {(Object.keys(config) as Serie[]).map((serie) => (
            <li key={serie} className="flex items-center gap-1.5">
              <span
                className="inline-block size-2 rounded-[2px]"
                style={{ background: config[serie].color }}
              />
              {config[serie].label}
            </li>
          ))}
        </ul>
      </div>

      {historico.length === 0 ? (
        <div className="flex h-[22vh] items-center justify-center text-[clamp(11px,0.9vw,14px)]">
          <EstadoVazio
            icone={BarChart3}
            titulo="Sem histórico para exibir"
            descricao="O gráfico aparece quando houver lançamentos registrados."
          />
        </div>
      ) : (
        <ChartContainer config={config} className="mt-[1vh] aspect-auto h-[22vh] w-full">
          <BarChart data={historico} barGap={6} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={(props) => <TickMes {...props} mesSelecionado={mesSelecionado} />}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(mes) => nomeDoMes(String(mes))}
                  formatter={(valor, serie, item) => (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ background: item.color }}
                      />
                      <span className="flex-1 text-muted-foreground">
                        {config[serie as Serie]?.label ?? serie}
                      </span>
                      <span className="font-medium text-foreground tabular-nums">
                        {formatarReais(Number(valor))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="arrecadacao"
              fill="var(--color-arrecadacao)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="despesas"
              fill="var(--color-despesas)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ChartContainer>
      )}

      {primeiro && ultimo && (
        <p className="mt-[0.8vh] text-[clamp(10px,0.76vw,12px)] text-slate-500">
          Valores mensais em reais · {nomeDoMesSemAno(primeiro)} a{' '}
          {nomeDoMes(ultimo).toLowerCase()}
        </p>
      )}
    </section>
  )
}
