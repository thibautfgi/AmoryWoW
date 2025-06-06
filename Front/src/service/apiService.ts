import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/wow';

export const apiGetItembyId = (itemId: number, callback: (data: any | null, error: string | null) => void): void => {
    axios.get(`${API_BASE_URL}/item/${itemId}`, { withCredentials: true })
        .then((response) => {
            const jsonData = response.data;
            callback(jsonData, null);
        })
        .catch((error) => {
            callback(null, error.response?.data?.error || error.message);
        });
};

export const apiGetItemMediabyId = (itemId: number, callback: (data: any | null, error: string | null) => void): void => {
    axios.get(`${API_BASE_URL}/item-media/${itemId}`, { withCredentials: true })
        .then((response) => {
            const jsonData = response.data;
            callback(jsonData, null);
        })
        .catch((error) => {
            callback(null, error.response?.data?.error || error.message);
        });
};