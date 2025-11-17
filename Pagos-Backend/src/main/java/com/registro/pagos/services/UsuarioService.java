package com.registro.pagos.services;

import com.registro.pagos.models.Usuario;
import com.registro.pagos.repository.UsuarioRepository;
import com.registro.pagos.exception.ResourceNotFoundException;
import com.registro.pagos.exception.InvalidOperationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Operaciones CRUD sobre Usuario.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Registra un nuevo usuario
    @Transactional
    public Usuario registerUsuario(Usuario usuario, String plainPassword) {
        if (usuario == null || usuario.getDni() == null || usuario.getDni().isBlank()) {
            throw new InvalidOperationException("DNI es requerido");
        }
        if (usuarioRepository.findByDni(usuario.getDni()).isPresent()) {
            throw new InvalidOperationException("Ya existe un usuario con ese DNI");
        }
        // Nota: aquí se guarda la contraseña tal cual en passwordHash. Recomiendo hashear con BCrypt.
        usuario.setPasswordHash(plainPassword);
        return usuarioRepository.save(usuario);
    }

    // Edita un usuario existente
    @Transactional
    public Usuario editUsuario(String dni, Usuario cambios, String newPlainPassword) {
        Usuario u = usuarioRepository.findByDni(dni)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + dni));
        if (cambios.getNombreCompleto() != null)
            u.setNombreCompleto(cambios.getNombreCompleto());
        u.setRol(cambios.getRol());
        if (newPlainPassword != null) {
            u.setPasswordHash(newPlainPassword);
        }
        return usuarioRepository.save(u);
    }

    // Elimina un usuario por DNI
    @Transactional
    public void deleteUsuario(String dni) {
        Usuario u = usuarioRepository.findByDni(dni)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + dni));
        usuarioRepository.delete(u);
    }

    // Encuentra usuario por DNI
    public Usuario findByDni(String dni) {
        return usuarioRepository.findByDni(dni)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + dni));
    }

    // Obtener todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }
}