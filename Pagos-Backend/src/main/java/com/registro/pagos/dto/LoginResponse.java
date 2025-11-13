package com.registro.pagos.dto;

public class LoginResponse {
    private String token;
    private String dni;
    private String rol;
    private long expiresAtEpochSeconds;

    public LoginResponse() {}

    public LoginResponse(String token, String dni,String rol, long expiresAtEpochSeconds) {
        this.token = token;
        this.dni = dni;
        this.rol = rol;
        this.expiresAtEpochSeconds = expiresAtEpochSeconds;
    }

    public String getToken() {
        return token;
    }

    public String getDni() {
        return dni;
    }

    public long getExpiresAtEpochSeconds() {
        return expiresAtEpochSeconds;
    }
}