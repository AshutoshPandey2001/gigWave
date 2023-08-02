import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import SearchIcon from '../../assets/icons/Search.svg'

const SearchGigScreen = ({ navigation }: any) => {
    const [searchValue, setSearchValue] = useState('')
    const { isListView }: any = useSelector((state: RootState) => state.isListView)
    const [proLists, setProLists] = useState([])

    const onChangeSearch = (value: any) => {
        setSearchValue(value)
    }

    useEffect(() => {
        getProList();
    }, [])

    const getProList = () => {
        let option = JSON.parse(JSON.stringify([
            { image: require('../../assets/images/list1.png'), title: 'Help for Dad', msg: 'Experience working with elderly, Housecleaning, Cooking.', paymentStatus: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', msg: 'Experience working with elderly, Housecleaning, Cooking.', paymentStatus: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', msg: 'Seeking  piano player for two hour family reunion', paymentStatus: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', msg: 'Experience working with elderly, Housecleaning, Cooking.', paymentStatus: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', msg: 'Seeking  piano player for two hour family reunion', paymentStatus: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', msg: 'Experience working with elderly, Housecleaning, Cooking.', paymentStatus: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', msg: 'Seeking  piano player for two hour family reunion', paymentStatus: 'Paid', isProList: true }
        ]))
        setProLists(option)
    }
    const ListView = (props: any) => {
        return (
            <View style={styles.cardContainer}>
                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>Gig Discovery</Text>
                {
                    proLists?.length > 0 ?
                        <>
                            {proLists.map((item: any, index) => (
                                <View key={index}>
                                    <Pressable onPress={() => navigation.navigate('View-gig', item)} style={[GlobalStyle.card, GlobalStyle.shadowProp,
                                    {
                                        display: 'flex', flexDirection: 'row', paddingVertical: 0,
                                        paddingHorizontal: 0
                                    }]} >
                                        <View>
                                            <Image resizeMode='contain' style={{ borderTopLeftRadius: 15, borderBottomLeftRadius: 15, height: 120 }} source={item.image} />
                                        </View>
                                        <View style={{ flex: 1, width: 100 }}>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 16, marginHorizontal: 10, paddingTop: 10, fontWeight: 'bold' }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 12, margin: 10, }]}>
                                                {item.msg}
                                            </Text>
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Pressable style={{ backgroundColor: item.paymentStatus === 'Paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                                <Text style={{ color: '#fff' }}>{item.paymentStatus}</Text>
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                </View>
                            ))
                            }
                        </>
                        :
                        <>
                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18 }]}>
                                    No gigs in your area match your skills.  Expand your search area or add these skills to your profile.
                                </Text>
                            </View>

                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontStyle: 'italic' }]}>
                                    Popular skills:
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>
                                    lawn care
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>
                                    heavy lifting
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>
                                    meal prep
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 18, fontWeight: 'bold' }]}>
                                    house cleaning

                                </Text>
                            </View>
                            <View style={{ margin: 20 }}>
                                <Pressable style={GlobalStyle.button} onPress={() => navigation.navigate('View-Profile')}>
                                    <Text style={GlobalStyle.btntext}>Edit Profile</Text>
                                </Pressable>
                            </View>
                        </>
                }
            </View>
        )
    }
    const MapView = (props: any) => {
        return (
            <View style={{ height: '100%', width: '100%' }}>
                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../assets/images/mapImage.png')} />
            </View>
        )
    }

    return (
        <SafeAreaView>

            <View style={{ marginHorizontal: 25, marginTop: 10 }}>
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
                        placeholder='Search Gig'
                        style={{ padding: 5, flex: 1 }}
                    />
                    <SearchIcon height={20} width={20}/>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    justifyContent: 'space-between'
                }}>

                    <View
                        style={[{
                            backgroundColor: '#F9F9F9',
                            borderColor: '#05E3D5',
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            flex: 1
                        }]}>
                        <TextInput
                            onChangeText={text => onChangeSearch(text)}
                            value={searchValue}
                            placeholder='Add Zip Code'
                            placeholderTextColor={'#1E1E1E'}
                            keyboardType='number-pad'
                        />
                    </View>
                    <View
                        style={[{
                            backgroundColor: '#F9F9F9',
                            borderColor: '#05E3D5',
                            borderRadius: 10,
                            paddingHorizontal: 5,
                            marginLeft: 5,
                            flex: 1
                        }]}>
                        <TextInput
                            onChangeText={text => onChangeSearch(text)}
                            value={searchValue}
                            placeholder='Posted On'
                            placeholderTextColor={'#1E1E1E'}
                        />
                    </View>
                    <View
                        style={[{
                            backgroundColor: '#F9F9F9',
                            borderColor: '#05E3D5',
                            borderRadius: 10,
                            marginLeft: 5,
                            paddingHorizontal: 5,
                            width: 110
                        }]}>
                        <SelectDropdown
                            data={['Free', 'Paid']}
                            onSelect={(selectedItem) => {
                                // setFieldValue('status', selectedItem)
                            }}
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            defaultButtonText='Free/Paid'
                            buttonTextStyle={{ textAlign: 'left', color: '#1E1E1E', fontSize: 14 }}
                            dropdownStyle={{ width: '25%', borderRadius: 10 }}
                            rowTextStyle={{ fontSize: 14 }}
                            defaultValue={''}
                        />
                    </View>

                </View>
                <ScrollView>

                    {
                        isListView &&
                        <ListView />
                    }
                </ScrollView>
            </View>
            {
                !isListView &&
                <MapView />

            }
        </SafeAreaView>
    )
}

export default SearchGigScreen

const styles = StyleSheet.create({
    cardContainer: { marginBottom: 10 }

})