package com.bole.recruitment.controller;

import com.bole.recruitment.model.Message;
import com.bole.recruitment.model.User;
import com.bole.recruitment.repository.MessageRepository;
import com.bole.recruitment.repository.UserRepository;
import com.bole.recruitment.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/with/{userId}")
    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('RECRUITER')")
    public ResponseEntity<List<Message>> getMessagesWith(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        List<Message> messages = messageRepository.findBySenderAndReceiver(currentUser, otherUser);
        messages.addAll(messageRepository.findBySenderAndReceiver(otherUser, currentUser));
        
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send/{userId}")
    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('RECRUITER')")
    public ResponseEntity<Message> sendMessage(@PathVariable Long userId, @RequestBody String content) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        User sender = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User receiver = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        
        Message savedMessage = messageRepository.save(message);
        
        // Send message through WebSocket
        messagingTemplate.convertAndSendToUser(
                receiver.getUsername(),
                "/queue/messages",
                savedMessage);
        
        return ResponseEntity.ok(savedMessage);
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload Message message) {
        Message savedMessage = messageRepository.save(message);
        
        messagingTemplate.convertAndSendToUser(
                message.getReceiver().getUsername(),
                "/queue/messages",
                savedMessage);
    }
}