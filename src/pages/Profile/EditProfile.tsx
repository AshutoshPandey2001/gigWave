import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import fs from 'react-native-fs'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from "yup"
import UploadPhotosScreen from '../../components/CamaraRoll'
import LocationSearch from '../../components/LocationSearch'
import { GlobalStyle } from '../../globalStyle'
import { setUser } from '../../redux/action/Auth/authAction'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { RootState } from '../../redux/store'
import { updateUsersDetails } from '../../services/authServices/authServices'
import { getProdetailsbyuserid, updateProUsersDetails } from '../../services/proUserService/proUserService'
import { getProfilePhoto, getUserByUserID, uploadProfilePhoto } from '../../services/userService/userServices'


interface InitialFormValues {
    user_id: string,
    fname: string,
    lname: string,
    email: string,
    phone: string,
    address: string,
    company?: string,
}
const EditProfileScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [prouserData, setProuserData] = useState<any>()
    const [profilePic, setProfilePic] = useState<any>()

    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
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
    const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);

    useEffect(() => {
        getUserByID()
        getProfileImage()
    }, []);

    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: Schema,
        onSubmit: ((values: any) => {
            updateProfile(values)
        }),
    });
    const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue } = formik

    const getProfileImage = async () => {
        // getProfilePhoto(user.user_id, firstToken).then(async (res: any) => {
        // }).catch((e) => {
        //     console.error(e, 'error when getting profile image');

        // })
    }
    const getUserByID = async () => {
        await dispatch(setLoading(true));
        if (user.is_pro) {
            getProdetailsbyuserid(user.user_id, firstToken).then((res) => {
                setProuserData(res)
                setFieldValue('company', res?.company)
                dispatch(setLoading(false));
            }).catch((e) => {
                dispatch(setLoading(false))
            })
        }
        getUserByUserID(user.user_id, firstToken).then((response) => {
            const dataURI = `data:image/jpeg;base64,${response.base64_img}`; // Assuming res is a base64 encoded image
            setProfilePic(dataURI);
            dispatch(setLoading(false))
            dispatch(setUser(response))
        })
    }
    const closeModel = () => {
        setModalVisible(false)
    }
    const closecamaraModel = () => {
        setIscamaraModalVisible(false)
    }
    const uploadProfileImage = (selectedImage: any) => {
        dispatch(setLoading(true))
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setProfilePic(`data:image/jpeg;base64,${imgRes}`)
            uploadProfilePhoto(user.user_id, firstToken, imgRes)
                .then((res) => {
                    getUserByUserID(user.user_id, firstToken).then((response) => {
                        const dataURI = `data:image/jpeg;base64,${response.base64_img}`; // Assuming res is a base64 encoded image
                        setProfilePic(dataURI);
                        dispatch(setLoading(false))
                        dispatch(setUser(response))
                    })
                    dispatch(setLoading(false))
                    // You might want to perform additional actions here after successful upload
                }).catch((err) => { dispatch(setLoading(false)); console.error(err) })
        })
    }



    const updateProfile = async (values: any) => {
        let provalue = {
            "company": values.company,
            "user_id": prouserData?.user_id,
            "raw_skills_text": prouserData.raw_skills_text,
            "payments": prouserData.payments,
            "interest_gig_type": prouserData.interest_gig_type,
        }
        dispatch(setLoading(true))
        if (user.is_pro) {
            updateProUsersDetails(provalue, firstToken).then((res) => {
                dispatch(setLoading(false));
            }).catch((e) => {
                console.log('error', JSON.stringify(e));
                dispatch(setLoading(false))
            })
        }

        updateUsersDetails(values, firstToken).then((response) => {
            // navigation.goBack();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile Updated Successfully',
            });
            dispatch(setLoading(false))
            dispatch(setUser(response))

        }).catch((e) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: e.message,
            });
            console.log('error', JSON.stringify(e));
            dispatch(setLoading(false))
        })

    }
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={[GlobalStyle.container]}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.profileImg, { marginRight: 10 }]}>
                            {/* <Image resizeMode='contain' style={styles.profileImg} source={require('../../assets/images/avatar_profile.png')} /> */}
                            <Image resizeMode='contain' style={styles.profileImg} source={profilePic ? { uri: profilePic } : require('../../assets/images/avatar_profile.png')} />
                            {/* <Image resizeMode='contain' style={[styles.profileImg]} source={user.base64_img ? { uri: `data:image/jpeg;base64,${user.base64_img}` } : require('../../assets/images/avatar_profile.png')} /> */}
                        </View>
                        <Pressable onPress={() => setIscamaraModalVisible(true)}>
                            <Text style={styles.editText}>Upload Photo </Text>
                        </Pressable>
                        {
                            iscamaraModalVisible && <UploadPhotosScreen isVisible={iscamaraModalVisible} onClose={closecamaraModel} uploadFunction={uploadProfileImage}
                            />
                        }
                    </View>
                    {/* <Formik
                        initialValues={initialFormValues}
                        validationSchema={Schema}
                        onSubmit={values => updateProfile(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => ( */}
                    <>
                        <View style={styles.cardContainer}>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>First</Text>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 15 : 0 }]}>
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
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 15 : 0 }]}>
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
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 15 : 0 }]}>
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
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 15 : 0 }]}>
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
                        {user?.is_pro && <View style={styles.cardContainer}>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Company</Text>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingVertical: Platform.OS === 'ios' ? 15 : 0 }]}>
                                <TextInput style={{ flex: 1, fontSize: 16 }}
                                    onChangeText={handleChange('company')}
                                    onBlur={() => { handleBlur('company') }}
                                    value={values?.company}
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
                    {/* )}
                     </Formik> */}
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
    profileImg: {
        height: 80, width: 80,
        borderRadius: 40, // Half of the height or width for a circular effect
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // Android shadow
    },
    editText: { color: '#05E3D5', fontSize: 20 }
})