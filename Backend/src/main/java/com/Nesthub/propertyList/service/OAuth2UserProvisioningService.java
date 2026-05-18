package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.entity.AuthProvider;
import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OAuth2UserProvisioningService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User resolveUser(String registrationId, OAuth2User oauth2User) {
        AuthProvider provider = toProvider(registrationId);
        String providerId = oauth2User.getName();
        String email = extractEmail(registrationId, oauth2User);
        String username = extractUsername(registrationId, oauth2User, email);
        String imageUrl = extractImageUrl(registrationId, oauth2User);

        if (!StringUtils.hasText(email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required from OAuth provider. Grant email scope or use a public email on GitHub.");
        }

        Optional<User> byProvider = userRepository.findByAuthProviderAndProviderId(provider, providerId);
        if (byProvider.isPresent()) {
            return updateProfile(byProvider.get(), username, imageUrl);
        }

        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isPresent()) {
            User existing = byEmail.get();
            if (existing.getAuthProvider() != AuthProvider.LOCAL
                    && existing.getAuthProvider() != provider) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Email already linked to another sign-in method");
            }
            existing.setAuthProvider(provider);
            existing.setProviderId(providerId);
            existing.setImageUrl(imageUrl);
            if (!StringUtils.hasText(existing.getUsername())) {
                existing.setUsername(username);
            }
            return userRepository.save(existing);
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(uniqueUsername(username));
        user.setAuthProvider(provider);
        user.setProviderId(providerId);
        user.setImageUrl(imageUrl);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return userRepository.save(user);
    }

    private User updateProfile(User user, String username, String imageUrl) {
        if (StringUtils.hasText(imageUrl)) {
            user.setImageUrl(imageUrl);
        }
        if (!StringUtils.hasText(user.getUsername()) && StringUtils.hasText(username)) {
            user.setUsername(username);
        }
        return userRepository.save(user);
    }

    private String uniqueUsername(String base) {
        String candidate = base.replaceAll("[^a-zA-Z0-9_]", "");
        if (candidate.length() < 3) {
            candidate = "user" + (System.currentTimeMillis() % 100000);
        }
        String username = candidate;
        int suffix = 1;
        while (userRepository.existsByUsername(username)) {
            username = candidate + suffix++;
        }
        return username;
    }

    private AuthProvider toProvider(String registrationId) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> AuthProvider.GOOGLE;
            case "github" -> AuthProvider.GITHUB;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported OAuth provider");
        };
    }

    private String extractEmail(String registrationId, OAuth2User user) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return user.getAttribute("email");
        }
        Object email = user.getAttribute("email");
        if (email != null && StringUtils.hasText(email.toString())) {
            return email.toString();
        }
        return null;
    }

    private String extractUsername(String registrationId, OAuth2User user, String email) {
        if ("github".equalsIgnoreCase(registrationId)) {
            String login = user.getAttribute("login");
            if (StringUtils.hasText(login)) {
                return login;
            }
        }
        String name = user.getAttribute("name");
        if (StringUtils.hasText(name)) {
            return name.replaceAll("\\s+", "").toLowerCase();
        }
        if (StringUtils.hasText(email)) {
            return email.substring(0, email.indexOf('@'));
        }
        return "user" + user.getName();
    }

    private String extractImageUrl(String registrationId, OAuth2User user) {
        if ("google".equalsIgnoreCase(registrationId)) {
            return user.getAttribute("picture");
        }
        return user.getAttribute("avatar_url");
    }
}
