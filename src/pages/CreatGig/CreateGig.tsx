import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, Pressable, Image, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import { Formik } from 'formik'
import SelectDropdown from 'react-native-select-dropdown'
import MicIcon from '../../assets/icons/Mic1.svg'
import * as Animatable from 'react-native-animatable';
import * as yup from "yup"
import LocationSearch from '../../components/LocationSearch'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { createGig } from '../../services/gigService/gigService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
const CreategigScreen = ({ navigation }: any) => {
  const user: any = useSelector((state: RootState) => state.user.user);
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
  const dispatch = useDispatch();
  const gigSchema = yup.object().shape({
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters')
      .max(400, 'Description must not exceed 400 characters'),
    address: yup.string().required('Address is required'),
    amount: yup.string().required('Amount is required'),
    status: yup.string().required('Status is required')
  })
  const onCreate = (values: any) => {
    return new Promise((resolve, reject) => {
      let gigValue = {
        "user_id": user.user_id,
        "background_check_required": false,
        "informal_description": values.description,
        "address": values.address,
        "gig_type": values.status === "Free" ? "unpaid" : values.status.toLowerCase(),
        "budget": Number(values.amount)
      }
      dispatch(setLoading(true))
      createGig(gigValue, firstToken).then((res) => {
        console.log(res, 'response creat gig')
        navigation.navigate('Home')
        dispatch(setLoading(false));
        resolve(true)
      }).catch((e) => {
        console.log('error', JSON.stringify(e));
        dispatch(setLoading(false))
      })
    })
  }
  const [isRecording, setIsRecording] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => { dispatch(setLoading(false)) }, [])
  const closeModel = () => {

    setModalVisible(false)
  }
  const handleMicIconPress = () => {
    setIsRecording(true);
    startLongPressAnimation();
  };

  const handleMicIconPressOut = () => {
    setIsRecording(false);
    // Start the press release animation
    startPressReleaseAnimation();
    // Add your logic for when the press is released
  };

  // Define animated values for animations
  const longPressScale = new Animated.Value(1);
  const pressReleaseScale = new Animated.Value(1);

  // Animation for long press
  const startLongPressAnimation = () => {
    Animated.timing(longPressScale, {
      toValue: 1.1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Animation for press release
  const startPressReleaseAnimation = () => {
    Animated.timing(pressReleaseScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style={[GlobalStyle.container]}>
          <View style={Style.cardContainer}>
            <Text style={[GlobalStyle.blackColor, { fontSize: 22, fontWeight: 'bold' }]}>How It Works</Text>
            <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
              <Text style={[GlobalStyle.blackColor, { fontSize: 18 }]}>
                Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros to help with your Gig.  In the app, you can message Pros, evaluate Pros, and even pay the Pro.              </Text>
            </View>
          </View>
          <View>
            <Text style={[GlobalStyle.blackColor, { fontSize: 22, fontWeight: 'bold' }]}>Gig Details</Text>
          </View>
          <Formik
            initialValues={{
              description: '',
              address: '',
              amount: '',
              status: ''
            }}
            validationSchema={gigSchema}
            onSubmit={async (values, { resetForm }) => {
              let res = await onCreate(values);
              console.log('res', res);
              resetForm();
              return res
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, resetForm, setFieldValue, touched }) => (
              <View>
                <View style={{ marginTop: 10 }}>
                  <View
                    style={Style.inputField}>
                    <Text style={Style.inputLabel}>Description</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        onChangeText={handleChange('description')}
                        onBlur={() => { handleBlur('description') }}
                        value={values.description}
                        maxLength={400}
                        style={{ width: '80%', fontSize: 16 }}
                      />
                      <View style={{ alignItems: 'center' }}>
                        <Pressable
                          onPress={handleMicIconPress}
                          onPressOut={handleMicIconPressOut}
                        >
                          <Animated.View
                            style={[
                              { alignItems: 'center' },
                              {
                                transform: [
                                  { scale: isRecording ? longPressScale : pressReleaseScale },
                                ],
                              },
                            ]}
                          >
                            <MicIcon height={70} width={70} style={{ padding: 10 }} />
                          </Animated.View>
                        </Pressable>
                        {/* <MicIcon height={70} width={70} style={{ padding: 10 }} /> */}
                      </View>
                    </View>
                  </View>
                  {errors.description && touched.description &&
                    <Text style={GlobalStyle.errorMsg}>{errors.description}</Text>
                  }
                </View>
                <View style={{ marginTop: 10 }}>
                  <View>
                    <View
                      style={Style.inputField}>
                      <Text style={Style.inputLabel}>Address</Text>

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
                        width: '100%', height: 50, fontSize: 16, color: '#000'
                      }} onPress={() => setModalVisible(true)}>{values.address ? values.address : ''}</Text>

                      {/* <TextInput
                        editable
                        multiline
                        numberOfLines={2}
                        onChangeText={handleChange('address')}
                        onBlur={() => { handleBlur('address') }}
                        value={values.address}
                        style={{ fontSize: 16 }}
                      /> */}
                    </View>
                    {errors.address && touched.address &&
                      <Text style={GlobalStyle.errorMsg}>{errors.address}</Text>
                    }
                  </View>
                </View>

                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>

                  <View
                    style={[{ marginRight: 10, width: '40%' }]}>
                    <View style={Style.inputField}>
                      <Text style={Style.inputLabel}>Free or Paid</Text>
                      <SelectDropdown
                        data={['Free', 'Paid']}
                        onSelect={(selectedItem) => {
                          setFieldValue('status', selectedItem)
                          if (selectedItem === 'Free') {
                            setFieldValue('amount', '0');
                          } else {
                            setFieldValue('amount', '');
                          }
                        }}
                        buttonStyle={{ backgroundColor: 'transparent' }}
                        defaultButtonText='Select'
                        buttonTextStyle={{ textAlign: 'left' }}
                        dropdownStyle={{ width: '35%', borderRadius: 10 }}
                        defaultValue={''}
                      />
                    </View>
                    {errors.status && touched.status &&
                      <Text style={GlobalStyle.errorMsg}>{errors.status}</Text>
                    }
                  </View>
                  {values.status === 'Free' ? null
                    :
                    <View
                      style={[{ flex: 1 }]}>
                      <View style={Style.inputField}>
                        <Text style={Style.inputLabel}>Amount</Text>
                        <TextInput
                          onChangeText={handleChange('amount')}
                          onBlur={() => { handleBlur('amount') }}
                          value={values.amount}
                          keyboardType='numeric'
                          style={{ fontSize: 16 }}
                        />
                      </View>
                      {errors.amount && touched.amount &&
                        <Text style={GlobalStyle.errorMsg}>{errors.amount}</Text>
                      }
                    </View>
                  }
                </View>
                <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}
                >
                  <Text style={GlobalStyle.btntext}>Create Gig</Text>
                </Pressable>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const Style = StyleSheet.create({
  cardContainer: { marginBottom: 10 },
  inputContainer: {
    backgroundColor: ''
  },
  inputField: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    fontSize: 16,
    padding: 10,
  },
  inputLabel: { color: '#05E3D5', fontSize: 16 }
})

export default CreategigScreen