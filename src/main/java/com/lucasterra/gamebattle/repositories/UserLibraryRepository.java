package com.lucasterra.gamebattle.repositories;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.domain.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserLibraryRepository extends JpaRepository<UserLibrary, Long> {

    Optional<UserLibrary> findByUserAndGame(User user, Game game);

    List<UserLibrary> findByUser_SteamId(String steamId);
}
