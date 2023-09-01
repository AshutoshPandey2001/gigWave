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
    console.log("base64_image", image)
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `${API_BASE_URL}/user/imageb64/`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                "user_id": userID,
                "base64_image": image
            }
        }).then((response) => {
            console.log(response, '---------------------')
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })

    })


};

export const getProfilePhoto = async (userID: any, token: any) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: `${API_BASE_URL}/user/image/${userID}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}