package com.example.bookstore.dto;

import com.example.bookstore.entity.User;

public class UserResponse {

    // 返回给前端/Postman 的用户信息，不包含 password，避免把密码直接暴露出去。
    private Long id;
    private String username;
    private String email;
    private String nickname;
    private String role;
    private Boolean enabled;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String email, String nickname, String role, Boolean enabled) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
        this.enabled = enabled;
    }

    public static UserResponse from(User user) {
        // 把数据库实体转换成接口响应对象。
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNickname(),
                user.getRole(),
                user.getEnabled());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
