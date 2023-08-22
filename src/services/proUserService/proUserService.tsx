import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, TOKEN_URL } from "../apiConstant";

export const createProUsers = async (userData: any, token: any): Promise<any> => {
    console.log(userData, 'userData');
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/pro/`,
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

export const updateProUsersDetails = async (userData: any, token: any): Promise<any> => {
    console.log(userData, 'userData');
    try {
        const response = await axios({
            method: 'put',
            url: `${API_BASE_URL}/pro/`,
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


export const getProdetailsbyuserid = async (user_id: string, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/pro/${user_id}`,
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