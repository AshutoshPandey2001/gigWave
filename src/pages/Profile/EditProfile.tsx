import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import * as yup from "yup"
import { Formik } from 'formik'
import LocationSearch from '../../components/LocationSearch'

const EditProfileScreen = () => {
    const Schema = yup.object().shape({
        firstname: yup.string().required('First Name is required'),
        lastname: yup.string().required('Last Name is required'),
        email: yup.string().email("Please enter valid email")
            .required('Email is required').matches(/@[^.]*\./, "Please enter valid email"),
        phone: yup.string().required('Phone number is required')
            .min(10, 'Phone number must be 10 digit number')
            .max(10, 'Phone number must be 10 digit number'),
        address: yup.string().required('Address is required'),
        company: yup.string().required('Company is required'),

    })
    const [isModalVisible, setModalVisible] = useState(false);
    const closeModel = () => {
        setModalVisible(false)
    }
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={[GlobalStyle.container]}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.profileImg, { marginRight: 10 }]}>
                            <Image resizeMode='contain' style={styles.profileImg} source={require('../../assets/images/avatar_profile.png')} />
                        </View>
                        <Pressable onPress={() => console.log('Edit-Profile')}>
                            <Text style={styles.editText}>Upload Photo </Text>
                        </Pressable>
                    </View>
                    <Formik
                        initialValues={{
                            firstname: '',
                            lastname: '',
                            email: '',
                            phone: '',
                            address: '',
                            company: '',
                        }}
                        validationSchema={Schema}
                        onSubmit={values => console.log(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                            <>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>First</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('firstname')}
                                            onBlur={() => { handleBlur('firstname') }}
                                            value={values.firstname}
                                            placeholder='First Name'
                                        />
                                    </View>
                                    {errors.firstname && touched.firstname &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.firstname}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Last</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('lastname')}
                                            onBlur={() => { handleBlur('lastname') }}
                                            value={values.lastname}
                                            placeholder='Last Name'
                                        />
                                    </View>
                                    {errors.lastname && touched.lastname &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.lastname}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Phone</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('phone')}
                                            onBlur={() => { handleBlur('phone') }}
                                            value={values.phone}
                                            keyboardType='phone-pad'
                                            placeholder='Phone'
                                            maxLength={10}
                                        />
                                    </View>
                                    {errors.phone && touched.phone &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.phone}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Address</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0, alignItems: 'center', justifyContent: 'center' }]}>
                                        <LocationSearch
                                            placeholder="Address"
                                            isModalVisible={isModalVisible}
                                            // notifyChange={handleLocationChange}
                                            notifyChange={location => {
                                                setModalVisible(false);
                                                setFieldValue('address', location.description)
                                                    // values.address = location.description
                                                    ;
                                            }}
                                            closeModel={closeModel}
                                        />
                                        <Text style={{
                                            width: '100%', height: 50, fontSize: 16, paddingTop: 13
                                        }} onPress={() => setModalVisible(true)}>{values.address ? values.address : 'Address'}</Text>
                                        {/* <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('address')}
                                            onBlur={() => { handleBlur('address') }}
                                            value={values.address}
                                            placeholder='Address'
                                        /> */}
                                    </View>
                                    {errors.address && touched.address &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.address}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Email</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('email')}
                                            onBlur={() => { handleBlur('email') }}
                                            value={values.email}
                                            keyboardType='email-address'
                                            placeholder='Email'
                                        />
                                    </View>
                                    {errors.email && touched.email &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.email}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Company</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('company')}
                                            onBlur={() => { handleBlur('company') }}
                                            value={values.company}
                                            placeholder='Company'
                                        />
                                    </View>
                                    {errors.company && touched.company &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.company}</Text>
                                    }
                                </View>
                                <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                    <Text style={GlobalStyle.btntext}>Update</Text>
                                </Pressable>
                            </>
                        )}
                    </Formik>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    cardContainer: { marginTop: 10, marginBottom: 5 },
    profileImg: { height: 80, width: 80 },
    editText: { color: '#05E3D5', fontSize: 20 }
})