import React, { Ref } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import BackIcon from '../assets/icons/Backbutton.svg';
import { GlobalStyle } from '../globalStyle';

interface PaymentWebViewProps {
    stripeUrl: string,
    setPayment: (payment: any) => void
}
const PaymentWebComponent = ({ setPayment, stripeUrl }: PaymentWebViewProps) => {
    return (
        <Modal style={{ height: '100%' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* <Pressable style={{ margin: 10 }} onPress={() => setPayment(false)}>
                        <BackIcon />
                    </Pressable> */}
                    <WebView
                        style={{ flex: 1 }}
                        // originWhitelist={['*']}
                        source={{ uri: stripeUrl }}
                        onNavigationStateChange={(e) => {
                            console.log('current state', e);
                            if (e.url === 'https://lab.gigwave.app/api/return_url') {
                                setPayment(false)
                            }
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

export default PaymentWebComponent;