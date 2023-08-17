import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../globalStyle'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const HeaderProfile = ({ navigation }: any) => {
    const user: any = useSelector((state: RootState) => state.user.user);

    return (
        <View style={[GlobalStyle.headerLeft]}>
            <View>
                <Image resizeMode='contain' source={require('../assets/images//avatar_profile.png')} />
            </View>
            <View style={{ marginLeft: 5 }}>
                <View>
                    <Text style={{ color: '#05E3D5', fontSize: 22 }}>Hi {user ? user.fname : 'Joshua'}</Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderProfile