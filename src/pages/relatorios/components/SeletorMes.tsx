import { nomeDoMes, ultimosMeses } from '../utils'

const meses = ultimosMeses()

// Seletor de mês do cabeçalho. É um <select> nativo estilizado como os
// Inputs do shadcn (o componente Select do shadcn não está instalado).
export function SeletorMes({
  value,
  onChange,
}: {
  value: string
  onChange: (mes: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Mês dos relatórios"
      className="h-[4vh] min-h-8 rounded-lg border border-input bg-white px-3
        text-[clamp(8px,0.7vw,11px)] shadow-xs outline-none
        focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {/* Garante que um mês vindo da URL fora da lista também apareça */}
      {!meses.includes(value) && <option value={value}>{nomeDoMes(value)}</option>}
      {meses.map((mes) => (
        <option key={mes} value={mes}>
          {nomeDoMes(mes)}
        </option>
      ))}
    </select>
  )
}
