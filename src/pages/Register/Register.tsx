import { Formik } from 'formik'
import React from 'react'
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import * as yup from "yup"
import GigwaveIcon from '../../assets/icons/gigwave.svg'
import LockIcon from '../../assets/icons/lock.svg'
import PersonIcon from '../../assets/icons/person.svg'
import { GlobalStyle } from '../../globalStyle'
import { setUser } from '../../redux/action/Auth/authAction'

const RegisterScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const registerSchema = yup.object().shape({
        firstname: yup.string().required('First Name is required'),
        lastname: yup.string().required('Last Name is required'),
        email: yup.string().email("Please enter valid email")
            .required('Email is required'),
        address: yup.string().required('Address is required'),

    })
    const onRegister = (values: any) => {
        console.log('values', values);
        dispatch(setUser(values))
    }
    return (
        <SafeAreaView style={GlobalStyle.safeAreaCotainer}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <View style={GlobalStyle.centerContentPage}>
                    <View style={Style.authContainer}>
                        <GigwaveIcon />
                        {/* <Image source={require('../../assets/images/gigwave.png')} /> */}
                        <Text style={[GlobalStyle.title, { marginTop: 20 }]}>Register</Text>
                        <Text style={{ color: '#949494', marginBottom: 20, fontSize: 18 }}>Please enter your details to register</Text>
                        <Formik
                            initialValues={{
                                firstname: '',
                                lastname: '',
                                email: '',
                                address: ''
                            }}
                            validationSchema={registerSchema}
                            onSubmit={values => onRegister(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                                <View style={{ padding: 10 }}>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <PersonIcon />
                                            {/* <Image source={require('../../assets/icons/person.png')} /> */}
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('firstname')}
                                            onBlur={() => { handleBlur('firstname') }}
                                            value={values.firstname}
                                            placeholder='First Name'
                                        />
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {touched.firstname && errors.firstname &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.firstname}</Text>
                                        }
                                    </View>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <PersonIcon />
                                            {/* <Image source={require('../../assets/icons/person.png')} /> */}
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('lastname')}
                                            onBlur={() => { handleBlur('lastname') }}
                                            value={values.lastname}
                                            placeholder='Last Name'
                                        />
                                    </View>
                                    <View style={{ marginBottom: 10 }}>
                                        {errors.lastname && touched.lastname &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.lastname}</Text>
                                        }
                                    </View>
                                    <View style={[GlobalStyle.fieldwithIcon]}>
                                        <View style={{ marginRight: 10 }}>
                                            <LockIcon />
                                            {/* <Image source={require('../../assets/icons/lock.png')} /> */}
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
                                            {/* <Image source={require('../../assets/icons/lock.png')} /> */}
                                        </View>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('address')}
                                            onBlur={() => { handleBlur('address') }}
                                            value={values.address}
                                            placeholder='Address'
                                        />
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