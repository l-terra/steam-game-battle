package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.service.GameService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@Validated
public class GameController {

    private final GameService gameService;

    @GetMapping("/least")
    public List<Game> getLeast(@RequestParam @NotBlank @Pattern(regexp = "^\\d{1,20}$") String steamId) {
        return gameService.getLowPlaytimeGames(steamId);
    }

    @GetMapping("/most")
    public List<Game> getMost(@RequestParam @NotBlank @Pattern(regexp = "^\\d{1,20}$") String steamId) {
        return gameService.getMostPlayedGames(steamId);
    }

    @PostMapping("/sync")
    public void syncLibrary(@RequestParam @NotBlank @Pattern(regexp = "^\\d{1,20}$") String steamId) {
        gameService.syncSteamLibrary(steamId);
    }
}
