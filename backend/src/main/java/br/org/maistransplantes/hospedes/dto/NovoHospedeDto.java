package br.org.maistransplantes.hospedes.dto;

import java.time.LocalDate;

import br.org.maistransplantes.hospedes.enums.SituacaoClinica;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NovoHospedeDto(
    @Size(max = 150)
    @NotBlank String paciente,
    @NotBlank String tipoTransplante,
    @NotBlank String acompanhante,
    String parentesco,
    @NotBlank String quarto,
    @NotNull LocalDate dataEntrada,
    @NotNull SituacaoClinica situacao 
) {}
