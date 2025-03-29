package com.bole.recruitment.controller;

import com.bole.recruitment.model.Company;
import com.bole.recruitment.model.User;
import com.bole.recruitment.repository.CompanyRepository;
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
@RequestMapping("/api/companies")
public class CompanyController {
    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return ResponseEntity.ok(company);
    }

    @GetMapping("/my-company")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Company> getMyCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Company company = companyRepository.findByUser(user)
                .orElse(new Company());
        
        return ResponseEntity.ok(company);
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Company> createOrUpdateCompany(@Valid @RequestBody Company companyDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Company company = companyRepository.findByUser(user)
                .orElse(new Company());
        
        company.setCompanyName(companyDetails.getCompanyName());
        company.setCompanyDescription(companyDetails.getCompanyDescription());
        company.setLocation(companyDetails.getLocation());
        company.setContactInfo(companyDetails.getContactInfo());
        company.setUser(user);
        
        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.ok(savedCompany);
    }
}