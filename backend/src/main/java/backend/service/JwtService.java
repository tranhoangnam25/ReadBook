package backend.service;

import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import java.text.ParseException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.StringJoiner;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String signerKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (signerKey == null || signerKey.trim().isEmpty()) {
            System.err.println("JWT Secret is EMPTY!");
        } else {
            System.out.println("JWT Secret loaded. Length: " + signerKey.length());
        }
    }

    public String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration * 1000);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("phn.com")
                .issueTime(now)
                .expirationTime(expirationDate)
                .claim("scope", buildScope(user))
                .build();
        
        System.out.println("Generating token for: " + user.getEmail());
        System.out.println("Expiration: " + expirationDate);

        JWSObject jwsObject = new JWSObject(header, new Payload(claims.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Cannot create token", e);
        }
    }

    public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        boolean verified = signedJWT.verify(verifier);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        
        System.out.println("Verifying token. Verified: " + verified);
        System.out.println("Token Exp: " + expirationTime);
        System.out.println("Current Time: " + new Date());

        if (!(verified && expirationTime.after(new Date()))) {
            System.out.println("Token verification failed!");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if(!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions()
                            .forEach(permission -> stringJoiner.add(permission.getName()));
            });
        }

        return stringJoiner.toString();
    }
}
