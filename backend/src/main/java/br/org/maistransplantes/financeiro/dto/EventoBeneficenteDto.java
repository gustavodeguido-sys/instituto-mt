package br.org.maistransplantes.financeiro.dto;

import java.time.LocalDate;
import java.util.UUID;

import br.org.maistransplantes.financeiro.EventoBeneficente;

public record EventoBeneficenteDto(
    UUID id,
    String nome,
    LocalDate data,
    String local,
    long arrecadado,
    long custos
) {
    public static EventoBeneficenteDto de(EventoBeneficente e, long arrecadado, long custos) {
        return new EventoBeneficenteDto(e.getId(), e.getNome(),
         e.getData(), e.getLocal(), arrecadado, custos);
    }
    
}
