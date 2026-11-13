package br.org.maistransplantes.hospedes.enums;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonValue;

import br.org.maistransplantes.hospedes.Hospedagem;

// Situação que aparece no selo da tela de hóspedes: espelha o tipo SituacaoHospede de
// frontend/src/types/hospedes.ts (o contrato com o front).
// É diferente de SituacaoClinica: aquela é o que fica GRAVADO na coluna situacao_clinica
// (3 valores); esta é CALCULADA a cada consulta, porque "chegou hoje" e "saída prevista"
// dependem da data de hoje e não faria sentido guardar no banco.
public enum SituacaoHospede {
    PRE_TRANSPLANTE("pre-transplante"),
    POS_TRANSPLANTE("pos-transplante"),
    INTERNADO_HC("internado-hc"),
    CHEGOU_HOJE("chegou-hoje"),
    SAIDA_PREVISTA("saida-prevista");

    // Quantos dias à frente uma saída prevista já vira selo (mesma janela do card
    // "saídas previstas na semana" do resumo).
    private static final int DIAS_AVISO_SAIDA = 7;

    private final String valor;

    SituacaoHospede(String valor) {
        this.valor = valor;
    }

    // @JsonValue: o Jackson escreve este texto no JSON ("chegou-hoje") em vez do nome
    // da constante (CHEGOU_HOJE), mantendo o kebab-case que o TypeScript espera.
    @JsonValue
    public String getValor() {
        return valor;
    }

    // Recebe "hoje" por parâmetro (em vez de chamar LocalDate.now() aqui dentro) para a
    // regra poder ser testada com qualquer data.
    public static SituacaoHospede calcular(Hospedagem h, LocalDate hoje) {
        if (h.getDataEntrada().isEqual(hoje)) {
            return CHEGOU_HOJE;
        }

        // dataSaidaPrevista é opcional (coluna sem NOT NULL), por isso o teste de null.
        LocalDate saidaPrevista = h.getDataSaidaPrevista();
        if (saidaPrevista != null && !saidaPrevista.isAfter(hoje.plusDays(DIAS_AVISO_SAIDA))) {
            return SAIDA_PREVISTA;
        }

        // Sem nada de especial nas datas: vale a situação clínica gravada no banco.
        return switch (h.getSituacaoClinica()) {
            case PRE_TRANSPLANTE -> PRE_TRANSPLANTE;
            case POS_TRANSPLANTE -> POS_TRANSPLANTE;
            case INTERNADO_HC -> INTERNADO_HC;
        };
    }
}
