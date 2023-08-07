import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GlobalStyle } from '../../globalStyle'
import HeaderProfile from '../../components/HeaderProfile'
import MarkerIcon from '../../assets/icons/marker.svg';

const HelpScreen = ({ route, navigation }: any) => {
    // const [params, setParams] = useState({})

    useEffect(() => {
        // let param:any=route.params
        // setParams(param)
    }, [])
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                    <View style={[GlobalStyle.headerLeft, { margin: 0 }]}>
                        <HeaderProfile />
                    </View>
                    <Text style={[GlobalStyle.blackColor, Style.commanmargin]}>Gig Need Help For</Text>
                    {route.params &&
                        <Pressable onPress={() => navigation.navigate('View-gig')}>

                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View>
                                    <Image resizeMode='contain' style={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15, height: 120 }} source={route.params?.image} />
                                </View>
                                <View style={{ flex: 1, width: 100 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize, { marginHorizontal: 10 }]}>
                                        {route.params?.title}
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, margin: 10, }]}>
                                        {route.params?.msg}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    }
                    <View style={{ marginHorizontal: 30 }}>
                        <Pressable style={[GlobalStyle.button, { backgroundColor: '#000', marginTop: 5 }]}>
                            <Text style={GlobalStyle.btntext}>Close Gig</Text>
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={[GlobalStyle.blackColor, Style.commanmargin]}>Review Pro List</Text>
                        <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Lala Kian
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        {/* <Image resizeMode='contain' source={require('../../assets/icons/marker.png')} /> */}
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Plays piano and violin for events
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-2.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Marley Vaccaro
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        {/* <Image resizeMode='contain' source={require('../../assets/icons/marker.png')} /> */}
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Professional pianist
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Ann Calzoni
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        {/* <Image resizeMode='contain' source={require('../../assets/icons/marker.png')} /> */}
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Teaches piano lessons
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const Style = StyleSheet.create({
    localCardStyle: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    commanmargin: {
        fontSize: 18,
        marginTop: 10
    },
    commanPaddingFontSize: {
        fontSize: 18,
        paddingTop: 10,
        fontWeight: 'bold'

    }
})

export default HelpScreen