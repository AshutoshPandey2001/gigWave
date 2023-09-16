import { useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from "yup"
import GigwaveIcon from '../../assets/icons/gigwave.svg'
import LockIcon from '../../assets/icons/lock.svg'
import PersonIcon from '../../assets/icons/person.svg'
import LocationSearch from '../../components/LocationSearch'
import { GlobalStyle } from '../../globalStyle'
import { setUser } from '../../redux/action/Auth/authAction'
import { RootState } from '../../redux/store'
import { checkUser, createUser } from '../../services/authServices/authServices'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import CommanAlertBox from '../../components/CommanAlertBox'

const RegisterScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const route = useRoute();
    const { mobileNumber } = route.params as { mobileNumber: string };
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const registerSchema = yup.object().shape({
        fname: yup.string().required('First Name is required')
            .min(2, 'First name must be at least 2 characters long')
            .max(20, 'First name must not exceed 20 characters')
            .matches(/^[a-zA-Z0-9\s]*$/, 'Invalid character in first name'),
        lname: yup.string().required('Last Name is required')
            .min(2, 'First name must be at least 2 characters long')
            .max(20, 'First name must not exceed 20 characters')
            .matches(/^[a-zA-Z0-9\s]*$/, 'Invalid character in first name'),
        email: yup.string().email("Please enter valid email")
            .required('Email is required').matches(/@[^.]*\./, "Please enter valid email"),
        address: yup.string().required('Address is required'),

    })
    const onRegister = (values: any) => {
        console.log('values', values);
        checkUser(values.email, mobileNumber, firstToken).then((res) => {
            let response = JSON.parse(JSON.stringify(res))
            console.log('res', response.status)
            if (response.status === 404 || response.status === "404") {
                createUser({ ...values, phone: mobileNumber }, firstToken).then((response: any) => {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Registration Successfully Completed',
                    });
                    dispatch(setUser(response))
                    console.log('Create user data Response:', response);
                }).catch((error) => {
                    CommanAlertBox({
                        title: 'Error',
                        message: error.message,
                    });

                    console.error("registeration error", JSON.stringify(error))
                })
            }
        })


    }
    const [isModalVisible, setModalVisible] = useState(false);

    const closeModel = () => {
        setModalVisible(false)
    }
    return (
        <SafeAreaView style={GlobalStyle.safeAreaCotainer}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={'always'}>
                <View style={GlobalStyle.centerContentPage}>
                    <View style={Style.authContainer}>
                        <GigwaveIcon />
                        <Text style={[GlobalStyle.title, { marginTop: 20 }]}>Register</Text>
                        <Text style={{ color: '#949494', marginBottom: 20, fontSize: 18 }}>Please enter your details to register</Text>
                        <Formik
                            initialValues={{
                                fname: '',
                                lname: '',
                                email: '',
                                address: ''
                            }}
                            validationSchema={registerSchema}
                            onSubmit={values => onRegister(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                                <View style={{ padding: 10 }}>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <PersonIcon />
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('fname')}
                                            onBlur={() => { handleBlur('fname') }}
                                            value={values.fname}
                                            placeholder='First Name'
                                        />
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {touched.fname && errors.fname &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.fname}</Text>
                                        }
                                    </View>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <PersonIcon />
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('lname')}
                                            onBlur={() => { handleBlur('lname') }}
                                            value={values.lname}
                                            placeholder='Last Name'
                                        />
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {errors.lname && touched.lname &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.lname}</Text>
                                        }
                                    </View>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <LockIcon />
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => { handleBlur('email') }}
                                            value={values.email}
                                            keyboardType='email-address'
                                            placeholder='Email'
                                        />
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {errors.email && touched.email &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.email}</Text>
                                        }
                                    </View>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <LockIcon />
                                        </View>
                                        {
                                            isModalVisible &&
                                            <LocationSearch
                                                placeholder="Address"
                                                isModalVisible={isModalVisible}
                                                notifyChange={location => {
                                                    setModalVisible(false);
                                                    setFieldValue('address', location.description)
                                                }}
                                                closeModel={closeModel}
                                            />
                                        }
                                        <View style={{ flex: 1 }}>
                                            {values.address ?
                                                <Text style={{ color: '#000', fontSize: 16 }} onPress={() => setModalVisible(true)}>{values.address ? values.address : ''}</Text>
                                                :
                                                <Text style={{ color: '#a9a9a9', fontSize: 16 }} onPress={() => setModalVisible(true)}>{'Address'}</Text>
                                            }
                                        </View>
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {errors.address && touched.address &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.address}</Text>
                                        }
                                    </View>
                                    <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                        <Text style={GlobalStyle.btntext}>Create Account</Text>
                                    </Pressable>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}
const Style = StyleSheet.create({
    authContainer: {
        height: '100%',
        display: "flex",
        alignItems: "center",
        padding: 20
    },
    footer: {
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row'
    },
    footerText: {
        fontWeight: "bold",
        color: 'black',
        fontSize: 18
    }
})

export default RegisterScreen