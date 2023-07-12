import { Formik } from 'formik'
import React, { useState } from 'react'
import { Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { GlobalStyle } from '../../globalStyle'

import * as yup from "yup"

const LoginScreen = ({ navigation }: any) => {
  const [isOtpsent, setOtpSend] = useState(false);
  const loginPhoneSchema = yup.object().shape({
    phone: yup.string().required('Phone number is required')
      .min(10, 'Phone number must be 10 digit number')
      .max(10, 'Phone number must be 10 digit number')
  })

  const loginCodeSchema = yup.object().shape({
    code: yup.string().required('Code is required')
  })
  const onLogin = (values: any) => {
    // console.log('values', values);
    setOtpSend(true)
  }
  const onSubmit = (values: any) => {
    // console.log('values', values);
    setOtpSend(false)
    navigation.navigate('Register')
  }
  return (
    <SafeAreaView style={GlobalStyle.safeAreaCotainer}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={GlobalStyle.centerContentPage}>
        <View style={Style.authContainer}>
          <Image source={require('../../assets/images/gigwave.png')} />
          <Text style={[GlobalStyle.title, { marginTop: 20 }]}>Login</Text>
          {!isOtpsent ?
            <Text style={{ color: '#949494' }}>Enter Login Details</Text>
            :
            <Text style={{ color: '#949494' }}>We Sent a Code To Your Phone</Text>
          }
          {
            !isOtpsent ?
              <Formik
                initialValues={{ phone: '' }}
                validationSchema={loginPhoneSchema}
                onSubmit={values => onLogin(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, resetForm }) => (
                  <View style={{ padding: 10 }}>

                    <View style={GlobalStyle.fieldwithIcon}>
                      <View style={{ marginRight: 10 }}>
                        <Image source={require('../../assets/icons/phone.png')} />
                      </View>
                      <TextInput style={{ flex: 1 }}
                        onChangeText={handleChange('phone')}
                        onBlur={() => { handleBlur('phone') }}
                        value={values.phone}
                        keyboardType={'phone-pad'}
                        placeholder='Phone'
                        maxLength={10}
                      />
                    </View>
                    {errors.phone &&
                      <Text style={GlobalStyle.errorMsg}>{errors.phone}</Text>
                    }
                    <Pressable style={GlobalStyle.button} disabled={!isValid} onPress={() => { handleSubmit(); resetForm() }}>
                      <Text style={GlobalStyle.btntext}>Continue</Text>
                    </Pressable>
                  </View>
                )}
              </Formik>
              :
              <Formik
                initialValues={{ code: '' }}
                validationSchema={loginCodeSchema}
                onSubmit={values => onSubmit(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                  <View style={{ padding: 10 }}>
                    <View style={[GlobalStyle.fieldwithIcon]}>
                      <View style={{ marginRight: 10 }}>
                        <Image source={require('../../assets/icons/lock.png')} />
                      </View>
                      <TextInput style={{ flex: 1 }}
                        onChangeText={handleChange('code')}
                        onBlur={() => { handleBlur('code') }}
                        value={values.code}
                        keyboardType={'numeric'}
                        placeholder='Code'
                        maxLength={10}
                      />
                    </View>
                    {errors.code &&
                      <Text style={GlobalStyle.errorMsg}>{errors.code}</Text>
                    }
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <Text onPress={() => setOtpSend(false)} style={[GlobalStyle.blackColor, { marginBottom: 10 }]}>Return to Login</Text>
                    </View>
                    <Pressable style={GlobalStyle.button} disabled={!isValid} onPress={() => handleSubmit()}>
                      <Text style={GlobalStyle.btntext}>Login</Text>
                    </Pressable>
                  </View>
                )}
              </Formik>
          }
        </View>
        <View style={Style.footer}>
          <Text style={[Style.footerText]}>
            Don’t have an account?
          </Text>
          <Text onPress={() => navigation.navigate('Signup')} style={[Style.footerText, GlobalStyle.themeColor, { paddingStart: 5 }]}>
            Register here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const Style = StyleSheet.create({
  authContainer: {
    height: '75%',
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
    color: 'black'
  }
})


export default LoginScreen