package com.hospital.modules.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(length = 100)
    private String code;

    @Column(unique = true, nullable = false, length = 150)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "is_system_role")
    private Boolean systemRole = false;

    @ManyToMany(mappedBy = "roles")
    private Set<UserEntity> users = new HashSet<>();
}
