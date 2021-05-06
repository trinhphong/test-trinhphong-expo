import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LinkingConfig from './LinkingConfig';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
export const AuthContext = React.createContext();

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = localStorage.getItem('token');
      } catch (e) {
        console.log('bootstrapAsync error: ', e);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async token => {
        localStorage.setItem('token', token);
        dispatch({ type: 'SIGN_IN', token });
      },
      signOut: () => {
        localStorage.removeItem('token');
        dispatch({ type: 'SIGN_OUT' });
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={LinkingConfig} >
        <Stack.Navigator>
          {state.userToken == null ? (
              <Stack.Screen name="login" component={LoginScreen} />
            ) : (
              <Stack.Screen name="profile" component={ProfileScreen} />
            )
          }
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
