package com.registro.pagos.models;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String dni;

    @Column(nullable = true)
    private String passwordHash;

    @Column(nullable = true)
    private String nombreCompleto;

    public Usuario() {}

    public Usuario(String dni, String passwordHash, String nombreCompleto) {
        this.dni = dni;
        this.passwordHash = passwordHash;
        this.nombreCompleto = nombreCompleto;
    }

    // getters y setters
    public Long getId() { return id; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }
}