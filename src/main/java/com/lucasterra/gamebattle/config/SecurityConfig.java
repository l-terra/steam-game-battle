package com.lucasterra.gamebattle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF para facilitar testes via Postman/Browser
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Libera acesso total a qualquer endpoint sem senha
                );

        return http.build();
    }
}