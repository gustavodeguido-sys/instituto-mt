package br.org.maistransplantes.financeiro.dto;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;

import br.org.maistransplantes.financeiro.EventoBeneficente;
import br.org.maistransplantes.financeiro.enums.CategoriaDespesa;
import br.org.maistransplantes.financeiro.enums.OrigemReceita;

public record PainelFinanceiroDto(
    YearMonth mes,
    long arrecadacao,
    long despesas,
    long arrecadacaoMesAnterior,
    long despesasMesAnterior,
    List<TotalMensalDto> historico, 
    Map<OrigemReceita, Long> porOrigem,
    Map<CategoriaDespesa, Long> porCategoria,
    int quantidadeDoacoes,
    List<DoacaoDto> ultimasDoacoes,
    List<EventoBeneficenteDto> eventos
) {}
