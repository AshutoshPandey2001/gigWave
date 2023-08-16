import axios from "axios";
import { API_BASE_URL, BEARER_TOKEN } from "../apiConstant";
import { PhoneNumber } from "libphonenumber-js";




export const getOtp = async (phoneNumber: any): Promise<any> => {
    try {
        // const phoneNumber1 = new PhoneNumber(phoneNumber, 'IN'); // Replace 'US' with the appropriate country code
        // const formattedPhoneNumber = phoneNumber.format('E.164');
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/device/otp?phone_number=${phoneNumber}`,
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
};

export const verifyOtp = async (phoneNumber: any, otp: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/device/otp?phone_number=${phoneNumber}&otp=${otp}`,
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}


export const createUser = async (userData: any): Promise<any> => {
    console.log('userData', JSON.stringify(userData));

    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/user/`,
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(userData),
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}