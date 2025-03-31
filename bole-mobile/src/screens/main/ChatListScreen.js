import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Divider, Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Import actions
import { fetchConversations, connectSocket, setCurrentConversation } from '../../store/slices/chatSlice';

const ChatListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Connect to socket when component mounts
    dispatch(connectSocket());
    
    // Fetch conversations
    dispatch(fetchConversations());
    
    // Set up navigation options
    navigation.setOptions({
      headerTitle: 'Messages',
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate('NewConversation')}
        >
          <MaterialIcons name="add" size={24} color="#6200ee" />
        </TouchableOpacity>
      ),
    });
  }, [dispatch, navigation]);
  
  const handleConversationPress = (conversation) => {
    dispatch(setCurrentConversation(conversation));
    navigation.navigate('Chat', { conversationId: conversation.id });
  };
  
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.id !== user.userId);
  };
  
  const renderItem = ({ item }) => {
    const otherParticipant = getOtherParticipant(item);
    const lastMessage = item.lastMessage;
    const unreadCount = item.unreadCount || 0;
    
    // Check if conversation matches search query
    if (
      searchQuery && 
      !otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return null;
    }
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem} 
        onPress={() => handleConversationPress(item)}
      >
        <Avatar.Text 
          size={50} 
          label={otherParticipant.name.substring(0, 2).toUpperCase()} 
          backgroundColor="#6200ee"
        />
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName}>{otherParticipant.name}</Text>
            <Text style={styles.timeStamp}>
              {lastMessage ? new Date(lastMessage.timestamp).toLocaleDateString() : ''}
            </Text>
          </View>
          <View style={styles.messagePreview}>
            <Text 
              style={[styles.lastMessage, unreadCount > 0 && styles.unreadMessage]} 
              numberOfLines={1}
            >
              {lastMessage ? lastMessage.content : 'No messages yet'}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  if (loading && conversations.length === 0) {
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
          onPress={() => dispatch(fetchConversations())}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search conversations"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="chat-bubble-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateText}>No conversations yet</Text>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => navigation.navigate('NewConversation')}
          >
            <Text style={styles.newChatButtonText}>Start a new conversation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadBadge: {
    backgroundColor: '#6200ee',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  newChatButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 25,
  },
  newChatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatListScreen;