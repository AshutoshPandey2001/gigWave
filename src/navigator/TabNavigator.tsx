import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import CreategigScreen from '../pages/CreatGig/CreateGig';
import FAQScreen from '../pages/FAQ/FAQ';
import HomeScreen from '../pages/Home/Home';
import MessageScreen from '../pages/Message/Message';




const TabNavigator = () => {
    const Tab = createBottomTabNavigator();
    const CustomTabButton = ({ children, onPress }: any) => (
        <Pressable
            style={{
                top: -45,
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}
            onPress={onPress}
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
    )
    return (
        <Tab.Navigator initialRouteName='Home'
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: 80
                },

            })}
            sceneContainerStyle={{ backgroundColor: '#fff' }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({ size, focused, color }) => {
                    return (
                        <Image
                            resizeMode='contain'
                            style={{ width: 40, height: 40 }}
                            source={require('../assets/icons/home.png')}
                        />
                    );
                },

            }} />
            <Tab.Screen name="Message" component={MessageScreen}
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                resizeMode='contain'
                                style={{ width: 40, height: 40 }}
                                source={require('../assets/icons/message.png')}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen name="FAQ"  component={FAQScreen} options={{
                tabBarIcon: ({ size, focused, color }) => {
                    return (
                        <Image
                            resizeMode='contain'
                            style={{ width: 45, height: 45 }}
                            source={require('../assets/icons/faq.png')}
                        />
                    );
                },
                headerTitle:'How GigWave Works',
                headerTitleStyle:{fontSize:20,fontWeight:'bold'},
                headerTitleAlign:'center'
            }}/>
            <Tab.Screen name="Create" component={CreategigScreen} options={{
                tabBarIcon: ({ size, focused, color }) => {
                    return (
                        <Image
                            style={{ width: 70, height: 70, marginEnd: 10 }}
                            source={require('../assets/icons/add.png')}
                        />
                    );
                },
                tabBarButton: (props) => (
                    <CustomTabButton {...props} />
                )
            }} />
        </Tab.Navigator>
    )
}

export default TabNavigator