import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from "yup"
import MicIcon from '../../assets/icons/Mic1.svg'
import LocationSearch from '../../components/LocationSearch'
import { GlobalStyle } from '../../globalStyle'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { setGigCreated } from '../../redux/action/Gig/GigSlice'
import { RootState } from '../../redux/store'
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices'
import { createGig } from '../../services/gigService/gigService'
import { useIsFocused } from "@react-navigation/native";
import CommanAlertBox from '../../components/CommanAlertBox'

interface InitialFormValues {
  description: string,
  address: string,
  amount: string,
  status: string
}
const CreategigScreen = ({ navigation }: any) => {
  const user: any = useSelector((state: RootState) => state.user.user);
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState<string>('');
  const dropdownRef = useRef<any>(null);
  const selectRef = useRef<SelectDropdown>(null);

  const [keyboardPersist, setkeyboardPersist] = useState(false)
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
    description: '',
    address: '',
    amount: '',
    status: ''
  });
  const isFocused = useIsFocused();
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
        dispatch(setGigCreated(true))
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Gig Created successfully',

        });
        setTimeout(() => {
          navigation.navigate('Home');
          dispatch(setLoading(false));
          resolve(true);
        }, 2000);

      }).catch((e) => {
        CommanAlertBox({
          title: 'Error',
          message: e.message,
        });

        dispatch(setLoading(false))
      })
    })
  }

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(setLoading(false))
    checkPermission()
  }, [])

  useEffect(() => {
    if (isFocused) {
      resetForm();
      setFieldValue("status", "")
      selectRef.current?.reset();
    }
  }, [isFocused]);

  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: gigSchema,
    onSubmit: (async (values: any) => {
      let res = await onCreate(values);
      resetForm();
      return res
    }),
  });
  const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue, resetForm } = formik
  const closeModel = () => {

    setModalVisible(false)
  }

  const startRecognizing = async () => {

    checkPermission().then((granted) => {

      if (!granted) {
        // Permissions not granted, return early
        console.log('Permissions not granted');
        return;
      }


      startRecord(setAudioPath, setIsRecording);
    })

  }
  const stopRecording = async () => {
    stopRecord(setIsRecording).then((res) => {
      dispatch(setLoading(true))
      readAudioFile(audioPath)
        .then((base64Data) => {
          if (base64Data) {
            const audioDataToSend = {
              audio_base64: base64Data,
              audio_format: Platform.OS === "ios" ? 'aac' : 'mp4', // Set the desired audio format
              platform: Platform.OS

            };
            audioToText(audioDataToSend, firstToken).then((res) => {
              setFieldValue('description', res.text)
              // values.description = res.text
              dispatch(setLoading(false))
            }).catch((error) => {
              CommanAlertBox({
                title: 'Error',
                message: error.message,
              });
              // console.error('error', error);
              dispatch(setLoading(false))
            })
          }
        })
        .catch((error) => {
          CommanAlertBox({
            title: 'Error',
            message: error.message,
          });
          dispatch(setLoading(false))
          // console.error('Error reading audio file:', error);
        });
    })
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView  behavior={Platform.OS == "ios" ? "height" : undefined}>
        <ScrollView keyboardShouldPersistTaps={keyboardPersist ? 'always' : 'never'} contentContainerStyle={{ flexGrow: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={true}>
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

              <View >
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
                        style={{ width: '80%', fontSize: 16,color:'#000' }}
                      />
                      <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={isRecording ? stopRecording : startRecognizing} >
                          {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 70, height: 70 }} /> : <MicIcon height={70} width={70} />}
                        </TouchableOpacity>

                      </View>
                    </View>
                  </View>
                  {errors.description && touched.description &&
                    <Text style={GlobalStyle.errorMsg}>{errors.description}</Text>
                  }
                </View>
                <View style={{ marginTop: 10 }}>
                  <View ref={dropdownRef}>
                    <View
                      style={Style.inputField}>
                      <Text style={Style.inputLabel} >Address</Text>

                      <LocationSearch
                        placeholder="Address"
                        isModalVisible={isModalVisible}
                        notifyChange={location => {
                          setModalVisible(false);
                          setFieldValue('address', location.description);
                          setkeyboardPersist(false)
                          dropdownRef.current.focus();
                        }}
                        closeModel={closeModel}
                        
                      />
                      <TouchableOpacity onPress={() => { setModalVisible(true); setkeyboardPersist(true) }}>

                        <Text style={{
                          width: '100%', height: 50, fontSize: 16, color: '#000'
                        }} >{values.address ? values.address : ''}</Text>
                      </TouchableOpacity>

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
                        ref={selectRef}
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
                      <View style={[Style.inputField]}>
                        <Text style={Style.inputLabel}>Amount</Text>
                        <TextInput
                          onChangeText={handleChange('amount')}
                          onBlur={() => { handleBlur('amount') }}
                          value={values.amount}
                          keyboardType='numeric'
                          style={{ fontSize: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 11,color:'#000' }}
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
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
const Style = StyleSheet.create({
  cardContainer: { marginBottom: 0 },
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