import moment from 'moment';
import React, { useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ChatScreen = ({ navigation }: any) => {
    const [message, setMessage] = useState('');
    const [result, setResults] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState('')
    const [chats, setChats] = useState([
        { id: 0, message: 'Hi There', time: new Date(), from: 'lala' },
        { id: 1, message: 'Lorem ipsum dolor sit amet consectetur. Leo faucibus integer mi sit morbi.', time: new Date(), from: 'Rev' },
        { id: 1, message: 'Are you ready?', time: new Date(), from: 'Rev' },
        { id: 0, message: 'Yes I am ready', time: new Date(), from: 'lala' },
        { id: 0, message: 'What is the work', time: new Date(), from: 'lala' },
    ])
    const { userType }: any = useSelector((state: RootState) => state.userType)



    useEffect(() => {
        //Setting callbacks for the process status
       
    }, []);

    const onSend = () => {
        console.log(message)
        setMessage('');
        setChats([...chats, { id: 0, message: message, time: new Date(), from: 'lala' }])
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
        
    }
    const stopRecording = async () => {
        
    }

    const RenderChats = () => {
        return (<>
            {chats && chats.length &&
                chats.map((data: any, i) => (
                    <View key={i}>
                        {data.id === 0 &&
                            <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-end' }}>
                                <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                    <View style={{ backgroundColor: '#05E3D5', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                        <View style={{ padding: 15 }}>
                                            <Text style={{ fontSize: 18, color: '#fff' }}> {data.message}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ margin: 5 }}>
                                    <Text style={styles.chatTime}>{moment(data.time).format('HH:mm A')}</Text>
                                </View>
                            </View>

                        }
                        {data.id === 1 &&
                            <View style={{ marginBottom: 25, display: 'flex', alignItems: 'flex-start' }}>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: '#EAEAEA', maxWidth: '80%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                                        <View style={{ padding: 15 }}>
                                            <Text style={{ fontSize: 18, color: '#000' }}> {data.message}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ margin: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {/* {data.from &&
                                        <>
                                            <Text style={[styles.chatTime, { fontWeight: '500' }]}>
                                                {data.from}
                                            </Text>
                                        </>
                                    }
                                    <View style={data.from && { height: 10, backgroundColor: '#A7A7A7', width: 10, borderRadius: 50, marginHorizontal: 5 }}>
                                    </View> */}
                                    <Text style={styles.chatTime}>{moment(data.time).format('HH:mm A')}</Text>
                                </View>
                            </View>
                        }
                    </View>
                ))
            }
        </>)
    }

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 80,padding:20 }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <BackIcon />
                </Pressable>
                <Text style={{ flex: 1, marginLeft: 26, fontSize: 20, color: '#000', fontWeight: 'bold' }}>Chatting with Lala</Text>
            </View>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                    <View>
                        {
                            userType === "CREATOR" &&
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp,
                            {
                                display: 'flex', flexDirection: 'row', paddingVertical: 10,
                                paddingHorizontal: 10
                            }]} >
                                <View>
                                    <Image resizeMode='contain' style={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }} source={require('../../assets/images/piano.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100 }}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginHorizontal: 10, paddingTop: 10, fontWeight: 'bold' }]}>
                                        Play Piano
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, margin: 10, }]}>
                                        Seeking  piano player for two hour family reunion
                                    </Text>
                                </View>
                            </View>
                        }
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp, styles.localCardStyle]}>
                            <View style={styles.imgView}>
                                <Image resizeMode='contain' style={styles.img} source={require('../../assets/images/avatar-1.png')} />
                            </View>
                            <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, paddingTop: 10, fontWeight: 'bold' }]}>
                                    Lala Kian
                                </Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <View>
                                        <MarkerIcon />
                                    </View>
                                    <Text style={{ fontSize: 14 }}>
                                        &nbsp;San Francisco, CA
                                    </Text>
                                </View>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                    Plays piano and violin for events
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <OnlineIcon height={40} width={40} />
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                        <View style={[styles.centerBorder, { left: 40 }]} />
                        <Text style={{ alignSelf: 'center', paddingHorizontal: 5, color: '#d6d6d6', fontSize: 18, fontWeight: 'bold' }}>Chat History</Text>
                        <View style={[styles.centerBorder, { right: 40 }]} />
                    </View>
                    <View style={styles.chatContainer}>
                        <RenderChats />
                    </View>
                </View>
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
                <TouchableOpacity style={styles.btnSend} onPress={startRecognizing} onLongPress={startRecognizing} onPressOut={stopRecording}>
                    <MicIcon height={35} width={35} />
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