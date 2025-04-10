import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../../styles/globalStyles';

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
      <View style={[globalStyles.container, styles.centered]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={globalStyles.primaryColor} />
        </View>
      </View>
      );
  }
  
  if (error) {
    return (
      <SafeAreaWrapper backgroundColor="#ffffff">
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchMessages(conversationId))}>
            <Text style={styles.retryText}>重试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaWrapper>
    );
  }
  
  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    padding: 10,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end', // Align to the right
    marginLeft: 50, // Push further to the right
  },
  otherMessageContainer: {
    alignSelf: 'flex-start', // Align to the left
    marginRight: 50, // Push further to the left
  },
  avatar: {
    marginRight: 8,
    alignSelf: 'flex-end', // Align with the end of the message
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%', // Take up full width
    ...globalStyles.shadow, // Apply shadow for depth
  },
  ownMessageBubble: {
    backgroundColor: globalStyles.primaryColor,
    borderBottomRightRadius: 0, // Remove sharp corner
  },
  otherMessageBubble: {
    backgroundColor: globalStyles.white,
    borderBottomLeftRadius: 0, // Remove sharp corner
  },
  messageText: {
    fontSize: 16,
    color: globalStyles.textColor,
    fontFamily: 'PingFang SC', // Consistent font
  },
  ownMessageText: { // Text color for own messages
    color: globalStyles.white,
  },
  messageTime: {
    fontSize: 10,
    color: globalStyles.secondaryTextColor,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  messageStatus: {
    fontSize: 12,
    color: globalStyles.tertiaryTextColor,
    marginLeft: 5,
  },
  dayContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dayText: {
    backgroundColor: globalStyles.tertiaryBackgroundColor,
    color: globalStyles.secondaryTextColor,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: globalStyles.white,
    borderTopWidth: 1,
    borderTopColor: globalStyles.borderColor,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: globalStyles.secondaryBackgroundColor,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    fontFamily: 'PingFang SC',
    color: globalStyles.textColor,
  },
  sendButton: {
    backgroundColor: globalStyles.primaryColor,
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    ...globalStyles.shadow,
  },
  disabledSendButton: {
    backgroundColor: globalStyles.disabledColor,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    errorContainer: {
        backgroundColor: globalStyles.errorBackground,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    errorText: {
        color: globalStyles.errorText,
        fontSize: 16,
        textAlign: 'center',
    },
    loadingContainer: {
        ...globalStyles.cardContainer,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
  },
  retryButton: {
    ...globalStyles.button,
    marginTop: 15,
  },
  retryText: {
    color: globalStyles.buttonText,
  },
});

export default ChatScreen;