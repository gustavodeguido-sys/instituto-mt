import { nomeDoMes, ultimosMeses } from '@/lib/mes'

const meses = ultimosMeses()

// Seletor de mês do cabeçalho (relatórios, financeiro...). É um <select> nativo
// estilizado como os Inputs do shadcn: aqui a lista nativa do navegador basta
// e funciona bem com teclado e leitores de tela.
export function SeletorMes({
  value,
  onChange,
  rotulo = 'Mês selecionado',
}: {
  value: string
  onChange: (mes: string) => void
  rotulo?: string // texto lido pelo leitor de tela (aria-label)
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={rotulo}
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
