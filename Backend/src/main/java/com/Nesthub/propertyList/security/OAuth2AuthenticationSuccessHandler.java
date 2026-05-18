package com.Nesthub.propertyList.security;

import com.Nesthub.propertyList.config.AppProperties;
import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.repository.UserRepository;
import com.Nesthub.propertyList.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String userId = String.valueOf(oauth2User.getAttribute("id"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("OAuth user not persisted"));

        String token = jwtService.generateToken(user);
        String targetUrl = UriComponentsBuilder
                .fromUriString(appProperties.getFrontendUrl() + "/oauth/callback")
                .queryParam("token", token)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
