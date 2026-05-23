package backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001", "http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/books/**",
                                "/api/authors/**",
                                "/api/categories/**",
                                "/api/reviews/**",
                                "/api/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/books/bestSellers",
                                "/api/books/bestRatings",
                                "/api/books/recommends",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/payment-success/**",
                                "/payment-cancel/**",
                                "/api/payments/payos/webhook",
                                "/api/reader-settings/**",
                                "/api/orders/check",
                                "/api/users/me/reading/progress",
                                "/api/orders/export",
                                "/api/reviews/{id}/reply",
                                "/api/sales/**",                 // 🌟 Gom gọn mở khóa toàn bộ các đường dẫn sales 
                                "/api/orders/admin/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                );
                
                // 💡 NẾU BẠN MUỐN TEST THOẢI MÁI KHÔNG CẦN TOKEN:
                // Hãy tạm thời khóa (comment) dòng addFilterBefore dưới đây bằng dấu gạch chéo //
                // Sau khi comment, request sẽ chạy thẳng vào hệ thống mà không đi qua bộ lọc JwtAuthenticationFilter nữa.
                
                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                http.exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.getWriter().write("Unauthorized : token expired or missing");
                            response.setCharacterEncoding("UTF-8");
                            response.setContentType("text/plain; charset=UTF-8");
                        }));

        return http.build();
    }
}