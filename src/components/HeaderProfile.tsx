import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../globalStyle'

const HeaderProfile = ({ navigation }: any) => {
    return (
        <View style={[GlobalStyle.headerLeft]}>
            <View>
                <Image resizeMode='contain' source={require('../assets/images//avatar_profile.png')} />
            </View>
            <View style={{ marginLeft: 5 }}>
                <View>
                    <Text style={{ color: '#05E3D5', fontSize: 20 }}>Hi Joshua</Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderProfile