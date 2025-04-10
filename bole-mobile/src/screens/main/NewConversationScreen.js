import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Searchbar } from 'react-native-paper';
import globalStyles from '../../styles/globalStyles';

// Import actions and API services
import { createConversation } from '../../store/slices/chatSlice';
import { userAPI } from '../../api/apiService';

const NewConversationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);
  const { token, user } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  useEffect(() => {
    // Set up navigation options
    navigation.setOptions({
      headerTitle: 'New Conversation',
    });
    
    // Load initial users
    fetchUsers();
  }, [navigation]);
  
  const fetchUsers = async (query = '') => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      
      const response = await userAPI.getAllUsers({ search: query });
      
      // Filter out current user
      const filteredUsers = response.data.filter(u => u.id !== user.userId);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSearchError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchUsers(query);
  };
  
  const handleUserPress = async (userId) => {
    try {
      // Create a new conversation with the selected user
      await dispatch(createConversation(userId)).unwrap();
      
      // Navigate to the chat screen
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };
  
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.userItem} 
        onPress={() => handleUserPress(item.id)}
      >
        <View style={globalStyles.avatar}><Text style={globalStyles.avatarText}>{item.name.substring(0, 1).toUpperCase()}</Text></View>
        <View style={styles.userInfo}>
          <Text style={globalStyles.text}>{item.name}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={globalStyles.container}>
      <Searchbar
        placeholder="Search users"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
        {searchLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={globalStyles.primaryColor} />
            </View>
        ) : searchError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Error: {searchError}</Text>
              <TouchableOpacity style={globalStyles.button} onPress={() => fetchUsers(searchQuery)}>
                <Text style={globalStyles.buttonText}>Retry</Text>
              </TouchableOpacity>
            </View>
        ) : users.length === 0 ? (
            <View style={styles.emptyState}><Text style={styles.emptyStateText}>No users found</Text></View>
        ) : (
            <FlatList
                data={users}
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
    ...globalStyles.container,
  },
  searchBar: {
    ...globalStyles.input,
    marginBottom: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userRole: {
    ...globalStyles.smallText,
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
  },