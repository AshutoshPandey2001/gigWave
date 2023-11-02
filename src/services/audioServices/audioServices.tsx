import axios from "axios";
import { PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AVModeIOSOption, AudioEncoderAndroidType, AudioSourceAndroidType } from 'react-native-audio-recorder-player';
import RNFetchBlob from "rn-fetch-blob";
import { PERMISSIONS, request, PermissionStatus } from 'react-native-permissions';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const checkPermission = async () => {
    if (Platform.OS == 'android') {
        const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        try {
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) {
                // console.log('Permission already granted', hasPermission);
                return true
            } else {
                const status = await PermissionsAndroid.request(permission);
                if (status === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission granted', status);
                    return true
                } else {
                    console.log('Permission denied');
                    return false
                }
            }
        } catch (error) {
            console.error('Error checking or requesting permission:', error);
        }
    } else {
        return request(PERMISSIONS.IOS.MICROPHONE).then((result: PermissionStatus) => {
            console.log(result, 'microphone permission granted')
            return true
        }).catch(() => { return false })
    }
};


export const startRecord = async (
    setAudioPath: React.Dispatch<React.SetStateAction<string>>,
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        const fileName = `recording${Date.now()}`;
        const path = Platform.select({
            ios: `${fileName}.aac`,
            android: `${RNFetchBlob.fs.dirs.CacheDir}/${fileName}.mp4`, //don't use mp4, it'll increase app size
        });
        const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            AVModeIOS: AVModeIOSOption.videochat,
        };
        const result = await audioRecorderPlayer.startRecorder(path, audioSet);
        console.log(result, 'result recorde')

        console.log('start recording,', result);
        if (result === "Already recording")
            audioRecorderPlayer.removeRecordBackListener();
        audioRecorderPlayer.addRecordBackListener((e) => {
            setAudioPath(result);
            setIsRecording(true);
        });
    } catch (error) {
        console.error('Error starting recording:', error);
        audioRecorderPlayer.removeRecordBackListener();
    }
};

export const stopRecord = async (
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
        console.log('stop recording', result);
        return true
    } catch (error) {
        console.error('Error stopping recording:', error);
        return false
    }
};



export const readAudioFile = async (audioPath: string): Promise<string | null> => {
    try {
        const filePath = Platform.OS === 'android' ? audioPath : audioPath.replace('file://', '')
        const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');
        // console.log('base64Data', base64Data);
        // Process the base64 data or return it as needed
        return base64Data;
    } catch (error) {
        console.error('Error reading audio file:', error);
        // Handle errors related to reading the audio file
        throw error;
    }
};


export const audioToText = async (audio: any, token: any) => {
    try {
        const response = await axios({
            method: 'post',
            url: `https://lab.gigwave.app/api/transcribe-b64/`,

            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: audio
        });
        // console.log('response.data', response.data);
        return response.data; // Return the response data
    } catch (error: any) {
        console.log(error.message);

        throw error; // Rethrow the error to be caught by the caller
    }
}