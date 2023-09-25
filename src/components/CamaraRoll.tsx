import React, { useState } from 'react';
import { Dimensions, Modal, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import fs from 'react-native-fs';
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import CamaraIcon from '../assets/icons/camera1.svg';
import CloseIcon from '../assets/icons/close.svg';
import GalleryIcon from '../assets/icons/image1.svg';
import { GlobalStyle } from '../globalStyle';
import { setUser } from '../redux/action/Auth/authAction';
import { setLoading } from '../redux/action/General/GeneralSlice';
import { RootState } from '../redux/store';
import { getUserByUserID, uploadProfilePhoto } from '../services/userService/userServices';

// import Modal from 'react-native-modal';

interface UploadPhotosProps {
    isVisible: boolean;
    onClose: () => void;
    setProfilePic: any;
    uploadFunction: (imageData: string) => void;
}

const UploadPhotosScreen = ({ isVisible, onClose, setProfilePic, uploadFunction }: UploadPhotosProps) => {
    const cameraRef = React.useRef<RNCamera | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [showCamera, setShowCamera] = useState(false); // New state to control camera visibility
    const [capturedImage, setCapturedImage] = useState<string | null>(null); // State to hold the captured image
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const dispatch = useDispatch();
    const windowHeight = Dimensions.get('window').height;


    const requestCameraPermission = async () => {
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
                console.log('You can use the camera');
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
                        console.log(res, 'original ROtation--------------------')
                        const selectedImage = res.assets[0];
                        uploadFunction(selectedImage);
                        // fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
                        //     setProfilePic(`data:image/jpeg;base64,${imgRes}`)
                        //     uploadProfilePhoto(user.user_id, firstToken, imgRes)
                        //         .then((res) => {
                        //             console.log(res, 'uploaded image');
                        //             getUserByUserID(user.user_id, firstToken).then((response) => {
                        //                 // console.log('res--------', response.base64_img);
                        //                 const dataURI = `data:image/jpeg;base64,${response.base64_img}`; // Assuming res is a base64 encoded image
                        //                 setProfilePic(dataURI);
                        //                 dispatch(setLoading(false))
                        //                 dispatch(setUser(response))
                        //             })
                        //             dispatch(setLoading(false))
                        //             // You might want to perform additional actions here after successful upload
                        //         }).catch((err) => { dispatch(setLoading(false)); console.error(err) })
                        // })
                    }
                });
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };
    const selectImage = () => {
        console.log('i am on select photo from galary');

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
                fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
                    setProfilePic(`data:image/jpeg;base64,${imgRes}`)
                    uploadProfilePhoto(user.user_id, firstToken, imgRes)
                        .then((res) => {
                            console.log(res, 'uploaded image');
                            getUserByUserID(user.user_id, firstToken).then((response) => {
                                // console.log('res--------', response.base64_img);
                                const dataURI = `data:image/jpeg;base64,${response.base64_img}`; // Assuming res is a base64 encoded image
                                setProfilePic(dataURI);
                                dispatch(setLoading(false))
                                dispatch(setUser(response))
                            })
                            dispatch(setLoading(false))
                            // You might want to perform additional actions here after successful upload
                        }).catch((err) => { dispatch(setLoading(false)); console.error(err) })
                })
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
                    <TouchableOpacity onPress={() => requestCameraPermission()} style={[styles.btn, { borderRadius: 15 }]}>
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
