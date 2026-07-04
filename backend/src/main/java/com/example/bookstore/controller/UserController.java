package com.example.bookstore.controller;

import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.dto.UserStatusRequest;
import com.example.bookstore.dto.UserResponse;
import com.example.bookstore.entity.User;
import com.example.bookstore.service.UserService;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    // Controller 接收注册请求，业务校验和保存交给 UserService。
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        // 作业4接口：注册用户，并返回不含密码的用户信息。
        User savedUser = userService.register(request);
        return ResponseEntity
                .created(URI.create("/api/v1/users/" + savedUser.getId()))
                .body(UserResponse.from(savedUser));
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        // 作业要求：使用数据库中的用户名和密码完成普通用户登录。
        return UserResponse.from(userService.login(request));
    }

    @GetMapping("/admin")
    public List<UserResponse> getUsers(@RequestParam Long adminId) {
        userService.ensureAdmin(adminId);
        return userService.findAllUsers().stream()
                .map(UserResponse::from)
                .toList();
    }

    @PatchMapping("/admin/{userId}/status")
    public UserResponse updateUserStatus(
            @RequestParam Long adminId,
            @PathVariable Long userId,
            @RequestBody UserStatusRequest request) {
        userService.ensureAdmin(adminId);
        return UserResponse.from(userService.updateEnabled(userId, request.getEnabled()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException error) {
        // 用户名为空、密码为空、用户名重复等问题统一返回 400。
        return ResponseEntity.badRequest().body(Map.of("message", error.getMessage()));
    }
}
