import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import ChatScreen from '../pages/Message/Chat';
import MessageScreen from '../pages/Message/Message';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { GlobalStyle } from '../globalStyle';
import { setIsCreateButton } from '../redux/action/User/userTypeSlice';
import { useDispatch } from 'react-redux';

const MessageStack = ({ navigation, route }: any) => {
    const MsgStack = createNativeStackNavigator();
    const dispatch = useDispatch();
    function HeaderLeft() {
        return (
            //     <View style={{ flex: 1, margin: 15 }}>
            //     {/* <HeaderProfile /> */}
            // </View>
            <View style={{ flex: 1, margin: 0 }}>
                {/* <HeaderProfile /> */}
            </View>
        );
    }
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "Chat") {
            dispatch(setIsCreateButton(false))
            navigation.setOptions({ tabBarStyle: GlobalStyle.noTabBar });
        } else {
            dispatch(setIsCreateButton(true))
            navigation.setOptions({ tabBarStyle: GlobalStyle.tabBar });
        }
    }, [navigation, route])
    return (
        <MsgStack.Navigator initialRouteName="Msg" screenOptions={{
            contentStyle: {
                backgroundColor: '#fff'
            }
        }}  >
            <MsgStack.Screen name="Msg" component={MessageScreen}
                options={{
                    headerTitle: '',
                    // header: () => (
                    //     <View style={{ height: 90, display: 'flex', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                    //         <HeaderLeft />
                    //     </View>
                    // ),
                    header: () => (
                        <View style={{ height: 0, display: 'flex', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                            <HeaderLeft />
                        </View>
                    ),
                    headerStyle: { backgroundColor: '#fff' },
                    contentStyle: { backgroundColor: "#fff" },
                    headerShadowVisible: false,
                }}
            />
            <MsgStack.Screen name="Chat" component={ChatScreen}
                options={{
                    headerTitle: 'Chatting with Lala',
                    headerStyle: { backgroundColor: '#fff' },
                    contentStyle: { backgroundColor: "#fff" },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerShown: false
                }}
            />
        </MsgStack.Navigator>
    )
}

export default MessageStack