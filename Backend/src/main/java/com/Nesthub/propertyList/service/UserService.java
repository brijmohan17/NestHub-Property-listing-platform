package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.dto.AuthResponse;
import com.Nesthub.propertyList.dto.LoginRequest;
import com.Nesthub.propertyList.dto.MessageResponse;
import com.Nesthub.propertyList.dto.SignupRequest;
import com.Nesthub.propertyList.entity.AuthProvider;
import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user = userRepository.save(user);

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .message("Signup Successful")
                .token(token)
                .user(toSummary(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        AuthProvider provider = user.getAuthProvider() != null ? user.getAuthProvider() : AuthProvider.LOCAL;
        if (provider != AuthProvider.LOCAL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This account uses " + provider.name() + " sign-in. Please use OAuth.");
        }
        if (!StringUtils.hasText(user.getPassword())
                || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .message("Login successful")
                .token(token)
                .user(toSummary(user))
                .build();
    }

    public MessageResponse logout() {
        String token = jwtService.generateShortLivedToken(Map.of("message", "loggedOut"), 10);
        return new MessageResponse(
                "Logout simulated. Temporary token issued that will expire in 10 seconds.");
    }

    public String getLogoutToken() {
        return jwtService.generateShortLivedToken(Map.of("message", "loggedOut"), 10);
    }

    private AuthResponse.UserSummary toSummary(User user) {
        return AuthResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
