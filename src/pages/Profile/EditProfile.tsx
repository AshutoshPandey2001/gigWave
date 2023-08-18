import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import * as yup from "yup"
import { Formik, useFormik } from 'formik'
import LocationSearch from '../../components/LocationSearch'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { updateUsersDetails } from '../../services/authServices/authServices'
import { getUserByUserID } from '../../services/userService/userServices'
import { setUser } from '../../redux/action/Auth/authAction'
import { setLoading } from '../../redux/action/General/GeneralSlice'
const EditProfileScreen = () => {
    const dispatch = useDispatch();
    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [initialFormValues, setInitialFormValues] = useState({
        user_id: user.user_id ? user.user_id : '',
        fname: user.fname ? user.fname : '',
        lname: user.lname ? user.lname : '',
        email: user.email ? user.email : '',
        phone: user.phone ? user.phone : '',
        address: user.address ? user.address : '',
        company: user.company ? user.company : '',
    });
    const Schema = yup.object().shape({
        fname: yup.string().required('First Name is required'),
        lname: yup.string().required('Last Name is required'),
        email: yup.string().email("Please enter valid email")
            .required('Email is required').matches(/@[^.]*\./, "Please enter valid email"),
        phone: yup.string().required('Phone number is required')
            .min(10, 'Phone number must be 10 digit number')
            .max(10, 'Phone number must be 10 digit number'),
        address: yup.string().required('Address is required'),
        company: yup.string(),
    })
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        getUserByID()
    }, []);

    const getUserByID = async () => {
        await dispatch(setLoading(true));
        if (user.is_pro) {

        } else {
            getUserByUserID(user.user_id, firstToken).then((response) => {
                dispatch(setLoading(false))
                dispatch(setUser(response))
            })
        }
    }
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
                        initialValues={initialFormValues}
                        validationSchema={Schema}
                        onSubmit={values => {
                            dispatch(setLoading(true))
                            updateUsersDetails(values, firstToken).then((res) => {
                                dispatch(setLoading(false))
                                dispatch(setUser(res))
                            }).catch((e) => {
                                dispatch(setLoading(false))
                                console.log('error', e)
                            }
                            )
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                            <>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>First</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('fname')}
                                            onBlur={() => { handleBlur('fname') }}
                                            value={values.fname}
                                            placeholder='First Name'
                                        />


                                    </View>
                                    {errors.fname && touched.fname &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.fname}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Last</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0 }]}>
                                        <TextInput style={{ flex: 1, fontSize: 16 }}
                                            onChangeText={handleChange('lname')}
                                            onBlur={() => { handleBlur('lname') }}
                                            value={values.lname}
                                            placeholder='Last Name'
                                        />
                                    </View>
                                    {errors.lname && touched.lname &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.lname}</Text>
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
                                            editable={false}
                                        />
                                    </View>
                                    {errors.phone && touched.phone &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.phone}</Text>
                                    }
                                </View>
                                <View style={styles.cardContainer}>
                                    <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Address</Text>
                                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: 0, alignItems: 'center', justifyContent: 'center' }]}>
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
                                        {values.address ?
                                            <Text style={{ color: '#000', fontSize: 16, paddingTop: 13, width: '100%', height: 50, }} onPress={() => setModalVisible(true)}>{values.address ? values.address : ''}</Text>
                                            :
                                            <Text style={{ color: '#a9a9a9', fontSize: 16, paddingTop: 13, width: '100%', height: 50, }} onPress={() => setModalVisible(true)}>{'Address'}</Text>
                                        }
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
                                            editable={false}
                                        />
                                    </View>
                                    {errors.email && touched.email &&
                                        <Text style={GlobalStyle.errorMsg}>{errors.email}</Text>
                                    }
                                </View>
                                {user?.is_Pro && <View style={styles.cardContainer}>
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
                                </View>}
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