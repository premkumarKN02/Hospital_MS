package com.hospital.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByName(String name);
    Optional<RoleEntity> findByCode(String code);

    @Query("SELECT r FROM RoleEntity r WHERE UPPER(r.code) = UPPER(:val) OR UPPER(r.name) = UPPER(:val)")
    Optional<RoleEntity> findByCodeOrName(@Param("val") String val);
}
