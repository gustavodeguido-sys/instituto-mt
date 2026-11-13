package br.org.maistransplantes.hospedes;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AcompanhanteRepository extends JpaRepository<Acompanhante, UUID>{
    
}
