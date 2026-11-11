package br.org.maistransplantes.common;

import java.util.stream.Collectors;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Prioridade máxima: com spring.mvc.problemdetails.enabled=true o Spring Boot registra um
// tratador próprio que também captura as falhas do @Valid. Sem o @Order ele ganharia do
// nosso e a resposta sairia sem a lista "campos".
@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class TratadorDeErros {
    @ExceptionHandler (RegraNegocioException.class)
    public ProblemDetail regra(RegraNegocioException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)   // falhas do @Valid
    public ProblemDetail validacao(MethodArgumentNotValidException e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Dados inválidos.");
        pd.setProperty("campos", e.getFieldErrors().stream()
            .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (a, b) -> a)));
        return pd;
    }
}


