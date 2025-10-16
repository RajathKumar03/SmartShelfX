package com.smartshelfx.SmartShelfX.controller;

import com.smartshelfx.SmartShelfX.model.User;
import com.smartshelfx.SmartShelfX.repository.UserRepository;
import com.smartshelfx.SmartShelfX.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService; 

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        Optional<User> existing = userRepo.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return "Email already registered!";
        }

        // Save user
        userRepo.save(user);

        // ✅ Send registration success email
        String subject = "Welcome to SmartShelfX!";
        String body = "Hello " + user.getFullName() + ",\n\n" +
                "Your registration was successful.\n\n" +
                "Company: " + user.getCompanyName() + "\n" +
                "Role: " + user.getRole() + "\n\n" +
                "Thank you for joining SmartShelfX!\n\nBest regards,\nSmartShelfX Team";

        try {
            emailService.sendEmail(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.out.println("⚠️ Error sending email: " + e.getMessage());
            return "Registration successful, but email failed to send.";
        }

        return "Registration successful! A confirmation email has been sent.";
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        Optional<User> optionalUser = userRepo.findByEmail(loginData.getEmail());

        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(401).body("Email not registered!");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(401).body("Incorrect password!");
        }

        if (!user.getRole().equals(loginData.getRole())) {
            return ResponseEntity.status(403).body("Role mismatch!");
        }

        return ResponseEntity.ok(user);
    }

}
