package com.lucasterra.gamebattle.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Slf4j
@Configuration
public class SteamConfig {

    @Value("${steam.api-url}")
    private String steamApiUrl;

    @Bean
    public RestClient steamRestClient() {
        return RestClient.builder()
                .baseUrl(steamApiUrl)
                .defaultStatusHandler(
                        status -> status.is4xxClientError(),
                        (request, response) -> {
                            log.error("Erro na Steam API: {}", response.getStatusCode());
                        }
                )
                .build();
    }
}