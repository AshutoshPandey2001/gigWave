import axios from "axios";
import { API_BASE_URL } from "../apiConstant";


export const getAllFaq = async (token: any): Promise<any> => {

    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/faq/get`,
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
