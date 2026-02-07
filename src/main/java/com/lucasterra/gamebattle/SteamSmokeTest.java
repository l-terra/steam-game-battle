package com.lucasterra.gamebattle;

import com.lucasterra.gamebattle.integration.steam.response.GetOwnedGamesResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SteamSmokeTest implements CommandLineRunner {

    private final RestClient steamRestClient;

    @Value("${steam.api-key}")
    private String apiKey;

    // Coloque seu ID aqui ou injete via @Value para testar
    @Value("${steam.steamid}")
    private String mySteamId;

    public SteamSmokeTest(RestClient steamRestClient) {
        this.steamRestClient = steamRestClient;
    }

    @Override
    public void run(String... args) {
        System.out.println("INICIANDO TESTE DA STEAM API...");

        try {
            // Endpoint: IPlayerService/GetOwnedGames
            var result = steamRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/IPlayerService/GetOwnedGames/v0001/")
                            .queryParam("key", apiKey)
                            .queryParam("steamid", mySteamId)
                            .queryParam("format", "json")
                            .queryParam("include_appinfo", true)
                            .build())
                    .retrieve()
                    .body(GetOwnedGamesResponse.class);

            if (result != null && result.response() != null) {
                System.out.println("✅ SUCESSO! Jogos encontrados: " + result.response().gameCount());
                System.out.println("🎮 Exemplo de jogo: " + result.response().games().get(0).name());
                var resultado = result.getGames();
                for (GetOwnedGamesResponse.GameDto game : resultado) {
                    System.out.println(game.name() + ": " + (game.playtimeForever()/60) + " hours");
                }
            } else {
                System.out.println("⚠️ Resposta vazia da Steam.");
            }
        } catch (Exception e) {
            System.out.println("❌ FALHA NO TESTE: " + e.getMessage());
            e.printStackTrace();
        }
    }
}