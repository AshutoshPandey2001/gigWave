import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyle } from '../../globalStyle'
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import SearchIcon from '../../assets/icons/gig Search bar.svg'
import MicIcon from '../../assets/icons/Mic.svg'
import MarkerIcon from '../../assets/icons/marker.svg'
import MapMarkerIcon from '../../assets/icons/map-marker.svg'
import DatePicker from 'react-native-date-picker'
import MapView, { Callout, Marker, Region } from 'react-native-maps'
import LocationSearch from '../../components/LocationSearch'
import { searchGigbyParameter } from '../../services/proUserService/proUserService'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import debounce from 'lodash.debounce';
import { getGigByGig_id } from '../../services/gigService/gigService'
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform } from 'react-native';
import { geocodeLocationByName } from '../../services/googleMapServices'

const SearchGigScreen = ({ navigation }: any) => {
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
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

    const closeModel = () => {
        setModalVisible(false)
    }
    const onChangeSearch = (value: any) => {
        setSearchValue(value)
        debouncedSearch(value, location, gigType)
    }
    const onChangeLocation = (value: any) => {
        setLocation(value)
        debouncedSearch(searchValue, value, gigType)
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
        debouncedSearch(searchValue, location, interestgig)

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
        checkPermission();
    }, [])

    const checkPermission = async () => {
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

    const getProList = () => {
        let option = JSON.parse(JSON.stringify([
            { image: require('../../assets/images/list1.png'), title: 'Help for Dad', summary: 'Experience working with elderly, Housecleaning, Cooking.', gig_type: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', summary: 'Experience working with elderly, Housecleaning, Cooking.', gig_type: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', summary: 'Seeking  piano player for two hour family reunion', gig_type: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', summary: 'Experience working with elderly, Housecleaning, Cooking.', gig_type: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', summary: 'Seeking  piano player for two hour family reunion', gig_type: 'Paid', isProList: true },
            { image: require('../../assets/images/list2.png'), title: 'Move a couch', summary: 'Experience working with elderly, Housecleaning, Cooking.', gig_type: 'Unpaid', isProList: false },
            { image: require('../../assets/images/piano.png'), title: 'Play Piano', summary: 'Seeking  piano player for two hour family reunion', gig_type: 'Paid', isProList: true }
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
                    initialRegion={initialRegion}
                >
                    {/* Display user's current location with a marker */}

                    <Marker
                        // image={require('../../assets/images/marker-current_location.png')}
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        // pinColor="#05E3D5"
                        title="Your Location"
                    >
                        <Image resizeMode="contain" source={require('../../assets/images/marker-current_location.png')} style={{ width: 30, height: 30 }} />
                        {/* Callout to display location name */}
                        <Callout>
                            <View>
                                <Text>{'Your Location'}</Text>
                            </View>
                        </Callout>
                    </Marker>

                    {nearbyLocationsgigs.map((location: any, index: number) => (
                        <Marker
                            key={index}
                            // image={require('../../assets/images/marker-nearby-gigs.png')}
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            pinColor="red"
                            title={location.locationName}
                        >
                            {/* Callout to display location name */}
                            <Image resizeMode="contain" source={require('../../assets/images/marker-nearby-gigs.png')} style={{ width: 30, height: 30 }} />
                            <Callout>
                                <View>
                                    <Text>{location.locationName}</Text>
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
            "interest_gig_type": gigType
        }

        try {
            dispatch(setLoading(true));
            const matchedGigs = await searchGigbyParameter(gigParms, firstToken);
            // matchedGigs.map((item: any) => item.image = require('../../assets/images/list1.png'))

            console.log('all gig Searched', matchedGigs);
            setProLists(matchedGigs);
            if (!isListView) {
                // await matchedGigs.map((gig: any) => {
                //     geocodeLocationByName(gig.address).then(async (res: any) => {
                //         console.log('response', res);

                //         await temp_data.push(res)
                //     }).catch((error: any) => {
                //         console.error(error);

                //     })
                // })
                const geocodePromises = matchedGigs.map((gig: any) => {
                    return geocodeLocationByName(gig.address)
                        .then((res: any) => {
                            return res;
                        })
                        .catch((error: any) => {
                            console.error(error);
                            return null;
                        });
                });

                Promise.all(geocodePromises)
                    .then((results) => {
                        const temp_data = results.filter((result) => result !== null);
                        setNearbyLocationsgigs(temp_data)
                    })
                    .catch((error) => {
                        console.error('Error while geocoding:', error);
                    });
                // const { latitude, longitude } = temp_data[0];
                // console.log('temp_data[0]', temp_data);

                // setInitialRegion((prevState) => ({
                //     ...prevState,
                //     latitude,
                //     longitude,
                // }));
                // setNearbyLocationsgigs(temp_data)
            }
            dispatch(setLoading(false));
        } catch (error) {
            console.error('errorr', JSON.stringify(error));
            dispatch(setLoading(false));
        }

    }
    // const debouncedSearch = debounce(searchGigs, 5000);
    const debouncedSearch = debounce((search: string, location: string, gigType: string) => {
        searchGigs(search, location, gigType);
    }, 3000);
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
                                onChangeLocation(location)

                                // setLocation(location.description)
                                // values.address = location.description

                            }}
                            closeModel={closeModel}
                        />

                        <Text numberOfLines={1} style={{ width: '100%', fontSize: 16, color: '#000', paddingLeft: 10 }} onPress={() => setModalVisible(true)}>{location ? location.description : 'San Francisco'}</Text>
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