import React, { useEffect } from 'react'
import { Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import GroupSvg from '../../assets/icons/Group.svg'
import HelpSVG from '../../assets/icons/Help.svg'
import CommanAlertBox from '../../components/CommanAlertBox'
import { GlobalStyle } from '../../globalStyle'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { setUserType } from '../../redux/action/User/userTypeSlice'
import { RootState } from '../../redux/store'
import { getFcmToken, notificationListener, requestUserPermission } from '../../services/noticationService/notification'
import { setDeviceToken } from '../../services/userService/userServices'

const RoleScreen = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const user: any = useSelector((state: RootState) => state.user.user);
  const fcm_token = useSelector((state: RootState) => state.fcm_token.fcm_token);
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);

  useEffect(() => {
    getFcmToken()
    requestUserPermission();
  }, [])

  useEffect(() => {
    if (fcm_token) {
      let deviceInfo = {
        device_id: "",
        device_token: fcm_token,
        id_token: "",
        user_id: user.user_id
      }
      setFCMTokenToUser(deviceInfo)
      notificationListener()
    }
    else {
      notificationListener()

      console.log('fcm_token', fcm_token)
    }
  }, [fcm_token])

  const setFCMTokenToUser = (value: any) => {
    dispatch(setLoading(true))
    try {
      setDeviceToken(value, firstToken).then((res: any) => {
        console.log(res, 'response token')
        dispatch(setLoading(false));
      })
    } catch (error: any) {
      CommanAlertBox({
        title: 'Error',
        message: error.message,
      });
      console.error('error', error);
      dispatch(setLoading(false))
    }
  }
  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={{ marginHorizontal: 10 }}>
        <View style={[GlobalStyle.headerLeft]}>
          <View>
            {/* <Image resizeMode='contain'style={[GlobalStyle.profileImg]} source={require('../../assets/images//avatar_profile.png')} /> */}
            <Image resizeMode='contain' style={[GlobalStyle.profileImg]} source={user.base64_img ? { uri: `data:image/jpeg;base64,${user.base64_img}` } : require('../../assets/images/avatar_profile.png')} />
          </View>
          <View style={{ marginLeft: 5 }}>
            <View>
              <Text style={{ color: '#05E3D5', fontSize: 22 }}>Hi {user ? user.fname : 'Joshua'}</Text>
              <Text style={[GlobalStyle.title, { fontSize: 20 }]}>Welcome to Gigwave</Text>
            </View>
          </View>
        </View>
      </View>
      {/* <ScrollView> */}
      <View style={[GlobalStyle.centerContentPage, { padding: 25, marginTop: 0, paddingTop: 10, height: 'auto' }]}>
        <View style={{ display: "flex", alignItems: 'center', justifyContent: "center", width: '100%', height: '85%' }}>
          <Text style={[GlobalStyle.title, { fontSize: 26 }]}>I want to</Text>
          <View>
            <Text style={[GlobalStyle.subtitle]}>
              Select want to do first, you can select the other option later by tapping.&nbsp;
              {/* <GigwaveIcon height={50} /> */}
              <Image style={{ resizeMode: 'contain', width: 34, height: 20 }} source={require('../../assets/images/gigwave.png')} />
            </Text>
            <Pressable style={[Style.button, { marginTop: 30 }]} onPress={() => { navigation.navigate('Home'); dispatch(setUserType('CREATOR')) }}>
              <View>
                {/* <Image source={require('../../assets/images/help.png')} /> */}
                <HelpSVG />
              </View>
              <View>
                <Text style={Style.btnTitle}>Get Help</Text>
              </View>
              <View>
                <Text style={Style.btnSubTitle}>I am looking for help and
                </Text>
              </View>
              <View>
                <Text style={Style.btnSubTitle}>want to CREATE a gig
                </Text>
              </View>
            </Pressable>
            <Pressable style={[Style.button, { marginTop: 20 }]} onPress={() => { navigation.navigate('Home'); dispatch(setUserType('PRO')) }}>
              <View>
                {/* <Image source={require('../../assets/images/help_other.png')} /> */}
                <GroupSvg />
              </View>
              <View>
                <Text style={Style.btnTitle}>Help Others</Text>
              </View>
              <View>
                <Text style={Style.btnSubTitle}>I’m a PRO looking for a gig
                </Text>
              </View>
              <View>
                <Text style={Style.btnSubTitle}>or help someone
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView >
  )
}

const Style = StyleSheet.create({
  button: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    height: 220,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTitle: {
    color: '#05E3D5',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 20
  },
  btnSubTitle: {
    fontSize: 16,
    color: '#000'
  }
})

export default RoleScreen