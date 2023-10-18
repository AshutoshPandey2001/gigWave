import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalStyle } from '../../globalStyle'
import { RootState } from '../../redux/store'
import { getGigByGig_id, updateGig } from '../../services/gigService/gigService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { checkProItrestedGig, notInterested, proInterestgig } from '../../services/proUserService/proUserService'
import { useIsFocused } from '@react-navigation/native'
import CommanAlertBox from '../../components/CommanAlertBox'
import firestore from '@react-native-firebase/firestore';

const ViewGigScreen = ({ route, navigation }: any) => {
    const { userType }: any = useSelector((state: RootState) => state.userType)
    const user: any = useSelector((state: RootState) => state.user.user);
    const [gigDetails, setGigDetails] = useState<any>()
    const [alreadyIntrest, setAlreadyIntrest] = useState(false)
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [gigprofiles, setGigProfiles] = useState<any>()

    const dispatch = useDispatch()
    const focus = useIsFocused();
    useEffect(() => {
        if (focus) {
            dispatch(setLoading(true));
            getGigsDetails()
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
                    }
                }
                );

            });

        return () => subscriber();
    }, []);
    const getGigsDetails = () => {
        dispatch(setLoading(true));
        getGigByGig_id(route.params.gig_id, firstToken).then((res: any) => {
            setGigDetails(res)
            checkProItrestedGig({
                "gig_id": res.gig_id,
                "pro_id": user.user_id
            }, firstToken).then((rese1: any) => {
                setAlreadyIntrest(rese1.status)
                dispatch(setLoading(false));

            }).catch(error => {
                CommanAlertBox({
                    title: 'Error',
                    message: error.message,
                });
                dispatch(setLoading(false));
            })

        }).catch((error) => {
            dispatch(setLoading(false));
            console.log(error)
        })
    }

    const closeGig = () => {
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
    const gigInterest = () => {
        dispatch(setLoading(true));

        proInterestgig({
            "gig_id": route.params.gig_id,
            "pro_id": user.user_id
        }, firstToken).then((res) => {
            dispatch(setLoading(false));
            if (res?.compatibility == "1") {
                setAlreadyIntrest(true)
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.evaluation_comment,
                });
            } else {
                CommanAlertBox({
                    title: 'Error',
                    message: res?.compatibility === "0"
                        ? `${res.evaluation_comment}\n${res.missing_required_skills.toString()}`
                        : res.evaluation_comment,
                });

            }
        }).catch((error) => {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });

            dispatch(setLoading(false));

            console.log(error, 'error');

        })
    }
    const notInterest = async () => {
        try {
            dispatch(setLoading(true));
            let dataValue = {
                "gig_id": route.params.gig_id,
                "pro_id": user.user_id,
                "archived": true,
                "archived_reason": "pro"
            }
            let res = await notInterested(dataValue, firstToken)
            navigation.goBack();
            dispatch(setLoading(false));
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            dispatch(setLoading(false));
        }
    }
    return (
        <SafeAreaView>
            <ScrollView>
                {
                    gigDetails ?
                        <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image resizeMode='cover' source={{ uri: gigDetails.thumbnail_img_url }} style={{ position: 'absolute', zIndex: 999, top: 0, width: "100%", height: 250 }} />
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { marginTop: 210, paddingTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold', fontSize: 20 }]}>{gigDetails.title ? gigDetails?.title : ''}</Text>
                                        <Text>{gigDetails.address ? gigDetails?.address : ''}</Text>
                                    </View>
                                </View>
                                {userType === "PRO" ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                                    {alreadyIntrest ?
                                        <>
                                            <Pressable style={[GlobalStyle.button, { flex: 1, backgroundColor: '#000', margin: 5, paddingHorizontal: 15 }]} onPress={notInterest}>
                                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 16 }]}>Not Interested</Text>
                                            </Pressable>
                                            <Pressable onPress={() => navigation.navigate('DirectChat', { user_id: gigDetails.user_id, gig_id: gigDetails.gig_id })} style={[GlobalStyle.button, { flex: 1, backgroundColor: '#05E3D5', margin: 5, paddingHorizontal: 10 }]}>
                                                <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold', fontSize: 16 }]}>Message Creator</Text>
                                            </Pressable>
                                        </> :
                                        <Pressable style={[GlobalStyle.button, { flex: 1, backgroundColor: '#000', margin: 5, paddingHorizontal: 10 }]} onPress={() => gigInterest()}>
                                            <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>I’m Interested</Text>
                                        </Pressable>
                                    }
                                </View> : <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                                    <Pressable onPress={() => closeGig()} style={[GlobalStyle.button, { width: '90%', backgroundColor: '#000', marginRight: 10 }]}>
                                        <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 18 }]}>Close Gig</Text>
                                    </Pressable>
                                </View>}

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[GlobalStyle.blackColor, style.headFont]}>Gig profile</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor]}>
                                        {gigDetails.summary ? gigDetails?.summary : 'Clean the house, cook and other various household tasks'}

                                    </Text>
                                </View>
                            </View>
                            {userType === "PRO" ?
                                <>
                                    {
                                        gigDetails.gig_requirement?.length > 0 ?
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={[GlobalStyle.blackColor, style.headFont]}>Gig requirement</Text>
                                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                                    {gigDetails.gig_requirement.map((item: any, index: any) => {
                                                        return (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
                                                                <Text style={{ fontSize: 18, marginRight: 5 }}>•</Text>
                                                                <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                                    {item}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View> : null
                                    }

                                    {
                                        gigDetails.good_to_have_skills?.length > 0 ?
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={[GlobalStyle.blackColor, style.headFont]}>Recommended skills</Text>
                                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                                    {gigDetails.good_to_have_skills.map((item: any, index: any) => {
                                                        return (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
                                                                <Text style={{ fontSize: 18, marginRight: 5 }}>•</Text>
                                                                <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                                    {item}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            </View> : null
                                    }</> : null
                            }


                            <View>
                                <View style={style.space}>
                                    <Text style={[GlobalStyle.blackColor, style.headFont]}>Job Type</Text>
                                    <Text style={[GlobalStyle.blackColor, style.headFont]}>Amount</Text>
                                </View>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp, style.space]}>
                                    <Text style={[GlobalStyle.blackColor]}>
                                        {gigDetails.gig_type ? gigDetails?.gig_type : 'Paid'}
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor]}>
                                        ${gigDetails.budget ? gigDetails?.budget : '0'}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={[GlobalStyle.blackColor, style.headFont]}>Posted On</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor]}>
                                        {/* 10/12/2023 */}
                                        {gigDetails.create_date ? gigDetails?.create_date : '10/12/2023'}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={[GlobalStyle.blackColor, style.headFont]}>Creator</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={{ height: 70, borderRadius: 35, width: 70 }}>
                                        <Image resizeMode='contain' style={style.profileImg} source={{ uri: `data:image/jpeg;base64,${gigDetails.creator_base64_img}` }} />
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 20, margin: 10 }]}>
                                        {gigDetails.creator_fname + ' ' + gigDetails.creator_lname}
                                    </Text>
                                </View>
                            </View>
                        </View> : null
                }
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
    },
    profileImg: {
        height: 70,
        width: 70,
        borderRadius: 40, // Half of the height or width for a circular effect
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
})

export default ViewGigScreen