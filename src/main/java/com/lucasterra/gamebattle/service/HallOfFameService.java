package com.lucasterra.gamebattle.service;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.HallOfFame;
import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.repositories.GameRepository;
import com.lucasterra.gamebattle.repositories.HallOfFameRepository;
import com.lucasterra.gamebattle.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.security.autoconfigure.SecurityProperties;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HallOfFameService {

    private final HallOfFameRepository hallOfFameRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public void saveChampion(String steamId, Long gameId) {
        User user = userRepository.findBySteamId(steamId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Jogo não encontrado"));

        HallOfFame hallOfFameEntry = HallOfFame.builder()
                .user(user)
                .game(game)
                .time(java.time.LocalDateTime.now())
                .build();

        hallOfFameRepository.save(hallOfFameEntry);
    }

    public List<Game> getTopChampionGames() {
        return hallOfFameRepository.findTopChampionGames().stream().limit(10).toList();
    }
}
