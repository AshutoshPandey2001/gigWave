import React, { useEffect } from 'react';
import { Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, checkMultiple } from 'react-native-permissions';
import CamaraIcon from '../assets/icons/camera1.svg';
import CloseIcon from '../assets/icons/close.svg';
import GalleryIcon from '../assets/icons/image1.svg';
import { GlobalStyle } from '../globalStyle';

// import Modal from 'react-native-modal';

interface UploadPhotosProps {
    isVisible: boolean;
    onClose: () => void;
    uploadFunction: (imageData: string) => void;
}

const UploadPhotosScreen = ({ isVisible, onClose, uploadFunction }: UploadPhotosProps) => {

    useEffect(() => {
        if (isVisible)
            requestCameraPermission();
    }, [isVisible])

    const requestCameraPermission = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera ',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera Permission Granted")
                } else {
                    console.log('Camera permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]).then((statuses) => {
                console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                console.log('FaceID', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
            })
        }
    };
    const selectCamera = () => {
        const cameraOption: CameraOptions = {
            mediaType: 'photo',
            saveToPhotos: true,
            cameraType: 'front',
            presentationStyle: 'fullScreen',
            maxHeight: 250,
            maxWidth: 250,
            quality: 1,

        }
        launchCamera(cameraOption, async (res: any) => {
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
            } else {
                onClose()
                const selectedImage = res.assets[0];
                uploadFunction(selectedImage);
            }
        });
    }
    const selectImage = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.2,
            includeBase64: false,

        };
        launchImageLibrary(options, async (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets.length > 0) {
                onClose()
                const selectedImage = response.assets[0];
                uploadFunction(selectedImage);
            }
        })
    };
    return (
        <Modal visible={isVisible} animationType="slide"
            transparent={true} onRequestClose={onClose} onPointerDown={onClose}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onTouchEnd={onClose}>
                <View style={{
                    height: "22%",
                    width: "100%",
                    marginTop: 'auto',
                    backgroundColor: 'white',
                    elevation: 5,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15
                }}>
                    <TouchableOpacity onPress={() => selectCamera()} style={[styles.btn, { borderRadius: 15 }]}>
                        <CamaraIcon height={30} width={30} />
                        <Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Open Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectImage} style={styles.btn}>
                        <GalleryIcon height={30} width={30} />
                        <Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Select from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.btn}>
                        <CloseIcon height={30} width={30} /><Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
};

export default UploadPhotosScreen;

const styles = StyleSheet.create({
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 10
    }
})
