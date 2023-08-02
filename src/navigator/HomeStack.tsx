
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { GlobalStyle } from '../globalStyle';
import HelpScreen from '../pages/Help/Help';
import HomeScreen from '../pages/Home/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderProfile from '../components/HeaderProfile';
import SingleproScreen from '../pages/Single-Pro/Singlepro';
import ViewGigScreen from '../pages/ViewGig/ViewGig';
import ViewProfileScreen from '../pages/Profile/ViewProfile';
import EditProfileScreen from '../pages/Profile/EditProfile';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


const HomeStack = ({ navigation }: any) => {
    const GigStack = createNativeStackNavigator();
    const { userType }: any = useSelector((state: RootState) => state.userType)

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
            <Pressable style={{ flex: 1, margin: 15 }} onPress={() => userType === "PRO" && navigation.navigate('View-Profile')}>
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
                        <View style={{ height: 90, display: 'flex', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>
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
        </GigStack.Navigator>
    )
}
export default HomeStack