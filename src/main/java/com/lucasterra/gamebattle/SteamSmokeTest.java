package com.lucasterra.gamebattle;

import com.lucasterra.gamebattle.domain.Game;
import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.domain.UserLibrary;
import com.lucasterra.gamebattle.integration.steam.response.GetOwnedGamesResponse;
import com.lucasterra.gamebattle.repositories.GameRepository;
import com.lucasterra.gamebattle.repositories.UserLibraryRepository;
import com.lucasterra.gamebattle.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Component
public class SteamSmokeTest implements CommandLineRunner {

    private final RestClient steamRestClient;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final UserLibraryRepository userLibraryRepository;

    @Value("${steam.api-key}")
    private String apiKey;

    @Value("${steam.steamid}")
    private String mySteamId;

    public SteamSmokeTest(RestClient steamRestClient, UserRepository userRepository, GameRepository gameRepository, UserLibraryRepository userLibraryRepository) {
        this.steamRestClient = steamRestClient;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.userLibraryRepository = userLibraryRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("Aplicação iniciada!");
    }
}