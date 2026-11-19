package br.org.maistransplantes.financeiro;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.org.maistransplantes.financeiro.dto.DoacaoDto;
import br.org.maistransplantes.financeiro.dto.EventoBeneficenteDto;
import br.org.maistransplantes.financeiro.dto.NovoLancamentoDto;
import br.org.maistransplantes.financeiro.dto.PainelFinanceiroDto;
import br.org.maistransplantes.financeiro.dto.TotalMensalDto;
import br.org.maistransplantes.financeiro.enums.CategoriaDespesa;
import br.org.maistransplantes.financeiro.enums.OrigemReceita;
import br.org.maistransplantes.financeiro.enums.TipoLancamento;

@Service
public class FinanceiroService {
    // Quantos meses o gráfico "Arrecadações x despesas" mostra (contrato: últimos 6).
    private static final int MESES_HISTORICO = 6;

    private final LancamentoRepository lancamentoRepository;
    private final EventoBeneficenteRepository eventoRepository;

    // Injeção pelo construtor: o Spring entrega os repositórios prontos,
    // e os campos podem ser final (não mudam depois de criados).
    public FinanceiroService(LancamentoRepository lancamentoRepository,
                             EventoBeneficenteRepository eventoRepository) {
        this.lancamentoRepository = lancamentoRepository;
        this.eventoRepository = eventoRepository;
    }

    // readOnly = true: avisa ao Hibernate que nada será alterado, então ele
    // pula a verificação de "o que mudou?" (dirty checking) no fim da transação.
    @Transactional(readOnly = true)
    public PainelFinanceiroDto montarPainel(YearMonth mes) {
        // YearMonth -> LocalDate: o repositório filtra por data, então convertemos
        // o mês em "primeiro dia" e "último dia" (atEndOfMonth já sabe se é 28, 30 ou 31).
        LocalDate inicioMes = mes.atDay(1);
        LocalDate fimMes = mes.atEndOfMonth();
        LocalDate inicioHistorico = mes.minusMonths(MESES_HISTORICO - 1).atDay(1);

        // UMA consulta traz os 6 meses inteiros. Daqui saem o histórico, os totais
        // do mês atual e do anterior e as divisões por origem/categoria —
        // tudo calculado em memória, em vez de uma consulta para cada número.
        List<Lancamento> todosMeses =
            lancamentoRepository.findByDataBetweenOrderByDataAsc(inicioHistorico, fimMes);

        // Só os lançamentos do mês pedido entram nas divisões por origem/categoria.
        // filter testa CADA lançamento (l) e mantém os que são do mês; toList() junta o resultado.
        List<Lancamento> doMes = todosMeses.stream()
            .filter(l -> YearMonth.from(l.getData()).equals(mes))
            .toList();

        List<TotalMensalDto> historico = montarHistorico(mes, todosMeses);
        // O histórico vai do mais antigo ao mais recente: o último é o mês pedido,
        // o penúltimo é o mês anterior (usado nos "% em relação ao mês passado").
        TotalMensalDto atual = historico.get(MESES_HISTORICO - 1);
        TotalMensalDto anterior = historico.get(MESES_HISTORICO - 2);

        // Para essas duas, o repositório já tem consultas prontas (TOP 5 e COUNT
        // feitos pelo próprio banco), restritas ao mês.
        long quantidadeDoacoes =
            lancamentoRepository.countByTipoAndDataBetween(TipoLancamento.RECEITA, inicioMes, fimMes);
        List<DoacaoDto> ultimasDoacoes = lancamentoRepository
            .findTop5ByTipoAndDataBetweenOrderByDataDesc(TipoLancamento.RECEITA, inicioMes, fimMes)
            .stream()
            .map(DoacaoDto::de)   // entidade -> DTO: o controller nunca devolve entidade JPA
            .toList();

        return new PainelFinanceiroDto(
            mes,
            atual.arrecadacao(),
            atual.despesas(),
            anterior.arrecadacao(),
            anterior.despesas(),
            historico,
            somarPorOrigem(doMes),
            somarPorCategoria(doMes),
            quantidadeDoacoes,
            ultimasDoacoes,
            montarEventos(inicioMes, fimMes));
    }

    // Uma entrada por mês, SEMPRE os 6 — mesmo um mês sem lançamentos aparece
    // com 0, senão o gráfico do front ficaria com um "buraco" no eixo.
    private List<TotalMensalDto> montarHistorico(YearMonth mes, List<Lancamento> lancamentos) {
        List<TotalMensalDto> historico = new ArrayList<>();
        for (int i = MESES_HISTORICO - 1; i >= 0; i--) {   // do mais antigo ao mais recente
            YearMonth m = mes.minusMonths(i);
            historico.add(new TotalMensalDto(
                m,
                somar(lancamentos, m, TipoLancamento.RECEITA),
                somar(lancamentos, m, TipoLancamento.DESPESA)));
        }
        return historico;
    }

