package com.bole.recruitment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "resumes")
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resumeId;

    @NotBlank
    private String name;

    private String education;

    private String experience;

    private String skills;

    private String contactInformation;

    // Relationship with User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}