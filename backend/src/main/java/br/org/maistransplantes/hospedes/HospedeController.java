package br.org.maistransplantes.hospedes;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.maistransplantes.hospedes.dto.HospedeDto;
import br.org.maistransplantes.hospedes.dto.NovoHospedeDto;
import br.org.maistransplantes.hospedes.dto.ResumoHospedesDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
        return service.listarHospedes(null);
    }

    @GetMapping("/resumo")
    public List<ResumoHospedesDto> resumo(@PathVariable Paciente pacienteId ) {
        return service.resumir();
    }

    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public HospedeDto cadastrar(@Valid @RequestBody NovoHospedeDto dados) {
        return service.cadastrar(dados);
    }
    

}
