package com.example.bookstore.service;

import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.entity.User;
import java.util.List;

public interface UserService {

    User register(RegisterRequest request);

    User login(LoginRequest request);

    List<User> findAllUsers();

    User updateEnabled(Long userId, Boolean enabled);

    User ensureAdmin(Long adminId);
}
