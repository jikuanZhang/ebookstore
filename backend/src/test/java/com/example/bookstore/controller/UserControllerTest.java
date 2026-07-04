package com.example.bookstore.controller;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.hasKey;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.entity.User;
import com.example.bookstore.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void registerReturnsCreatedUserWithoutPassword() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("reader1");
        request.setPassword("123456");
        request.setConfirmPassword("123456");
        request.setEmail("reader1@example.com");

        User savedUser = new User("reader1", "123456", "reader1@example.com", "读者一号");
        savedUser.setId(10L);

        when(userService.register(any(RegisterRequest.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.username").value("reader1"))
                .andExpect(jsonPath("$", not(hasKey("password"))));
    }
}
