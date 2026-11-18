package br.org.maistransplantes.financeiro;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.Getter;


@Getter 
@Setter 
@Entity 
@Table(name = "lancamento")
public class Lancamento {
    @Setter (AccessLevel.NONE)
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; 

    @Enumerated(EnumType.STRING)
    @Column (nullable = false)
    private String TipoLancamento;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "valor_centavos", nullable = false)
    private long valorCentavos;

    @Column(nullable = false)
    private LocalDate data;

    private String observacoes;
    private String origem;
    private String categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_beneficente_id")
    private EventoBeneficente evento;

    protected Lancamento() {}

    public Lancamento(String TipoLancamento, String descricao, long valorCentavos,
                    LocalDate data, String observacoes, String categoria
    ) {
        this.TipoLancamento = TipoLancamento;
        this.descricao = descricao;
        this.valorCentavos = valorCentavos;
        this.data = data;
        this.observacoes = observacoes;
        this.categoria = categoria;
    }
}
