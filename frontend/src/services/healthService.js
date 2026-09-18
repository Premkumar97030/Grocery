import api from './api';
export const getHealth = async () => (await api.get('/health')).data;
