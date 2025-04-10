import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import JobsScreen from '../screens/main/JobsScreen';
import JobDetailScreen from '../screens/main/JobDetailScreen';
import ApplicationsScreen from '../screens/main/ApplicationsScreen';
import ApplicationDetailScreen from '../screens/main/ApplicationDetailScreen';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import NewConversationScreen from '../screens/main/NewConversationScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import CompanyProfileScreen from '../screens/main/CompanyProfileScreen';
import EditCompanyScreen from '../screens/main/EditCompanyScreen';
import CreateJobScreen from '../screens/main/CreateJobScreen';
import EditJobScreen from '../screens/main/EditJobScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Job Stack Navigator
const JobsNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobsList" component={JobsScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      {isRecruiter && (
        <>
          <Stack.Screen name="CreateJob" component={CreateJobScreen} />
          <Stack.Screen name="EditJob" component={EditJobScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Applications Stack Navigator
const ApplicationsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApplicationsList" component={ApplicationsScreen} />
      <Stack.Screen name="ApplicationDetail" component={ApplicationDetailScreen} />
    </Stack.Navigator>
  );
};

// Chat Stack Navigator
const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="NewConversation" component={NewConversationScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      {isRecruiter && (
        <>
          <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
          <Stack.Screen name="EditCompany" component={EditCompanyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'work' : 'work-outline';
          } else if (route.name === 'Applications') {
            iconName = focused ? 'description' : 'description';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chat' : 'chat';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: '首页', tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="home" size={size} color={color} />
        ) }} 
      />
      <Tab.Screen 
        name="Jobs" 
        component={JobsNavigator} 
        options={{ tabBarLabel: '职位', tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="work" size={size} color={color} />
        ) }} 
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsNavigator} 
        options={{ tabBarLabel: '申请', tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="description" size={size} color={color} />
        ) }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatNavigator} 
        options={{ tabBarLabel: '聊天', tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="chat" size={size} color={color} />
        ) }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{ tabBarLabel: '我的', tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="person" size={size} color={color} />
        ) }} 
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;