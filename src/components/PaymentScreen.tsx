import { CardForm, useStripe } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalStyle } from '../globalStyle';
import { setLoading } from '../redux/action/General/GeneralSlice';
import { RootState } from '../redux/store';
import { paymentIntent } from '../services/payment/paymentService';


const PaymentScreen = ({ route, navigation }: any) => {
    const { confirmPayment } = useStripe();
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [cardInfo, setCardInfo] = useState<any>(null)
    const dispatch = useDispatch()
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [amount, setamount] = useState(route.params.amount);
    const [amountError, setAmountError] = useState('');
    const [paymentConfirmation, setPaymentConfirmation] = useState<any>(null);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState<any>(false);
    const handlePayment = async () => {
        if (!amount)
            setAmountError('Please enter valid amount!')
        else
            setIsVisible(true)
    };

    const onClose = () => {
        setIsVisible(false)
    }
    const onConfirm = async () => {
        setIsVisible(false)
        dispatch(setLoading(true))
        setIsLoading(true)
        try {
            const intent = await paymentIntent({
                "amount": amount * 100,
                "currency": "usd",
                "user_id": route.params.user_id
                // 960c1d18-3d00-11ee-ad60-d629e211ff84
            }, firstToken)
            dispatch(setLoading(true))
            const confirmPaymentIntent = await confirmPayment(intent?.client_secret, { paymentMethodType: 'Card' })
            setPaymentConfirmation(confirmPaymentIntent)
            setIsPaymentSuccess(true)
            console.log('confirmPaymentIntent', confirmPaymentIntent);
            dispatch(setLoading(false))
            setIsLoading(false)
            setTimeout(() => {
                navigation.goBack()
            }, 3000);
        } catch (error: any) {
            // CommanAlertBox({
            //     title: 'Error',
            //     message: error.message,
            // });
            setPaymentConfirmation(error)
            setIsLoading(false)
            setIsPaymentSuccess(false)
            setTimeout(() => {
                navigation.goBack()
            }, 3000);
            dispatch(setLoading(false))
        }
    }
    const fetchCardDetail = (cardDetail: any) => {
        // console.log("my card details",cardDetail)
        if (cardDetail.complete) {
            setCardInfo(cardDetail)
            console.log('cardDetail', cardDetail);
        } else {
            setCardInfo(null)
        }
    }
    return (
        <View style={{ flex: 1 }}>
            {
                paymentConfirmation ?
                    <>
                        {isPaymentSuccess ?
                            <>
                                <View style={{ top: '20%' }}>
                                    <View >
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../assets/images/payment_success.gif')} style={{ width: 250, height: 250 }} resizeMode='contain' />
                                            <Text style={{ color: 'black', fontSize: 20, margin: 2, fontWeight: 'bold' }}>
                                                Payment Successfull...
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </>
                            :
                            <>
                                <View style={{ top: '20%' }}>
                                    <View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../assets/images/payment_failed.gif')} style={{ width: 250, height: 250 }} resizeMode='contain' />
                                            <Text style={{ color: 'red', fontSize: 20, margin: 2, fontWeight: 'bold' }}>
                                                Payment Failed...
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        }

                    </> :
                    <>
                        <View style={[Style.inputField]}>
                            <Text style={Style.inputLabel}>Amount</Text>
                            <TextInput
                                onChangeText={(amt: any) => {
                                    setamount(amt)
                                    if (amt)
                                        setAmountError('')
                                    else
                                        setAmountError('Please enter valid amount!')
                                }}
                                autoFocus={true}
                                placeholder='0.00'
                                value={amount}
                                keyboardType='numeric'
                                placeholderTextColor={'#05E3D5'}
                                style={{ fontSize: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 11, color: '#000' }}
                            />
                        </View>
                        {amountError &&
                            <View>
                                <Text style={[GlobalStyle.errorMsg,{paddingStart:25}]}>{amountError}</Text>
                            </View>
                        }
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={GlobalStyle.title}>Add Card Details</Text>
                        </View>
                        <CardForm
                            defaultValues={{ countryCode: 'US' }}
                            cardStyle={{
                                backgroundColor: '#FFFFFF',
                                textColor: '#000000',
                                placeholderColor: '#05E3D5'

                            }}
                            placeholders={{
                                number: '**** **** **** 4242',
                            }}
                            onFormComplete={(cardDetails) => {
                                console.log('card details', cardDetails);
                                fetchCardDetail(cardDetails)
                            }}
                            style={{ height: '45%', padding: 20, margin: 20, marginBottom: 0 }}
                        />
                        <Pressable style={[GlobalStyle.button, { marginHorizontal: 20, marginTop: 0 }]} disabled={!cardInfo} onPress={() => handlePayment()}>
                            <Text style={GlobalStyle.btntext}>Proceed to Payment</Text>
                        </Pressable>
                    </>
            }



            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
                onPointerDown={onClose}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{
                        height: Platform.OS === 'ios' ? '35%' : '40%',
                        width: "100%",
                        backgroundColor: 'white',
                        elevation: 5,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,

                    }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#05E3D5' }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: "bold" }}>Payment Summary</Text>
                        </View>
                        {cardInfo && (
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', padding: 15 }}>
                                <Text style={{ color: 'black', fontSize: 18, margin: 2 }}>
                                    Card number: <Text style={{ fontWeight: 'bold' }}>XXXX .... {cardInfo.last4}</Text>
                                </Text>
                                <Text style={{ color: 'black', fontSize: 18, margin: 2 }}>
                                    Expiry Date: <Text style={{ fontWeight: 'bold' }}>{cardInfo.expiryMonth}/{cardInfo.expiryYear}</Text>
                                </Text>
                                <Text style={{ color: 'black', fontSize: 18, margin: 2 }}>
                                    Paid to: <Text style={{ fontWeight: 'bold' }}>{route.params.payeeName}</Text>
                                </Text>
                                <Text style={{ color: 'black', fontSize: 18, margin: 2 }}>
                                    Gig name: <Text style={{ fontWeight: 'bold' }}>{route.params.gigTitle}</Text>
                                </Text>
                            </View>
                        )}

                        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12 }}>
                            <Pressable
                                onPress={() => onConfirm()}
                                style={{ backgroundColor: '#3371FF', borderRadius: 10, margin: 10, padding: 10, width: '50%', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Text style={[GlobalStyle.btntext, { color: 'white' }]}>Pay (${amount})</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
const Style = StyleSheet.create({
    inputField: {
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        fontSize: 16,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 20
    },
    inputLabel: { color: '#000', fontSize: 16 }
})
export default PaymentScreen;
