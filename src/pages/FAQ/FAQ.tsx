import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { GlobalStyle } from '../../globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFaq } from '../../services/faqService/faqService';
import { RootState } from '../../redux/store';
import { setLoading } from '../../redux/action/General/GeneralSlice';
import CommanAlertBox from '../../components/CommanAlertBox';


const FAQScreen = () => {
    const [selectedIndex, SetSelectedIndex] = useState(0);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const { userType }: any = useSelector((state: RootState) => state.userType)
    const [creatorFAQs, setCreatorFAQs] = useState([]);
    const [proFAQs, setProFAQs] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        getFAQS()
    }, [userType])
    const getFAQS = () => {
        dispatch(setLoading(true));
        getAllFaq(firstToken).then((res) => {
            // res.map((item: any) => item.image = require('../../assets/images/list1.png'))
            let creatorFAQ = res.filter((item: any) => item.section === "Creator")
            let proFAQ = res.filter((item: any) => item.section === "Pro")
            dispatch(setLoading(false))
            setCreatorFAQs(creatorFAQ);
            setProFAQs(proFAQ)
        }).catch((error) => {
            dispatch(setLoading(false))
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            console.error(JSON.stringify(error));
        })
    }
    return (
        <SafeAreaView>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <View style={{ display: 'flex', alignItems: 'center', paddingTop: 20 }}>
                <SegmentedControl
                    values={['CREATOR', 'PRO']}
                    selectedIndex={selectedIndex}
                    onChange={(event) => {
                        SetSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                    }}
                    backgroundColor='#05E3D5'
                    style={{ width: '80%', height: 40, backgroundColor: "#05E3D5" }}
                    tintColor='#fff'
                    activeFontStyle={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}
                    fontStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}
                />
            </View>
            <ScrollView>
                <View style={[GlobalStyle.container, { marginBottom: 50 }]}>
                    {selectedIndex === 0 ?
                        <>
                            {creatorFAQs.length > 0 ?
                                <>
                                    {creatorFAQs.map((item: any, index) => (
                                        <View key={index}>
                                            <View style={Style.cardContainer}>
                                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>{item?.question}</Text>
                                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                        {item?.answer}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                </> :
                                <View>
                                    <View style={Style.cardContainer}>
                                        {/* <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Creator</Text> */}
                                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                No Data Found.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        </>
                        :
                        <>
                            {proFAQs.length > 0 ?
                                <>
                                    {proFAQs.map((item: any, index) => (
                                        <View key={index}>
                                            <View style={Style.cardContainer}>
                                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>{item?.question}</Text>
                                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                        {item?.answer}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                </> :
                                <View>
                                    <View style={Style.cardContainer}>
                                        {/* <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Creator</Text> */}
                                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                                No Data Found.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        </>
                    }
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const Style = StyleSheet.create({
    cardContainer: { marginBottom: 10 },
    commanFont: {
        fontSize: 18,
        fontWeight: 'bold'
    }

})
export default FAQScreen