import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';

const checkeApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default checkeApi;