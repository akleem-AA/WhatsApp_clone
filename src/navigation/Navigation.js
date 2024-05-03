import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from '../core/theme'
import LoginScreen from '../screens/AuthScreens/LoginScreen'
import ChatScreen from '../screens/Chats/ChatScreen'
import FriendsListScreen from '../screens/Chats/FriendsListScreen'
import RegisterScreen from '../screens/AuthScreens/RegisterScreen'
import Dashboard from '../screens/HomeScreens/Dashboard'
import ResetPasswordScreen from '../screens/AuthScreens/ResetPasswordScreen'



const Stack = createStackNavigator()

export default function Navigation() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
         
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatList" component={FriendsListScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
