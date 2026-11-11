package br.org.maistransplantes.reunioes;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.org.maistransplantes.reunioes.dto.NovaReuniaoDto;
import br.org.maistransplantes.reunioes.dto.ReuniaoDto;
import br.org.maistransplantes.reunioes.dto.ReuniaoPassadaDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

// @RestController registra a classe no Spring e devolve o retorno dos métodos como JSON.
// Sem ele o @RequestMapping é ignorado e todas as rotas respondem 404.
@RestController
@RequestMapping("/api/reunioes")
public class ReuniaoController {
    private final ReuniaoService service;
    public ReuniaoController(ReuniaoService service) {
        this.service = service;
    }

    @GetMapping 
    public List<ReuniaoDto> listar() {
        return service.buscarProximas();
    }

    @GetMapping("/passadas")
    public List<ReuniaoPassadaDto> passadas(
            // @Min/@Max valem para o número "limite" (fora da faixa -> 400)
            @RequestParam(defaultValue = "5") @Min(1) @Max(50) int limite) {
        return service.buscarPassadas(limite);
    }

    @PostMapping 
    @ResponseStatus(HttpStatus.CREATED)
    public ReuniaoDto agendar(@Valid @RequestBody NovaReuniaoDto dados) {
        return service.agendar(dados);
    } 
    
}
