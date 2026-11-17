package br.org.maistransplantes.resumo.dto;

import java.time.LocalDate;
import java.util.UUID;

import br.org.maistransplantes.hospedes.Hospedagem;

public record HospedagemAtualDto(
    UUID id, String paciente, String acompanhante, String quarto,
    LocalDate dataEntrada, LocalDate dataSaida
) {
   // Um parâmetro só: assim o método casa com o Function<Hospedagem, ...> que o
   // stream().map(...) espera, e dá para escrever map(HospedagemAtualDto::de).
   public static HospedagemAtualDto de(Hospedagem h) {
    return new HospedagemAtualDto(h.getId(),
    h.getPaciente().getNome(),
    h.getAcompanhante().getNome(), 
    h.getQuarto().getNumero(),
    h.getDataEntrada(), h.getDataSaida());
   }
}
