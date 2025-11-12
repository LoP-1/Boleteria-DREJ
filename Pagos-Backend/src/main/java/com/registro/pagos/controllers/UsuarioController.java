package com.registro.pagos.controllers;

import com.registro.pagos.models.Usuario;
import com.registro.pagos.services.UsuarioService;
import com.registro.pagos.exception.InvalidOperationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Registrar usuario
    public static class RegisterUsuarioRequest {
        public String dni;
        public String nombreCompleto;
        public String password;
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterUsuarioRequest req) {
        if (req == null || req.dni == null || req.dni.isBlank() || req.password == null) {
            throw new InvalidOperationException("DNI y password son requeridos");
        }
        Usuario u = new Usuario();
        u.setDni(req.dni);
        u.setNombreCompleto(req.nombreCompleto);
        Usuario created = usuarioService.registerUsuario(u, req.password);
        return ResponseEntity.status(201).body(created);
    }

    // Editar usuario (por DNI path)
    public static class EditUsuarioRequest {
        public String nombreCompleto;
        public String password;
    }

    @PutMapping("/{dni}")
    public ResponseEntity<?> edit(@PathVariable String dni, @RequestBody EditUsuarioRequest req) {
        Usuario cambios = new Usuario();
        cambios.setNombreCompleto(req != null ? req.nombreCompleto : null);
        String newPass = req != null ? req.password : null;
        Usuario updated = usuarioService.editUsuario(dni, cambios, newPass);
        return ResponseEntity.ok(updated);
    }

    // Eliminar usuario
    @DeleteMapping("/{dni}")
    public ResponseEntity<?> delete(@PathVariable String dni) {
        usuarioService.deleteUsuario(dni);
        return ResponseEntity.noContent().build();
    }

    // Obtener usuario por dni
    @GetMapping("/{dni}")
    public ResponseEntity<?> getByDni(@PathVariable String dni) {
        Usuario u = usuarioService.findByDni(dni);
        // Por seguridad, puedes eliminar passwordHash del body si no quieres exponerlo
        u.setPasswordHash(null);
        return ResponseEntity.ok(u);
    }
}