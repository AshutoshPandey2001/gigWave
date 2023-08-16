/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import AuthNavigator from './src/navigator/AuthNavigator';

import { useDispatch, useSelector, } from 'react-redux';
import TabNavigator from './src/navigator/TabNavigator';
import { RootState } from './src/redux/store';

import { LogBox } from 'react-native';
import { getLoginToken } from './src/services/authServices/authServices';
import { setFirstToken } from './src/redux/action/Auth/authAction';
LogBox.ignoreLogs(['new NativeEventEmitter']);
function App(): JSX.Element {

  const Stack = createNativeStackNavigator();
  const user = useSelector((state: RootState) => state.user)
  const [isLoggedIn, setIsLogged] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.user) {
      setIsLogged(true)
    }
  }, [user])
  useEffect(() => {
    getLoginToken().then((res) => {
      if (res) {
        dispatch(setFirstToken(res.access_token))
      }
    })
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer theme={DefaultTheme}>
        {isLoggedIn ?
          <TabNavigator />
          : <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Auth" options={{ headerShown: false }}
              component={AuthNavigator} />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </SafeAreaView>
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
