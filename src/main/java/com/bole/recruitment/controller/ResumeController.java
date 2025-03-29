package com.bole.recruitment.controller;

import com.bole.recruitment.model.Resume;
import com.bole.recruitment.model.User;
import com.bole.recruitment.repository.ResumeRepository;
import com.bole.recruitment.repository.UserRepository;
import com.bole.recruitment.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resume")
public class ResumeController {
    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<Resume> getMyResume() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Resume resume = resumeRepository.findByUser(user)
                .orElse(new Resume());
        
        return ResponseEntity.ok(resume);
    }

    @PostMapping
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<Resume> createOrUpdateResume(@Valid @RequestBody Resume resumeDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Resume resume = resumeRepository.findByUser(user)
                .orElse(new Resume());
        
        resume.setName(resumeDetails.getName());
        resume.setEducation(resumeDetails.getEducation());
        resume.setExperience(resumeDetails.getExperience());
        resume.setSkills(resumeDetails.getSkills());
        resume.setContactInformation(resumeDetails.getContactInformation());
        resume.setUser(user);
        
        Resume savedResume = resumeRepository.save(resume);
        return ResponseEntity.ok(savedResume);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Resume> getResumeByUserId(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Resume resume = resumeRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Resume not found for user with id: " + userId));
        
        return ResponseEntity.ok(resume);
    }
}