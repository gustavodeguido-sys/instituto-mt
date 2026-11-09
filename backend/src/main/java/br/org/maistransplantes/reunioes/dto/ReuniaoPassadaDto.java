package br.org.maistransplantes.reunioes.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import br.org.maistransplantes.reunioes.FormatoReuniao;

public record ReuniaoPassadaDto( 
    UUID id, String titulo, LocalDate data,
    @JsonFormat(pattern = "HH:mm") LocalTime horaInicio,
    @JsonFormat(pattern ="HH:mm") LocalTime horaFim,
    FormatoReuniao formato, String local,
    int totalParticipantes, String ata
) {}
