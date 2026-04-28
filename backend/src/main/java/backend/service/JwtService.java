package backend.service;

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

import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String signerKey;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("phn.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plusSeconds(expiration).toEpochMilli()
                ))
                .claim("CustomClaim", "custom")
                .build();

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
        System.out.println("verified = " + verified);
        System.out.println("exp = " + expirationTime);
        System.out.println("now = " + new Date());

        if (!(verified && expirationTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return signedJWT;
    }
}
