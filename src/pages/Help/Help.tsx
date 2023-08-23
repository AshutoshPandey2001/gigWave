import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MarkerIcon from '../../assets/icons/marker.svg'
import { GlobalStyle } from '../../globalStyle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { matchProuserwithgig_id, updateGig } from '../../services/gigService/gigService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

const HelpScreen = ({ route, navigation }: any) => {
    const [matchedprouserList, setmatchedprouserList] = useState([])
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setLoading(true))
        matchProuserwithgig_id(route.params.gig_id, firstToken).then((res) => {
            setmatchedprouserList(res)
            console.log('all gig this user', res);

            dispatch(setLoading(false))
        }).catch((error) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message,
            });
            console.error(JSON.stringify(error));
            dispatch(setLoading(false))
        })
    }, [])

    const closeGig = () => {
        dispatch(setLoading(true));
        updateGig({ gig_id: route.params.gig_id, status: "inactive" }, firstToken)
            .then((res) => {
                console.log(res, 'response update gig');
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Gig Closed Scuuessfully 👋',
                });
                navigation.navigate('Home')
                dispatch(setLoading(false));
            })
            .catch((e) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: e.message,
                });
                console.log('error', JSON.stringify(e));
                dispatch(setLoading(false));
            });
    };
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginTop: 0 }]}>

                    <Text style={[GlobalStyle.blackColor, Style.commanmargin]}>Gig Need Help For</Text>
                    {route.params &&
                        <Pressable onPress={() => navigation.navigate('View-gig', route.params)}>

                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View>
                                    <Image resizeMode='contain' style={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15, height: 120 }} source={route.params?.image} />
                                </View>
                                <View style={{ flex: 1, width: 100 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize, { marginHorizontal: 10 }]}>
                                        {route.params?.title}
                                    </Text>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, margin: 10, }]}>
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
                                <Pressable onPress={() => navigation.navigate('Single-pro')} key={i}>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                        <View style={{ padding: 10 }}>
                                            <Image resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
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
                                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                                    No matches found for the given gig
                                </Text>
                            </View>}
                        {/* <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Lala Kian
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Plays piano and violin for events
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-2.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Marley Vaccaro
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Professional pianist
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Single-pro')}>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, Style.localCardStyle]}>
                                <View style={{ padding: 10 }}>
                                    <Image resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
                                </View>
                                <View style={{ flex: 1, width: 100, marginHorizontal: 10 }}>
                                    <Text style={[GlobalStyle.blackColor, Style.commanPaddingFontSize]}>
                                        Ann Calzoni
                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                        <MarkerIcon />
                                        <Text style={{ fontSize: 14 }}>
                                            &nbsp;San Francisco, CA
                                        </Text>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 14, paddingTop: 5 }]}>
                                        Teaches piano lessons
                                    </Text>
                                </View>
                            </View>
                        </Pressable> */}
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
        paddingVertical: 15,
        paddingHorizontal: 0
    },
    commanmargin: {
        fontSize: 18,
        marginTop: 10
    },
    commanPaddingFontSize: {
        fontSize: 18,
        paddingTop: 10,
        fontWeight: 'bold'

    }
})

export default HelpScreen

function resolve(arg0: boolean) {
    throw new Error('Function not implemented.')
}
