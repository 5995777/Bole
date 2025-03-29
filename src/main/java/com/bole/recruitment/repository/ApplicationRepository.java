package com.bole.recruitment.repository;

import com.bole.recruitment.model.Application;
import com.bole.recruitment.model.Job;
import com.bole.recruitment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUser(User user);
    
    List<Application> findByJob(Job job);
    
    List<Application> findByJobAndStatus(Job job, Application.Status status);
}