package com.lucasterra.gamebattle;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.domain.UserLibrary;
import com.lucasterra.gamebattle.integration.steam.response.GetOwnedGamesResponse;
import com.lucasterra.gamebattle.repositories.GameRepository;
import com.lucasterra.gamebattle.repositories.UserLibraryRepository;
import com.lucasterra.gamebattle.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class SteamSmokeTest implements CommandLineRunner {

    private final RestClient steamRestClient;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final UserLibraryRepository userLibraryRepository;

    @Value("${steam.api-key}")
    private String apiKey;

    @Value("${steam.steamid}")
    private String mySteamId;

    public SteamSmokeTest(RestClient steamRestClient, UserRepository userRepository, GameRepository gameRepository, UserLibraryRepository userLibraryRepository) {
        this.steamRestClient = steamRestClient;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.userLibraryRepository = userLibraryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("INICIANDO TESTE DA STEAM API...");

        try {
            // Endpoint: IPlayerService/GetOwnedGames
            var response = steamRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/IPlayerService/GetOwnedGames/v0001/")
                            .queryParam("key", apiKey)
                            .queryParam("steamid", mySteamId)
                            .queryParam("format", "json")
                            .queryParam("include_appinfo", true)
                            .build())
                    .retrieve()
                    .body(GetOwnedGamesResponse.class);

            if (response == null || response.getGames().isEmpty()) {
                System.out.println("Nenhum jogo encontrado para o usuário Steam ID: " + mySteamId);
                return;
            }

            User user = userRepository.findBySteamId(mySteamId)
                    .orElseGet(() -> userRepository.save(User.builder()
                            .steamId(mySteamId)
                            .username("lt") // Placeholder (depois pegamos da API de perfil)
                            .avatarUrl("TODO")
                            .build()));

            System.out.println("Usuário processado: " + user.getUsername());

            int novosJogos = 0;
            for (var gameDto : response.getGames()) {
                Game game = gameRepository.findByAppId(gameDto.appId())
                        .orElseGet(() -> {
                            return gameRepository.save(Game.builder()
                                    .appId(gameDto.appId())
                                    .name(gameDto.name())
                                    .imageUrl("http://media.steampowered.com/steamcommunity/public/images/apps/" + gameDto.appId() + "/Header.jpg")
                                    .build());
                        });

                Optional<UserLibrary> libraryEntry = userLibraryRepository.findByUserAndGame(user, game);

                if(libraryEntry.isPresent()) {
                    UserLibrary lib = libraryEntry.get();
                    lib.setTotalPlaytime(gameDto.playtimeForever());
                    userLibraryRepository.save(lib);
                }
                else {
                    userLibraryRepository.save(UserLibrary.builder()
                            .user(user)
                            .game(game)
                            .totalPlaytime(gameDto.playtimeForever())
                            .build());
                    novosJogos++;
                }
            }

            System.out.println("FINALIZADO! " + response.getGames().size() + " jogos processados.");
            System.out.println("Jogos novos cadastrados nesta execucao: " + novosJogos);
        } catch (Exception e) {
            System.out.println("FALHA NO TESTE: " + e.getMessage());
            e.printStackTrace();
        }
    }
}