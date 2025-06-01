package org.example.mirinayapi.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestControllerAdvice
@Tag(name = "Erros", description = "Tratamento de erros")
public class ErrorHandler {

    @ExceptionHandler(NoSuchElementException.class)
    @Operation(summary = "Erro 404", description = "Recurso não encontrado")
    @ApiResponse(responseCode = "404", description = "Recurso não encontrado")
    public ResponseEntity<?> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErroResponse("Recurso não encontrado", ex.getMessage()));
    }

    @ExceptionHandler(ExpiredJwtException.class)
    @Operation(summary = "Erro 403", description = "Token expirado")
    @ApiResponse(responseCode = "403", description = "Token expirado ou inválido")
    public ResponseEntity<?> handleTokenExpired(ExpiredJwtException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErroResponse("Token inválido", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @Operation(summary = "Erro 400", description = "Formato de argumento inválido")
    @ApiResponse(responseCode = "400", description = "URL ou parâmetro mal formatado")
    public ResponseEntity<?> handleArgumentMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse("URL mal formatada", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @Operation(summary = "Erro 400", description = "Dados de entrada inválidos")
    @ApiResponse(responseCode = "400", description = "Erros de validação dos campos")
    public ResponseEntity<?> handleValidationError(MethodArgumentNotValidException ex) {
        List<FieldError> errors = ex.getFieldErrors();
        List<DadosErroValidacao> detalhes = new ArrayList<>();
        for (FieldError fe : errors) {
            detalhes.add(new DadosErroValidacao(fe.getField(), fe.getDefaultMessage()));
        }
        return ResponseEntity.badRequest()
                .body(new ErroResponse("Dados inválidos", detalhes));
    }

    @ExceptionHandler(BadRequestException.class)
    @Operation(summary = "Erro 400", description = "Requisição inválida")
    @ApiResponse(responseCode = "400", description = "Erro na requisição")
    public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse("Erro na requisição", ex.getMessage()));
    }

    @ExceptionHandler(HttpClientErrorException.class)
    @Operation(summary = "Erro de cliente", description = "Erro genérico do cliente")
    @ApiResponse(responseCode = "400", description = "Erro genérico do cliente")
    public ResponseEntity<?> handleHttpClientError(HttpClientErrorException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErroResponse("Erro do cliente", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @Operation(summary = "Erro 400", description = "Argumento ilegal fornecido")
    @ApiResponse(responseCode = "400", description = "Erro no argumento")
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(new ErroResponse("Erro de argumento", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    @Operation(summary = "Erro genérico", description = "Erro inesperado no servidor")
    @ApiResponse(responseCode = "500", description = "Erro interno no servidor")
    public ResponseEntity<?> handleGenericException(Exception ex) {
        ex.printStackTrace(); // Log do erro para depuração
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErroResponse("Erro interno", ex.getMessage()));
    }

    // Classe para resposta de erro genérica
    private record ErroResponse(String mensagem, Object detalhes) {
    }

    // Classe para detalhes de validação
    private record DadosErroValidacao(String campo, String mensagem) {
    }
}
