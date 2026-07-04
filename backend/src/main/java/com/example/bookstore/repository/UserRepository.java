package com.example.bookstore.repository;

import com.example.bookstore.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

// UserRepository 负责 users 表的数据访问，并补充用户名查询能力。
public interface UserRepository extends JpaRepository<User, Long> {

    // 根据用户名查用户，后续如果做登录可以复用。
    Optional<User> findByUsername(String username);

    // 注册前检查用户名是否已存在，避免违反唯一约束。
    boolean existsByUsername(String username);
}
