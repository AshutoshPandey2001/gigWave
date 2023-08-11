import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
// import SearchIcon from '../../assets/icons/Search.svg'
import SearchIcon from '../../assets/icons/gig Search bar.svg'
import MicIcon from '../../assets/icons/Mic.svg'
import MarkerIcon from '../../assets/icons/marker.svg'
import DatePicker from 'react-native-date-picker'
import MapView from 'react-native-maps'
import LocationSearch from '../../components/LocationSearch'

const SearchGigScreen = ({ navigation }: any) => {
    const [searchValue, setSearchValue] = useState('')
    const { isListView }: any = useSelector((state: RootState) => state.isListView)
    const [proLists, setProLists] = useState([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Specify the type as Date | null
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const closeModel = () => {
        setModalVisible(false)
    }
    const onChangeSearch = (value: any) => {
        setSearchValue(value)
    }
    const openDatePicker = () => {
        setDatePickerVisible(true);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setDatePickerVisible(false)
        // Do something with the selected date
    };
    const formatDate = (date: { toISOString: () => string }) => {
        return date.toISOString().split('T')[0]; // Extract only the date part
    };
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
                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>Gig Discovery</Text>
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
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginHorizontal: 10, paddingTop: 10, fontWeight: 'bold' }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 16, margin: 10, }]}>
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
                                <Text style={[GlobalStyle.blackColor, { fontSize: 22 }]}>
                                    No gigs in your area match your skills.  Expand your search area or add these skills to your profile.
                                </Text>
                            </View>

                            <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontStyle: 'italic' }]}>
                                    Popular skills:
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
                                    lawn care
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
                                    heavy lifting
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
                                    meal prep
                                </Text>
                                <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
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
    const MyMapView = (props: any) => {
        return (
            <View style={{ height: '75%', width: '100%' }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Add markers, polygons, etc. here */}
                </MapView>
                {/* <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../assets/images/mapImage.png')} /> */}
            </View>
        )
    }

    return (
        <SafeAreaView>
            <View style={{ marginHorizontal: 10, marginTop: 0 }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderColor: '#05E3D5',
                        borderWidth: 1,
                        borderRadius: 10,

                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5
                    }}>
                    <SearchIcon height={25} width={25} style={{ marginLeft: 5 }} />
                    <TextInput
                        onChangeText={text => onChangeSearch(text)}
                        value={searchValue}
                        placeholder='Search here'
                        style={{ padding: 5, flex: 1, fontSize: 16 }}
                    />
                    <MicIcon height={50} width={50} />
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                    justifyContent: 'space-between'
                }}>

                    <View
                        style={[{
                            backgroundColor: '#F9F9F9',
                            borderColor: '#05E3D5',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            flex: 1,
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            overflow: 'hidden',
                            justifyContent: 'center'
                        }]}>
                        <MarkerIcon height={22} width={22} color={'black'} />

                        <LocationSearch
                            placeholder="Address"
                            isModalVisible={isModalVisible}
                            // notifyChange={handleLocationChange}
                            notifyChange={location => {
                                setModalVisible(false);
                                console.log('location', location);

                                // values.address = location.description
                                ;
                            }}
                            closeModel={closeModel}
                        />
                        <Text style={{ width: '100%', fontSize: 16, color: '#000' }} onPress={() => setModalVisible(true)}>San Francisco</Text>
                        {/* <TextInput
                            onChangeText={text => console.log(text)}
                            value={'San Francisco'}
                            placeholder='City'
                            placeholderTextColor={'#1E1E1E'}
                            // keyboardType='number-pad'
                            style={{ fontSize: 16 }}
                        /> */}
                    </View>
                    <View>
                        <View
                            style={{
                                backgroundColor: '#F9F9F9',
                                borderColor: '#05E3D5',
                                borderRadius: 10,
                                paddingHorizontal: 5,
                                marginLeft: 5,
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ width: '100%', fontSize: 16, color: '#000' }} onPress={openDatePicker}>{selectedDate ? formatDate(selectedDate) : 'Posted On'}</Text>
                            {/* <TextInput
                                onPressIn={openDatePicker}
                                value={selectedDate ? formatDate(selectedDate) : ''} // Display the selected date in the TextInput
                                placeholder='Posted On'
                                placeholderTextColor={'#1E1E1E'}
                                editable={true}
                                aria-disabled
                                style={{ fontSize: 16, color: '#000' }} // Adjust text color if needed
                            /> */}
                        </View>
                        {/* {datePickerVisible && ( */}
                        <DatePicker
                            modal
                            open={datePickerVisible}
                            date={selectedDate || new Date()}
                            mode='date'
                            // onDateChange={handleDateChange}
                            onConfirm={(date) => {
                                handleDateChange(date)
                                setDatePickerVisible(false)
                            }}
                            onCancel={() => {
                                setDatePickerVisible(false)
                            }}
                        />
                        {/* )} */}
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
                            buttonTextStyle={{ textAlign: 'left', color: '#1E1E1E', fontSize: 16 }}
                            dropdownStyle={{ width: '25%', borderRadius: 10 }}
                            rowTextStyle={{ fontSize: 16 }}
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
                <MyMapView />

            }
        </SafeAreaView>
    )
}

export default SearchGigScreen

const styles = StyleSheet.create({
    cardContainer: { marginBottom: 10 },
    inputContainer: {
        backgroundColor: '#F9F9F9',
        borderColor: '#05E3D5',
        borderRadius: 10,
        paddingHorizontal: 5,
        marginLeft: 5,
        flex: 1,
    },

})