package com.invoice.demo.auth.dto;

public record AuthResponse(
        String message,
        AuthUserResponse user,
        String accessToken
) {
}
