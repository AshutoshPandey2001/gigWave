import React, { useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import fs from 'react-native-fs';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import BackButtonIcon from '../assets/icons/Backbutton.svg';
import { GlobalStyle } from '../globalStyle';
import { RootState } from '../redux/store';
import { uploadProfilePhoto } from '../services/userService/userServices';

// import Modal from 'react-native-modal';

interface UploadPhotosProps {
    isVisible: boolean;
    onClose: () => void;
}

const UploadPhotosScreen = ({ isVisible, onClose }: UploadPhotosProps) => {
    const cameraRef = React.useRef<RNCamera | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [showCamera, setShowCamera] = useState(false); // New state to control camera visibility
    const [capturedImage, setCapturedImage] = useState<string | null>(null); // State to hold the captured image
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

    const user: any = useSelector((state: RootState) => state.user.user);
    const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log('clickedd photo', data.uri);
            // fs.readFile(data.uri, 'base64') // Read the image file as base64
            //     .then((base64Image: any) => {
            //         // Call a function to upload the base64Image to the server
            //         uploadProfilePhoto(user.user_id, firstToken, base64Image).then((res) => {
            //             console.log(res, 'uploaded image')

            //         }).catch((e) => {
            //             console.log('error', JSON.stringify(e));
            //         });
            //     })
            //     .catch((error: any) => {
            //         console.log('Error reading image:', error);
            //     });
            // setCapturedImage(data.uri); // Store the captured image URI
            // setShowCamera(false);
        }
    };
    const retakePhoto = () => {
        setCapturedImage(null); // Reset the captured image URI to retake
        setShowCamera(true);
    };

    const uploadPhoto = () => {
        if (capturedImage) {
            fs.readFile(capturedImage, 'base64')
                .then(async (base64Image: any) => {
                    // console.log('base64Image', base64Image);
                    // const binaryImageData = Buffer.from(base64Image, 'base64'); // Convert base64 to binary
                    const base64Response = await fetch(`data:image/jpeg;base64,${base64Image}`);
                    console.log('binaryImageData', base64Response);


                    // uploadProfilePhoto(user.user_id, firstToken, base64Image)
                    //     .then((res) => {
                    //         console.log(res, 'uploaded image');
                    //         onClose()
                    //         // You might want to perform additional actions here after successful upload
                    //     })
                    //     .catch((e) => {
                    //         console.log('error', JSON.stringify(e));
                    //     });
                })
                .catch((error: any) => {
                    console.log('Error reading image:', error);
                });
        }
    };
    const selectImage = () => {
        console.log('i am on select photo from galary');

        const options: ImageLibraryOptions = {
            // title: 'Select Image',
            mediaType: 'photo', // Add this 
            // storageOptions: {
            //     skipBackup: true,
            //     path: 'images',
            // },
        };

        launchImageLibrary(options, async (response: any) => {
            console.log('image response', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];

                if (selectedImage) {


                    // const response = await fetch(selectedImage.uri);
                    // const blob = await response.blob();
                    // console.log('blob-----------------',selectedImage);
                    uploadProfilePhoto(user.user_id, firstToken, selectedImage)
                        .then((res) => {
                            console.log(res, 'uploaded image');
                            onClose()
                            // You might want to perform additional actions here after successful upload
                        })
                        .catch((e) => {
                            console.log('error', JSON.stringify(e));
                        });
                    // fs.readFile(selectedImage.uri, 'base64')
                    //     .then(async(base64Image: any) => {
                    //         console.log('base64Image', base64Image);
                    //         const base64Response = await fetch(`data:image/jpeg;base64,${base64Image}`);
                    //         console.log('binaryImageData', base64Response);
                    //      
                    //     })
                    //     .catch((error: any) => {
                    //         console.log('Error reading image:', error);
                    //     });
                    // You can use the selectedImage.uri as needed
                } else {
                    console.log('No photo selected');
                }
            }
        });
    };
    const toggleCameraType = () => {
        setCameraType((prevCameraType: any) => (
            prevCameraType === RNCamera.Constants.Type.back
                ? RNCamera.Constants.Type.front
                : RNCamera.Constants.Type.back
        ));
    };
    return (
        <Modal visible={isVisible}>
            <View style={{ flex: 1 }}>
                {showCamera ? (
                    <View style={{ flex: 1 }}>
                        <RNCamera
                            ref={cameraRef}
                            style={{ flex: 1 }}
                            type={cameraType}
                            onCameraReady={() => setIsCameraReady(true)}
                        />
                        <TouchableOpacity onPress={takePicture} style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Capture Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowCamera(false)} style={{ position: 'absolute', top: 20, left: 20 }}>
                            {/* <BackButtonIcon fill="white" /> */}

                            <Text style={{ fontSize: 18, color: 'white' }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleCameraType} style={{ position: 'absolute', top: 20, right: 20 }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>Toggle Camera</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {capturedImage ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={{ uri: capturedImage }} style={{ width: 400, height: '100%' }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 20, width: '100%' }}>
                                    <TouchableOpacity onPress={retakePhoto}>
                                        <Text style={{ fontSize: 18, marginLeft: 20, color: 'white' }}>Retake</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={uploadPhoto}>
                                        <Text style={{ fontSize: 18, marginRight: 20, color: 'white' }}>Upload</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 15, marginLeft: -80 }}>
                                    <BackButtonIcon onPress={onClose} />
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, flex: 1, paddingLeft: 20, color: '#000' }}> Upload Photo</Text>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => setShowCamera(true)} style={GlobalStyle.button}>
                                        <Text style={GlobalStyle.btntext}>Open Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={selectImage} style={GlobalStyle.button}>
                                        <Text style={GlobalStyle.btntext}>Select from Gallery</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                        )}
                    </View>
                )}
            </View>
        </Modal>

    );
};

export default UploadPhotosScreen;
