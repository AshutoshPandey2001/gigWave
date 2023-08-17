import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, TOKEN_URL } from "../apiConstant";



export const getLoginToken = async () => {
    try {
        // const phoneNumber1 = new PhoneNumber(phoneNumber, 'IN'); // Replace 'US' with the appropriate country code
        // const formattedPhoneNumber = phoneNumber.format('E.164');
        const config: AxiosRequestConfig = {
            method: 'post',
            url: `${TOKEN_URL}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "client_id": "uolsKx8KLjOFdU6k4TuNpMwjSYIt39Kb",
                "client_secret": "wWubFSTbIelj990ZwDiLL2Y3X5kyxPeEqMbEfb6OsBaf_R-u410jKdQ98xvO5b7Q",
                "audience": "backend.gigwave.ai",
                "grant_type": "client_credentials"
            }
        }
        const response: AxiosResponse = await axios(config);
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}

export const getOtp = async (phoneNumber: any, token: any): Promise<any> => {
    try {
        // const phoneNumber1 = new PhoneNumber(phoneNumber, 'IN'); // Replace 'US' with the appropriate country code
        // const formattedPhoneNumber = phoneNumber.format('E.164');
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/device/otp?phone_number=${phoneNumber}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
};

export const verifyOtp = async (phoneNumber: any, otp: any, token: any): Promise<any> => {
    console.log('phoneNumber otp', phoneNumber, otp);

    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/device/otp?phone_number=${phoneNumber}&otp=${otp}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}


export const createUser = async (userData: any, token: any): Promise<any> => {
    console.log(userData, 'userData');

    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/user/`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: userData,
        });
        return response.data; // Return the response data
    } catch (error) {
        console.log('error', error);

        throw error; // Rethrow the error to be caught by the caller
    }
}
export const checkUser = async (email: string, phone: string, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/user?email=${email}&phone=${phone}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response; // Return the response data
    } catch (error) {

        return error; // Rethrow the error to be caught by the caller
    }
}