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

    public List<Game> getLowPlaytimeGames(String steamId) {
        return userLibraryRepository.findByUser_SteamId(steamId).stream()
                .filter(lib -> lib.getTotalPlaytime() < 180)
                .map(lib -> lib.getGame())
                .toList();
    }

    public List<Game> getMostPlayedGames(String steamId) {
        return userLibraryRepository.findByUser_SteamId(steamId).stream()
                .sorted(Comparator.comparingInt(lib -> -lib.getTotalPlaytime()))
                .limit(20)
                .map(lib -> lib.getGame())
                .toList();
    }
}
