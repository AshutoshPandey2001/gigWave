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
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AuthNavigator from './src/navigator/AuthNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector, } from 'react-redux';
import TabNavigator from './src/navigator/TabNavigator';
import { RootState } from './src/redux/store';

import { LogBox } from 'react-native';
import { ErrorToast, SuccessToast } from 'react-native-toast-message';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { setFirstToken } from './src/redux/action/Auth/authAction';
import { setLoading } from './src/redux/action/General/GeneralSlice';
import { checkPermission } from './src/services/audioServices/audioServices';
import { getLoginToken } from './src/services/authServices/authServices';
import { requestUserPermission } from './src/services/noticationService/notification';


LogBox.ignoreLogs(['new NativeEventEmitter', 'ViewPropTypes']);
function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const user = useSelector((state: RootState) => state.user)
  const { isLoading } = useSelector((state: RootState) => state.isLoading)
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
        dispatch(setLoading(false))
      }
    })
  }, [])
  useEffect(() => {
    checkPermission();
    requestUserPermission();
  }, [])

  const toastConfig = {
    success: (props: any) => (
      <SuccessToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 16
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'

        }}
        text2Style={{
          fontSize: 16
        }}
      />
    ),
    tomatoToast: (props: any) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text style={{ color: 'white' }}>{props.text1}</Text>
        <Text style={{ color: 'white' }}>{props.text2}</Text>
        <Text style={{ color: 'white' }}>{props.text3}</Text>
      </View>
    )
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading &&
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size={'large'} />
        </View>
      }
      <NavigationContainer theme={DefaultTheme}>
        {isLoggedIn ?
          <TabNavigator />
          : <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Auth" options={{ headerShown: false }}
              component={AuthNavigator} />
          </Stack.Navigator>
        }
      </NavigationContainer>
      <Toast config={toastConfig} />
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
  container: {
    position: 'absolute',
    zIndex: 999,
    height: '100%',
    width: '100%',
    margin: 'auto',
    backgroundColor: "rgba(255,255,255,0.7)",
    elevation: Platform.OS === "android" ? 50 : 0,
    shadowColor: "rgba(255,255,255,0.7)"
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default App;
