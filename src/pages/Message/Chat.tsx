import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image, SafeAreaView, ScrollView, StyleSheet,
    Text, Pressable,
    TextInput, TouchableOpacity, View, Modal, KeyboardAvoidingView, Platform, Keyboard
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
import UploadPhotosScreen from '../../components/CamaraRoll'
import CloseIcon from '../../assets/icons/close.svg';
import { sendPushNotification } from '../../services/noticationService/notification';
import storage from '@react-native-firebase/storage';

const ChatScreen = ({ route, navigation }: any) => {
    const [message, setMessage] = useState('');
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [gigDetails, setGigDetails] = useState<any>()
    const [toUserDetails, setTouserDetails] = useState<any>()
    const [proDetails, setproDetails] = useState<any>()
    const [audioPath, setAudioPath] = useState<string>('');
    const user: any = useSelector((state: RootState) => state.user.user);
    const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);
    const dispatch = useDispatch()
    const scrollViewRef = useRef<any>();

    const [chats, setChats] = useState<any[]>([

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
            .doc(`${user.user_id}_${userType}`)
            .collection('messages')
            .doc(`${route.params.user_id}@${route.params.gig_id}`)
            .collection('chat')
            .orderBy('time', 'asc')
            .onSnapshot(querySnapshot => {
                const allMessages = querySnapshot.docs.map(doc => (doc.data()));
                setChats(allMessages)
            });

        return () => subscriber();
    }, []);

    useEffect(() => {

        const senderDocRef = firestore()
            .collection('chats')
            .doc(`${user.user_id}_${userType}`)
            .collection('messages')
            .doc(`${route.params.user_id}@${route.params.gig_id}`);

        // Add a snapshot listener to the document
        const subscriber = senderDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data: any = doc.data(); // Existing data
                // Perform your updates on the data here
                data.read = true; // Modify the data as needed

                senderDocRef
                    .set(data)
                    .then(() => {
                        0
                        console.log('Document successfully updated!');
                    })
                    .catch((error) => {
                        console.error('Error updating document: ', error);
                    });
            } else {
                console.log('Document does not exist');
            }
        }, (error) => {
            console.error('Error with the snapshot listener: ', error);
        });

        return () => subscriber();
    }, [])
    const getTouserAndgigDetails = async () => {
        try {
            dispatch(setLoading(true));
            const gigDetailsResponse = await getGigByGig_id(route.params.gig_id, firstToken);
            setGigDetails(gigDetailsResponse);
            const userDetailsResponse = await getUserByUserID(route.params.user_id, firstToken);
            setTouserDetails(userDetailsResponse);
            const proDetails = await getProdetailsbyuserid(route.params.user_id, firstToken);
            setproDetails(proDetails);
            dispatch(setLoading(false));
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            console.error(error);
            dispatch(setLoading(false));
            // Handle the error as needed, e.g., show an error message to the user
        }
    };

    const onSend = async () => {
        if ((message.trim() === '' && (imgUrl === null || imgUrl.trim() === ''))) {
            return;
        }
        setMessage('');
        setImgUrl(null);
        const myMsg: any = {
            id: undefined,
            img: imgUrl,
            message: message,
            time: new Date(),
            from: user.fname
        };
        // Firestore collections and document references
        const senderDocRef = firestore()
            .collection('chats')
            .doc(`${user.user_id}_${userType}`) // sender id
            .collection('messages')
            .doc(`${route.params.user_id}@${gigDetails.gig_id}`);

        const receiverDocRef = firestore()
            .collection('chats')
            .doc(`${route.params.user_id}_${userType === "PRO" ? "CREATOR" : "PRO"}`) // reciver id
            .collection('messages')
            .doc(`${user.user_id}@${gigDetails.gig_id}`);

        const toUserGig = {
            gig_title: gigDetails.title,
            gig_id: gigDetails.gig_id,
            latest_message: myMsg.message,
            latest_messageTime: new Date(),
            img: myMsg.img ? 'Photo' : '',
            to_userName: '',
            to_useruid: '',
            to_userProfilepic: '',
            status: 'active',
            read: false
        }
        // Use a batch write to add messages to both sender and receiver collections
        const batch = firestore().batch();
        batch.set(senderDocRef.collection('chat')
            .doc(), { ...myMsg, id: 0 });
        batch.set(receiverDocRef.collection('chat')
            .doc(), { ...myMsg, id: 1 });
        batch.set(senderDocRef, { ...toUserGig, to_userName: toUserDetails.fname + " " + toUserDetails.lname, to_userProfilepic: toUserDetails.base64_img, to_useruid: toUserDetails.user_id, read: true });
        batch.set(receiverDocRef, { ...toUserGig, to_userName: user.fname + " " + user.lname, to_userProfilepic: user.base64_img, to_useruid: user.user_id, read: false });

        try {
            await batch.commit();
            let fcm_token = userType === "PRO" ? toUserDetails?.device_token : proDetails?.device_token;
            await sendPushNotification(fcm_token, `New Message from ${user.fname} ${user.lname}`, message)
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            console.error('Error sending message: ', error);
        }
    }

    const startRecognizing = async () => {
        const granted = await checkPermission();
        if (!granted) {
            // Permissions not granted, return early
            return;
        }
        startRecord(setAudioPath, setIsRecording);

    }
    const stopRecording = async () => {
        stopRecord(setIsRecording).then((res) => {
            dispatch(setLoading(true))
            readAudioFile(audioPath)
                .then((base64Data) => {
                    if (base64Data) {
                        const audioDataToSend = {
                            audio_base64: base64Data,
                            audio_format: Platform.OS === "ios" ? 'aac' : 'mp4', // Set the desired audio format
                            platform: Platform.OS
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
        })
    }

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openImageModal = (img: string) => {
        setSelectedImage(img);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };
    const closeImage = () => {
        setImgUrl(null);
    };
    const RenderChats = () => {
        return (
            <>
                {chats && chats.length > 0 &&
                    chats.map((data: any, i) => (
                        <View key={i}>
                            {data.id === 0 &&
                                <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-end' }}>
                                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                                        <View style={{ backgroundColor: '#05E3D5', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                            {data.img &&
                                                <View style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
                                                    <TouchableOpacity onPress={() => openImageModal(data.img)}>
                                                        <Image source={{ uri: data.img }} style={{ width: 200, height: 300, borderRadius: 10 }} />
                                                    </TouchableOpacity>
                                                    {/* {data.img ? <Image source={{ uri: data.img }} defaultSource={require('../../assets/images/image.png')} style={{ width: 200, height: 300, borderRadius: 10 }} /> : null} */}
                                                </View>
                                            }
                                            {data.message &&
                                                <View style={{ padding: 15 }}>
                                                    {data.message && <Text style={{ fontSize: 18, color: '#000' }}>{data.message}</Text>}
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    <View style={{ margin: 5 }}>
                                        <Text style={styles.chatTime}>{data.time ? moment(data.time.toDate()).format('hh:mm A') : ''}</Text>
                                    </View>
                                </View>
                            }
                            {data.id === 1 &&
                                <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-start' }}>
                                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                                        <View style={{ backgroundColor: '#EAEAEA', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                            {data.img &&
                                                <View style={{ padding: 5, display: 'flex', alignItems: 'center' }}>
                                                    {data.img && (
                                                        <TouchableOpacity onPress={() => openImageModal(data.img)}>
                                                            <Image source={{ uri: data.img }} style={{ width: 200, height: 300, borderRadius: 10 }} />
                                                        </TouchableOpacity>
                                                    )}
                                                    {/* {data.img && <Image source={{ uri: data.img }}  style={{ width: 200, height: 300, borderRadius: 10 }} />} */}
                                                </View>
                                            }
                                            {data.message &&
                                                <View style={{ padding: 15 }}>
                                                    {data.message && <Text style={{ fontSize: 18, color: '#000' }}>{data.message}</Text>}
                                                </View>}
                                        </View>

                                    </View>
                                    <View style={{ margin: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.chatTime}>{data.time ? moment(data.time.toDate()).format('hh:mm A') : ''}</Text>
                                    </View>
                                </View>
                            }
                            {selectedImage && (
                                <Modal transparent={true} animationType="fade" visible={selectedImage !== null}>
                                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', paddingTop: Platform.OS == 'ios' ? 25 : 0 }}>
                                        <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '90%', resizeMode: 'contain' }} />
                                        <TouchableOpacity style={{ position: 'absolute', top: Platform.OS === "ios" ? 60 : 20, right: 20 }} onPress={closeImageModal}>
                                            <CloseIcon height={30} width={30} fill={"#fff"} />
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            )}

                        </View>
                    ))
                }
            </>
        );
    }
    const closecamaraModel = () => {
        setIscamaraModalVisible(false)
    }
    const opencamaraModel = () => {
        Keyboard.dismiss()
        setIscamaraModalVisible(true)
    }
    const uploadAndSendImage = async (selectedImage: any) => {
        try {
            dispatch(setLoading(true))
            const imageRef = storage().ref(`images/${gigDetails.gig_id}/${selectedImage.fileName}_${Math.floor(Math.random() * new Date().getTime())}`);

            const snapshot = await imageRef.putFile(selectedImage.uri);
            console.log('Image uploaded successfully', snapshot);

            const downloadURL = await imageRef.getDownloadURL();
            console.log('Image downloadURL successfully', downloadURL);
            setImgUrl(downloadURL);
            dispatch(setLoading(false))

        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            dispatch(setLoading(false))

            console.error('Error uploading image:', error);
        }

    }

    return (
        <>

            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ height: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 80, padding: 20 }}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <BackIcon />
                        </Pressable>
                        {toUserDetails &&
                            <Text style={{ flex: 1, marginLeft: 26, fontSize: 20, color: '#000', fontWeight: 'bold' }}>Chatting with {toUserDetails.fname}</Text>
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
                                                    <Image resizeMode='cover' style={styles.img} source={toUserDetails.base64_img ? { uri: `data:image/jpeg;base64,${toUserDetails.base64_img}` } : require('../../assets/images/avatar-1.png')} />
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
                                                        {proDetails.summary}
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

                    <View style={[styles.footer, { height: imgUrl ? 200 : 80 }]}>
                        {imgUrl && (
                            <View style={{ width: '100%' }}>
                                <View style={{
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 15,
                                    padding: 10,
                                    width: '30%',
                                }}>
                                    <View style={{
                                        width: '100%',
                                        aspectRatio: 1, // Create a perfect square
                                        // overflow: 'hidden', // Hide any content outside the square
                                        borderWidth: 2, // Add a border for a circular shape
                                        borderColor: 'white',
                                        borderRadius: 10
                                    }}>

                                        <Image
                                            source={{ uri: imgUrl }}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                resizeMode: 'cover', // Cover the entire circle
                                            }}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: -8,
                                            backgroundColor: 'black',
                                            borderRadius: 50,
                                            width: 28,
                                            height: 28,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={closeImage}
                                    >
                                        <CloseIcon height={15} width={15} fill={"#fff"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <TouchableOpacity style={[styles.btnSend, { paddingRight: 10, paddingLeft: Platform.OS === 'ios' ? 10 : 'auto' }]} onPress={() => opencamaraModel()}>
                                    <CamaraIcon height={30} width={30} />
                                </TouchableOpacity>
                                {
                                    iscamaraModalVisible && <UploadPhotosScreen isVisible={iscamaraModalVisible} onClose={closecamaraModel} uploadFunction={uploadAndSendImage}
                                    />
                                }
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
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btnSend, { paddingRight: Platform.OS === 'ios' ? 10 : 'auto' }]} onPress={isRecording ? stopRecording : startRecognizing} >
                                {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 35, height: 35 }} /> : <MicIcon height={35} width={35} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>

        </>

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
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        // height: 80,
        backgroundColor: '#05E3D5',
        width: '100%',
        alignItems: 'flex-start',
        padding: 10,
        paddingBottom: Platform.OS === "ios" ? 25 : 10
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