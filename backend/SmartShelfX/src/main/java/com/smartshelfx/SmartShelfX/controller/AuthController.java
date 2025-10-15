package com.smartshelfx.SmartShelfX.controller;

import com.smartshelfx.SmartShelfX.model.User;
import com.smartshelfx.SmartShelfX.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        Optional<User> existing = userRepo.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return "Email already registered!";
        }
        userRepo.save(user);
        return "Registration successful!";
    }

    @PostMapping("/login")
    public Object loginUser(@RequestBody User loginData) {
        Optional<User> user = userRepo.findByEmail(loginData.getEmail());
        if (user.isPresent()
                && user.get().getPassword().equals(loginData.getPassword())
                && user.get().getRole().equals(loginData.getRole())) {
            return user.get();
        }
        return "Invalid credentials or role!";
    }
}
