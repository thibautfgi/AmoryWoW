import axios from 'axios';

// Pour Android Emulator, remplace par l'IP correcte selon ton environnement
const API_BASE_URL = 'http://10.0.2.2:3000/api/wow'; 

export const apiGetItemById = (
  itemId: number, 
  callback: (data: any | null, error: string | null) => void
): void => {
  axios.get(`${API_BASE_URL}/item/${itemId}` /*, { withCredentials: true } si besoin */)
    .then(response => callback(response.data, null))
    .catch(error => callback(null, error.response?.data?.error || error.message));
};

export const apiGetItemMediaById = (
  itemId: number, 
  callback: (data: any | null, error: string | null) => void
): void => {
  axios.get(`${API_BASE_URL}/item-media/${itemId}` /*, { withCredentials: true } si besoin */)
    .then(response => callback(response.data, null))
    .catch(error => callback(null, error.response?.data?.error || error.message));
};

export const searchItems = async (params: {
  name: string;
  _page?: number;
  _pageSize?: number;
  orderby?: string;
}): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/item`, {
      params: {
        name: params.name,
        _page: params._page,
        _pageSize: params._pageSize,
        orderby: params.orderby,
      },
      // withCredentials: true si nécessaire
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error.message;
  }
};

export const postItem = async (id: number): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/item`, { id } /*, { withCredentials: true } si besoin */);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error.message;
  }
};

export const getInventory = async (): Promise<number[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory` /*, { withCredentials: true } si besoin */);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error.message;
  }
};

export const deleteItem = async (id: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/item/${id}` /*, { withCredentials: true } si besoin */);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error.message;
  }
};

export const getInventoryCount = async (id_user: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory/${id_user}` /*, { withCredentials: true } si besoin */);
    return response.data.length;
  } catch (err) {
    console.error('Erreur lors du comptage de l\'inventaire:', err);
    return 0;
  }
};
