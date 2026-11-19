package br.org.maistransplantes.financeiro.dto;

import java.time.LocalDate;
import java.util.UUID;

import br.org.maistransplantes.financeiro.Lancamento;

public record DoacaoDto(
    UUID id,
    String descricao,
    LocalDate data,
    long valor
) {
    public static DoacaoDto de(Lancamento l) {
        return new DoacaoDto(l.getId(),
            l.getDescricao(), l.getData(),
            l.getValorCentavos());
        
    }
}
