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

    try {

        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/user/image/${userID}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: image
        });
        return response.data; // Return the response data
    } catch (error) {
        console.log('error', JSON.stringify(error));

        throw error; // Rethrow the error to be caught by the caller
    }
};