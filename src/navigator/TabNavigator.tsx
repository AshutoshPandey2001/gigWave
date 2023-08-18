import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from '../assets/icons/Add.svg';
import FAQIcon from '../assets/icons/FAQ.svg';
import HomeIcon from '../assets/icons/Home.svg';
import MessageIcon from '../assets/icons/Message.svg';
import SearchIcon from '../assets/icons/Search-tab.svg';
import HeaderProfile from '../components/HeaderProfile';
import { GlobalStyle } from '../globalStyle';
import CreategigScreen from '../pages/CreatGig/CreateGig';
import FAQScreen from '../pages/FAQ/FAQ';
import RoleScreen from '../pages/Role/Role';
import { RootState } from '../redux/store';
import HomeStack from './HomeStack';
import MessageStack from './MessageStack';
import SearchGigStack from './SearchGigStack';
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [hideCreate, setHideCreate] = useState(false)
    const [currentScreen, setCurrentScreen] = useState(null)
    const { userType }: any = useSelector((state: RootState) => state.userType)
    const { isCreateButton }: any = useSelector((state: RootState) => state.isCreateButton)

    useEffect(() => {
        if (currentScreen === 4) {
            setHideCreate(true)
        } else {
            setHideCreate(false)
        }

    }, [currentScreen])

    const CustomTabButton = ({ children, onPress }: any) => (

        <>
            {
                userType === "CREATOR" && isCreateButton &&
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
                    tabBarStyle: GlobalStyle.tabBar
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
                        <Tab.Screen name="Home" component={HomeStack} options={({ route }) => ({
                            tabBarIcon: ({ size, focused, color }) => {
                                return (
                                    <View>
                                        <HomeIcon />
                                    </View>
                                );
                            },
                            headerShown: false
                        })} />
                        <Tab.Screen name="Message" component={MessageStack}
                            options={({ route }) => {
                                return {
                                    tabBarIcon: () => {
                                        return (
                                            <View>
                                                <MessageIcon />
                                            </View>
                                        )
                                    },
                                    // tabBarStyle: ((route) => {
                                    //     const routeName = getFocusedRouteNameFromRoute(route)
                                    //     console.log(routeName)
                                    //     if (routeName === 'Chat') {
                                    //         setHideCreate(true)
                                    //         return { position: "absolute", height: 0 }
                                    //     }
                                    //     else {
                                    //         setHideCreate(false)
                                    //         return GlobalStyle.tabBar
                                    //     }

                                    // })(route),
                                    headerShown: false,
                                };
                            }}

                        />
                        {userType === "PRO" && <Tab.Screen name="SearchGig" component={SearchGigStack} options={{
                            tabBarIcon: ({ size, focused, color }) => {
                                return (
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
                                            <AddIcon />
                                        </View>
                                    );
                                },
                                headerTitleAlign: 'center',
                                headerTitle: 'Create Gig',
                                tabBarButton: (props) => <CustomTabButton {...props} />
                            }} />
                        }
                    </>
                }
            </Tab.Navigator>
        </>
    )
}
export default TabNavigator
