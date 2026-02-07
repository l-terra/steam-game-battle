package com.lucasterra.gamebattle.integration.steam.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Collections;
import java.util.List;

public record GetOwnedGamesResponse(ResponsePayload response) {

    public List<GameDto> getGames() {
        if(response == null || response.games() == null) {
            return Collections.emptyList();
        }
        return response.games();
    }

    public record ResponsePayload(
            @JsonProperty("game_count") Integer gameCount,
            List<GameDto> games
    ) {}

    public record GameDto(
            @JsonProperty("appid") Long appId,
            @JsonProperty("name") String name,
            @JsonProperty("playtime_forever") Integer playtimeForever
    ) {}
}