/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet
} from 'react-native';

import AuthNavigator from './src/navigator/AuthNavigator';

import { useSelector, } from 'react-redux';
import TabNavigator from './src/navigator/TabNavigator';
import RoleScreen from './src/pages/Role/Role';
import { RootState } from './src/redux/store';


function App(): JSX.Element {

  const Stack = createNativeStackNavigator();
  const user = useSelector((state: RootState) => state.user)
  const [isLoggedIn, setIsLogged] = useState(false);


  useEffect(() => {
    console.log('userDetails--------', user.user);
    if (user?.user) {
      setIsLogged(true)
    }
  }, [user])

  return (
    <NavigationContainer>
      {isLoggedIn ?
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={RoleScreen} options={{
            headerTitle: 'Select Role',
            headerTitleAlign: 'center',
            headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
            headerShadowVisible: false
          }} />
          <Stack.Screen name="Tab" options={{ headerShown: false}}
            component={TabNavigator} />
        </Stack.Navigator> :
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Auth" options={{ headerShown: false }}
            component={AuthNavigator} />
        </Stack.Navigator>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
