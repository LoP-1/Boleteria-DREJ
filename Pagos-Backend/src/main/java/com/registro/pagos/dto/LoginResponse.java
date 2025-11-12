package com.registro.pagos.dto;

public class LoginResponse {
    private String token;
    private String dni;
    private long expiresAtEpochSeconds;

    public LoginResponse() {}

    public LoginResponse(String token, String dni, long expiresAtEpochSeconds) {
        this.token = token;
        this.dni = dni;
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