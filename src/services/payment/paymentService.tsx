import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../apiConstant";

export const onboardUser = async (userData: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/onboard_user?user_id=${userData.user_id}`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error('error', error);

        throw error; // Rethrow the error to be caught by the caller
    }
}
export const checkAccountStatus = async (userData: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/check_account_status/${userData.user_id}`,
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

export const paymentIntent = async (intent: any, token: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios({
                method: 'post',
                url: `${API_BASE_URL}/create_payment_intent`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: intent
            });
            resolve(response.data); // Return the response data
        } catch (error) {
            reject(error)
        }

    })
}