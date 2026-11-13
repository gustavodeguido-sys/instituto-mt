package br.org.maistransplantes.hospedes;

import br.org.maistransplantes.hospedes.enums.*;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

// @Getter/@Setter na classe: o Lombok gera, na compilação, um getter e um setter para
// cada atributo (getPaciente(), setPaciente(...), getDataEntrada()...), sem escrever um por um.
// Não usamos @Data em entidade JPA: ele gera equals/hashCode/toString com todos os campos,
// o que dispara o carregamento das relações LAZY.
@Getter
@Setter
@Entity
@Table(name = "hospedagem")
public class Hospedagem {
    // O id é gerado pelo banco/Hibernate, então fica só com getter (sem setId).
    @Setter(AccessLevel.NONE)
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    // Regra da casa: nenhum paciente se hospeda sozinho, então o acompanhante é obrigatório.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "acompanhante_id", nullable = false)
    private Acompanhante acompanhante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quarto_id", nullable = false)
    private Quarto quarto;

    // LocalDate (e não String): as colunas são DATE no banco, e o "validate" do
    // Hibernate compara o tipo do atributo com o tipo da coluna.
    @Column(nullable = false)
    private LocalDate dataEntrada;

    private LocalDate dataSaidaPrevista;
    private LocalDate dataSaida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SituacaoClinica situacaoClinica;

    // Construtor vazio exigido pelo JPA (protected: o resto do código usa o construtor completo).
    protected Hospedagem() {}

    public Hospedagem(Paciente paciente, Acompanhante acompanhante, Quarto quarto,
            LocalDate dataEntrada, LocalDate dataSaidaPrevista, LocalDate dataSaida,
            SituacaoClinica situacaoClinica) {
        this.paciente = paciente;
        this.acompanhante = acompanhante;
        this.quarto = quarto;
        this.dataEntrada = dataEntrada;
        this.dataSaidaPrevista = dataSaidaPrevista;
        this.dataSaida = dataSaida;
        this.situacaoClinica = situacaoClinica;
    }
}
