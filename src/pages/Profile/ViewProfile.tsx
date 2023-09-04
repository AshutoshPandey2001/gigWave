import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import MicIcon from '../../assets/icons/Mic1.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { backGroundCheck_pro, createProUsers, getProdetailsbyuserid, updateProUsersDetails } from '../../services/proUserService/proUserService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'


const ViewProfileScreen = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const [skillValue, setSkillValue] = useState("")
    const [backgroundCheck, setBackGroudCheck] = useState(false)
    const [payment, setPayment] = useState(false)
    const [interestGigType, setInterestGigType] = useState('unpaid')
    const [alreadyProuser, setalreadyprouser] = useState(false)
    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);

    useEffect(() => {
        dispatch(setLoading(true));
        getProdetailsbyuserid(user.user_id, firstToken).then((res) => {
            setSkillValue(res.raw_skills_text)
            setPayment(res.payments)
            setInterestGigType(res.interest_gig_type)
            setalreadyprouser(true)
            console.log(res, 'pro user details')
            //   navigation.navigate('Home')
            dispatch(setLoading(false));
        }).catch((e) => {
            console.log('error', JSON.stringify(e));
            dispatch(setLoading(false))
        })
    }, [])

    const updateProprofile = (interestgigType: any) => {
        setInterestGigType(interestgigType)
        console.log('calling', interestGigType);

        return new Promise((resolve, reject) => {
            let provalue = {
                "user_id": user.user_id,
                "raw_skills_text": skillValue,
                "interest_gig_type": interestgigType,
            }
            dispatch(setLoading(true))
            if (alreadyProuser) {
                updateProUsersDetails(provalue, firstToken).then((res) => {
                    console.log(res, 'pro user details updated')
                    //   navigation.navigate('Home')
                    dispatch(setLoading(false));
                    resolve(true)
                }).catch((e) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: e,
                    });
                    console.log('error', JSON.stringify(e));
                    dispatch(setLoading(false))
                })
            } else {
                createProUsers(provalue, firstToken).then((res) => {
                    console.log(res, 'pro user details')
                    //   navigation.navigate('Home')
                    dispatch(setLoading(false));
                    resolve(true)
                }).catch((e) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: e,
                    });
                    console.log('error', JSON.stringify(e));
                    dispatch(setLoading(false))
                })
            }

        })
    }

    const backGroundCheck = async () => {
        let userData = await {
            "email": user.email,
            "user_id": user.user_id
        }
        backGroundCheck_pro(userData, firstToken).then((res) => {
            console.log('backGroundCheck', res);
            setBackGroudCheck(res)
        }).catch((e) => {
            console.log(e, 'error');

        })
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container]}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.profileImg, { marginRight: 10 }]}>
                            {/* <Image resizeMode='contain' style={styles.profileImg} source={require('../../assets/images/avatar_profile.png')} /> */}
                            <Image resizeMode='contain' style={[styles.profileImg]} source={user.base64_img ? { uri: `data:image/jpeg;base64,${user.base64_img}` } : require('../../assets/images/avatar_profile.png')} />
                        </View>
                        <Pressable onPress={() => navigation.navigate('Edit-Profile')}>
                            <Text style={styles.editText}>Edit </Text>
                            <Text style={styles.editText}>Profile</Text>
                        </Pressable>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>My Skills or How I Can Help Others</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Type here..."
                                    placeholderTextColor="#fff"
                                    value={skillValue ? skillValue : ''}
                                    editable={true}
                                    onChangeText={(msg: string) => setSkillValue(msg)}
                                    style={{ flex: 1, fontSize: 16, color: '#000' }}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    {/* <Image source={require('../../assets/icons/mic1.png')} /> */}
                                    <MicIcon height={50} width={50} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => updateProprofile(interestGigType)}>
                                <Text style={GlobalStyle.btntext}>Update Skills</Text>
                            </Pressable>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => setPayment(true)}>
                                <Text style={GlobalStyle.btntext}>Enroll to Receive Payments</Text>
                            </Pressable>
                        </View>
                        <View style={styles.btnMargin}>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#000' }]} onPress={() => backGroundCheck()}>
                                <Text style={GlobalStyle.btntext}>{backgroundCheck ? 'Remove Background Check' : 'Add Background Check'}</Text>
                            </Pressable>
                        </View>
                        {
                            !backgroundCheck &&
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 }}>
                                <Text style={{ fontSize: 14, color: '#000' }}>How Does Background Check Work? </Text>
                                <Text style={{ fontSize: 14, color: '#05E3D5' }}>Click here</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Alert</Text>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                            <Pressable style={[GlobalStyle.button, interestGigType === 'paid' ? { backgroundColor: 'lightgray' } : GlobalStyle.button, { padding: 0, marginTop: 0, marginRight: 30 }]} onPress={() => updateProprofile('unpaid')}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>Free</Text>
                            </Pressable>
                            <Pressable style={[GlobalStyle.button, interestGigType === 'unpaid' ? { backgroundColor: 'lightgray' } : GlobalStyle.button, {
                                padding: 0, marginTop: 0
                            }]} onPress={() => updateProprofile('paid')}>
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
    profileImg: {
        height: 80, width: 80,
        borderRadius: 40, // Half of the height or width for a circular effect
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Android shadow
    },
    editText: { color: '#05E3D5', fontSize: 20 },
    btnMargin: { marginTop: 10 }
})