package br.org.maistransplantes.hospedes;

import jakarta.persistence.Entity;

import java.util.UUID;

import jakarta.persistence.*;

@Entity 
@Table(name = "acompanhante")
public class Acompanhante {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String nome;
    private String parentesco;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;
    

    protected Acompanhante() {}
    public Acompanhante(String nome, String parentesco, Paciente paciente) {
        this.nome = nome; 
        this.parentesco = parentesco;
        this.paciente = paciente;
    }

    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getParentesco() {
        return parentesco;
    }

    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
 }
