package com.codingping.util;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class JwtUtils {
    // HS512 알고리즘에 적합한 SecretKey 생성
    public static SecretKey generateSecretKey() {
        return Keys.secretKeyFor(SignatureAlgorithm.HS512); // HS512 알고리즘에 맞는 키 생성
    }
}