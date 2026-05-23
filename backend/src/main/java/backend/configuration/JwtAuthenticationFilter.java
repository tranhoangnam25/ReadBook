package backend.configuration;

import backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest  request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
    throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            String token = authHeader.substring(7);
            logger.info("Processing token for request: " + request.getMethod() + " " + request.getRequestURI());
            try {
                var signedJWT = jwtService.verifyToken(token);
                String email = signedJWT.getJWTClaimsSet().getSubject();
                logger.info("Token verified successfully for email: " + email);

                String scope = signedJWT.getJWTClaimsSet().getStringClaim("scope");
                logger.info("Token scope: " + scope);

                List<SimpleGrantedAuthority> authorities = Collections.emptyList();
                if (scope != null && !scope.isEmpty()) {
                    authorities = Arrays.stream(scope.split(" "))
                                    .filter(s -> !s.isEmpty())
                                    .map(SimpleGrantedAuthority::new)
                                    .toList();
                }

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authentication set in SecurityContext for: " + email);
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                logger.error("JWT FAILED: " + e.getMessage());
                // e.printStackTrace(); // Optional: remove if too noisy
            }
        } else {
            logger.info("No Bearer token found for: " + request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }
}



