package com.invoice.demo.security;

import com.invoice.demo.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final Duration tokenExpiration;

    public JwtService(
            @Value("${app.jwt.secret:invoice-management-super-secret-key-please-change-this-32bytes-min}") String secret,
            @Value("${app.jwt.expiration-minutes:120}") long expirationMinutes
    ) {
        this.signingKey = buildSigningKey(secret);
        this.tokenExpiration = Duration.ofMinutes(expirationMinutes);
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("fullName", user.getFullName())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(tokenExpiration)))
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {
        return parseAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, User user) {
        String email = extractEmail(token);
        return email != null && email.equalsIgnoreCase(user.getEmail()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = parseAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    private Claims parseAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey buildSigningKey(String rawSecret) {
        String trimmed = rawSecret.trim();
        try {
            byte[] decoded = Decoders.BASE64.decode(trimmed);
            return Keys.hmacShaKeyFor(decoded);
        } catch (RuntimeException ignored) {
            byte[] utf8Bytes = trimmed.getBytes(StandardCharsets.UTF_8);
            return Keys.hmacShaKeyFor(utf8Bytes);
        }
    }
}
