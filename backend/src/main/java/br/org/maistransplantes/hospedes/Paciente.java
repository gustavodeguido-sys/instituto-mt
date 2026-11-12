package br.org.maistransplantes.hospedes;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;

@Entity 
@Table(name = "paciente")
public class Paciente {
    @Id @GeneratedValue (strategy = GenerationType.UUID)   
    private UUID id;
    private String nome;

    @Enumerated(EnumType.STRING) 
    private String tipoTransplante;


    private String telefone;
    private String cidadeOrigem;


    protected Paciente() {}
    public Paciente(String nome, String tipoTransplante, String telefone, String cidadeOrigem) {
        this.nome = nome;
        this.tipoTransplante = tipoTransplante;
        this.telefone = telefone;
        this.cidadeOrigem = cidadeOrigem;
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

    public String getTipoTransplante() {
        return tipoTransplante;
    }

    public void setTipoTransplante(String tipoTransplante) {
        this.tipoTransplante = tipoTransplante;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCidadeOrigem() {
        return cidadeOrigem;
    }

    public void setCidadeOrigem(String cidadeOrigem) {
        this.cidadeOrigem = cidadeOrigem;
    }
}
