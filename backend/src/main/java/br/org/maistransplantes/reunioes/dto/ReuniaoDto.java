package br.org.maistransplantes.reunioes.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import br.org.maistransplantes.reunioes.FormatoReuniao;

import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record ReuniaoDto(UUID id, String titulo, LocalDate data,
    @JsonFormat(pattern = "HH:mm") LocalTime horaInicio,

    @JsonFormat(pattern = "HH:mm") LocalTime horaFim, FormatoReuniao formato,
    String local, List<ParticipanteDto> participantes, List<String> pauta ){} 
    

