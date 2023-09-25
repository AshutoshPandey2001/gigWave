import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image, SafeAreaView, ScrollView, StyleSheet,
    Text, Pressable,
    TextInput, TouchableOpacity, View
} from 'react-native';
import MicIcon from '../../assets/icons/Mic.svg';
import CamaraIcon from '../../assets/icons/camera.svg';
import MarkerIcon from '../../assets/icons/marker.svg';
import SendIcon from '../../assets/icons/send.svg';
import OnlineIcon from '../../assets/icons/online.svg';
import BackIcon from '../../assets/icons/Backbutton.svg';
import { GlobalStyle } from '../../globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices';
import { setLoading } from '../../redux/action/General/GeneralSlice';
import { getUserByUserID } from '../../services/userService/userServices';
import { getGigByGig_id } from '../../services/gigService/gigService';
import CommanAlertBox from '../../components/CommanAlertBox';
import { getProdetailsbyuserid } from '../../services/proUserService/proUserService';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ route, navigation }: any) => {
    const [message, setMessage] = useState('');
    const [result, setResults] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [gigDetails, setGigDetails] = useState<any>()
    const [toUserDetails, setTouserDetails] = useState<any>()
    const [proDetails, setproDetails] = useState<any>()
    const [audioPath, setAudioPath] = useState<string>('');
    const user: any = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch()
    const scrollViewRef = useRef<any>();

    const [chats, setChats] = useState<any[]>([
        // { id: 0, message: 'Hi There', time: new Date(), from: 'lala' },
        // { id: 1, message: 'Lorem ipsum dolor sit amet consectetur. Leo faucibus integer mi sit morbi.', time: new Date(), from: 'Rev' },
        // { id: 1, message: 'Are you ready?', time: new Date(), from: 'Rev' },
        // { id: 0, message: 'Yes I am ready', time: new Date(), from: 'lala' },
        // { id: 0, message: 'What is the work', time: new Date(), from: 'lala' },
    ])
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const { userType }: any = useSelector((state: RootState) => state.userType)



    useEffect(() => {
        dispatch(setLoading(true));
        getTouserAndgigDetails()
        checkPermission()
    }, []);
    useEffect(() => {
        const subscriber = firestore()
            .collection('chats')
            .doc(user.user_id)
            .collection('messages')
            .doc(`${route.params.user_id}`)
            .collection('chat')
            .orderBy('time', 'asc')
            .onSnapshot(querySnapshot => {
                const allMessages = querySnapshot.docs.map(doc => (doc.data()));
                setChats(allMessages)
            });

        return () => subscriber();
    }, []);


    const getTouserAndgigDetails = async () => {
        try {
            dispatch(setLoading(true));
            const gigDetailsResponse = await getGigByGig_id(route.params.gig_id, firstToken);
            setGigDetails(gigDetailsResponse);
            const userDetailsResponse = await getUserByUserID(route.params.user_id, firstToken);
            setTouserDetails(userDetailsResponse);
            if (userType === "CREATOR") {
                const proDetails = await getProdetailsbyuserid(route.params.user_id, firstToken);
                setproDetails(proDetails);
            }
            dispatch(setLoading(false));
        } catch (error) {
            console.error(error);
            dispatch(setLoading(false));
            // Handle the error as needed, e.g., show an error message to the user
        }
    };

    const onSend = async () => {
        if (message.trim() === '') {
            // Message is blank, don't send it
            return;
        }
        setMessage('');
        const myMsg: any = {
            id: undefined,
            message: message,
            time: new Date(),
            from: user.fname
        };



        // Firestore collections and document references
        const senderDocRef = firestore()
            .collection('chats')
            .doc(`${user.user_id}`) // sender id
            .collection('messages')
            .doc(`${route.params.user_id}`);

        const receiverDocRef = firestore()
            .collection('chats')
            .doc(`${route.params.user_id}`) // reciver id
            .collection('messages')
            .doc(`${user.user_id}`);

        const toUserGig = {
            gig_title: gigDetails.title,
            gig_id: gigDetails.gig_id,
            latest_message: myMsg.message,
            latest_messageTime: new Date(),
            to_userName: '',
            to_useruid: '',
            to_userProfilepic: '',
        }
        // Use a batch write to add messages to both sender and receiver collections
        const batch = firestore().batch();
        batch.set(senderDocRef.collection('chat')
            .doc(), { ...myMsg, id: 0 });
        batch.set(receiverDocRef.collection('chat')
            .doc(), { ...myMsg, id: 1 });
        batch.set(senderDocRef, { ...toUserGig, to_userName: toUserDetails.fname + " " + toUserDetails.lname, to_userProfilepic: toUserDetails.base64_img, to_useruid: toUserDetails.user_id });
        batch.set(receiverDocRef, { ...toUserGig, to_userName: user.fname + " " + user.lname, to_userProfilepic: user.base64_img, to_useruid: user.user_id });

        try {
            await batch.commit();
        } catch (error) {

            console.error('Error sending message: ', error);
        }
    }
    const onSpeechResults = (e: any) => {
        //Invoked when SpeechRecognizer is finished recognizing
        console.log('onSpeechResults: ', e);
        if (e.value && e.value.length) {
            setResults(e.value);
            setMessage(e.value[0])
        }
    };

    const startRecognizing = async () => {
        const granted = await checkPermission();
        if (!granted) {
            // Permissions not granted, return early
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
                        setMessage(res.text)
                        dispatch(setLoading(false))
                    }).catch((error) => {
                        console.error('error', error);
                        dispatch(setLoading(false))
                    })
                }
            })
            .catch((error) => {
                dispatch(setLoading(false))
                console.error('Error reading audio file:', error);
            });
    }

    const RenderChats = () => {
        return (
            <>
                {chats && chats.length > 0 &&
                    chats.map((data: any, i) => (
                        <View key={i}>
                            {data.id === 0 &&
                                <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-end' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        <View style={{ backgroundColor: '#05E3D5', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                            <View style={{ padding: 15 }}>
                                                <Text style={{ fontSize: 18, color: '#fff' }}>{data.message}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ margin: 5 }}>
                                        <Text style={styles.chatTime}>{data.time ? moment(data.time.toDate()).format('HH:mm A') : ''}</Text>
                                    </View>
                                </View>
                            }
                            {data.id === 1 &&
                                <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-start' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <View style={{ backgroundColor: '#EAEAEA', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ padding: 15 }}>
                                                <Text style={{ fontSize: 18, color: '#000' }}>{data.message}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ margin: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.chatTime}>{data.time ? moment(data.time.toDate()).format('HH:mm A') : ''}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    ))
                }
            </>
        );
    }


    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 80, padding: 20 }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <BackIcon />
                </Pressable>
                {toUserDetails &&
                    <Text style={{ flex: 1, marginLeft: 26, fontSize: 20, color: '#000', fontWeight: 'bold' }}>Chatting with {toUserDetails.fname + " " + toUserDetails.lname}</Text>
                }
            </View>
            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    // Scroll to the end when content size changes (new content is added)
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }}
            >
                {gigDetails &&
                    <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                        <View>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                                display: 'flex', flexDirection: 'row', paddingVertical: 10,
                                paddingHorizontal: 10
                            }]}>
                                <View>
                                    <Image resizeMode='contain' style={styles.imageStyle}
                                        defaultSource={require('../../assets/images/image.png')}
                                        source={gigDetails.thumbnail_img_url ? { uri: gigDetails.thumbnail_img_url } : require('../../assets/images/piano.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100 }}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginHorizontal: 10, paddingTop: 10, fontWeight: 'bold' }]}>
                                        {gigDetails.title}
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, margin: 10, }]}>
                                        {gigDetails.summary}
                                    </Text>
                                </View>
                            </View>
                            {
                                toUserDetails && proDetails && userType === "CREATOR" && (
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, styles.localCardStyle]}>
                                        <View style={styles.imgView}>
                                            <Image resizeMode='contain' style={styles.img} source={toUserDetails.base64_img ? { uri: `data:image/jpeg;base64,${toUserDetails.base64_img}` } : require('../../assets/images/avatar-1.png')} />
                                        </View>
                                        <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 18, paddingTop: 10, fontWeight: 'bold' }]}>
                                                {toUserDetails.fname + " " + toUserDetails.lname}
                                            </Text>
                                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                <View>
                                                    <MarkerIcon />
                                                </View>
                                                <Text style={{ fontSize: 14 }}>
                                                    &nbsp;{toUserDetails.address}
                                                </Text>
                                            </View>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                                {proDetails.raw_skills_text}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'center' }}>
                                            <OnlineIcon height={40} width={40} />
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <View style={[styles.centerBorder, { left: 40 }]} />
                            <Text style={{ alignSelf: 'center', paddingHorizontal: 5, color: '#d6d6d6', fontSize: 18, fontWeight: 'bold' }}>Chat History</Text>
                            <View style={[styles.centerBorder, { right: 40 }]} />
                        </View>
                        <View style={styles.chatContainer}>
                            <RenderChats />
                        </View>
                    </View>}
            </ScrollView>
            <View style={styles.footer}>
                <View>
                    <TouchableOpacity style={[styles.btnSend, { paddingRight: 10 }]} onPress={() => console.log('send')}>
                        <CamaraIcon height={30} width={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Type here..."
                        placeholderTextColor="#fff"
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        returnKeyType='send'
                        value={message ? message : ''}
                        onChangeText={(msg: string) => setMessage(msg)}
                        onSubmitEditing={() => onSend()}
                        blurOnSubmit={false}
                    />
                </View>
                <TouchableOpacity style={[styles.btnSend, { paddingRight: 10 }]} onPress={() => onSend()}>
                    <SendIcon fill={'#fff'} height={30} width={30} />
                    {/* <Image style={{ height: 30, width: 30 }} resizeMode='contain'
                        source={require('../../assets/icons/send.png')}
                    /> */}
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSend} onPress={isRecording ? stopRecording : startRecognizing} >
                    {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 35, height: 35 }} /> : <MicIcon height={35} width={35} />}
                </TouchableOpacity>
            </View>



        </SafeAreaView >

    )
}

export default ChatScreen

const styles = StyleSheet.create({
    localCardStyle: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    imageStyle: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 100,
        width: 90
    },
    imgView: {
        height: 72, width: 72, borderRadius: 36
    },
    img: {
        height: 70,
        width: 70,
        borderRadius: 35,
        borderWidth: 2
    },
    centerBorder: {
        alignSelf: 'center',
        position: 'absolute',
        borderBottomColor: '#d6d6d6',
        borderBottomWidth: 2,
        height: '50%',
        width: '20%'
    },
    footer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        height: 80,
        backgroundColor: '#05E3D5',
        width: '100%',
        alignItems: 'center',
        padding: 10
    },
    footer_img: {
        flexDirection: 'row',
        minHeight: 80,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        padding: 5,
        paddingTop: 10
    },
    btnSend: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 5,
    },
    inputs: {
        height: 40,
        marginLeft: 10,
        borderBottomColor: '#FFFFFF',
        flex: 1,
        color: '#fff',
        fontSize: 18
    },
    chatContainer: {
        marginVertical: 10,
    },
    chatTime: {
        color: '#A7A7A7',
        fontSize: 16
    }


})