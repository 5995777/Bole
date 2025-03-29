package com.bole.recruitment.controller;

import com.bole.recruitment.model.Company;
import com.bole.recruitment.model.Job;
import com.bole.recruitment.model.User;
import com.bole.recruitment.repository.CompanyRepository;
import com.bole.recruitment.repository.JobRepository;
import com.bole.recruitment.repository.UserRepository;
import com.bole.recruitment.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return ResponseEntity.ok(job);
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found for this user"));
        
        job.setCompany(company);
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody Job jobDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found for this user"));
        
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        
        if (!job.getCompany().getCompanyId().equals(company.getCompanyId())) {
            return ResponseEntity.badRequest().build();
        }
        
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setLocation(jobDetails.getLocation());
        job.setSalaryRange(jobDetails.getSalaryRange());
        
        Job updatedJob = jobRepository.save(job);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Company not found for this user"));
        
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        
        if (!job.getCompany().getCompanyId().equals(company.getCompanyId())) {
            return ResponseEntity.badRequest().build();
        }
        
        jobRepository.delete(job);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam String keyword, @RequestParam(required = false) String location) {
        List<Job> jobs;
        if (location != null && !location.isEmpty()) {
            jobs = jobRepository.searchByKeywordAndLocation(keyword, location);
        } else {
            jobs = jobRepository.searchByKeyword(keyword);
        }
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        
        List<Job> jobs = jobRepository.findByCompany(company);
        return ResponseEntity.ok(jobs);
    }
}