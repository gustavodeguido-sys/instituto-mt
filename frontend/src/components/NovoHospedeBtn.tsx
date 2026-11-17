import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  NUMEROS_QUARTO,
  type NovoHospede,
  type NumeroQuarto,
  type SituacaoClinica,
} from "@/types/hospedes";
import { cadastrarHospede } from "@/services/HospedesService";

// Opções da lista de quartos no formato { value, label } que o `items` do Select espera:
// o value é o que vai para a API ('01'), o label é o que o usuário lê ("Quarto 01").
const opcoesQuarto = NUMEROS_QUARTO.map((numero) => ({ value: numero, label: `Quarto ${numero}` }))

interface NovoHospedeBtnProps {
  className?: string;
  onCadastrado?: () => void;
}

export default function NovoHospedeBtn({ className, onCadastrado }: NovoHospedeBtnProps) {
  // useState: controla se o modal está aberto. O Dialog avisa as mudanças
  // (clicar fora, ESC, botão fechar) via onOpenChange, que atualiza este estado.
  const [open, setOpen] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);
  const [erro, setErro] = useState<string | null>(null)
  // useState: quarto escolhido na lista. O Select é controlado (como em NovoLancamentoBtn)
  // para validarmos a escolha no submit; null = nenhum quarto escolhido ainda.
  const [quarto, setQuarto] = useState<NumeroQuarto | null>(null)

  // Ao abrir ou fechar o modal, limpa o erro e o quarto do cadastro anterior
  // (os inputs de texto já recomeçam vazios porque o conteúdo do Dialog é desmontado).
  const handleOpenChange = (aberto: boolean) => {
    setOpen(aberto)
    setErro(null)
    setQuarto(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // O `required` do HTML não vale para o Select do Base UI, então validamos aqui.
    if (!quarto) return setErro('Escolha o quarto do hóspede.')

    const form = new FormData(event.currentTarget)
    const parentesco = String(form.get('parentesco') ?? '').trim()

    const dados: NovoHospede = {
      paciente: String(form.get('paciente')),
      parentesco: parentesco === '' ? null : parentesco,
      tipoTransplante: String(form.get('tipoTransplante')),
      acompanhante: String(form.get('acompanhante')),
      quarto,
      dataEntrada: String(form.get('dataEntrada')),
      situacao: form.get('situacao') as SituacaoClinica
    }
    
    setCadastrando(true)
    setErro(null)
    try {
      await cadastrarHospede(dados)
      onCadastrado?.()
      handleOpenChange(false)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível fazer o cadastro.')
    } finally {
      setCadastrando(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" className={className}>
            <Plus />
            Adicionar hóspede
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bold">Adicionar hóspede</DialogTitle>
          <DialogDescription>
            Cadastre o paciente e o acompanhante hospedados na casa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="hospede-paciente">Nome do paciente</Label>
                <Input
                  id="hospede-paciente"
                  name="paciente"
                  placeholder="Nome completo"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="hospede-transplante">Tipo de transplante</Label>
                <Input
                  id="hospede-transplante"
                  name="tipoTransplante"
                  placeholder="Ex.: Transplante de rim"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="hospede-acompanhante">Acompanhante</Label>
                <Input
                  id="hospede-acompanhante"
                  name="acompanhante"
                  placeholder="Nome completo"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="hospede-parentesco">Parentesco</Label>
                <Input
                  id="hospede-parentesco"
                  name="parentesco"
                  placeholder="Ex.: Mãe, Esposa"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field>
                <Label htmlFor="hospede-quarto">Quarto</Label>
                {/* `items` diz ao SelectValue qual texto mostrar para o valor escolhido */}
                <Select
                  value={quarto}
                  onValueChange={(valor) => setQuarto(valor as NumeroQuarto | null)}
                  items={opcoesQuarto}
                >
                  <SelectTrigger
                    id="hospede-quarto"
                    className="h-9 w-full bg-white"
                    aria-invalid={erro !== null && !quarto}
                  >
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  {/* Mesmo ajuste do NovoLancamentoBtn: lista abaixo do campo e fundo
                      explícito (o index.css não define --popover/--accent do shadcn). */}
                  <SelectContent
                    alignItemWithTrigger={false}
                    className="bg-white p-1 text-slate-800 shadow-lg ring-slate-200"
                  >
                    {opcoesQuarto.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="py-1.5 focus:bg-emerald-50 focus:text-emerald-800
                          data-selected:font-bold data-selected:text-emerald-700"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label htmlFor="hospede-entrada">Data de entrada</Label>
                <Input id="hospede-entrada" name="dataEntrada" type="date" required />
              </Field>

              <Field>
                <Label htmlFor="hospede-situacao">Situação</Label>
                <select
                  id="hospede-situacao"
                  name="situacao"
                  defaultValue="pre-transplante"
                  className="h-9 w-full rounded-lg border border-input bg-white px-3 text-sm
                    shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3
                    focus-visible:ring-ring/50"
                >
                  <option value="pre-transplante">Pré-transplante</option>
                  <option value="pos-transplante">Pós-transplante</option>
                  <option value="internado-hc">Internado no HC</option>
                </select>
              </Field>
            </div>
          </FieldGroup>
          {erro && (
          <p role="alert" className="mt-4 text-sm text-red-600">{erro}</p>
                    )}

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={cadastrando}>
            {cadastrando ? "Salvando..." : "Salvar hóspede"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
