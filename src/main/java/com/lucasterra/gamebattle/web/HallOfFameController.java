package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.service.HallOfFameService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hall-of-fame")
@RequiredArgsConstructor
@Validated
public class HallOfFameController {

    private final HallOfFameService hallOfFameService;

    @PostMapping
    public void saveChampion(
            @RequestParam @NotBlank @Pattern(regexp = "^\\d{1,20}$") String steamId,
            @RequestParam @NotNull @Positive Long gameId) {
        hallOfFameService.saveChampion(steamId, gameId);
    }

    @GetMapping("/top-champions")
    public List<Game> getTopChampionGames() {
        return hallOfFameService.getTopChampionGames();
    }
}
