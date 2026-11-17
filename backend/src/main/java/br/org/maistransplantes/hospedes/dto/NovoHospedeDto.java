package br.org.maistransplantes.hospedes.dto;

import java.time.LocalDate;

import br.org.maistransplantes.hospedes.enums.SituacaoClinica;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NovoHospedeDto(
    @Size(max = 150)
    @NotBlank String paciente,

    @Size(max = 60)
    @NotBlank String tipoTransplante,

    @Size(max = 150)
    @NotBlank String acompanhante,

    @Size(max = 40)
    String parentesco,

    @Size(max = 10)
    @NotBlank String quarto,
    @NotNull LocalDate dataEntrada,
    @NotNull SituacaoClinica situacao 
) {}
