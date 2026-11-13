package br.org.maistransplantes.hospedes.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SituacaoClinica {
    PRE_TRANSPLANTE, 
    POS_TRANSPLANTE,
    INTERNADO_HC;

    @JsonValue  
    public String toKebabCase() {
        return name().toLowerCase().replace("_", "-");
    }
}
