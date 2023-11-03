import React, { useRef } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import BackButtonIcon from '../assets/icons/Backbutton.svg';
import { GlobalStyle } from '../globalStyle';

interface LocationSearchProps {
    placeholder: string;
    isModalVisible: boolean;
    notifyChange: (location: any) => void;
    closeModel: () => void;
}

const LocationSearch = ({ placeholder, isModalVisible, notifyChange, closeModel }: LocationSearchProps) => {
    const autocompleteRef = useRef<any | null>(null);
    // const [isModalVisible, setModalVisible] = useState(false);
    // console.log('isModalVisible', isModalVisible);

    const apiKey = "AIzaSyA5sBOIt1fXpYGll4Kb_808VXSwly-M37o"
    const handlePress = (data: any, details: any) => {
        // if (autocompleteRef.current) {
        //     autocompleteRef.current.setAddressText('');
        // }
        // console.log('details.geometry.location', data);

        // setModalVisible(false);
        // notifyChange(details.geometry.location);
        notifyChange(data);
    };
    // const toggleModal = () => {
    //     setModalVisible(!isModalVisible);
    // };

    return (
        <ScrollView horizontal={true} style={{ width: "100%", flexDirection: 'row' }} keyboardShouldPersistTaps={'always'}>
            <View>
                {/* <TouchableOpacity onPress={toggleModal} style={styles.lockIconContainer} > */}
                <Modal visible={isModalVisible} animationType="slide" >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 15, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
                        <BackButtonIcon onPress={closeModel} />
                        <Text style={{ fontWeight: 'bold', fontSize: 18, flex: 1, paddingLeft: 20, color: '#000' }}> Search {placeholder}</Text>
                    </View>

                    <GooglePlacesAutocomplete
                        placeholder={placeholder}
                        minLength={2}
                        fetchDetails={true}
                        listViewDisplayed={false}
                        keyboardShouldPersistTaps={'handled'}
                        onPress={(data, details = null) => handlePress(data, details)}
                        onFail={error => console.log('error', error)}
                        onNotFound={() => console.log('no results')}
                        enablePoweredByContainer={false}
                        query={{
                            key: apiKey,
                            language: 'en'
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={300}
                        ref={autocompleteRef}
                        textInputProps={{
                            placeholderTextColor: 'gray',
                        }}
                        styles={{

                            container: GlobalStyle.container,
                            textInput: [GlobalStyle.card, { height: 50, color: '#000' },
                            ],
                            listView: { backgroundColor: '#f5f5f5', borderRadius: 10, color: '#000' },
                            row: { backgroundColor: '#f5f5f5', color: '#000' },
                            description: { color: '#000' },
                            predefinedPlacesDescription: { color: '#000' }
                        }}

                    />


                </Modal>
                {/* </TouchableOpacity> */}

            </View >
        </ScrollView>

        // <ScrollView horizontal={true} style={{ width: "100%", flexDirection: 'row' }}>
        //     <View style={{ flex: 1 }}>
        //         <LockIcon />
        //     </View>
        // <GooglePlacesAutocomplete
        //     placeholder={placeholder}
        //     minLength={2}
        //     fetchDetails={true}
        //     listViewDisplayed={true}
        //     onPress={(data, details) => handlePress(data, details)}
        //     query={{
        //         key: apiKey,
        //         language: 'en'
        //     }}
        //     nearbyPlacesAPI='GooglePlacesSearch'
        //     debounce={300}
        //     ref={autocompleteRef}
        // />
        // </ScrollView>
    );
};

const styles = StyleSheet.create({
    lockIconContainer: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    closeButton: {
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    autocompleteContainer: {

        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});
export default LocationSearch