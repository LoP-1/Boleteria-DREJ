package com.registro.pagos.services;

import com.registro.pagos.dto.LoginRequest;
import com.registro.pagos.dto.LoginResponse;
import com.registro.pagos.exception.InvalidOperationException;
import com.registro.pagos.exception.ResourceNotFoundException;
import com.registro.pagos.models.Usuario;
import com.registro.pagos.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    private AuthService authService;

    private final Map<String, TokenInfo> tokenStore = new ConcurrentHashMap<>();
    //duracion del token
    private final long expirySeconds = Duration.ofHours(8).getSeconds();

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse login(LoginRequest req) {
        if (req == null || req.getDni() == null || req.getPassword() == null) {
            throw new InvalidOperationException("DNI y password son requeridos");
        }
        Optional<Usuario> uOpt = usuarioRepository.findByDni(req.getDni());
        if (uOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado para dni: " + req.getDni());
        }
        Usuario usuario = uOpt.get();

        String stored = usuario.getPasswordHash();
        if (stored == null) {
            throw new InvalidOperationException("El usuario no tiene password configurado");
        }
        boolean ok = stored.equals(req.getPassword());
        if (!ok) {
            throw new InvalidOperationException("Credenciales inválidas");
        }

        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(expirySeconds);
        tokenStore.put(token, new TokenInfo(req.getDni(), expiresAt));
        return new LoginResponse(token, req.getDni(), expiresAt.getEpochSecond());
    }

    public Optional<String> validateToken(String token) {
        if (token == null) return Optional.empty();
        TokenInfo info = tokenStore.get(token);
        if (info == null) return Optional.empty();
        if (Instant.now().isAfter(info.expiresAt)) {
            tokenStore.remove(token);
            return Optional.empty();
        }
        return Optional.of(info.dni);
    }

    public void logout(String token) {
        if (token != null) tokenStore.remove(token);
    }

    private static class TokenInfo {
        final String dni;
        final Instant expiresAt;
        TokenInfo(String dni, Instant expiresAt) {
            this.dni = dni;
            this.expiresAt = expiresAt;
        }
    }
}
