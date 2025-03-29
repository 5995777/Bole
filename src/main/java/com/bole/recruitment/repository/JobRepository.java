package com.bole.recruitment.repository;

import com.bole.recruitment.model.Company;
import com.bole.recruitment.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompany(Company company);
    
    @Query("SELECT j FROM Job j WHERE j.title LIKE %:keyword% OR j.description LIKE %:keyword%")
    List<Job> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT j FROM Job j WHERE (j.title LIKE %:keyword% OR j.description LIKE %:keyword%) AND j.location LIKE %:location%")
    List<Job> searchByKeywordAndLocation(@Param("keyword") String keyword, @Param("location") String location);
}