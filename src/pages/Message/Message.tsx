import { View, Text, SafeAreaView, ScrollView, TextInput, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import SearchIcon from '../../assets/icons/Search.svg'
import DropDownIcon from '../../assets/icons/dropdown.svg'

const MessageScreen = ({ navigation }: any) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedValue, setSelectValue] = useState('')

  const profiles = [
    { name: 'Susan Thomas', title: 'Help for Dad', message: 'Wanted to ask if you’re availab...', time: '12:50 AM' },
    { name: 'Tom Ishawn', title: 'Childcare', message: 'WI know... I’m trying to get the...', time: '12:50 AM' },
    { name: 'Shawn Peoples', title: 'Childcare', message: 'I’m looking for tips around...', time: '12:50 AM' },
    { name: 'Mary Seacan', title: 'Childcare', message: 'Wanted to ask if you’re availab...', time: '12:50 AM' },
    { name: 'Rev Aswan', title: 'Paint Job', message: 'Wanted to ask if you’re availab...', time: '12:50 AM' },
    { name: 'Steph Waters', title: 'Paint Job', message: 'Wanted to ask if you’re availab...', time: '12:50 AM' },
  ]
  const onChangeSearch = (value: any) => {
    setSearchValue(value)
  }
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
              style={{ padding: 5, flex: 1 }}
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
          {profiles.length && profiles.map((data, index) => (
            <Pressable onPress={() => navigation.navigate('Chat')} key={index}>
              <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingHorizontal: 10 }]} >
                <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={{ height: 70, width: 70, backgroundColor: 'black', borderRadius: 35 }}>
                    <Image style={{ height: 70, width: 70, borderRadius: 35 }} resizeMode='contain' source={require('../../assets/images/avatar-1.png')} />
                    <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: '#36CC36', position: 'absolute', bottom: 0, right: 0 }}></View>
                  </View>
                  <View style={{ flex: 1, marginStart: 10 }}>
                    <Text style={[GlobalStyle.blackColor, { fontSize: 18 }]}>{data.name}</Text>
                    <Text style={[GlobalStyle.blackColor]}>{data.title}</Text>
                    <Text numberOfLines={1} style={[GlobalStyle.greyColor,]}>{data.message}</Text>
                  </View>
                  <View>
                    <Text style={[GlobalStyle.themeColor, { fontWeight: 'bold' }]}>{data.time}</Text>
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