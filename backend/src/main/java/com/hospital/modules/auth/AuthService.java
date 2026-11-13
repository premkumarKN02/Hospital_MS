package com.hospital.modules.auth;

import com.hospital.modules.auth.dto.AuthResponse;
import com.hospital.modules.auth.dto.LoginRequest;
import com.hospital.modules.auth.dto.RegisterRequest;
import com.hospital.modules.user.RoleEntity;
import com.hospital.modules.user.RoleRepository;
import com.hospital.modules.user.UserEntity;
import com.hospital.modules.user.UserRepository;
import com.hospital.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        UserEntity user = userRepository.findByUsernameOrEmail(userDetails.getUsername())
                .orElseThrow();

        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new com.hospital.exception.BusinessException("DUPLICATE_USERNAME", "Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.hospital.exception.BusinessException("DUPLICATE_EMAIL", "Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus("ACTIVE");

        // Assign role
        String roleName = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole().toUpperCase()
                : "PATIENT";
        RoleEntity role = roleRepository.findByCodeOrName(roleName)
                .orElse(roleRepository.findByCodeOrName("PATIENT")
                        .orElseThrow(() -> new com.hospital.exception.ResourceNotFoundException("Role not found: " + roleName)));
        user.setRoles(Set.of(role));

        user = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .roles(roleName)
                .build();

        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    private AuthResponse buildAuthResponse(UserEntity user, String accessToken, String refreshToken) {
        List<String> roles = user.getRoles().stream()
                .flatMap(role -> {
                    List<String> list = new java.util.ArrayList<>();
                    if (role.getCode() != null) {
                        list.add(role.getCode());
                        if (role.getCode().toUpperCase().contains("ADMIN")) {
                            list.add("ADMIN");
                        }
                    }
                    if (role.getName() != null) {
                        list.add(role.getName());
                    }
                    return list.stream();
                })
                .distinct()
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId().toString())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phone(user.getPhone())
                        .profilePictureUrl(null)
                        .roles(roles)
                        .preferredLanguage("en")
                        .build())
                .build();
    }
}
