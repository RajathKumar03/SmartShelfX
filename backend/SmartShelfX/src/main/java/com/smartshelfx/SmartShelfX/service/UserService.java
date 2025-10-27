package com.smartshelfx.SmartShelfX.service;


import com.smartshelfx.SmartShelfX.model.User;
import com.smartshelfx.SmartShelfX.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) { this.repo = repo; }

    public User register(User user) {
        return repo.save(user);
    }

    public Optional<User> login(String email, String password, String role) {
        return repo.findByEmail(email)
                .filter(u -> u.getPassword().equals(password) && u.getRole().equals(role));
    }
}
