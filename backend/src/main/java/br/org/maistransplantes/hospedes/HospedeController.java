package br.org.maistransplantes.hospedes;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.maistransplantes.hospedes.dto.HospedeDto;
import br.org.maistransplantes.hospedes.dto.NovoHospedeDto;
import br.org.maistransplantes.hospedes.dto.ResumoHospedesDto;
import jakarta.validation.Valid;


import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;


@RestController 
@RequestMapping("/api/hospedes")
public class HospedeController {
    private final HospedeService service;
    public HospedeController(HospedeService service) {
        this.service = service;
    }

    @GetMapping 
    public List<HospedeDto> listar() {
        return service.listarHospedes(LocalDate.now());
    }

    @GetMapping("/resumo")
    public ResumoHospedesDto resumo() {
        return service.resumir(LocalDate.now());
    }

    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public HospedeDto cadastrar(@Valid @RequestBody NovoHospedeDto dados) {
        return service.cadastrar(dados);
    }
    

}
