package com.bole.recruitment.repository;

import com.bole.recruitment.model.Message;
import com.bole.recruitment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiver(User sender, User receiver);
    
    List<Message> findBySenderOrReceiverOrderBySentAtDesc(User sender, User receiver);
}