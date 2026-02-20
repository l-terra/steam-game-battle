package com.lucasterra.gamebattle.integration.steam.response;

import java.util.List;

public record GetPlayerSummariesResponse() {

    public record ResponsePayload(List<PlayerDto> players) {}

    public record PlayerDto(
            String personaname,
            String avatarfull
    ) {}
}
