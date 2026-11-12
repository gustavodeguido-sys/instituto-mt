package br.org.maistransplantes.hospedes;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.*;
@Entity 
@Table(name = "quarto")
public class Quarto {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private Long id;
    private String numero;
    private int capacidade;


    protected Quarto() {}
        public Quarto(Long id, String numero, int capacidade) {
            this.id = id;
            this.numero = numero;
            this.capacidade = capacidade;
        }


    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }  


}
