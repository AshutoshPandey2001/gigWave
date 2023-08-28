import axios from "axios";
import { API_BASE_URL } from "../apiConstant";

export const getUserByUserID = async (userID: any, token: any): Promise<any> => {
    try {
        // const phoneNumber1 = new PhoneNumber(phoneNumber, 'IN'); // Replace 'US' with the appropriate country code
        // const formattedPhoneNumber = phoneNumber.format('E.164');
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/user/${userID}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.log('error', JSON.stringify(error));

        throw error; // Rethrow the error to be caught by the caller
    }
};


export const uploadProfilePhoto = async (userID: any, token: any, image: any): Promise<any> => {
    console.log('image', image);
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        // const imageuri = image.uri.replace("file:///", "file://")
        // console.log(imageuri, 'imageuri')
        const file = {
            uri: image.uri,
            type: image.type,
            name: image.fileName,
            size: image.fileSize
        };
        formData.append('file', file);
        axios({
            method: 'post',
            url: `${API_BASE_URL}/user/image/?user_id=${userID}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: formData
        }).then((response) => {
            console.log(response, '---------------------')
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })

    })


};