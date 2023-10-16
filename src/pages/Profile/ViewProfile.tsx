import { Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import MicIcon from '../../assets/icons/Mic1.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { backGroundCheck_pro, createProUsers, getProdetailsbyuserid, updateProUsersDetails } from '../../services/proUserService/proUserService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices'
import CommanAlertBox from '../../components/CommanAlertBox'


const ViewProfileScreen = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const [skillValue, setSkillValue] = useState("")
    const [backgroundCheck, setBackGroudCheck] = useState(false)
    const [payment, setPayment] = useState(false)
    const [interestGigType, setInterestGigType] = useState('unpaid')
    const [alreadyProuser, setalreadyprouser] = useState(false)
    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState<string>('');
    const [error, setError] = useState('');
    const isRequired = (value: any) => value.trim() !== '';
    const isWithinRange = (value: any, min: any, max: any) => value.length >= min && value.length <= max;
    useEffect(() => {
        dispatch(setLoading(true));
        getProdetailsbyuserid(user.user_id, firstToken).then((res) => {
            setSkillValue(res.raw_skills_text)
            setPayment(res.payments)
            setInterestGigType(res.interest_gig_type)
            setalreadyprouser(true)
            //   navigation.navigate('Home')
            dispatch(setLoading(false));
        }).catch((e) => {
            CommanAlertBox({
                title: 'Error',
                message: e.message,
            });
            console.log('error', JSON.stringify(e));
            dispatch(setLoading(false))
        })
    }, [])

    const updateProprofile = (interestgigType: any) => {
        setInterestGigType(interestgigType)
        if (error !== '') {
            return
        }

        return new Promise((resolve, reject) => {
            let provalue = {
                "user_id": user.user_id,
                "raw_skills_text": skillValue,
                "interest_gig_type": interestgigType,
            }
            dispatch(setLoading(true))
            if (alreadyProuser) {
                updateProUsersDetails(provalue, firstToken).then((res) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Pro Profile Updated Successfully',
                    });
                    dispatch(setLoading(false));
                    resolve(true)
                }).catch((e) => {
                    CommanAlertBox({
                        title: 'Error',
                        message: e.message,
                    });
                    dispatch(setLoading(false))
                })
            } else {
                createProUsers(provalue, firstToken).then((res) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Pro user Created Successfully',
                    });
                    dispatch(setLoading(false));
                    resolve(true)
                }).catch((e) => {
                    CommanAlertBox({
                        title: 'Error',
                        message: e.message,
                    });
                    console.log('error', JSON.stringify(e));
                    dispatch(setLoading(false))
                })
            }

        })
    }

    const backGroundCheck = async () => {
        dispatch(setLoading(true))
        let userData = await {
            "email": user.email,
            "user_id": user.user_id
        }
        backGroundCheck_pro(userData, firstToken).then((res) => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Background Check Successfully',
            });
            dispatch(setLoading(false))

            setBackGroudCheck(res)
        }).catch((e: any) => {
            dispatch(setLoading(false))
            CommanAlertBox({
                title: 'Error',
                message: e.message,
            });
            console.log(e, 'error');

        })
    }

    const handleInputChange = (msg: any) => {
        setSkillValue(msg);
        setError('');
        if (!isRequired(msg)) {
            setError('This field is required');
        } else if (!isWithinRange(msg, 10, 200)) { // Adjust min and max length as needed
            setError('Skills must be between 10 and 200 characters');
        }
    }
    const startReconding = async () => {

        const granted = await checkPermission();

        if (!granted) {
            // Permissions not granted, return early
            console.log('Permissions not granted');
            return;
        }


        startRecord(setAudioPath, setIsRecording);

    }
    const stopRecording = async () => {
        stopRecord(setIsRecording);
        dispatch(setLoading(true))
        readAudioFile(audioPath)
            .then((base64Data) => {
                if (base64Data) {
                    const audioDataToSend = {
                        audio_base64: base64Data,
                        audio_format: 'mp4', // Set the desired audio format
                    };
                    audioToText(audioDataToSend, firstToken).then((res) => {
                        handleInputChange(res.text)
                        dispatch(setLoading(false))
                    }).catch((error) => {
                        CommanAlertBox({
                            title: 'Error',
                            message: error.message,
                        });
                        // console.error('error', error);
                        dispatch(setLoading(false))
                    })
                }
            })
            .catch((error) => {
                dispatch(setLoading(false))
                CommanAlertBox({
                    title: 'Error',
                    message: error.message,
                });
                console.error('Error reading audio file:', error);
            });
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
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 16 : 0 }]}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Type here..."
                                    placeholderTextColor="#000"
                                    value={skillValue ? skillValue : ''}
                                    editable={true}
                                    onChangeText={(msg: string) => handleInputChange(msg)}
                                    style={{ flex: 1, fontSize: 16, color: '#000' }}
                                />
                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity onPress={isRecording ? stopRecording : startReconding} >
                                        {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 50, height: 50 }} /> : <MicIcon height={50} width={50} />}
                                    </TouchableOpacity>
                                    {/* <Image source={require('../../assets/icons/mic1.png')} /> */}
                                    {/* <MicIcon height={50} width={50} /> */}
                                </View>
                            </View>
                        </View>
                        {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}
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
        // elevation: 2, // Android shadow
    },
    editText: { color: '#05E3D5', fontSize: 20 },
    btnMargin: { marginTop: 10 }
})