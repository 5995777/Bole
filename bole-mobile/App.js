import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Text } from 'react-native';

// Import screens
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

// Import store
import store from './src/store';

const Stack = createNativeStackNavigator();

export default function App() {
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
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Text style={{ display: 'none' }}>App is running!</Text>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </ReduxProvider>
  );
  // return (
  //   <ReduxProvider store={store}>
  //     <PaperProvider theme={theme}>
  //       <NavigationContainer theme={theme}>
  //         <Stack.Navigator screenOptions={{ headerShown: false }}>
  //           <Stack.Screen name="Auth" component={AuthNavigator} />
  //           <Stack.Screen name="Main" component={MainNavigator} />
  //         </Stack.Navigator>
  //       </NavigationContainer>
  //       <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
  //     </PaperProvider>
  //   </ReduxProvider>
  // );
}