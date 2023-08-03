import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, Pressable, Image } from 'react-native'
import React, { useEffect } from 'react'
import { GlobalStyle } from '../../globalStyle'
import { Formik } from 'formik'
import SelectDropdown from 'react-native-select-dropdown'
import MicIcon from '../../assets/icons/Mic.svg'
import * as yup from "yup"

const CreategigScreen = ({ navigation }: any) => {
  const gigSchema = yup.object().shape({
    description: yup.string().required('Description is required'),
    address: yup.string().required('Address is required'),
    amount: yup.string().required('Amount is required'),
    status: yup.string().required('Status is required')
  })
  const onCreate = (values: any) => {
    return new Promise((resolve, reject) => {
      console.log(values);
      navigation.navigate('Home')
      return true;
    })
  }
  useEffect(() => { }, [])
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[GlobalStyle.container]}>
          <View style={Style.cardContainer}>
            <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>How It Works</Text>
            <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
              <Text style={[GlobalStyle.blackColor, { fontSize: 14 }]}>
                Tap the mic and speak what you need help with (or tap the box below to type).  Gigwave helps match you with local Pros to help with your Gig.  In the app, you can message Pros, evaluate Pros, and even pay the Pro.              </Text>
            </View>
          </View>
          <View>
            <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Gig Details</Text>
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
                        style={{ width: '90%' }}
                      />
                      <View style={{ width: '10%', alignItems: 'center' }}>
                        <MicIcon />
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
                      <TextInput
                        editable
                        multiline
                        numberOfLines={2}
                        onChangeText={handleChange('address')}
                        onBlur={() => { handleBlur('address') }}
                        value={values.address}
                      />
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
                  <View
                    style={[{ flex: 1 }]}>
                    <View style={Style.inputField}>
                      <Text style={Style.inputLabel}>Amount</Text>
                      <TextInput
                        onChangeText={handleChange('amount')}
                        onBlur={() => { handleBlur('amount') }}
                        value={values.amount}
                        keyboardType='numeric'
                      />
                    </View>
                    {errors.amount && touched.amount &&
                      <Text style={GlobalStyle.errorMsg}>{errors.amount}</Text>
                    }
                  </View>
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
    padding: 10,

  },
  inputLabel: { color: '#05E3D5', fontSize: 14 }
})

export default CreategigScreen