    // Soma (em centavos) os lançamentos de um tipo dentro de um mês.
    // mapToLong(...).sum() devolve 0 quando o filtro não deixa sobrar nada.
    private static long somar(List<Lancamento> lancamentos, YearMonth mes, TipoLancamento tipo) {
        return lancamentos.stream()
            .filter(l -> l.getTipo() == tipo && YearMonth.from(l.getData()).equals(mes))
            .mapToLong(Lancamento::getValorCentavos)
            .sum();
    }

    // O contrato é Record<OrigemReceita, number>: o front espera TODAS as chaves.
    // Por isso o mapa começa com 0 em cada origem, e só depois soma o que houver.
    // EnumMap: Map otimizado para chaves enum, e mantém a ordem de declaração.
    private static Map<OrigemReceita, Long> somarPorOrigem(List<Lancamento> doMes) {
        Map<OrigemReceita, Long> totais = new EnumMap<>(OrigemReceita.class);
        for (OrigemReceita origem : OrigemReceita.values()) {
            totais.put(origem, 0L);
        }
        for (Lancamento l : doMes) {
            if (l.getTipo() == TipoLancamento.RECEITA && l.getOrigem() != null) {
                // merge: "pega o valor atual da chave e soma este" (Long::sum).
                totais.merge(l.getOrigem(), l.getValorCentavos(), Long::sum);
            }
        }
        return totais;
    }

    // Mesma ideia, para as despesas.
    private static Map<CategoriaDespesa, Long> somarPorCategoria(List<Lancamento> doMes) {
        Map<CategoriaDespesa, Long> totais = new EnumMap<>(CategoriaDespesa.class);
        for (CategoriaDespesa categoria : CategoriaDespesa.values()) {
            totais.put(categoria, 0L);
        }
        for (Lancamento l : doMes) {
            if (l.getTipo() == TipoLancamento.DESPESA && l.getCategoria() != null) {
                totais.merge(l.getCategoria(), l.getValorCentavos(), Long::sum);
            }
        }
        return totais;
    }

    // Eventos do mês, cada um com o arrecadado e os custos somados no banco.
    // São 2 consultas por evento; como a casa faz poucos eventos por mês, é
    // aceitável. Se um dia forem muitos, troque por uma única consulta com GROUP BY.
    private List<EventoBeneficenteDto> montarEventos(LocalDate inicioMes, LocalDate fimMes) {
        return eventoRepository.findByDataBetweenOrderByDataAsc(inicioMes, fimMes).stream()
            .map(e -> EventoBeneficenteDto.de(
                e,
                lancamentoRepository.somarPorEventoETipo(e.getId(), TipoLancamento.RECEITA),
                lancamentoRepository.somarPorEventoETipo(e.getId(), TipoLancamento.DESPESA)))
            .toList();
    }

    @Transactional 
    public void registrarLancamento(Lancamento l, NovoLancamentoDto observacoes) {
        // 1. VALIDAÇÃO — já foi feita antes de chegar aqui.
        //    O controller recebe o DTO com @Valid, então @NotNull, @NotBlank, @Positive
        //    e a regra @AssertTrue (receita -> origem, despesa -> categoria) já passaram.
        //    O service não precisa repetir essas checagens.

        // 2. NORMALIZAR OS TEXTOS (opcional, mas evita lixo no banco)
        //    - descricao: tirar espaços das pontas (strip)
        //    - observacoes: se vier null ou só com espaços, guardar null;
        //      senão, guardar o texto sem os espaços das pontas
        //    (o contrato com o front usa null para "sem observação", não string vazia)
        String limparTexto = l.getDescricao().strip();
        l.setDescricao(limparTexto);
        // 3. CONVERTER DTO -> ENTIDADE
        //    - criar um new Lancamento(...) usando o construtor público da entidade
        //    - passar: tipo, descricao, valor (já em centavos), data, observacoes,
        //      origem e categoria
        //    - atenção: no DTO o campo se chama "valor", na entidade "valorCentavos"
        //    - o id NÃO é passado: o banco/Hibernate gera o UUID ao salvar
        
        // 4. SALVAR
        //    - chamar lancamentoRepository.save(lancamento)
        //    - como o método é @Transactional, se algo falhar no meio
        //      a transação é desfeita (rollback) e nada fica gravado pela metade

        // 5. RETORNO
        //    - hoje o método é void: o controller responde 201 Created sem corpo
        //    - se o front precisar do lançamento criado (ex.: para mostrar o id),
        //      trocar o retorno por um DTO de resposta e devolver
        //      algo como XxxDto.de(lancamentoSalvo) — nunca a entidade JPA
    }
}
