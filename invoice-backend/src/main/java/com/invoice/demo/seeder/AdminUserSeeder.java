package com.invoice.demo.seeder;

import com.invoice.demo.user.entity.User;
import com.invoice.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(3)
public class AdminUserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "admin@email.com";
        String encodedPassword = passwordEncoder.encode("admin123");

        User adminUser = userRepository.findByEmailIgnoreCase(email)
                .map(existing -> {
                    existing.setFullName("Admin");
                    existing.setPassword(encodedPassword);
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .fullName("Admin")
                        .email(email)
                        .password(encodedPassword)
                        .build());

        userRepository.save(adminUser);
    }
}
