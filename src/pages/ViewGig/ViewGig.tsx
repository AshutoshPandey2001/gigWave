import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalStyle } from '../../globalStyle'
import { RootState } from '../../redux/store'
import { getGigByGig_id, updateGig } from '../../services/gigService/gigService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { checkProItrestedGig, proInterestgig } from '../../services/proUserService/proUserService'
import { useIsFocused } from '@react-navigation/native'
import CommanAlertBox from '../../components/CommanAlertBox'

const ViewGigScreen = ({ route, navigation }: any) => {
    const { userType }: any = useSelector((state: RootState) => state.userType)
    const user: any = useSelector((state: RootState) => state.user.user);
    const [gigDetails, setGigDetails] = useState<any>()
    const [alreadyIntrest, setAlreadyIntrest] = useState(false)
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const dispatch = useDispatch()
    const focus = useIsFocused();
    useEffect(() => {
        if (focus) {
            dispatch(setLoading(true));

            getGigsDetails()
        }
    }, [focus])
    const getGigsDetails = () => {
        dispatch(setLoading(true));
        getGigByGig_id(route.params.gig_id, firstToken).then((res: any) => {
            console.log(res, 'gig details response');
            setGigDetails(res)
            checkProItrestedGig({
                "gig_id": res.gig_id,
                "pro_id": user.user_id
            }, firstToken).then((rese1: any) => {
                console.log('rese1 already intrested', rese1);
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
        dispatch(setLoading(true));

        updateGig({ gig_id: route.params.gig_id, status: "inactive" }, firstToken)
            .then((res) => {
                console.log(res, 'response update gig');
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Gig Closed Successfully',
                });
                navigation.navigate('Home');
                dispatch(setLoading(false));
            })
            .catch((e) => {
                CommanAlertBox({
                    title: 'Error',
                    message: e.message,
                });
                dispatch(setLoading(false));
            });
    };
    const gigInterest = () => {
        dispatch(setLoading(true));

        proInterestgig({
            "gig_id": route.params.gig_id,
            "pro_id": user.user_id
        }, firstToken).then((res) => {
            console.log('Interest gig response', res);
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
    return (
        <SafeAreaView>
            <ScrollView>
                {
                    gigDetails ?
                        <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                            {/* <View style={[GlobalStyle.headerLeft, { margin: 0 }]}>
                        <HeaderProfile />
                    </View> */}
                            {/* <View style={{ marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 22, fontWeight: 'bold' }]}>Gig</Text>
                            </View> */}
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
                                            <Pressable style={[GlobalStyle.button, { flex: 1, backgroundColor: '#000', margin: 5, paddingHorizontal: 15 }]}>
                                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold', fontSize: 16 }]}>Not Interested</Text>
                                            </Pressable>
                                            <Pressable onPress={() => navigation.navigate('DirectChat')} style={[GlobalStyle.button, { flex: 1, backgroundColor: '#05E3D5', margin: 5, paddingHorizontal: 10 }]}>
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
                                                            <Text style={[GlobalStyle.blackColor]} key={index}>
                                                                {item}
                                                            </Text>
                                                        )

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
                                                            <Text style={[GlobalStyle.blackColor]} key={index}>
                                                                {item}
                                                            </Text>
                                                        )
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