import axios from "axios";
import { API_BASE_URL } from "../apiConstant";

export const createGig = async (gigValue: any, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/gig/`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: gigValue
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}
export const getGigByUser = async (user_id: string, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/gig/user/${user_id}`,
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

export const getGigByGig_id = async (gig_id: string, token: any): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/gig/${gig_id}`,
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


export const updateGig = async (gigValue: any, token: any): Promise<any> => {
    console.log('update', gigValue);

    try {
        const response = await axios({
            method: 'put',
            url: `${API_BASE_URL}/gig/`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: gigValue
        });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Rethrow the error to be caught by the caller
    }
}

export const matchProuserwithgig_id = async (gig_id: any, token: any): Promise<any> => {

    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/gig/${gig_id}/matches`,
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

export const getGigThumbnail = async (gig_id: any, token: any): Promise<any> => {

    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/gig/image/${gig_id}`,
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




