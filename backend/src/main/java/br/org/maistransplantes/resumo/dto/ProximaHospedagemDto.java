package br.org.maistransplantes.resumo.dto;

import java.time.LocalDate;
import java.util.UUID;

import br.org.maistransplantes.hospedes.Hospedagem;

public record ProximaHospedagemDto(
    UUID id,
    String paciente,
    String quarto,
    LocalDate dataPrevista
) {
   public static ProximaHospedagemDto de(Hospedagem h) {
    return new ProximaHospedagemDto(h.getId(),
     h.getPaciente().getNome(),
     h.getQuarto().getNumero(), 
     h.getDataEntrada());
   } 
   
}
