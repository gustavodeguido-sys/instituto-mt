package br.org.maistransplantes.financeiro;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
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

    // Recebe o DTO inteiro (já validado pelo @Valid no controller), e não os
    // campos soltos: o service é quem sabe convertê-lo em entidade.
    @Transactional
    public void registrarLancamento(NovoLancamentoDto dto) {
        // 2. NORMALIZAR OS TEXTOS (evita lixo no banco)
        //    O DTO é um record (imutável), então guardamos os textos limpos em variáveis.
        String descricao = dto.descricao().strip();
        // Observação vazia ou só com espaços vira null: o contrato com o front
        // usa null para "sem observação", não string vazia.
        String observacoes = (dto.observacoes() == null || dto.observacoes().isBlank())
            ? null
            : dto.observacoes().strip();

        Lancamento lancamento = new Lancamento(
            dto.tipo(), descricao, dto.valor(), dto.data(),
            observacoes, dto.origem(), dto.categoria());
        lancamentoRepository.save(lancamento);

    }

    // Gera o CSV do mês para o botão "Exportar". readOnly: só lê o banco.
    // Devolve bytes (não DTO): a resposta é um arquivo, não JSON — quem diz ao
    // navegador "baixe isto" é o controller, com o cabeçalho Content-Disposition.
    @Transactional(readOnly = true)
    public byte[] exportar(YearMonth mes) {
        LocalDate inicio = mes.atDay(1);
        LocalDate fim = mes.atEndOfMonth();

        List<Lancamento> lancamentos = lancamentoRepository.findByDataBetweenOrderByDataAsc(inicio, fim);

        // Separador ";" porque o Excel pt-BR usa "," como decimal.
        // A última coluna não leva ";" no fim (senão vira uma coluna vazia extra),
        // e "\n" encerra a linha.
        StringBuilder sb = new StringBuilder();
        sb.append("Data;Tipo;Descrição;Valor (R$);Origem;Categoria;Observações\n");

        for (Lancamento l : lancamentos) {
            sb.append(l.getData().format(FORMATO_DATA)).append(';')
              .append(l.getTipo().toKebabCase()).append(';')
              .append(escaparCsv(l.getDescricao())).append(';')
              .append(formatarReais(l.getValorCentavos())).append(';')
              // origem/categoria/observacoes podem ser null: vira célula vazia, não "null".
              .append(l.getOrigem() == null ? "" : l.getOrigem().toKebabCase()).append(';')
              .append(l.getCategoria() == null ? "" : l.getCategoria().toKebabCase()).append(';')
              .append(escaparCsv(l.getObservacoes()))
              .append('\n');
        }

        // "\uFEFF" (BOM) avisa o Excel que o arquivo é UTF-8; sem ele os acentos quebram.
        return ("\uFEFF" + sb).getBytes(StandardCharsets.UTF_8);
    }

    // static final: o formatador é imutável e seguro entre threads,
    // então criamos um só para a classe toda em vez de um por chamada.
    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // Centavos -> "1234,56". %02d completa com zero à esquerda: 5 centavos vira "05", não "5".
    private static String formatarReais(long centavos) {
        return String.format("%d,%02d", centavos / 100, centavos % 100);
    }

    // Texto livre pode ter ";", aspas ou quebra de linha, o que desalinharia as colunas.
    // Regra do CSV: envolver o campo em aspas e duplicar as aspas internas (" -> "").
    private static String escaparCsv(String texto) {
        if (texto == null) {
            return "";
        }
        if (texto.contains(";") || texto.contains("\"") || texto.contains("\n")) {
            return "\"" + texto.replace("\"", "\"\"") + "\"";
        }
        return texto;
    }
}
