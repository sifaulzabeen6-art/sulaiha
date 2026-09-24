package com.sulaiha.sulaiha.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
        .csrf(csrf -> csrf
    .ignoringRequestMatchers("/api/orders","/api/admin/**","/logout")
)
            .authorizeHttpRequests(auth -> auth

                // Public pages
                .requestMatchers(
                    "/",
                    "/welcome",
                    "/login",
                    "/register",
                    "/forgot-password",
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()
                 // Admin APIs
                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Admin pages
                .requestMatchers("/admin/**").hasRole("ADMIN")


                // User pages
                .requestMatchers("/home", "/user/**").hasRole("USER")

                // Everything else requires login
                .anyRequest().permitAll()
            )

            .formLogin(form -> form
                .loginPage("/login")

                // IMPORTANT:
                // Login HTML uses "email" as the username field.
                .usernameParameter("email")
                .passwordParameter("password")

                .successHandler((request, response, authentication) -> {

                    boolean isAdmin = authentication.getAuthorities()
                            .stream()
                            .anyMatch(authority ->
                                    authority.getAuthority()
                                            .equals("ROLE_ADMIN"));

                    if (isAdmin) {
                        response.sendRedirect("/admin/dashboard");
                    } else {
                        response.sendRedirect("/home");
                    }
                })

                .permitAll()
            )

            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .permitAll()
            );

        return http.build();
    }
}