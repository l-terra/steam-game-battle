package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameController {

    private final GameService gameService;

    // URL: GET http://localhost:8080/api/games/least?steamId=...
    @GetMapping("/least")
    public List<Game> getLeast(@RequestParam String steamId) {
        return gameService.getLowPlaytimeGames(steamId);
    }

    // URL: GET http://localhost:8080/api/games/most?steamId=...
    @GetMapping("/most")
    public List<Game> getMost(@RequestParam String steamId) {
        return gameService.getMostPlayedGames(steamId);
    }

    // Endpoint para disparar a sincronização
    // URL: POST http://localhost:8080/api/games/sync?steamId=...
    @PostMapping("/sync")
    public void syncLibrary(@RequestParam String steamId) {
        gameService.syncSteamLibrary(steamId);
    }
}
