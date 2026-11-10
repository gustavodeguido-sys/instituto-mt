package br.org.maistransplantes.reunioes;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity 
@Table(name="participante")
public class Participante {
    @Id @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false) private String nome;
    protected Participante() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
    
    public void setNome(String nome){
        this.nome = nome;
    }

    public String getNome(){
        return this.nome;
    }
    
}
