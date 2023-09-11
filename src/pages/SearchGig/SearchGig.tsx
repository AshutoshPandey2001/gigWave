import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
// import SearchIcon from '../../assets/icons/gig Search bar.svg'
import MicIcon from '../../assets/icons/SearchMic.svg'
import MarkerIcon from '../../assets/icons/marker.svg'
import MapMarkerIcon from '../../assets/icons/map-marker.svg'
import DatePicker from 'react-native-date-picker'
import MapView, { Callout, Marker, Region } from 'react-native-maps'
import LocationSearch from '../../components/LocationSearch'
import { getMatchedGigbyuserid, searchGigbyParameter } from '../../services/proUserService/proUserService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import debounce from 'lodash.debounce';
import { getGigByGig_id } from '../../services/gigService/gigService'
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform } from 'react-native';
import { geocodeLocationByName } from '../../services/googleMapServices'
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices'
import SearchIcon from '../../assets/icons/Search.svg'

const SearchGigScreen = ({ navigation }: any) => {
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState<string>('');
    const dispatch = useDispatch()
    const [initialRegion, setInitialRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [currentLocation, setcurrentLocation] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [searchValue, setSearchValue] = useState('')
    const [gigType, setGigType] = useState('')
    const { isListView }: any = useSelector((state: RootState) => state.isListView)
    const [proLists, setProLists] = useState<any[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Specify the type as Date | null
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [location, setLocation] = useState<any>();
    const [nearbyLocationsgigs, setNearbyLocationsgigs] = useState<any>([]);
    const user: any = useSelector((state: RootState) => state.user.user);

    const closeModel = () => {
        setModalVisible(false)
    }
    const onChangeSearch = () => {
        if (!searchValue || !location || !gigType) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: "Address / Payment type is required",
            });
            return;
        }
        searchGigs(searchValue, location, gigType)
    }
    const onChangeLocation = (value: any) => {
        setLocation(value)

        // searchGigs(searchValue, value, gigType)
        geocodeLocationByName(value.description)
            .then((res: any) => {
                const { latitude, longitude } = res;
                setInitialRegion((prevState) => ({
                    ...prevState,
                    latitude,
                    longitude,
                }));
                return res;
            })
            .catch((error: any) => {
                console.error(error);
                return null; // Handle errors gracefully if needed
            });
    }
    const separateAddressComponents = (addressJSON: any) => {
        const terms = addressJSON.terms.slice(-3); // Extract last three terms
        const city = terms[0].value;
        const state = terms[1].value;
        const country = terms[2].value;
        return { city, state, country };
    }
    const onChangegigType = (value: any) => {
        let interestgig = undefined
        if (value === "Free") {
            interestgig = "unpaid"
            setGigType('unpaid')
        } else {
            interestgig = "paid"
            setGigType('paid')
        }
        // searchGigs(searchValue, location, interestgig)

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
        checkPermission()
        checkPermissionGooglemap();
    }, [])

    const checkPermissionGooglemap = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION

        try {
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) {
                getCurrentLocation()
                console.log('Permission already granted', hasPermission);
            } else {
                const status = await PermissionsAndroid.request(permission);
                if (status === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation()
                    console.log('Permission granted', status);
                } else {
                    console.log('Permission denied');
                }
            }
        } catch (error) {
            console.error('Error checking or requesting permission:', error);
        }
    };
    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log('latitude, longitude', latitude, longitude);
                setInitialRegion((prevState) => ({
                    ...prevState,
                    latitude,
                    longitude,
                }));
                setcurrentLocation((prevState) => ({
                    ...prevState,
                    latitude,
                    longitude,
                }))
            },
            error => {
                console.error('error on getting current location', error);
                // Handle location permission error here
            },
            // { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
    }
    const startRecognizing = async () => {

        const granted = await checkPermission();

        if (!granted) {
            // Permissions not granted, return early
            console.log('Permissions not granted');
            return;
        }


        startRecord(setAudioPath, setIsRecording);

    }
    const stopRecording = async () => {
        stopRecord(setIsRecording);
        console.log('audioPath', audioPath);
        dispatch(setLoading(true))

        readAudioFile(audioPath)
            .then((base64Data) => {
                if (base64Data) {
                    const audioDataToSend = {
                        audio_base64: base64Data,
                        audio_format: 'mp4', // Set the desired audio format
                    };
                    audioToText(audioDataToSend, firstToken).then((res: any) => {
                        dispatch(setLoading(false))
                    }).catch((error) => {
                        console.error('error', error);
                        dispatch(setLoading(false))
                    })
                }
            })
            .catch((error) => {
                dispatch(setLoading(false))
                console.error('Error reading audio file:', error);
            });
    }
    const getProList = async () => {
        try {
            dispatch(setLoading(true));
            const matchedGigs = await getMatchedGigbyuserid(user.user_id, firstToken);
            setProLists(matchedGigs);
            dispatch(setLoading(false));
        } catch (error) {
            console.error(JSON.stringify(error));
            dispatch(setLoading(false));
        }
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
                                            <Image resizeMode='contain' style={styles.imageStyle} source={item.thumbnail_img_url ? { uri: item.thumbnail_img_url } : item.image} />
                                        </View>
                                        <View style={{ flex: 1, width: 100 }}>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 18, marginHorizontal: 10, paddingTop: 10, fontWeight: 'bold' }]}>
                                                {item.title}
                                            </Text>
                                            <Text style={[GlobalStyle.blackColor, { fontSize: 16, margin: 10, }]}>
                                                {item.summary}
                                            </Text>
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <Pressable style={{ backgroundColor: item.gig_type === 'Paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                                <Text style={{ color: '#fff' }}>{item.gig_type}</Text>
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                </View>
                            ))
                            }
                        </>
                        :
                        <>
                            <ScrollView>
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
                            </ScrollView>
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
                    initialRegion={initialRegion}

                >
                    {/* Display user's current location with a marker */}

                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Your Location"
                    >
                        <Image resizeMode="contain" source={require('../../assets/images/marker-current_location.png')} style={{ width: 30, height: 30 }} />
                        <Callout>
                            <View>
                                <Text>{'Your Location'}</Text>
                            </View>
                        </Callout>
                    </Marker>

                    {proLists.map((location: any, index: number) => (
                        <Marker
                            key={index}
                            // image={require('../../assets/images/marker-nearby-gigs.png')}
                            coordinate={{
                                latitude: location.lat,
                                longitude: location.lon,
                            }}
                            pinColor="red"
                            title={location.address}
                        >
                            {/* Callout to display location name */}
                            <Image resizeMode="contain" source={require('../../assets/images/marker-nearby-gigs.png')} style={{ width: 30, height: 30 }} />
                            <Callout>
                                <View>
                                    <Text>{location.address}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
                {/* <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={require('../../assets/images/mapImage.png')} /> */}
            </View>
        )
    }

    const searchGigs = async (searchValue: any, location: any, gigType: any) => {
        if (!searchValue || !location || !gigType) {
            return;
        }
        const { city, state, country } = await separateAddressComponents(location);
        console.log('city, state, country', city, state, country);

        const gigParms = await {
            "city": city,
            "country": country,
            "state": state,
            "search_query": searchValue,
            "interest_gig_type": gigType,
            "user_id": user.user_id
        }

        try {
            dispatch(setLoading(true));
            const matchedGigs = await searchGigbyParameter(gigParms, firstToken);

            setProLists(matchedGigs);
            dispatch(setLoading(false));
        } catch (error) {
            console.error('errorr', JSON.stringify(error));
            dispatch(setLoading(false));
        }

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
                    {/* <SearchIcon height={25} width={25} style={{ marginLeft: 5 }} /> */}
                    <TextInput
                        onChangeText={text => setSearchValue(text)}
                        value={searchValue}
                        placeholder='Search here'
                        style={{ padding: 5, flex: 1, fontSize: 16 }}
                    />
                    {searchValue ?
                        <TouchableOpacity onPress={() => onChangeSearch()} >
                            <SearchIcon height={30} width={30} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={isRecording ? stopRecording : startRecognizing} >
                            {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/SearchStopRecord.png')} style={{ width: 30, height: 30 }} /> : <MicIcon height={30} width={30} />}
                        </TouchableOpacity>

                    }
                    {/* <TouchableOpacity onPress={isRecording ? stopRecording : startRecognizing} >
                        {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 50, height: 50 }} /> : <MicIcon height={50} width={50} />}
                    </TouchableOpacity> */}
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
                                onChangeLocation(location)

                                // setLocation(location.description)
                                // values.address = location.description

                            }}
                            closeModel={closeModel}
                        />

                        <Text numberOfLines={1} style={{ width: '100%', fontSize: 16, color: '#000', paddingLeft: 10 }} onPress={() => setModalVisible(true)}>{location ? location.description : 'Address'}</Text>
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
                                onChangegigType(selectedItem)
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
    imageStyle: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 120,
        width: 100
    }
})