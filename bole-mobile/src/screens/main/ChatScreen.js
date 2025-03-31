import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Import actions
import { fetchMessages, sendMessage } from '../../store/slices/chatSlice';

const ChatScreen = ({ route, navigation }) => {
  const { conversationId } = route.params;
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  
  const { currentConversation, messages, loading, error } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  
  const conversationMessages = messages[conversationId] || [];
  
  useEffect(() => {
    // Fetch messages for this conversation
    dispatch(fetchMessages(conversationId));
    
    // Set up navigation options
    if (currentConversation) {
      const otherParticipant = getOtherParticipant(currentConversation);
      navigation.setOptions({
        headerTitle: otherParticipant.name,
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate('Profile', { userId: otherParticipant.id })}
          >
            <MaterialIcons name="info-outline" size={24} color="#6200ee" />
          </TouchableOpacity>
        ),
      });
    }
  }, [dispatch, navigation, conversationId, currentConversation]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (conversationMessages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversationMessages]);
  
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return { name: 'User' };
    return conversation.participants.find(p => p.id !== user.userId) || { name: 'User' };
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    setSending(true);
    const trimmedMessage = messageText.trim();
    setMessageText('');
    
    try {
      await dispatch(sendMessage({
        conversationId,
        content: trimmedMessage,
        type: 'TEXT'
      })).unwrap();
      
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };
  
  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === user.userId;
    
    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer]}>
        {!isOwnMessage && (
          <Avatar.Text 
            size={30} 
            label={getOtherParticipant(currentConversation).name.substring(0, 2).toUpperCase()} 
            backgroundColor="#6200ee"
            style={styles.avatar}
          />
        )}
        <View style={[styles.messageBubble, isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble]}>
          <Text style={styles.messageText}>{item.content}</Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isOwnMessage && (
              <Text style={styles.messageStatus}> • {item.status.toLowerCase()}</Text>
            )}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderDay = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dayText;
    if (date.toDateString() === today.toDateString()) {
      dayText = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dayText = 'Yesterday';
    } else {
      dayText = date.toLocaleDateString();
    }
    
    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{dayText}</Text>
      </View>
    );
  };
  
  const renderMessageItem = ({ item, index }) => {
    // Check if we need to show a day separator
    const showDaySeparator = index === 0 || (
      index > 0 && 
      new Date(item.timestamp).toDateString() !== 
      new Date(conversationMessages[index - 1].timestamp).toDateString()
    );
    
    return (
      <View>
        {showDaySeparator && renderDay(item.timestamp)}
        {renderMessage({ item })}
      </View>
    );
  };
  
  if (loading && conversationMessages.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchMessages(conversationId))}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !messageText.trim() && styles.disabledSendButton]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  avatar: {
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: '#6200ee',
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  ownMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  messageStatus: {
    fontSize: 10,
    color: '#ccc',
  },
  dayContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dayText: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
  },
});

export default ChatScreen;