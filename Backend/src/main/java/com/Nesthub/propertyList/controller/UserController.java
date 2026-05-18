package com.Nesthub.propertyList.controller;

import com.Nesthub.propertyList.dto.AuthResponse;
import com.Nesthub.propertyList.dto.LoginRequest;
import com.Nesthub.propertyList.dto.SignupRequest;
import com.Nesthub.propertyList.service.JwtService;
import com.Nesthub.propertyList.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = userService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        String token = jwtService.generateShortLivedToken(Map.of("message", "loggedOut"), 10);
        Map<String, String> body = new LinkedHashMap<>();
        body.put("message",
                "Logout simulated. Temporary token issued that will expire in 10 seconds.");
        body.put("token", token);
        return ResponseEntity.ok(body);
    }
}
