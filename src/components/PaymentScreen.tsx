import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, Modal } from 'react-native';
import { useStripe, CardForm, CardFormView, CardField } from '@stripe/stripe-react-native';
import { paymentIntent } from '../services/payment/paymentService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CloseIcon from '../assets/icons/close.svg';
import { GlobalStyle } from '../globalStyle';
import { setLoading } from '../redux/action/General/GeneralSlice';
import CommanAlertBox from './CommanAlertBox';


const PaymentScreen = ({ route, navigation }: any) => {
    const { confirmPayment } = useStripe();
    const [isVisible, setIsVisible] = useState(false)
    const [cardInfo, setCardInfo] = useState<any>(null)
    const dispatch = useDispatch()
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);

    const handlePayment = async () => {
        setIsVisible(true)
    };

    const onClose = () => {
        setIsVisible(false)
    }
    const onConfirm = async () => {
        dispatch(setLoading(true))
        try {
            const intent = await paymentIntent({
                "amount": route.params.amount,
                "currency": "usd",
                "user_id": route.params.user_id
            }, firstToken)
            dispatch(setLoading(true))
            const confirmPaymentIntent = await confirmPayment(intent?.paymentIntent, { paymentMethodType: 'Card' })
            CommanAlertBox({
                title: 'Success',
                message: "Payment Successfully Completed...",
            });
            dispatch(setLoading(false))
            setIsVisible(false)
            navigation.goBack();
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
            dispatch(setLoading(false))
            setIsVisible(false)
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
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={GlobalStyle.title}>Add Card Details</Text>
            </View>
            <CardForm
                defaultValues={{ countryCode: 'US' }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                onFormComplete={(cardDetails) => {
                    console.log('card details', cardDetails);
                    fetchCardDetail(cardDetails)
                }}
                style={{ height: 200, padding: 20, margin: 20 }}
            />
            {/* <CardField
                postalCodeEnabled={false}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    borderColor: '#000',
                    borderWidth: 1,
                }}
                style={{
                    width: '98%',
                    height: 50,
                    borderColor: '#000',
                    padding: 20
                }}
                onCardChange={(cardDetails) => {
                    fetchCardDetail(cardDetails)
                }}

            /> */}
            <Button title="Proceed to Payment" color={'green'} onPress={() => handlePayment()} disabled={!cardInfo} />
            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <View
                        style={{
                            height: '50%',
                            width: '90%', // Adjust the width as needed
                            backgroundColor: 'white',
                            elevation: 5,
                            borderRadius: 15,

                        }}
                    >
                        <View style={{ justifyContent: 'center', left: '22%' }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: "bold" }}>Payment Summary</Text>
                        </View>
                        {cardInfo &&
                            <View style={{ justifyContent: 'center', paddingLeft: 15, top: '30%' }}>
                                <Text style={{ color: 'black', fontSize: 18 }}>Card number :<Text style={{ fontWeight: 'bold' }}>XXXX .... {cardInfo.last4}</Text></Text>
                                <Text style={{ color: 'black', fontSize: 18 }}>MM/YY:<Text style={{ fontWeight: 'bold' }}>{cardInfo.expiryMonth}/{cardInfo.expiryYear}</Text> </Text>
                                <Text style={{ color: 'black', fontSize: 18 }}>Amount: <Text style={{ fontWeight: 'bold' }}>{route.params.amount}</Text></Text>
                            </View>}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                position: 'absolute', // Set the position to absolute
                                bottom: 0, // Place the buttons at the bottom
                                height: 50,
                                width: '100%', // Make sure the buttons span the full width                               
                                paddingBottom: 10
                            }}
                        >

                            <TouchableOpacity onPress={() => onClose()} style={{ backgroundColor: 'red', width: '50%', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onConfirm()} style={{ backgroundColor: 'lightgreen', width: '50%', alignItems: 'center', borderRadius: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

export default PaymentScreen;
