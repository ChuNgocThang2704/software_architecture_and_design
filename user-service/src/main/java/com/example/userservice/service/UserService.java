package com.example.userservice.service;


import com.example.userservice.entity.User;
import com.example.userservice.exception.UnauthorizedException;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User login(User request) {
        log.info("UserService gọi db kiểm tra thông tin đăng nhập của người dùng.");
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Email và mật khẩu không chính xác"));

        if (!request.getPassword().equals(user.getPassword())) {
            throw new UnauthorizedException("Email và mật khẩu không chính xác");
        }

        return user;
    }

    @Transactional
    public User register(User request) {
        log.info("UserService gọi db đăng kí tài khoản mới.");
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(email);
        newUser.setPassword(request.getPassword()); // Không có yêu cầu băm mật khẩu, lưu thẳng
        newUser.setRole(request.getRole() != null && !request.getRole().isBlank() ? request.getRole() : "USER");

        return userRepository.save(newUser);
    }
}
