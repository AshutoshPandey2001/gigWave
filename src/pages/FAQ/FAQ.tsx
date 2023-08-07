import { View, Text, SafeAreaView, StatusBar, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { GlobalStyle } from '../../globalStyle';


const FAQScreen = () => {
    const [selectedIndex, SetSelectedIndex] = useState(0);
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
                        <View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Creator</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Creating a Gig</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Evaluating Pros</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Paying Pros</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Free vs Paid</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>

                        </View> :
                        <View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Pro</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Searching Gigs</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Paid vs Free</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Paying Pros</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                            <View style={Style.cardContainer}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Benefits of Premium & Background Check</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                            <View style={[Style.cardContainer, { marginBottom: 20 }]}>
                                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Getting Paid</Text>
                                <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 16 }]}>
                                        Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros who
                                    </Text>
                                </View>
                            </View>
                        </View>
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