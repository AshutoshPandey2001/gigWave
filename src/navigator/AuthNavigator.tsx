import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../pages/Login/Login';
import RegisterScreen from '../pages/Register/Register';
import SignupScreen from '../pages/Signup/Signup';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            contentStyle: {
                backgroundColor: '#fff'
            }
        }}>
            <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignupScreen} />
            <Stack.Screen
                options={{
                    headerBackButtonMenuEnabled: true, headerTitle: '',
                    headerShadowVisible: false
                }} name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}

export default AuthNavigator