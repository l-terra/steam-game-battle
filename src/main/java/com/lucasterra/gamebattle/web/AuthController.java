package com.lucasterra.gamebattle.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/steam")
    public RedirectView loginWithSteam() {
        String steamOpenIdUrl = "https://steamcommunity.com/openid/login" +
                "?openid.ns=http://specs.openid.net/auth/2.0" +
                "&openid.mode=checkid_setup" +
                "&openid.return_to=http://localhost:8080/api/auth/steam/callback" +
                "&openid.realm=http://localhost:8080" +
                "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
                "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

        return new RedirectView(steamOpenIdUrl);
    }

    @GetMapping("/steam/callback")
    public RedirectView steamCallback(HttpServletRequest request) {
        String claimedId = request.getParameter("openid.claimed_id");

        if (claimedId != null && claimedId.contains("/id/")) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);
            return new RedirectView("http://localhost:5173/?steamId=" + steamId);
        }

        return new RedirectView("http://localhost:5173/?error=true");
    }
}
