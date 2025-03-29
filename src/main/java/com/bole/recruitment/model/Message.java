package com.bole.recruitment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @NotBlank
    private String content;

    private LocalDateTime sentAt;

    // Relationship with Sender
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    // Relationship with Receiver
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}