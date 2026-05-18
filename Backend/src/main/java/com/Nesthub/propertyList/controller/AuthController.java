package com.Nesthub.propertyList.controller;

import com.Nesthub.propertyList.config.OAuth2ClientConfig.OAuth2ProviderRegistry;
import com.Nesthub.propertyList.config.SecurityContextHelper;
import com.Nesthub.propertyList.dto.AuthResponse;
import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.repository.UserRepository;
import com.Nesthub.propertyList.security.JwtUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final OAuth2ProviderRegistry oauth2ProviderRegistry;

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserSummary> me() {
        JwtUserPrincipal principal = SecurityContextHelper.currentUser();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return ResponseEntity.ok(AuthResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build());
    }

    @GetMapping("/oauth/providers")
    public ResponseEntity<Map<String, Object>> oauthProviders() {
        return ResponseEntity.ok(Map.of(
                "enabled", oauth2ProviderRegistry.isEnabled(),
                "providers", oauth2ProviderRegistry.providers()));
    }
}
