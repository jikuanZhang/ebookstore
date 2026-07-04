package com.example.bookstore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.dto.RegisterRequest;
import com.example.bookstore.entity.User;
import com.example.bookstore.repository.UserRepository;
import com.example.bookstore.service.impl.UserServiceImpl;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void registerCreatesEnabledCustomer() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername(" reader1 ");
        request.setPassword("123456");
        request.setConfirmPassword("123456");
        request.setEmail("reader1@example.com");
        request.setNickname("Reader One");

        when(userRepository.existsByUsername("reader1")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.register(request);

        assertThat(user.getUsername()).isEqualTo("reader1");
        assertThat(user.getRole()).isEqualTo("CUSTOMER");
        assertThat(user.getEnabled()).isTrue();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void loginRejectsDisabledUser() {
        LoginRequest request = new LoginRequest();
        request.setUsername("reader");
        request.setPassword("123456");
        User disabledUser = new User("reader", "123456", "reader@example.com", "读者");
        disabledUser.setEnabled(false);

        when(userRepository.findByUsername("reader")).thenReturn(Optional.of(disabledUser));

        assertThatThrownBy(() -> userService.login(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("禁用");
    }
}
