package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.service.HallOfFameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hall-of-fame")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HallOfFameController {

    private final HallOfFameService hallOfFameService;

    @PostMapping
    public void saveChampion(@RequestParam String steamId, @RequestParam Long gameId) {
        hallOfFameService.saveChampion(steamId, gameId);
    }

    @GetMapping("/top-champions")
    public List<Game> getTopChampionGames() {
        return hallOfFameService.getTopChampionGames();
    }
}
