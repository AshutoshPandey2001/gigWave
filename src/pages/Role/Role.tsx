import { View, Text, SafeAreaView, StatusBar, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../../globalStyle'

const RoleScreen = ({navigation}:any) => {
  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      <View style={[GlobalStyle.centerContentPage, { justifyContent: 'center', padding: 30 }]}>
        <View>
          <Text style={[GlobalStyle.title, { fontSize: 26 }]}>I want to</Text>
        </View>
        <View>
          <Text style={[GlobalStyle.subtitle,]}>
            Select want to do first, you can select the other option later by tapping.&nbsp;
            <Image style={{ resizeMode: 'contain', width: 34, height: 20 }} source={require('../../assets/images/gigwave.png')} />
          </Text>
          <Pressable style={[Style.button, { marginTop: 60 }]} onPress={()=>navigation.navigate('Tab')}>
            <View>
              <Image source={require('../../assets/images/help.png')} />
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
          <Pressable style={[Style.button, { marginTop: 20 }]} onPress={()=>navigation.navigate('Tab')}>
            <View>
              <Image source={require('../../assets/images/help_other.png')} />
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
    </SafeAreaView>
  )
}

const Style = StyleSheet.create({
  button: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    height: 220,
    padding:30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTitle: {
    color: '#05E3D5',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20
  },
  btnSubTitle: {
    fontSize: 14,
    color: '#000'
  }
})

export default RoleScreen