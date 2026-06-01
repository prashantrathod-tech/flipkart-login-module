package com.flipkart.service;

import com.flipkart.model.User;
import com.flipkart.repository.UserRepository;
import com.flipkart.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * User Service for handling user-related business logic
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user
     * @param user the user to register
     * @return the registered user
     * @throws IllegalArgumentException if email already exists
     */
    public User registerUser(User user) throws IllegalArgumentException {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Hash the password
        String hashedPassword = PasswordUtil.hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(true);

        return userRepository.save(user);
    }

    /**
     * Authenticate user with email and password
     * @param email user email
     * @param password user password
     * @return User if authentication is successful, null otherwise
     */
    public User authenticate(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getIsActive() && PasswordUtil.verifyPassword(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    /**
     * Get user by email
     * @param email user email
     * @return User if found, null otherwise
     */
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    /**
     * Get user by ID
     * @param id user ID
     * @return User if found, null otherwise
     */
    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    /**
     * Update user
     * @param user the user to update
     * @return the updated user
     */
    public User updateUser(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    /**
     * Delete user by ID
     * @param id user ID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
