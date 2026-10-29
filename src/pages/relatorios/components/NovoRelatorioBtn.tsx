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
import { gerarRelatorio } from "@/services/RelatoriosService";
import type { CategoriaId, FormatoRelatorio } from "@/types/categorias";
import { CATEGORIAS } from "../categorias";

interface NovoRelatorioBtnProps {
  className?: string;
  categoriaInicial?: CategoriaId; // já vem marcada quando aberto dentro de uma categoria
}

// <select> nativo com o visual dos Inputs do shadcn.
const classeSelect = `h-9 w-full rounded-lg border border-input bg-white px-3 text-sm
  shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3
  focus-visible:ring-ring/50`;

export default function NovoRelatorioBtn({ className, categoriaInicial }: NovoRelatorioBtnProps) {
  // useState: controla se o modal está aberto. O Dialog avisa as mudanças
  // (clicar fora, ESC, botão fechar) via onOpenChange, que atualiza este estado.
  const [open, setOpen] = useState(false);

  // useState: trava o botão "Gerar" enquanto o pedido está sendo enviado,
  // evitando que um clique duplo gere o mesmo relatório duas vezes.
  const [enviando, setEnviando] = useState(false);

  // Lê os campos do formulário e pede ao service para gerar o arquivo.
  // Hoje o service não faz nada; quando houver API, o modal já está ligado.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setEnviando(true);
    try {
      await gerarRelatorio({
        categoria: form.get("categoria") as CategoriaId,
        periodoInicio: form.get("periodoInicio") as string,
        periodoFim: form.get("periodoFim") as string,
        formato: form.get("formato") as FormatoRelatorio,
      });
      setOpen(false);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" className={className}>
            <Plus />
            Novo relatório
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo relatório</DialogTitle>
          <DialogDescription>
            Escolha a categoria e o período para gerar o arquivo do relatório.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <Label htmlFor="relatorio-categoria">Categoria</Label>
              <select
                id="relatorio-categoria"
                name="categoria"
                defaultValue={categoriaInicial ?? CATEGORIAS[0].id}
                className={classeSelect}
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.titulo}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="relatorio-inicio">Início do período</Label>
                <Input id="relatorio-inicio" name="periodoInicio" type="date" required />
              </Field>

              <Field>
                <Label htmlFor="relatorio-fim">Fim do período</Label>
                <Input id="relatorio-fim" name="periodoFim" type="date" required />
              </Field>
            </div>

            <Field>
              <Label htmlFor="relatorio-formato">Formato do arquivo</Label>
              <select
                id="relatorio-formato"
                name="formato"
                defaultValue="pdf"
                className={classeSelect}
              >
                <option value="pdf">PDF</option>
                <option value="xlsx">Planilha (XLSX)</option>
              </select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Gerando..." : "Gerar relatório"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
