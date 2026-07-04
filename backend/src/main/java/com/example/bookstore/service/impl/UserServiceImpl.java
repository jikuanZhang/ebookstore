package com.example.bookstore.service.impl;

import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.entity.User;
import com.example.bookstore.repository.UserRepository;
import com.example.bookstore.service.UserService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl implements UserService {

    // UserService 负责注册相关业务逻辑，真正保存数据时交给 UserRepository。
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        // 先清理输入，再做必要校验，最后创建 User 并写入数据库。
        String username = clean(request.getUsername());
        String password = clean(request.getPassword());
        String email = clean(request.getEmail());
        String nickname = clean(request.getNickname());

        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (!StringUtils.hasText(password)) {
            throw new IllegalArgumentException("Password is required.");
        }

        if (StringUtils.hasText(request.getConfirmPassword()) && !password.equals(clean(request.getConfirmPassword()))) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        if (StringUtils.hasText(email) && !email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new IllegalArgumentException("Email format is invalid.");
        }

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists.");
        }

        User user = new User(username, password, email, nickname);
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {
        String username = clean(request.getUsername());
        String password = clean(request.getPassword());

        if (!StringUtils.hasText(username)) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (!StringUtils.hasText(password)) {
            throw new IllegalArgumentException("Password is required.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Username or password is incorrect."));

        if (Boolean.FALSE.equals(user.getEnabled())) {
            throw new IllegalArgumentException("您的账号已经被禁用");
        }

        if (!password.equals(user.getPassword())) {
            throw new IllegalArgumentException("Username or password is incorrect.");
        }

        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User updateEnabled(Long userId, Boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        if ("ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("Administrator account cannot be disabled.");
        }
        user.setEnabled(Boolean.TRUE.equals(enabled));
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User ensureAdmin(Long adminId) {
        User user = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + adminId));
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("Administrator permission is required.");
        }
        return user;
    }

    private String clean(String value) {
        // 统一去掉表单输入前后的空格，避免 "alice " 和 "alice" 被当成两个用户。
        return value == null ? null : value.trim();
    }
}
