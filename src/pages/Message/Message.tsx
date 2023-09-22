import { View, Text, SafeAreaView, ScrollView, TextInput, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import SearchIcon from '../../assets/icons/Search.svg'
import DropDownIcon from '../../assets/icons/dropdown.svg'
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import moment from 'moment'

const MessageScreen = ({ navigation }: any) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedValue, setSelectValue] = useState('')
  const [profiles, setProfiles] = useState<any[]>([])
  const user: any = useSelector((state: RootState) => state.user.user);
  const onChangeSearch = (value: any) => {
    setSearchValue(value)
  }
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(user.user_id)
      .collection('messages')
      .onSnapshot(querySnapshot => {
        const allProfiles = querySnapshot.docs.map(doc => (doc.data()));
        setProfiles(allProfiles)

      });

    return () => subscriber();
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[GlobalStyle.container, { marginTop: 0 }]}>
          <View
            style={{
              backgroundColor: '#fff',
              borderColor: '#05E3D5',
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 15,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5
            }}>
            <TextInput
              onChangeText={text => onChangeSearch(text)}
              value={searchValue}
              placeholder='Search chats'
              style={{ padding: 5, flex: 1, fontSize: 16 }}
            />
            <SearchIcon height={20} width={20} />
          </View>
          <View
            style={[{
              marginTop: 10,
              backgroundColor: '#F9F9F9',
              borderColor: '#05E3D5',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
            <View style={{ flex: 1, padding: 5 }}>
              <SelectDropdown
                data={['Gig']}
                onSelect={(selectedItem) => {
                  setSelectValue(selectedItem)
                }}

                buttonStyle={{ backgroundColor: 'transparent', width: '100%' }}
                defaultButtonText='Select Gig'
                buttonTextStyle={{ textAlign: 'left' }}
                dropdownStyle={{ width: '85%', borderRadius: 10 }}
                defaultValue={selectedValue}
              />
            </View>
            <DropDownIcon style={{ marginEnd: 10 }} />
            {/* <Image source={require('../../assets/icons/dropdown.png')} style={{ marginEnd: 10 }} /> */}
          </View>
          {profiles.length > 0 && profiles.map((data, index) => (
            <Pressable onPress={() => navigation.navigate('Chat', { user_id: data.to_useruid, gig_id: data.gig_id })} key={index}>
              <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingHorizontal: 10 }]} >
                <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={{ height: 70, width: 70, backgroundColor: 'black', borderRadius: 35 }}>
                    <Image style={{ height: 70, width: 70, borderRadius: 35 }} resizeMode='contain' source={data.to_userProfilepic ? { uri: `data:image/jpeg;base64,${data.to_userProfilepic}` } : require('../../assets/images/avatar-1.png')} />
                    <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: '#36CC36', position: 'absolute', bottom: 0, right: 0 }}></View>
                  </View>
                  <View style={{ flex: 1, marginStart: 10 }}>
                    <Text style={[GlobalStyle.blackColor, { fontSize: 18 }]}>{data.to_userName}</Text>
                    <Text style={[GlobalStyle.blackColor]}>{data.gig_title}</Text>
                    <Text numberOfLines={1} style={[GlobalStyle.greyColor,]}>{data.latest_message}</Text>
                  </View>
                  <View>
                    <Text style={[GlobalStyle.themeColor, { fontWeight: 'bold' }]}>{data.latest_messageTime ? moment(data.latest_messageTime.toDate()).format('HH:mm A') : ''}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MessageScreen