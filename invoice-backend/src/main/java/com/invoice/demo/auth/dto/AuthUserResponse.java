package com.invoice.demo.auth.dto;

public record AuthUserResponse(
        Long id,
        String fullName,
        String email
) {
}
