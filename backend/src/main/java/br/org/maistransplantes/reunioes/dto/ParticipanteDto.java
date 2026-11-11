package br.org.maistransplantes.reunioes.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;


public record ParticipanteDto(@NotNull UUID id, String nome) {
    
}
