import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderProfile from '../components/HeaderProfile';
import EditProfileScreen from '../pages/Profile/EditProfile';
import ViewProfileScreen from '../pages/Profile/ViewProfile';
import SearchGigScreen from '../pages/SearchGig/SearchGig';
import ViewGigScreen from '../pages/ViewGig/ViewGig';
import { setView } from '../redux/action/User/userTypeSlice';
import { RootState } from '../redux/store';

const SearchGigStack = ({ navigation }: any) => {
    const SearchGigStack = createNativeStackNavigator();
    const { isListView }: any = useSelector((state: RootState) => state.isListView)
    const dispatch = useDispatch();

    function HeaderLeft() {
        return (
            <Pressable style={{ flex: 1, margin: 15 }} onPress={()=>navigation.navigate('View-Profile')}>
                <HeaderProfile />
            </Pressable>
        );
    }
    return (
        <SearchGigStack.Navigator initialRouteName="Search-Gig" screenOptions={{
            contentStyle: {
                backgroundColor: '#fff'
            }
        }}  >
            <SearchGigStack.Screen name="Search-Gig" component={SearchGigScreen} options={{
                header: () => (
                    <View style={{ height: 70, display: 'flex', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff' }}>
                        <HeaderLeft />
                        <Pressable style={{ marginHorizontal: 10 }} onPress={() => {
                            if (isListView) {
                                dispatch(setView(false))
                            } else {
                                dispatch(setView(true))
                            }
                        }} >
                            <Text style={{ color: '#05D3E5', fontSize: 20 }}>{isListView ? 'Map View' : 'List View'}</Text>
                        </Pressable>
                    </View>
                ),
                headerStyle: { backgroundColor: '#fff' },

                contentStyle: { backgroundColor: "#fff" },
                headerShadowVisible: false,
                headerTitle: '',
            }} />
            <SearchGigStack.Screen name="View-gig" component={ViewGigScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <SearchGigStack.Screen name="View-Profile" component={ViewProfileScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
            <SearchGigStack.Screen name="Edit-Profile" component={EditProfileScreen} options={{
                headerBackButtonMenuEnabled: true,
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: "#fff" }
            }} />
        </SearchGigStack.Navigator>
    )
}

export default SearchGigStack