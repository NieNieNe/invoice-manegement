package com.invoice.demo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120, message = "Full name cannot exceed 120 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email is invalid")
        @Size(max = 180, message = "Email cannot exceed 180 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 72, message = "Password must be between 6 and 72 characters")
        String password
) {
}
