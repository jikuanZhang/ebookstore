package com.example.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BookstoreApplication {

    // 后端启动入口：启动后 Spring 会扫描 controller/service/repository/entity 等组件。
    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);
    }
}
