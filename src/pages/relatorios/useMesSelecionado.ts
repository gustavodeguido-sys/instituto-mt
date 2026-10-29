import { useSearchParams } from 'react-router-dom'
import { mesAtual } from './utils'

const FORMATO_MES = /^\d{4}-\d{2}$/

/**
 * Hook do mês selecionado nas telas de relatórios.
 *
 * O mês fica na URL (?mes=2026-10) em vez de num useState: assim ele
 * continua o mesmo ao entrar numa categoria, ao voltar para o hub
 * e ao recarregar a página. Sem ?mes válido, usa o mês atual.
 */
export function useMesSelecionado() {
  // useSearchParams: lê e altera os parâmetros da URL (?chave=valor).
  const [params, setParams] = useSearchParams()
  const valorUrl = params.get('mes')
  const mes = valorUrl && FORMATO_MES.test(valorUrl) ? valorUrl : mesAtual()

  // `replace` troca a URL atual em vez de criar uma nova entrada,
  // para o botão "voltar" do navegador não passar mês por mês.
  function setMes(novoMes: string) {
    setParams(
      (atuais) => {
        atuais.set('mes', novoMes)
        return atuais
      },
      { replace: true },
    )
  }

  return [mes, setMes] as const
}
