import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api';
const KEY = '31204543-62c8e31a076b6db5358d79a6b';
const IMG_TYPE = 'image_type=photo';
const ORIENTATION = 'orientation=horizontal';
const SAFESEARCH = 'safesearch=true';
const PER_PAGE = 'per_page=40';

export async function fetchImages(name, page) {
  try {
    const result = axios.get(
      `${BASE_URL}/?key=${KEY}&q=${name}&${IMG_TYPE}&${ORIENTATION}&${SAFESEARCH}&page=${page}&${PER_PAGE}`
    );
    return result;
  } catch (error) {
    console.log(error);
  }
}
