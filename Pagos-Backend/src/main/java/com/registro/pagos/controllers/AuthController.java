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
        if (request == null || request.getDni() == null || request.getPassword() == null) {
            throw new InvalidOperationException("DNI y password son requeridos");
        }
        Usuario u = usuarioRepository.findByDni(request.getDni())
                .orElseThrow(() -> new InvalidOperationException("Credenciales inválidas"));
        String stored = u.getPasswordHash();
        if (stored == null || !stored.equals(request.getPassword())) {
            throw new InvalidOperationException("Credenciales inválidas");
        }
        return ResponseEntity.ok(Map.of(
                "dni", u.getDni(),
                "nombreCompleto", u.getNombreCompleto(),
                "rol",u.getRol()
        ));
    }
}