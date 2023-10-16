import React, { useEffect, useState } from 'react'
import { Alert, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import MarkerIcon from '../../assets/icons/marker.svg'
import { GlobalStyle } from '../../globalStyle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { matchProuserwithgig_id, updateGig } from '../../services/gigService/gigService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import CommanAlertBox from '../../components/CommanAlertBox'
import { useIsFocused } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';

const HelpScreen = ({ route, navigation }: any) => {
    const [matchedprouserList, setmatchedprouserList] = useState([])
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const dispatch = useDispatch()
    const focus = useIsFocused();  // useIsFocused as shown         
    const [gigprofiles, setGigProfiles] = useState<any>()
    const user: any = useSelector((state: RootState) => state.user.user);
    useEffect(() => {
        if (focus) {
            dispatch(setLoading(true))
            matchProuserwithgig_id(route.params.gig_id, firstToken).then((res) => {
                setmatchedprouserList(res)
                dispatch(setLoading(false))
            }).catch((error) => {
                CommanAlertBox({
                    title: 'Error',
                    message: error.message,
                });
                dispatch(setLoading(false))
            })
        }
    }, [focus])
    useEffect(() => {
        const subscriber = firestore()
            .collection('chats')
            .doc(user.user_id)
            .collection('messages')
            .onSnapshot(querySnapshot => {
                querySnapshot.docs.map((doc) => {
                    if (doc.data().gig_id === route.params.gig_id) {
                        setGigProfiles(doc.data())
                        // console.log('doc.data()', doc.data());
                    }
                }
                );

            });

        return () => subscriber();
    }, []);
    const closeGig = () => {
        // console.log(gigprofiles, 'gigprofiles');

        Alert.alert(
            'Confirm',
            '“Are you sure? This gig All data will be deleted.”',
            [
                {
                    text: 'N0',
                    onPress: () => {
                        // Handle the cancel button press
                    },
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        dispatch(setLoading(true));
                        updateGig({ gig_id: route.params.gig_id, status: "inactive" }, firstToken)
                            .then(async (res) => {
                                if (gigprofiles) {
                                    try {
                                        const senderDocRef = firestore()
                                            .collection('chats')
                                            .doc(user.user_id) // sender id
                                            .collection('messages')
                                            .doc(`${gigprofiles.to_useruid}@${route.params.gig_id}`);

                                        const receiverDocRef = firestore()
                                            .collection('chats')
                                            .doc(gigprofiles.to_useruid) // receiver id
                                            .collection('messages')
                                            .doc(`${user.user_id}@${route.params.gig_id}`);

                                        const batch = firestore().batch();

                                        // Use object spread to update the 'status' field
                                        batch.set(senderDocRef, { ...gigprofiles, status: 'inactive' });
                                        batch.set(receiverDocRef, {
                                            ...gigprofiles,
                                            to_userName: user.fname + " " + user.lname,
                                            to_userProfilepic: user.base64_img,
                                            to_useruid: user.user_id,
                                            status: 'inactive'
                                        });

                                        await batch.commit(); // Commit the batch write

                                        Toast.show({
                                            type: 'success',
                                            text1: 'Success',
                                            text2: 'Gig Closed Successfully',
                                        });
                                        navigation.goBack();
                                    } catch (error: any) {
                                        CommanAlertBox({
                                            title: 'Error',
                                            message: error.message,
                                        });
                                    } finally {
                                        dispatch(setLoading(false));
                                    }
                                } else {
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Success',
                                        text2: 'Gig Closed Successfully',
                                    });
                                    navigation.goBack();
                                }

                            })
                            .catch((e) => {
                                CommanAlertBox({
                                    title: 'Error',
                                    message: e.message,
                                });
                                dispatch(setLoading(false));
                            });

                    },
                },
            ],
            {
                cancelable: true,
                onDismiss: () => {
                    // Handle the alert dismissal (e.g., pressing outside the alert)
                },
            }
        );

    };

    return (
        <SafeAreaView >
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>

                    <Text style={[GlobalStyle.blackColor, Style.commanmargin]}>Gig Need Help For</Text>
                    {route.params &&
                        <Pressable onPress={() => navigation.navigate('View-gig', route.params)}>

                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View>
                                    <Image resizeMode={Platform.OS === 'ios' ? 'cover' : 'contain'} style={Style.imageStyle} source={{ uri: route.params.thumbnail_img_url }} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginVertical: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize, { marginHorizontal: 10 }]}>
                                        {route.params?.title}
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16, margin: 10, }]}>
                                        {route.params?.informal_description}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    }
                    <View style={{ marginHorizontal: 30 }}>
                        <Pressable onPress={() => closeGig()} style={[GlobalStyle.button, { backgroundColor: '#000', marginTop: 5 }]}>
                            <Text style={GlobalStyle.btntext}>Close Gig</Text>
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={[GlobalStyle.blackColor, Style.commanmargin]}>Review Pro List</Text>
                        {matchedprouserList?.length > 0 ?
                            matchedprouserList?.map((item: any, i) =>
                                <Pressable onPress={() => route.params.status === 'active' ? navigation.navigate('Single-pro', { user_id: item.user_id, gig_id: route.params.gig_id }) : null} key={i}>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                        <View style={{ padding: 10 }}>
                                            <Image resizeMode='contain' style={Style.profileImg} source={item.base64_img ? { uri: `data:image/jpeg;base64,${item.base64_img}` } : require('../../assets/images/avatar_profile.png')} />
                                        </View>
                                        <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                            <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                                {item.fname + " " + item.lname}
                                            </Text>
                                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                <MarkerIcon />
                                                {/* <Image resizeMode='contain' source={require('../../assets/icons/marker.png')} /> */}
                                                <Text style={{ fontSize: 14 }}>
                                                    &nbsp;{item.city}

                                                </Text>
                                            </View>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                                {item.summary}
                                            </Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )
                            : <View style={{ marginTop: 50 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                                    No matches found
                                </Text>
                            </View>}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const Style = StyleSheet.create({
    localCardStyle: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 0,
        paddingHorizontal: 0,
        alignItems: 'center'
    },
    commanmargin: {
        fontSize: 18,
        marginTop: 10
    },
    commanPaddingFontSize: {
        fontSize: 18,
        paddingTop: 10,
        fontWeight: 'bold'

    },
    imageStyle: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 150,
        width: 100
    },
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
})

export default HelpScreen

function resolve(arg0: boolean) {
    throw new Error('Function not implemented.')
}
