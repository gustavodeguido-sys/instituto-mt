package br.org.maistransplantes.financeiro.dto;

import java.time.YearMonth;

public record TotalMensalDto(
    YearMonth mes,
    long arrecadacao,
    long despesas
) {
    
}
