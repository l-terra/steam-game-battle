package com.lucasterra.gamebattle.web;

import com.lucasterra.gamebattle.domain.User;
import com.lucasterra.gamebattle.repositories.UserRepository;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getUser(@RequestParam @NotBlank @Pattern(regexp = "^\\d{1,20}$") String steamId) {
        return userRepository.findBySteamId(steamId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
