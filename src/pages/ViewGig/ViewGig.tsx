import React from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { GlobalStyle } from '../../globalStyle'
import { RootState } from '../../redux/store'

const ViewGigScreen = ({ route, navigation }: any) => {
    const { userType }: any = useSelector((state: RootState) => state.userType)
    console.log(route.params);
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                    {/* <View style={[GlobalStyle.headerLeft, { margin: 0 }]}>
                        <HeaderProfile />
                    </View> */}
                    <View style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 22, fontWeight: 'bold' }]}>Gig</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ display: 'flex', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/baby.png')} style={{ position: 'absolute', zIndex: 999, top: 0 }} />
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { marginTop: 90, paddingTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold' }]}>Part-time Childcare</Text>
                                <Text>San Francisco, CA</Text>
                            </View>
                        </View>
                        {userType === "PRO" ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                            {route.params && route.params?.isProList ?
                                <>
                                    <Pressable style={[GlobalStyle.button, { flex: 1, backgroundColor: '#000', margin: 5, paddingHorizontal: 15 }]}>
                                        <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 16 }]}>Not Interested</Text>
                                    </Pressable>
                                    <Pressable onPress={() => navigation.navigate('DirectChat')} style={[GlobalStyle.button, { flex: 1, backgroundColor: '#05E3D5', margin: 5, paddingHorizontal: 10 }]}>
                                        <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold', fontSize: 16 }]}>Message Creator</Text>
                                    </Pressable>
                                </> :
                                <Pressable style={[GlobalStyle.button, { flex: 1, backgroundColor: '#000', margin: 5, paddingHorizontal: 10 }]}>
                                    <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>I’m Interested</Text>
                                </Pressable>
                            }
                        </View> : <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                            <Pressable style={[GlobalStyle.button, { width: '90%', backgroundColor: '#000', marginRight: 10 }]}>
                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>Close Gig</Text>
                            </Pressable>
                        </View>}

                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={[GlobalStyle.blackColor, style.headFont]}>Gig profile</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                            <Text style={[GlobalStyle.blackColor]}>
                                Clean the house, cook and other various household tasks.
                            </Text>
                        </View>
                    </View>
                    <View>
                        <View style={style.space}>
                            <Text style={[GlobalStyle.blackColor, style.headFont]}>Job Type</Text>
                            <Text style={[GlobalStyle.blackColor, style.headFont]}>Amount</Text>
                        </View>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, style.space]}>
                            <Text style={[GlobalStyle.blackColor]}>
                                Paid
                            </Text>
                            <Text style={[GlobalStyle.blackColor]}>
                                $100
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[GlobalStyle.blackColor, style.headFont]}>Posted On</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                            <Text style={[GlobalStyle.blackColor]}>
                                10/12/2023
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[GlobalStyle.blackColor, style.headFont]}>Creator</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={{ height: 70, borderRadius: 35, width: 70 }}>
                                <Image resizeMode='contain' style={{ height: 70, width: 70 }} source={require('../../assets/images/avatar-3.png')} />
                            </View>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 20, margin: 10 }]}>
                                Kaiya Vetrovs
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    space: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    headFont: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold'
    }
})

export default ViewGigScreen