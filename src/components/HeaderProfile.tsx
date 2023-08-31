import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { GlobalStyle } from '../globalStyle'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const HeaderProfile = ({ navigation }: any) => {
    const user: any = useSelector((state: RootState) => state.user.user);

    return (
        <View style={[GlobalStyle.headerLeft]}>
            <View>
                {/* <Image resizeMode='contain' source={require('../assets/images//avatar_profile.png')} /> */}
                <Image resizeMode='contain' style={[GlobalStyle.profileImg]} source={user.base64_img ? { uri: `data:image/jpeg;base64,${user.base64_img}` } : require('../assets/images/avatar_profile.png')} />
            </View>
            <View style={{ marginLeft: 5 }}>
                <View>
                    <Text style={{ color: '#05E3D5', fontSize: 22 }}>Hi {user ? user.fname : 'Joshua'}</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    profileImg: {
        height: 80,
        width: 80,
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
})

export default HeaderProfile