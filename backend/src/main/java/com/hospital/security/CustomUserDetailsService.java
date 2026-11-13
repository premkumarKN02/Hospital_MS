package com.hospital.security;

import com.hospital.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.hospital.modules.user.UserEntity user = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!user.isActive()) {
            throw new UsernameNotFoundException("Account is inactive: " + username);
        }

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .flatMap(role -> {
                    List<SimpleGrantedAuthority> list = new java.util.ArrayList<>();
                    if (role.getCode() != null) {
                        String codeUpper = role.getCode().toUpperCase();
                        list.add(new SimpleGrantedAuthority("ROLE_" + codeUpper));
                        if (codeUpper.contains("ADMIN")) {
                            list.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        }
                    }
                    if (role.getName() != null) {
                        String nameUpper = role.getName().toUpperCase().replace(" ", "_");
                        list.add(new SimpleGrantedAuthority("ROLE_" + nameUpper));
                        if (nameUpper.contains("ADMIN")) {
                            list.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                        }
                    }
                    return list.stream();
                })
                .collect(Collectors.toList());

        return User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountLocked(user.getAccountLockedUntil() != null &&
                        user.getAccountLockedUntil().isAfter(java.time.LocalDateTime.now()))
                .build();
    }
}
