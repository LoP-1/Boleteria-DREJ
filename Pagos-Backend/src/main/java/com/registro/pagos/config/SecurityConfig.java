package com.registro.pagos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    // Configura CORS para permitir solicitudes desde el frontend
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Aplica a todas las rutas
                .allowedOrigins("http://localhost:4200,http://192.168.10.69:3001")  // Orígenes permitidos (desarrollo y producción)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Métodos HTTP permitidos
                .allowedHeaders("*")  // Todos los headers permitidos
                .allowCredentials(true)  // Permite credenciales (cookies, auth headers)
                .maxAge(3600);  // Cachea la preflight request por 1 hora
    }
}