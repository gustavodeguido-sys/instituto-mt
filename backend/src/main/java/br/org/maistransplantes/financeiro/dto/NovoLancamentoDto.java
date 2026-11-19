package br.org.maistransplantes.financeiro.dto;

import java.time.LocalDate;

import br.org.maistransplantes.financeiro.enums.CategoriaDespesa;
import br.org.maistransplantes.financeiro.enums.OrigemReceita;
import br.org.maistransplantes.financeiro.enums.TipoLancamento;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record NovoLancamentoDto(
    @NotNull TipoLancamento tipo,

    @Size (max = 150)
    @NotBlank String descricao,

    @Positive long valor,

    @NotNull LocalDate data,

    String observacoes,

    OrigemReceita origem,
    CategoriaDespesa categoria
) {
    @AssertTrue(message = "receita exige origem, despesa exige categoria (e não os dois)")
    public boolean isCamposDoTipoValidos() {
        if (tipo == null) return true;
        return switch (tipo) {
            case RECEITA -> origem != null && categoria == null;
            case DESPESA -> categoria != null && origem == null;
        };
    }
}
