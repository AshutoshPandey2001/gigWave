
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderProfile from '../components/HeaderProfile';
import HelpScreen from '../pages/Help/Help';
import HomeScreen from '../pages/Home/Home';
import ChatScreen from '../pages/Message/Chat';
import EditProfileScreen from '../pages/Profile/EditProfile';
import ViewProfileScreen from '../pages/Profile/ViewProfile';
import SingleproScreen from '../pages/Single-Pro/Singlepro';
import ViewGigScreen from '../pages/ViewGig/ViewGig';
import { RootState } from '../redux/store';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { GlobalStyle } from '../globalStyle';
import { setIsCreateButton } from '../redux/action/User/userTypeSlice';
import PaymentScreen from '../components/PaymentScreen';


const HomeStack = ({ navigation, route }: any) => {
    const GigStack = createNativeStackNavigator();
    const dispatch = useDispatch()
    const { userType }: any = useSelector((state: RootState) => state.userType)
    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "DirectChat") {
            dispatch(setIsCreateButton(false))
            navigation.setOptions({ tabBarStyle: GlobalStyle.noTabBar });
        } else {
            dispatch(setIsCreateButton(true))
            navigation.setOptions({ tabBarStyle: GlobalStyle.tabBar });
        }
    }, [navigation, route])
    function HeaderRight() {
        return (
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', margin: 15 }}>
                <View>
                    <Pressable onPress={() => navigation.navigate('Role')}>
                        <Image resizeMode='contain' style={{ width: 60 }} source={require('../assets/images/gigwave.png')} />
                    </Pressable>
                </View>
            </View>
        );
    }
    function HeaderLeft() {
        return (
            <Pressable style={{ flex: 1, margin: 15 }} onPress={() => userType === "PRO" ? navigation.navigate('View-Profile') : navigation.navigate('Edit-Profile')}>
                <HeaderProfile />
            </Pressable>
        );
    }
    return (
        <GigStack.Navigator initialRouteName="HomeScreen" screenOptions={{
            contentStyle: {
                backgroundColor: '#fff'
            }
        }}  >
            <GigStack.Screen name="HomeScreen" component={HomeScreen}
                options={{
                    headerTitle: '',
                    header: () => (
                        <View style={{ height: 90, display: 'flex', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff', marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
                            <HeaderLeft />
                            <HeaderRight {...navigation} />
                        </View>
                    ),
                    headerStyle: { backgroundColor: '#fff' },
                    contentStyle: { backgroundColor: "#fff" },
                    headerShadowVisible: false,
                }}
            />
            <GigStack.Screen name="Help" component={HelpScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="Single-pro" component={SingleproScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="Payment" component={PaymentScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="View-gig" component={ViewGigScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="View-Profile" component={ViewProfileScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="Edit-Profile" component={EditProfileScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <GigStack.Screen name="DirectChat" component={ChatScreen}
                options={{
                    headerStyle: { backgroundColor: '#fff' },
                    contentStyle: { backgroundColor: "#fff" },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerShown: false
                }}
            />
        </GigStack.Navigator>
    )
}
export default HomeStack