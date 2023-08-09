import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LockIcon from '../assets/icons/lock.svg'

interface LocationSearchProps {
    placeholder: string;
    notifyChange: (location: any) => void;
}

const LocationSearch = ({ placeholder, notifyChange }: LocationSearchProps) => {
    const autocompleteRef = useRef<any | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const apiKey = "AIzaSyA5sBOIt1fXpYGll4Kb_808VXSwly-M37o"
    const handlePress = (data: any, details: any) => {
        // if (autocompleteRef.current) {
        //     autocompleteRef.current.setAddressText('');
        // }
        console.log('details.geometry.location', details.geometry.location, data);

        setModalVisible(false);
        notifyChange(details.geometry.location);
    };
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <ScrollView horizontal={true} style={{ width: "100%", flexDirection: 'row' }}>
            <View>
                <TouchableOpacity onPress={toggleModal} style={styles.lockIconContainer}>
                    <Modal visible={isModalVisible} animationType="slide" >
                        <ScrollView contentContainerStyle={styles.modalContent} horizontal={true} style={{ width: "100%", flexDirection: 'row' }}>
                            <GooglePlacesAutocomplete
                                placeholder={placeholder}
                                minLength={2}
                                fetchDetails={true}
                                listViewDisplayed={false}
                                onPress={(data, details) => handlePress(data, details)}
                                query={{
                                    key: apiKey,
                                    language: 'en'
                                }}
                                nearbyPlacesAPI='GooglePlacesSearch'
                                debounce={300}
                                ref={autocompleteRef}

                            />
                        </ScrollView>
                    </Modal>
                </TouchableOpacity>

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
});
export default LocationSearch