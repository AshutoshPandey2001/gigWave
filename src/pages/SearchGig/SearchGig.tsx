import React, { useEffect, useState, useRef } from 'react'
import { Dimensions, Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalStyle } from '../../globalStyle'
import { RootState } from '../../redux/store'
// import SearchIcon from '../../assets/icons/gig Search bar.svg'
import Geolocation from '@react-native-community/geolocation'
import { useIsFocused } from '@react-navigation/native'
import DatePicker from 'react-native-date-picker'
import MapView, { Marker, Region } from 'react-native-maps'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import SearchIcon from '../../assets/icons/Search.svg'
import MicIcon from '../../assets/icons/SearchMic.svg'
import MarkerIcon from '../../assets/icons/marker.svg'
import CommanAlertBox from '../../components/CommanAlertBox'
import LocationSearch from '../../components/LocationSearch'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices'
import { geocodeLocationByName } from '../../services/googleMapServices'
import { getMatchedGigbyuserid, searchGigbyParameter } from '../../services/proUserService/proUserService'
var heightY = Dimensions.get("window").height;

const SearchGigScreen = ({ navigation }: any) => {
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const [isRecording, setIsRecording] = useState(false);
    const [audioPath, setAudioPath] = useState<string>('');
    const selectRef = useRef<SelectDropdown>(null);

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
    const [selectedMarker, setSelectedMarker] = useState<any>();
    const focus = useIsFocused();  // useIsFocused as shown         

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
        if (addressJSON.terms && addressJSON.terms?.length) {
            const terms = addressJSON.terms.slice(-3) // Extract last three terms
            if (terms.length === 1) {
                const city = "";
                const state = "";
                const country = terms[0]?.value.trim();
                return { city, state, country };
            }
            else if (terms.length === 2) {
                const city = terms[0]?.value.trim();
                const state = "";
                const country = terms[1]?.value.trim();
                return { city, state, country };

            } else {
                const city = terms[0]?.value.trim();
                const state = terms[1].value.trim();
                const country = terms[2]?.value.trim();
                return { city, state, country };
            }
        }
        else {
            const terms = addressJSON.description.split(",")
            if (terms.length === 1) {
                const city = "";
                const state = "";
                const country = terms[0].trim();
                return { city, state, country };
            }
            else if (terms.length === 2) {
                const city = terms[0].trim();
                const state = "";
                const country = terms[1].trim();
                return { city, state, country };

            } else {
                const city = terms[0].trim();
                const state = terms[1].trim();
                const country = terms[2].trim();
                return { city, state, country };
            }
        }

    }
    const onChangegigType = (value: any) => {
        if (value === "unpaid") {
            setGigType('unpaid')
        } else if (value === "Paid") {
            setGigType('paid')
        } else if (value === "Both") {
            setGigType('all')
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
        setGigType('all')
        setSearchValue("");
        // selectRef.current?.reset();
        setLocation("");
        setSelectedMarker(null);
        if (focus) {
            getDefaultAddress()
            checkPermission()
        }
    }, [focus])
    useEffect(() => {
        getProList();
    }, [])

    const getDefaultAddress = () => {
        setLocation({ description: user.address, terms: [{ "offset": 0, "value": user.city }, { "offset": 10, "value": user.state }, { "offset": 14, "value": user.country }] })
        geocodeLocationByName(user.address)
            .then((res: any) => {
                const { latitude, longitude } = res;
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
            })
            .catch((error: any) => {
                CommanAlertBox({
                    title: 'Error',
                    message: error.message,
                });
                console.error(error);
                return null; // Handle errors gracefully if needed
            });
    }


    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
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
        stopRecord(setIsRecording).then((res) => {
            dispatch(setLoading(true))
            readAudioFile(audioPath)
                .then((base64Data) => {
                    if (base64Data) {
                        const audioDataToSend = {
                            audio_base64: base64Data,
                            audio_format: Platform.OS === "ios" ? 'aac' : 'mp4', // Set the desired audio format
                            platform: Platform.OS
                        };
                        audioToText(audioDataToSend, firstToken).then((res: any) => {
                            setSearchValue(res.text)
                            dispatch(setLoading(false))
                        }).catch((error) => {
                            CommanAlertBox({
                                title: 'Error',
                                message: error.message,
                            });
                            dispatch(setLoading(false))
                        })
                    }
                })
                .catch((error) => {
                    dispatch(setLoading(false))
                    CommanAlertBox({
                        title: 'Error',
                        message: error.message,
                    });
                });
        })
    }

    const handleMarkerPress = (markerData: any) => {
        // Set the selectedMarker state to the clicked marker's data
        setSelectedMarker(markerData);
    };
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
                                <View key={index} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                                    paddingVertical: 0,
                                    paddingHorizontal: 0
                                }]}>
                                    <Pressable onPress={() => navigation.navigate('View-gig', item)}
                                        style={{
                                            display: 'flex', flexDirection: 'row',
                                        }} >
                                        <View>
                                            <Image resizeMode={Platform.OS === 'ios' ? 'cover' : 'contain'} style={styles.imageStyle}
                                                source={{ uri: item.thumbnail_img_url }}
                                            />

                                        </View>
                                        <View style={{ flex: 1, width: 100 }}>
                                            <View style={{
                                                display: 'flex', flexDirection: 'row',
                                            }}>
                                                <Text style={[GlobalStyle.blackColor, styles.title, { flex: 1 }]}>
                                                    {item.title}
                                                </Text>
                                                <View style={{ padding: 10 }}>
                                                    <Pressable style={{ backgroundColor: item.gig_type === 'paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                                        <Text style={{ color: '#fff', textTransform: 'capitalize' }}>{item.gig_type}</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                            <Text style={[GlobalStyle.blackColor, styles.message]}>
                                                {item.informal_description}
                                            </Text>
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
    const MyMapView = () => {
        return (
            <View style={{ height: '71%', width: '100%' }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                    >
                        <Image resizeMode="contain" source={require('../../assets/images/marker-current_location.png')} style={{ width: 30, height: 30 }} />
                    </Marker>

                    {proLists.map((location: any, index: number) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: location.lat,
                                longitude: location.lon,
                            }}
                            pinColor="red"
                            onPress={() => handleMarkerPress(location)}
                        >
                            <Image resizeMode="contain" source={require('../../assets/images/marker-nearby-gigs.png')} style={{ width: 30, height: 30 }} />

                        </Marker>
                    ))}

                </MapView>
                <View style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    right: 10,
                    padding: 10,
                    borderRadius: 10,
                    elevation: 15,
                }}>
                    {selectedMarker && (
                        <View>
                            <Pressable onPress={() => navigation.navigate('View-gig', selectedMarker)} style={[GlobalStyle.card, GlobalStyle.shadowProp,
                            {
                                display: 'flex', flexDirection: 'row', paddingVertical: 0,
                                paddingHorizontal: 0
                            }]} >
                                <View>
                                    <Image resizeMode={Platform.OS === 'ios' ? 'cover' : 'contain'} style={[styles.imageStyle, { height: 150 }]} source={selectedMarker.thumbnail_img_url ? { uri: selectedMarker.thumbnail_img_url } : selectedMarker.image} />
                                </View>
                                <View style={{ flex: 1, width: 100 }}>
                                    <View style={{
                                        display: 'flex', flexDirection: 'row',
                                    }}>
                                        <Text style={[GlobalStyle.blackColor, styles.title, { flex: 1 }]}>
                                            {selectedMarker.title}
                                        </Text>
                                        <View style={{ padding: 10 }}>
                                            <Pressable style={{ backgroundColor: selectedMarker.gig_type === 'paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                                <Text style={{ color: '#fff', textTransform: 'capitalize' }}>{selectedMarker.gig_type}</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <Text style={[GlobalStyle.blackColor, styles.message]}>
                                        {selectedMarker.informal_description}
                                    </Text>
                                </View>

                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    const searchGigs = async (searchValue: any, location: any, gigType: any) => {
        if (!searchValue || !location || !gigType) {
            return;
        }
        const { city, state, country } = await separateAddressComponents(location);

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
            setSelectedMarker(null);
            setProLists(matchedGigs);
            dispatch(setLoading(false));
        } catch (error: any) {
            CommanAlertBox({
                title: 'Error',
                message: error.message,
            });
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
                        placeholderTextColor='gray'
                        style={{ padding: 5, flex: 1, fontSize: 16, color: '#000' }}
                    />
                    {searchValue ?
                        <TouchableOpacity onPress={() => onChangeSearch()} >
                            <SearchIcon height={30} width={30} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={isRecording ? stopRecording : startRecognizing} >
                            {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/SearchStopRecord.png')} style={{ width: 30, height: 30 }} /> : <MicIcon height={30} width={30} />}
                        </TouchableOpacity>
                    }

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
                            notifyChange={location => {
                                setModalVisible(false);
                                onChangeLocation(location)
                            }}
                            closeModel={closeModel}
                        />
                        <Text numberOfLines={1} style={{ width: '100%', fontSize: 16, color: '#000', paddingLeft: 10 }} onPress={() => setModalVisible(true)}>{location ? location.description : 'Address'}</Text>

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

                        </View>
                        <DatePicker
                            modal
                            open={datePickerVisible}
                            date={selectedDate || new Date()}
                            mode='date'
                            onConfirm={(date) => {
                                handleDateChange(date)
                                setDatePickerVisible(false)
                            }}
                            onCancel={() => {
                                setDatePickerVisible(false)
                            }}
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
                            data={['unpaid', 'Paid', 'Both']}
                            onSelect={(selectedItem) => {
                                onChangegigType(selectedItem)
                            }}
                            ref={selectRef}
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            defaultButtonText='Both'
                            buttonTextStyle={{ textAlign: 'left', color: '#1E1E1E', fontSize: 16 }}
                            dropdownStyle={{ width: '25%', borderRadius: 10 }}
                            rowTextStyle={{ fontSize: 16 }}
                        />
                    </View>
                </View>
                <View style={{ height: '90%' }} >
                    {isListView ? <ScrollView >
                        <ListView />
                    </ScrollView> : <MyMapView />}
                </View>

            </View>

            {/* <View style={{ height: '90%' }}>
                {
                    !isListView &&
                    <MyMapView />

                }
            </View> */}

        </SafeAreaView>
    )

}

export default SearchGigScreen

const styles = StyleSheet.create({
    cardContainer: { marginBottom: 200 },
    inputContainer: {
        backgroundColor: '#F9F9F9',
        borderColor: '#05E3D5',
        borderRadius: 10,
        paddingHorizontal: 5,
        marginLeft: 5,
        flex: 1,

    },
    title: {
        fontSize: heightY * 0.022,
        marginHorizontal: 10,
        paddingTop: 10,
        fontWeight: 'bold'
    },
    message: {
        fontSize: heightY * 0.018,
        margin: 10
    },
    imageStyle: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        height: 120,
        width: 100
    }
})