import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Plus, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { registrarLancamento } from '@/services/FinanceiroService'
import type {
  CategoriaDespesa,
  NovoLancamento,
  OrigemReceita,
  TipoLancamento,
} from '@/types/financeiro'
import { CATEGORIAS_DESPESA, ORIGENS_RECEITA, TIPOS_LANCAMENTO } from '../rotulos'
import { formatarReais, hojeIso } from '../utils'

interface NovoLancamentoProps {
  className?: string
  onLancar?: () => void // avisa a página para recarregar os números
}

// Opções do select "Categoria / origem" para cada tipo de lançamento.
const opcoesPorTipo: Record<TipoLancamento, { value: string; label: string }[]> = {
  receita: Object.entries(ORIGENS_RECEITA).map(([value, { label }]) => ({ value, label })),
  despesa: Object.entries(CATEGORIAS_DESPESA).map(([value, label]) => ({ value, label })),
}

const placeholderPorTipo: Record<TipoLancamento, string> = {
  receita: 'Selecione a origem da arrecadação',
  despesa: 'Selecione a categoria da despesa',
}

export default function NovoLancamentoBtn({ className, onLancar }: NovoLancamentoProps) {
  // useState: controla se o modal está aberto (ESC, clicar fora e "X" também fecham).
  const [open, setOpen] = useState(false)

  // useState: campos controlados. Os demais (descrição, data, observações)
  // são lidos do formulário com FormData na hora de salvar.
  const [tipo, setTipo] = useState<TipoLancamento>('receita')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [valorCentavos, setValorCentavos] = useState(0)

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Os inputs não controlados voltam ao padrão sozinhos porque o conteúdo
  // do Dialog é desmontado ao fechar; os estados acima precisam ser limpos.
  function handleOpenChange(aberto: boolean) {
    setOpen(aberto)
    if (!aberto) {
      setTipo('receita')
      setCategoria(null)
      setValorCentavos(0)
      setErro(null)
    }
  }

  // Trocar o tipo limpa a categoria: as opções de receita e despesa são diferentes.
  function handleTipo(novoTipo: TipoLancamento) {
    setTipo(novoTipo)
    setCategoria(null)
  }

  // Máscara de dinheiro: guarda só os dígitos como centavos.
  // Digitar "4235" mostra "R$ 42,35"; apagar remove o último dígito.
  function handleValor(event: ChangeEvent<HTMLInputElement>) {
    const digitos = event.target.value.replace(/\D/g, '').slice(0, 11)
    setValorCentavos(Number(digitos) || 0)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validações que o HTML não faz sozinho (valor mascarado e Select).
    if (valorCentavos <= 0) return setErro('Informe um valor maior que zero.')
    if (!categoria) {
      return setErro(tipo === 'receita' ? 'Escolha a origem da arrecadação.' : 'Escolha a categoria da despesa.')
    }

    const form = new FormData(event.currentTarget)
    const base = {
      descricao: String(form.get('descricao')).trim(),
      valor: valorCentavos,
      data: String(form.get('data')),
      observacoes: String(form.get('observacoes') ?? '').trim() || null,
    }

    // Monta o objeto certo para cada tipo (ver NovoLancamento em types/financeiro).
    const dados: NovoLancamento =
      tipo === 'receita'
        ? { ...base, tipo, origem: categoria as OrigemReceita }
        : { ...base, tipo, categoria: categoria as CategoriaDespesa }

    setSalvando(true)
    setErro(null)
    try {
      await registrarLancamento(dados)
      onLancar?.()
      handleOpenChange(false)
    } catch {
      setErro('Não foi possível salvar o lançamento. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" className={className}>
            <Plus />
            Novo lançamento
          </Button>
        }
      />

      <DialogContent className="gap-0 p-6 sm:max-w-lg">
        <DialogHeader className="flex-row items-center gap-3 border-b pb-4">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl
              bg-emerald-50 text-emerald-600"
          >
            <Wallet className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Novo lançamento
            </DialogTitle>
            <DialogDescription>Registre uma arrecadação ou despesa da casa.</DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4 py-4">
            {/* Tipo: dois botões que funcionam como uma escolha única */}
            <Field>
              <Label id="lancamento-tipo-label">Tipo de lançamento</Label>
              <div
                className="flex gap-2"
                role="group"
                aria-labelledby="lancamento-tipo-label"
              >
                {(Object.keys(TIPOS_LANCAMENTO) as TipoLancamento[]).map((opcao) => {
                  const ativo = tipo === opcao
                  return (
                    <Button
                      key={opcao}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTipo(opcao)}
                      aria-pressed={ativo}
                      className={`rounded-full px-4 ${
                        ativo
                          ? 'border-emerald-500 bg-white font-semibold text-emerald-700 hover:bg-white'
                          : 'border-emerald-200 bg-emerald-50/60 text-slate-700 hover:bg-emerald-50'
                      }`}
                    >
                      {TIPOS_LANCAMENTO[opcao]}
                    </Button>
                  )
                })}
              </div>
            </Field>

            <Field>
              <Label htmlFor="lancamento-descricao">Descrição</Label>
              <Input
                id="lancamento-descricao"
                name="descricao"
                placeholder={
                  tipo === 'receita' ? 'Ex.: Doação do Mercado São Jorge' : 'Ex.: Conta de luz de outubro'
                }
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="lancamento-valor">Valor (R$)</Label>
                <Input
                  id="lancamento-valor"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={valorCentavos > 0 ? formatarReais(valorCentavos, true) : ''}
                  onChange={handleValor}
                  aria-invalid={erro !== null && valorCentavos <= 0}
                />
              </Field>

              <Field>
                <Label htmlFor="lancamento-data">Data</Label>
                <Input
                  id="lancamento-data"
                  name="data"
                  type="date"
                  defaultValue={hojeIso()}
                  required
                />
              </Field>
            </div>

            <Field>
              <Label htmlFor="lancamento-categoria">Categoria / origem</Label>
              {/* `items` diz ao SelectValue qual texto mostrar para o valor escolhido */}
              <Select
                value={categoria}
                onValueChange={setCategoria}
                items={opcoesPorTipo[tipo]}
              >
                <SelectTrigger
                  id="lancamento-categoria"
                  className="h-9 w-full bg-white"
                  aria-invalid={erro !== null && !categoria}
                >
                  <SelectValue placeholder={placeholderPorTipo[tipo]} />
                </SelectTrigger>
                {/* A lista abre ABAIXO do campo (alignItemWithTrigger={false}) e com
                    fundo/realce explícitos: o index.css não define as variáveis de tema
                    do shadcn (--popover, --accent), então bg-popover ficaria transparente. */}
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-white p-1 text-slate-800 shadow-lg ring-slate-200"
                >
                  {opcoesPorTipo[tipo].map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="py-1.5 focus:bg-emerald-50 focus:text-emerald-800
                        data-selected:font-semibold data-selected:text-emerald-700"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="lancamento-observacoes">Observações (opcional)</Label>
              <Textarea
                id="lancamento-observacoes"
                name="observacoes"
                placeholder="Adicione detalhes sobre este lançamento"
                className="min-h-20 bg-white"
              />
            </Field>

            {erro && (
              <p role="alert" className="text-sm text-red-600">
                {erro}
              </p>
            )}
          </FieldGroup>

          <DialogFooter className="-mx-6 -mb-6 bg-white px-6 pt-4 pb-6">
            <DialogClose render={<Button type="button" variant="outline" className="h-9 px-4" />}>
              Cancelar
            </DialogClose>
            <Button
              type="submit"
              disabled={salvando}
              className="h-9 bg-blue-600 px-4 text-white hover:bg-blue-700"
            >
              {salvando ? 'Salvando...' : 'Salvar lançamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
