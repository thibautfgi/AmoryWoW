import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/wow';

export const apiGetItemById = (itemId: number, callback: (data: any | null, error: string | null) => void): void => {
    axios.get(`${API_BASE_URL}/item/${itemId}`, { withCredentials: true })
        .then((response) => {
            const jsonData = response.data;
            callback(jsonData, null);
        })
        .catch((error) => {
            callback(null, error.response?.data?.error || error.message);
        });
};

export const apiGetItemMediaById = (itemId: number, callback: (data: any | null, error: string | null) => void): void => {
    axios.get(`${API_BASE_URL}/item-media/${itemId}`, { withCredentials: true })
        .then((response) => {
            const jsonData = response.data;
            callback(jsonData, null);
        })
        .catch((error) => {
            callback(null, error.response?.data?.error || error.message);
        });
};

export const searchItems = (params: {
    name: string;
    _page?: number;
    _pageSize?: number;
    orderby?: string;
}): Promise<any> => {
    return axios.get(`${API_BASE_URL}/search/item`, {
        params: {
            'name': params.name, // le back gère `name.fr_FR`
            _page: params._page,
            _pageSize: params._pageSize,
            orderby: params.orderby,
        },
        withCredentials: true,
    })
        .then((response) => response.data)
        .catch((error) => {
            throw error.response?.data?.error || error.message;
        });
};

export const postItem = (id: number): Promise<any> => {
    console.log('Posting to:', `${API_BASE_URL}/item`, 'with config:', { withCredentials: true }); // Debug log
    return axios.post(`${API_BASE_URL}/item`, { id }, { withCredentials: true })
        .then((response) => {
            console.log('Post response:', response.data); // Debug log
            return response.data;
        })
        .catch((error) => {
            console.error('Post error:', error.response?.data || error.message); // Debug log
            throw error.response?.data?.error || error.message;
        });
};

export const getInventory = (): Promise<number[]> => {
    console.log('Fetching inventory from:', `${API_BASE_URL}/inventory`, 'with config:', { withCredentials: true }); // Debug log
    return axios.get(`${API_BASE_URL}/inventory`, { withCredentials: true })
        .then((response) => {
            console.log('Inventory response:', response.data); // Debug log
            return response.data;
        })
        .catch((error) => {
            console.error('Inventory fetch error:', error.response?.data || error.message); // Debug log
            throw error.response?.data?.error || error.message;
        });
};

export const deleteItem = (id: number): Promise<any> => {
    console.log('Deleting item from:', `${API_BASE_URL}/item/${id}`, 'with config:', { withCredentials: true }); // Debug log
    return axios.delete(`${API_BASE_URL}/item/${id}`, { withCredentials: true })
        .then((response) => {
            console.log('Delete response:', response.data); // Debug log
            return response.data;
        })
        .catch((error) => {
            console.error('Delete error:', error.response?.data || error.message); // Debug log
            throw error.response?.data?.error || error.message;
        });
};

const getInventoryCount = async (id_user: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/inventory/${id_user}`, { withCredentials: true });
        return response.data.length;
    } catch (err) {
        console.error('Erreur lors du comptage de l\'inventaire:', err);
        return 0;
    }
};