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

    // Clase interna para request de registro
    public static class RegisterUsuarioRequest {
        public String dni;
        public String nombreCompleto;
        public String password;
        public String rol;
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterUsuarioRequest req) {
        // Valida campos requeridos
        if (req == null || req.dni == null || req.dni.isBlank() || req.password == null) {
            throw new InvalidOperationException("DNI y password son requeridos");
        }
        // Crea el usuario
        Usuario u = new Usuario();
        u.setDni(req.dni);
        u.setRol(req.rol);
        u.setNombreCompleto(req.nombreCompleto);
        Usuario created = usuarioService.registerUsuario(u, req.password);
        return ResponseEntity.status(201).body(created);
    }

    // Clase interna para request de edición
    public static class EditUsuarioRequest {
        public String nombreCompleto;
        public String password;
        public String rol;
    }

    @PutMapping("/{dni}")
    public ResponseEntity<?> edit(@PathVariable String dni, @RequestBody EditUsuarioRequest req) {
        // Prepara cambios
        Usuario cambios = new Usuario();
        cambios.setNombreCompleto(req != null ? req.nombreCompleto : null);
        cambios.setRol(req != null ? req.rol : "USUARIO");
        String newPass = req != null ? req.password : null;
        // Edita el usuario
        Usuario updated = usuarioService.editUsuario(dni, cambios, newPass);
        return ResponseEntity.ok(updated);
    }

    // Elimina un usuario por DNI
    @DeleteMapping("/{dni}")
    public ResponseEntity<?> delete(@PathVariable String dni) {
        usuarioService.deleteUsuario(dni);
        return ResponseEntity.noContent().build();
    }

    // Obtiene un usuario por DNI (sin password)
    @GetMapping("/{dni}")
    public ResponseEntity<?> getByDni(@PathVariable String dni) {
        Usuario u = usuarioService.findByDni(dni);
        u.setPasswordHash(null); // No devolver password
        return ResponseEntity.ok(u);
    }

    @GetMapping()
    public ResponseEntity<?> getAllUsers(){
        // Lista todos los usuarios
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }


}