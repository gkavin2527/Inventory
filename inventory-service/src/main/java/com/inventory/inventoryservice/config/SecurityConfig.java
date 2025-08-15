package com.inventory.inventoryservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // disable CSRF for local development
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // allow all requests
            )
            .cors(cors -> {}); // enable CORS

        return http.build();
    }
}
