import Notiflix from 'notiflix';
const axios = require('axios').default;
import { pictureInput } from '../index';

export async function searchPictures() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '31853975-bc1b1ba443a9213885c0622f6',
        q: pictureInput.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      }
    });
    console.log(response.data.hits); // zwraca 3 keys'y, interesuje Cię 3ci, czyli hits
  } catch (error) {
    console.error(error);
  }
}


