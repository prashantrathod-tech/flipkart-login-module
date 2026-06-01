package com.flipkart.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility class for password hashing and verification
 */
public class PasswordUtil {

    /**
     * Hash a password using SHA-256
     * @param password the plain text password
     * @return the hashed password
     */
    public static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    /**
     * Verify a password against a hash
     * @param password the plain text password
     * @param hash the hashed password
     * @return true if password matches hash, false otherwise
     */
    public static boolean verifyPassword(String password, String hash) {
        String hashOfInput = hashPassword(password);
        return hashOfInput.equals(hash);
    }
}
