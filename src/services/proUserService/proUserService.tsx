import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, TOKEN_URL } from "../apiConstant";

export const createProUsers = async (userData: any, token: any): Promise<any> => {
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


export const getMatchedGigbyuserid = async (user_id: string, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/pro/gigs/${user_id}`,
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

export const searchGigbyParameter = async (searchParms: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/pro/gig/search`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: searchParms
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}

export const proInterestgig = async (interestValue: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/pro/gig/interest`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: interestValue
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}
export const notInterested = async (value: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'put',
            url: `${API_BASE_URL}/matching/`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: value
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}


export const backGroundCheck_pro = async (userData: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/pro/request-background-check`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: userData
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}

export const checkProItrestedGig = async (matchingData: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'put',
            url: `${API_BASE_URL}/matching/exists`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: matchingData
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}


export const uploadChatimages = async (imageValues: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/chat/image`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: imageValues
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}
export const getImageFromdb = async (imgUrl: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${imgUrl}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}
