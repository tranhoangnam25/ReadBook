package backend.repository;

import backend.entity.ReaderSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReaderSettingRepository extends JpaRepository<ReaderSetting, Long> {
    Optional<ReaderSetting> findByUser_Id(Long userId);
    
    void deleteByUser_Id(Long userId);

    @Modifying
    @Query(value = "DELETE FROM Reader_Setting WHERE user_id = :userId", nativeQuery = true)
    void forceDeleteByUserId(@Param("userId") Long userId);
}
