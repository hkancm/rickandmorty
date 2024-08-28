import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});

export const fetchCharacters = async (gender?: string, status?: string) => {
  try {
    const response = await api.get('/character', {
      params: {
        gender,
        status,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};
