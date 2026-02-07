package com.lucasterra.gamebattle.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class SteamConfig {

    @Value("${steam.api-url}")
    private String steamApiUrl;

    @Value("${steam.api-key}")
    private String steamApiKey;

    @Bean
    public RestClient steamRestClient() {
        return RestClient.builder()
                .baseUrl(steamApiUrl)
                .defaultStatusHandler(
                        status -> status.is4xxClientError(),
                        (request, response) -> {
                            System.out.println("Erro na Steam API: " + response.getStatusCode());
                        }
                )
                .build();
    }

    public String getApiKey() {
        return steamApiKey;
    }
}