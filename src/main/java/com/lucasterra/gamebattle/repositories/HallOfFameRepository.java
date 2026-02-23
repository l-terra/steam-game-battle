package com.lucasterra.gamebattle.repositories;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.HallOfFame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HallOfFameRepository extends JpaRepository<HallOfFame, Long> {

    @Query("SELECT h.game FROM HallOfFame h GROUP BY h.game ORDER BY COUNT(h) DESC")
    List<Game> findTopChampionGames();
}
