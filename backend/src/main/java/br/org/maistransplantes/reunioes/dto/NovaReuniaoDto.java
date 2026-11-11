package br.org.maistransplantes.reunioes.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import br.org.maistransplantes.reunioes.FormatoReuniao;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NovaReuniaoDto(
    @NotBlank String titulo,
    @NotNull LocalDate data,
    @NotNull @JsonFormat (pattern = "HH:mm") LocalTime horaInicio,
    @NotNull @JsonFormat (pattern = "HH:mm") LocalTime horaFim,
    @NotNull FormatoReuniao formato,
    @NotBlank String local,
    // @Valid no elemento: faz o @NotNull do id de cada ParticipanteDto ser conferido
    @NotNull List<@Valid ParticipanteDto> participantes,
    @NotNull List<@NotBlank String> pauta) {} 
    

