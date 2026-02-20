package com.lucasterra.gamebattle.service;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.domain.UserLibrary;
import com.lucasterra.gamebattle.integration.steam.response.GetOwnedGamesResponse;
import com.lucasterra.gamebattle.repositories.GameRepository;
import com.lucasterra.gamebattle.repositories.UserLibraryRepository;
import com.lucasterra.gamebattle.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {

    private final UserLibraryRepository userLibraryRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final RestClient steamRestClient;

    @Value("${steam.api-key}")
    private String apiKey;

    // Lista de palavras que indicam que o "jogo" não é jogável ou relevante
    private static final List<String> INVALID_KEYWORDS = List.of(
            "beta",
            "test",
            "demo",
            "public test",
            "test server",
            "trial",
            "server",
            "retired",
            "soundtrack",
            "dlc",
            "dedicated server",
            "playtest",
            "alpha",
            "experimental",
            "testing grounds"
    );

    @Transactional
    public void syncSteamLibrary(String steamId) {
        System.out.println("Sincronizando biblioteca do Steam para o usuário: " + steamId);

        var response = steamRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/IPlayerService/GetOwnedGames/v0001/")
                        .queryParam("key", apiKey)
                        .queryParam("steamid", steamId)
                        .queryParam("format", "json")
                        .queryParam("include_appinfo", true)
                        .build())
                .retrieve()
                .body(GetOwnedGamesResponse.class);

        if (response == null || response.getGames().isEmpty()) {
            System.out.println("Nenhum jogo encontrado para o usuário Steam ID: " + steamId + " (Perfil Privado?)");
            return;
        }

        User user = userRepository.findBySteamId(steamId)
                .orElseGet(() -> userRepository.save(User.builder()
                        .steamId(steamId)
                        .username("Jogador_" + steamId.substring(steamId.length() - 4)) // Nome genérico temporário
                        .avatarUrl("")
                        .build()));

        for (var gameDto : response.getGames()) {
            String imageUrl = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/" + gameDto.appId() + "/header.jpg";

            Game game = gameRepository.findByAppId(gameDto.appId())
                    .map(existingGame -> {
                        existingGame.setImageUrl(imageUrl);
                        return gameRepository.save(existingGame);
                    })
                    .orElseGet(() -> gameRepository.save(Game.builder()
                            .appId(gameDto.appId())
                            .name(gameDto.name())
                            .imageUrl(imageUrl)
                            .build()));

            Optional<UserLibrary> libraryEntry = userLibraryRepository.findByUserAndGame(user, game);

            if (libraryEntry.isPresent()) {
                UserLibrary lib = libraryEntry.get();
                lib.setTotalPlaytime(gameDto.playtimeForever());
                userLibraryRepository.save(lib);
            } else {
                userLibraryRepository.save(UserLibrary.builder()
                        .user(user)
                        .game(game)
                        .totalPlaytime(gameDto.playtimeForever())
                        .build());
            }
        }
        System.out.println("Sincronização concluída com sucesso!");
    }

    public List<Game> getLowPlaytimeGames(String steamId) {
        return userLibraryRepository.findByUser_SteamId(steamId).stream()
                .filter(lib -> lib.getTotalPlaytime() < 180)
                .filter(lib -> isValidGame(lib.getGame().getName()))
                .map(lib -> lib.getGame())
                .toList();
    }

    public List<Game> getMostPlayedGames(String steamId) {
        return userLibraryRepository.findByUser_SteamId(steamId).stream()
                .filter(lib -> isValidGame(lib.getGame().getName()))
                .sorted(Comparator.comparingInt(lib -> -lib.getTotalPlaytime()))
                .limit(20)
                .map(lib -> lib.getGame())
                .toList();
    }

    private Boolean isValidGame(String gameName) {
        if(gameName == null) {
            return false;
        }

        String lowerCaseName = gameName.toLowerCase();
        return INVALID_KEYWORDS.stream().noneMatch(lowerCaseName::contains);
    }
}
