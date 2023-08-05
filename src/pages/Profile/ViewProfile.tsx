import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import MicIcon from '../../assets/icons/Mic.svg'


const ViewProfileScreen = ({ navigation }: any) => {
    const [skillValue, setSkillValue] = useState("I do clean the house, cook and other various household tasks.  I also play the piano and violin at weddings.")
    const [backgroundCheck, setBackGroudCheck] = useState(false)

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container]}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.profileImg, { marginRight: 10 }]}>
                            <Image resizeMode='contain' style={styles.profileImg} source={require('../../assets/images/avatar_profile.png')} />
                        </View>
                        <Pressable onPress={() => navigation.navigate('Edit-Profile')}>
                            <Text style={styles.editText}>Edit </Text>
                            <Text style={styles.editText}>Profile</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 16, fontWeight: 'bold' }]}>My Skills or How I Can Help Others</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Type here..."
                                    placeholderTextColor="#fff"
                                    value={skillValue ? skillValue : ''}
                                    editable={false}
                                    onChangeText={(msg: string) => setSkillValue(msg)}
                                    style={{ flex: 1, fontSize: 14, color: '#000' }}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {/* <Image source={require('../../assets/icons/mic1.png')} /> */}
                                    <MicIcon height={80} width={80} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => console.log('add skill')}>
                                <Text style={GlobalStyle.btntext}>Update Skills</Text>
                            </Pressable>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => console.log('add skill')}>
                                <Text style={GlobalStyle.btntext}>Enroll to Receive Payments</Text>
                            </Pressable>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => backgroundCheck ? setBackGroudCheck(false) : setBackGroudCheck(true)}>
                                <Text style={GlobalStyle.btntext}>{backgroundCheck ? 'Remove Background Check' : 'Add Background Check'}</Text>
                            </Pressable>
                        </View>
                        {
                            !backgroundCheck &&
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                                <Text style={{ fontSize: 12, color: '#000' }}>How Does Background Check Work? </Text>
                                <Text style={{ fontSize: 12, color: '#05E3D5' }}>Click here</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 16, fontWeight: 'bold' }]}>Alert</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: 'lightgrey', padding: 0, marginTop: 0, marginRight: 30 }]} onPress={() => console.log('add skill')}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>Free</Text>
                            </Pressable>
                            <Pressable style={[GlobalStyle.button, { padding: 0, marginTop: 0 }]} onPress={() => console.log('add skill')}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>Paid</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewProfileScreen

const styles = StyleSheet.create({
    cardContainer: { marginTop: 20, marginBottom: 10 },
    profileImg: { height: 80, width: 80 },
    editText: { color: '#05E3D5', fontSize: 18 },
    btnMargin: { marginTop: 10 }
})