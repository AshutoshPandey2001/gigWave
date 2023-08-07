import { View, Text, SafeAreaView, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../../globalStyle'
import HeaderProfile from '../../components/HeaderProfile'

const SingleproScreen = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                    {/* <View style={[GlobalStyle.headerLeft, { margin: 0 }]}>
                        <HeaderProfile />
                    </View> */}
                    <View style={{ marginTop: 50 }}>
                        <View style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <Image source={require('../../assets/images/avatar-3.png')} style={{ position: 'absolute', zIndex: 999, top: 15 }} />
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { marginTop: 70, paddingTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold' }]}>Kaiya Vetrovs</Text>
                                <Text>San Francisco, CA</Text>
                                <Text style={{ color: '#989898', marginTop: 5, fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' }}>Background Check Completed</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                            <Pressable style={[GlobalStyle.button, { width: '50%', backgroundColor: '#000', marginRight: 10 }]}>
                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>Message Pro</Text>
                            </Pressable>
                            <Pressable style={[GlobalStyle.button, { width: '50%' }]}>
                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>Pay Pro</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginTop: 10, fontWeight: 'bold' }]}>Review Pro List</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                Lorem ipsum dolor sit amet consectetur. Vestibulum nibh aliquet mattis arcu pretium neque orci. Faucibus risus eleifend.
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginTop: 10, fontWeight: 'bold' }]}>Company</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                ABC Pvt. Ltd.
                            </Text>
                        </View>
                    </View>
                    <Pressable style={[GlobalStyle.button, { backgroundColor: '#FF0000', marginTop: 10 }]}>
                        <Text style={[GlobalStyle.btntext, { fontWeight: 'bold' }]}>I’m Not Interested</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SingleproScreen