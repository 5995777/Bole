package com.bole.recruitment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime appliedAt;

    // Relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Relationship with Job
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, INTERVIEW, REJECTED
    }
}