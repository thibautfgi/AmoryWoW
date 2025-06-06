import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Inclure les cookies de session
});

export default instance;