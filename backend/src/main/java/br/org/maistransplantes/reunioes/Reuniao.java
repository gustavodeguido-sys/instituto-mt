package br.org.maistransplantes.reunioes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


import jakarta.persistence.*;

@Entity
@Table(name = "reuniao")
public class Reuniao {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String titulo;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;


    @Enumerated(EnumType.STRING)
    private FormatoReuniao formato;

    private String local;
    private String ata;

    @ManyToMany 
    @JoinTable(name = "reuniao_participante",
        joinColumns = @JoinColumn(name = "reuniao_id"),
        inverseJoinColumns = @JoinColumn(name = "participante_id"))
        private Set<Participante> participantes = new HashSet<>();

    @ElementCollection 
    @CollectionTable(name = "reuniao_pauta", joinColumns = @JoinColumn (name = "reuniao_id"))
    @OrderColumn(name = "ordem")
    @Column(name = "item")
    private List<String> pauta = new ArrayList<>();

    protected Reuniao() {}
        public Reuniao(String titulo, LocalDate data, LocalTime horaInicio, LocalTime horaFim
            , FormatoReuniao formato, String local) {
                this.titulo = titulo;
                this.data = data;
                this.horaInicio = horaInicio;
                this.horaFim = horaFim;
                this.formato = formato;
                this.local = local;          
            }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public LocalDate getData() {
        return data;
    }
    public void setData(LocalDate data) {
        this.data = data;
    }
    public LocalTime getHoraInicio() {
        return horaInicio;
    }
    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }
    public LocalTime getHoraFim() {
        return horaFim;
    }
    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }
   }



