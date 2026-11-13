package com.hospital.modules.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "hospital_id")
    private UUID hospitalId = UUID.fromString("55555555-0001-0000-0000-000000000001");

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(unique = true, length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "user_type", length = 50)
    private String userType = "STAFF";

    @Column(name = "status", length = 50)
    private String status = "ACTIVE";

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime accountLockedUntil;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<RoleEntity> roles = new HashSet<>();

    public boolean isActive() {
        return "ACTIVE".equalsIgnoreCase(this.status) || "APPROVED".equalsIgnoreCase(this.status);
    }

    public String getFullName() {
        return this.username;
    }
}
