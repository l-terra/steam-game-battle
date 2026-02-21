package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public User getUser(@RequestParam String steamId) {
        return userRepository.findBySteamId(steamId).orElse(null);
    }
}
