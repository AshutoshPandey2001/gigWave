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
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import AuthNavigator from './src/navigator/AuthNavigator';

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

LogBox.ignoreLogs(['new NativeEventEmitter', 'ViewPropTypes']);
function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const user = useSelector((state: RootState) => state.user)
  const { isLoading } = useSelector((state: RootState) => state.isLoading)
  const [isLoggedIn, setIsLogged] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user?.user) {

      // console.log('user info', user.user);
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
    checkPermission()
  }, [])

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
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
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
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


    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
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
      {/* <ToastProvider
        placement="top"
        duration={3000}
        animationType='zoom-in'
        animationDuration={250}
        successColor="green"
        dangerColor="red"
        warningColor="orange"
        normalColor="gray"
        textStyle={{ fontSize: 16 }}
        offset={50} // offset for both top and bottom toasts
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled={true}
        renderType={{
          success_toast: (toast) => (

            <View
              style={{
                maxWidth: "100%",
                width: "100%",
                top: 0,
                left: 0,
                paddingHorizontal: 15,
                paddingVertical: 10,
                backgroundColor: "transparent",
                marginVertical: 4,
                borderRadius: 8,
                borderLeftColor: "#00C851",
                borderLeftWidth: 6,
                // justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
                paddingLeft: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {toast.data.title}
              </Text>
              <Text style={{ color: "#a3a3a3", marginTop: 2 }}>{toast.message}</Text>
            </View>
          ),

        }}

      > */}
      <NavigationContainer theme={DefaultTheme}>
        {isLoggedIn ?
          <TabNavigator />
          : <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Auth" options={{ headerShown: false }}
              component={AuthNavigator} />
          </Stack.Navigator>
        }
      </NavigationContainer>
      {/* </ToastProvider> */}
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
