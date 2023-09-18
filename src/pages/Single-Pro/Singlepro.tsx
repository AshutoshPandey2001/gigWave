import React, { useEffect, useState } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { GlobalStyle } from '../../globalStyle'
import { getProdetailsbyuserid } from '../../services/proUserService/proUserService'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import CommanAlertBox from '../../components/CommanAlertBox'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { getUserByUserID } from '../../services/userService/userServices'

const SingleproScreen = ({ route, navigation }: any) => {
    const [proDetails, setproDetails] = useState<any>()
    const [proUserDetails, setproUserDetails] = useState<any>()
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const dispatch = useDispatch()
    const [profilePic, setProfilePic] = useState<any>()

    useEffect(() => {
        getProuserData()
    }, [])

    const getProuserData = async () => {
        try {
            dispatch(setLoading(true));
            const proDetails = await getProdetailsbyuserid(route.params.user_id, firstToken);
            console.log(proDetails, 'pro user details');
            setproDetails(proDetails);
            const proUserResponse = await getUserByUserID(route.params.user_id, firstToken);
            console.log('res', proUserResponse);
            const dataURI = `data:image/jpeg;base64,${proUserResponse.base64_img}`;
            setProfilePic(dataURI);
            setproUserDetails(proUserResponse);
            dispatch(setLoading(false));
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            dispatch(setLoading(false));
        }
    };




    return (
        <SafeAreaView>
            <ScrollView>
                {
                    proUserDetails ?
                        <View style={[GlobalStyle.container, { marginTop: 0 }]}>
                            <View style={{ marginTop: 0 }}>
                                <View style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <Image style={styles.profileImg} source={profilePic ? { uri: profilePic } : require('../../assets/images/avatar_profile.png')} />
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { marginTop: 70, paddingTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[GlobalStyle.blackColor, { fontWeight: 'bold' }]}>{proUserDetails.fname + " " + proUserDetails.lname}</Text>
                                        <Text>{proUserDetails.address}</Text>
                                        <Text style={{ color: '#989898', marginTop: 5, fontSize: 18, fontStyle: 'italic', fontWeight: 'bold' }}>Background Check {proDetails.background_clear}</Text>
                                    </View>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: -15 }}>
                                    <Pressable style={[GlobalStyle.button, { width: '50%', backgroundColor: '#000', marginRight: 10 }]} onPress={() => navigation.navigate('DirectChat')}>
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
                                        {proDetails.raw_skills_text}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginTop: 10, fontWeight: 'bold' }]}>Company</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        {proDetails.company}
                                    </Text>
                                </View>
                            </View>
                            <Pressable style={[GlobalStyle.button, { backgroundColor: '#FF0000', marginTop: 10 }]}>
                                <Text style={[GlobalStyle.btntext, { fontWeight: 'bold' }]}>I’m Not Interested</Text>
                            </Pressable>
                        </View> : null
                }

            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    profileImg: {
        height: 100,
        width: 100,
        borderRadius: 50, // Half of the height or width for a circular effect
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        position: 'absolute',
        zIndex: 999,
        top: 15,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 2, // Android shadow
    },
})
export default SingleproScreen