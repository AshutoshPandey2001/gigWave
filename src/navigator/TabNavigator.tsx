import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderProfile from '../components/HeaderProfile';
import { GlobalStyle } from '../globalStyle';
import CreategigScreen from '../pages/CreatGig/CreateGig';
import FAQScreen from '../pages/FAQ/FAQ';
import RoleScreen from '../pages/Role/Role';
import { RootState } from '../redux/store';
import HomeStack from './HomeStack';
import MessageStack from './MessageStack';
import SearchGigStack from './SearchGigStack';
import MessageIcon from '../assets/icons/Message.svg'
import HomeIcon from '../assets/icons/Home.svg'
import SearchIcon from '../assets/icons/Search-tab.svg'
import FAQIcon from '../assets/icons/FAQ.svg'
import AddIcon from '../assets/icons/Add.svg'

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [hideCreate, setHideCreate] = useState(false)
    const [currentScreen, setCurrentScreen] = useState(null)

    const { userType }: any = useSelector((state: RootState) => state.userType)
    const { isListView }: any = useSelector((state: RootState) => state.isListView)


    const dispatch = useDispatch();
    useEffect(() => {
        if (currentScreen === 4) {
            setHideCreate(true)
        } else {
            setHideCreate(false)
        }

    }, [currentScreen])

    function HeaderLeft() {
        return (
            <View style={{ flex: 1, margin: 15 }}>
                <HeaderProfile />
            </View>
        );
    }
    const CustomTabButton = ({ children, onPress }: any) => (

        <>
            {
                userType === "CREATOR" &&
                <>

                    {hideCreate ?
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                marginEnd: 10,
                            }}
                        ></View>
                        :
                        <Pressable
                            style={{
                                top: -45,
                                justifyContent: 'flex-end',
                                alignItems: 'center',

                            }}
                            onPress={() => { onPress() }}
                        >
                            <View
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 35,
                                    marginEnd: 10
                                }}

                            >{children}</View>
                        </Pressable>
                    }
                </>
            }
        </>
    )

    return (
        <>

            <Tab.Navigator initialRouteName='Role' backBehavior='firstRoute'
                screenListeners={({ navigation }) => ({
                    state: (e: any) => {
                        // Do something with the state
                        setCurrentScreen(e.data.state.index)
                    },
                })}
                sceneContainerStyle={{ backgroundColor: '#fff' }}
                screenOptions={() => ({
                    headerBackgroundContainerStyle: '#fff',
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        borderWidth: 0,
                        shadowRadius: 2,
                        shadowOffset: {
                            width: 0,
                            height: -5,
                        },

                        shadowColor: '#555',
                        shadowOpacity: 0.2,
                        borderColor: '#fff',
                        elevation: 10,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        backgroundColor: '#fff',
                        position: 'absolute',
                        padding: 10,
                        width: '100%',
                        height: 80,
                    }
                })}
            >
                <Tab.Screen
                    name="Role"
                    component={RoleScreen}
                    options={{
                        tabBarStyle: { display: "none" },
                        headerTitle: 'Select Role',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
                        headerShadowVisible: false,
                        tabBarButton: () => null
                    }}

                />
                {userType &&
                    <>
                        <Tab.Screen name="Home" component={HomeStack} options={{
                            tabBarIcon: ({ size, focused, color }) => {
                                return (
                                    // <Image
                                    //     resizeMode='contain'
                                    //     style={{ width: 40, height: 40, borderTopLeftRadius: 20 }}
                                    //     source={require('../assets/icons/home.png')}
                                    // />
                                    <View>
                                        <HomeIcon />
                                    </View>
                                );
                            },

                            headerShown: false
                        }} />
                        <Tab.Screen name="Message" component={MessageStack}

                            options={({ route }) => {
                                const focusedRouteName = getFocusedRouteNameFromRoute(route);
                                if (focusedRouteName === 'Chat') {
                                    return {
                                        tabBarStyle: { display: 'none' },
                                        headerShown: false
                                    };
                                }
                                return {
                                    tabBarIcon: () => {
                                        return (
                                            // <Image
                                            //     resizeMode='contain'
                                            //     style={{ width: 40, height: 40 }}
                                            //     source={require('../assets/icons/message.png')}
                                            // />
                                            <View>
                                                <MessageIcon />
                                            </View>
                                        )
                                    },
                                    headerShown: false
                                };
                            }}

                        />
                        {userType === "PRO" && <Tab.Screen name="SearchGig" component={SearchGigStack} options={{
                            tabBarIcon: ({ size, focused, color }) => {
                                return (
                                    // <Image
                                    //     resizeMode='contain'
                                    //     style={{ width: 40, height: 40 }}
                                    //     source={require('../assets/icons/search-tab.png')}
                                    // />
                                    <View>
                                        <SearchIcon />
                                    </View>
                                );
                            },
                            headerShown: false
                            // headerStyle:{height:100}
                        }} />
                        }
                        <Tab.Screen name="FAQ" component={FAQScreen} options={{
                            tabBarIcon: ({ size, focused, color }) => {
                                return (
                                    // <Image
                                    //     resizeMode='contain'
                                    //     style={{ width: 45, height: 45 }}
                                    //     source={require('../assets/icons/faq.png')}
                                    // />
                                    <View>
                                        <FAQIcon />
                                    </View>
                                );
                            },
                            headerTitle: 'How GigWave Works',
                            headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
                            headerTitleAlign: 'center',
                            // headerStyle:{height:100}
                        }} />
                        {
                            userType === "CREATOR" &&
                            <Tab.Screen name="Create" component={CreategigScreen} options={{
                                tabBarIcon: ({ size, focused, color }) => {
                                    return (
                                        <View style={GlobalStyle.shadowProp}>
                                            {/* <Image
                                                style={{ width: 70, height: 70, marginEnd: 10 }}
                                                source={require('../assets/icons/add.png')}
                                            /> */}
                                            <AddIcon/>
                                        </View>
                                    );
                                },
                                headerTitleAlign: 'center',
                                headerTitle: 'Create Gig',
                                tabBarButton: (props) => (
                                    <CustomTabButton {...props} />
                                )

                            }} />
                        }
                    </>
                }
            </Tab.Navigator>
        </>
    )
}
export default TabNavigator
