package com.bole.recruitment.controller;

import com.bole.recruitment.model.Application;
import com.bole.recruitment.model.Job;
import com.bole.recruitment.model.User;
import com.bole.recruitment.repository.ApplicationRepository;
import com.bole.recruitment.repository.JobRepository;
import com.bole.recruitment.repository.UserRepository;
import com.bole.recruitment.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('RECRUITER')")
    public ResponseEntity<List<Application>> getApplications(@RequestParam(required = false) Long jobId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Application> applications;
        
        if (user.getRole() == User.Role.JOBSEEKER) {
            applications = applicationRepository.findByUser(user);
        } else if (jobId != null) {
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
            
            // Check if the recruiter owns this job
            if (!job.getCompany().getUser().getUserId().equals(user.getUserId())) {
                return ResponseEntity.badRequest().build();
            }
            
            applications = applicationRepository.findByJob(job);
        } else {
            // Get all applications for all jobs posted by this recruiter
            applications = applicationRepository.findAll();
            applications.removeIf(app -> !app.getJob().getCompany().getUser().getUserId().equals(user.getUserId()));
        }
        
        return ResponseEntity.ok(applications);
    }

    @PostMapping
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<Application> applyForJob(@RequestParam Long jobId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        
        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setStatus(Application.Status.PENDING);
        
        Application savedApplication = applicationRepository.save(application);
        return ResponseEntity.ok(savedApplication);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestParam Application.Status status) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        
        // Check if the recruiter owns the job this application is for
        if (!application.getJob().getCompany().getUser().getUserId().equals(user.getUserId())) {
            return ResponseEntity.badRequest().build();
        }
        
        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);
        return ResponseEntity.ok(updatedApplication);
    }
}