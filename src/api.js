import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39838992-cddbb024fce110c66185237bc';


export async function getImages (searchQuery, page) {
  const options = {
    params: {
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
      q: searchQuery,
    },
  };
  const response = await axios(BASE_URL, options);
  return response;
};