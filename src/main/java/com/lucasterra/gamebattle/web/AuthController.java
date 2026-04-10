package com.lucasterra.gamebattle.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    private static final java.util.regex.Pattern STEAM_ID_PATTERN =
            java.util.regex.Pattern.compile("^\\d{1,20}$");

    @GetMapping("/steam")
    public RedirectView loginWithSteam() {
        String steamOpenIdUrl = "https://steamcommunity.com/openid/login" +
                "?openid.ns=http://specs.openid.net/auth/2.0" +
                "&openid.mode=checkid_setup" +
                "&openid.return_to=" + backendUrl + "/api/auth/steam/callback" +
                "&openid.realm=" + backendUrl +
                "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
                "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

        return new RedirectView(steamOpenIdUrl);
    }

    @GetMapping("/steam/callback")
    public RedirectView steamCallback(HttpServletRequest request) {
        String claimedId = request.getParameter("openid.claimed_id");

        if (claimedId != null && claimedId.contains("/id/")) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);

            if (!STEAM_ID_PATTERN.matcher(steamId).matches()) {
                return new RedirectView(frontendUrl + "/?error=true");
            }

            return new RedirectView(frontendUrl + "/?steamId=" + steamId);
        }

        return new RedirectView(frontendUrl + "/?error=true");
    }
}
