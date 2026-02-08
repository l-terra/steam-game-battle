package com.lucasterra.gamebattle.service;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.repositories.UserLibraryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final UserLibraryRepository userLibraryRepository;

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
