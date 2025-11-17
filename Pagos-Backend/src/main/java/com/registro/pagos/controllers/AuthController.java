package com.registro.pagos.controllers;

import com.registro.pagos.dto.LoginRequest;
import com.registro.pagos.exception.InvalidOperationException;
import com.registro.pagos.models.Usuario;
import com.registro.pagos.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Valida que el request tenga DNI y password
        if (request == null || request.getDni() == null || request.getPassword() == null) {
            throw new InvalidOperationException("DNI y password son requeridos");
        }
        // Busca el usuario por DNI
        Usuario u = usuarioRepository.findByDni(request.getDni())
                .orElseThrow(() -> new InvalidOperationException("Credenciales inválidas"));
        // Verifica la contraseña
        String stored = u.getPasswordHash();
        if (stored == null || !stored.equals(request.getPassword())) {
            throw new InvalidOperationException("Credenciales inválidas");
        }
        // Retorna la respuesta con datos del usuario
        return ResponseEntity.ok(Map.of(
                "dni", u.getDni(),
                "nombreCompleto", u.getNombreCompleto(),
                "rol",u.getRol()
        ));
    }
}