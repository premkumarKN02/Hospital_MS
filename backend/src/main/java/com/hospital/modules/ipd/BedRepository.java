package com.hospital.modules.ipd;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BedRepository extends JpaRepository<BedEntity, UUID> {
    List<BedEntity> findByBedStatus(String bedStatus);
    List<BedEntity> findByRoomId(UUID roomId);
}
