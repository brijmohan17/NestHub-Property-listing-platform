package com.Nesthub.propertyList.service;

import com.Nesthub.propertyList.entity.User;
import com.Nesthub.propertyList.security.JwtUserPrincipal;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final byte[] secretBytes;
    private final long expirationMillis;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-hours}") int expirationHours) {
        this.secretBytes = deriveSigningKey(secret);
        this.expirationMillis = expirationHours * 60L * 60L * 1000L;
    }

    /**
     * Derives a 256-bit HMAC key from the configured secret (required by HS256 libraries).
     * Users who still hold tokens from the legacy Express server should sign in again.
     */
    private static byte[] deriveSigningKey(String secret) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    public String generateToken(User user) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .claim("id", user.getId())
                    .claim("email", user.getEmail())
                    .claim("username", user.getUsername())
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plusMillis(expirationMillis)))
                    .build();

            SignedJWT signedJwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
            signedJwt.sign(new MACSigner(secretBytes));
            return signedJwt.serialize();
        } catch (JOSEException ex) {
            throw new IllegalStateException("Failed to generate token", ex);
        }
    }

    public String generateShortLivedToken(Map<String, Object> claimsMap, long seconds) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plusSeconds(seconds)));
            claimsMap.forEach(builder::claim);

            SignedJWT signedJwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), builder.build());
            signedJwt.sign(new MACSigner(secretBytes));
            return signedJwt.serialize();
        } catch (JOSEException ex) {
            throw new IllegalStateException("Failed to generate token", ex);
        }
    }

    public JwtUserPrincipal parsePrincipal(String token) {
        try {
            SignedJWT signedJwt = SignedJWT.parse(token);
            if (!signedJwt.verify(new MACVerifier(secretBytes))) {
                throw new IllegalArgumentException("Invalid token signature");
            }
            JWTClaimsSet claims = signedJwt.getJWTClaimsSet();
            return new JwtUserPrincipal(
                    readClaimAsString(claims, "id"),
                    readClaimAsString(claims, "email"),
                    readClaimAsString(claims, "username"));
        } catch (ParseException | JOSEException ex) {
            throw new IllegalArgumentException("Invalid or expired token", ex);
        }
    }

    public boolean isValid(String token) {
        try {
            parsePrincipal(token);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private String readClaimAsString(JWTClaimsSet claims, String name) throws ParseException {
        Object value = claims.getClaim(name);
        return value != null ? value.toString() : null;
    }
}
