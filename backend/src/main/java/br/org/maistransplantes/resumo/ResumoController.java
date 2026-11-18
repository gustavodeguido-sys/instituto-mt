package br.org.maistransplantes.resumo;

import java.time.LocalDate;
import java.time.ZoneId;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.maistransplantes.resumo.dto.ResumoDashboardDto;

@RestController 
@RequestMapping("/api/dashboard") 
public class ResumoController {

    private final ResumoService service;
    public ResumoController(ResumoService service) {
        this.service = service;
    }

    @GetMapping("/resumo")
    public ResumoDashboardDto resumo() {
        return service.resumir(LocalDate.now(ZoneId.of("America/Sao_Paulo")));
    } 
    
}
