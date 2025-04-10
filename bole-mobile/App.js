import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { checkAuth } from './src/store/slices/authSlice';

// Import screens
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

// Import store
import store from './src/store';

const Stack = createNativeStackNavigator();

// 内部组件用于处理认证状态和导航逻辑
function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [initialRoute, setInitialRoute] = useState('Auth');
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  
  const theme = colorScheme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#6200ee',
      accent: '#03dac4',
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#6200ee',
      accent: '#03dac4',
    },
  };

  // 检查用户是否已登录
  useEffect(() => {
    const checkUserAuth = async () => {
      await dispatch(checkAuth());
      console.log('Auth check completed, isAuthenticated:', isAuthenticated);
      setIsLoading(false);
    };
    
    checkUserAuth();
  }, [dispatch]);

  // 监听认证状态变化，处理导航
  useEffect(() => {
    console.log('Authentication state changed:', { isAuthenticated, isLoading });
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('User is authenticated, setting route to Main');
        setInitialRoute('Main');
      } else {
        console.log('User is not authenticated, setting route to Auth');
        setInitialRoute('Auth');
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}