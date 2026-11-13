package br.org.maistransplantes.hospedes.dto;

import java.time.LocalDate;
import java.util.UUID;

import br.org.maistransplantes.hospedes.Hospedagem;
import br.org.maistransplantes.hospedes.enums.SituacaoHospede;

public record HospedeDto( UUID id,
    String paciente,
    String tipoTransplante,
    String acompanhante,
    String parentesco,
    String quarto,
    LocalDate dataEntrada,
    SituacaoHospede situacao
) {
    public static HospedeDto de(Hospedagem h, LocalDate hoje) {
        return new HospedeDto(h.getId(), 
        h.getPaciente().getNome(),
        h.getPaciente().getTipoTransplante(),
        h.getAcompanhante().getNome(),
        h.getAcompanhante().getParentesco(),
        h.getQuarto().getNumero(),
        h.getDataEntrada(),
        SituacaoHospede.calcular(h, hoje));
    }
    
}
