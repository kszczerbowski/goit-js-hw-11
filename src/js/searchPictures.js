import Notiflix from 'notiflix';
const axios = require('axios').default;
import { pictureInput } from '../index';

const gallery = document.querySelector('div.gallery');
let pageNumber = 1;
const markupArr = [];

export async function searchPictures() {
  try {
    const searchParams = new URLSearchParams({
      key: '31853975-bc1b1ba443a9213885c0622f6',
      q: pictureInput.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: pageNumber,
      per_page: 40,
    });
    const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
    console.log(response.data); // zwraca 3 keys'y, interesuje Cię 3ci, czyli hits
    response.data.hits.forEach(image => {
      markupArr.push(`
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${image.downloads}
          </p>
        </div>
      </div>
      `)
      gallery.insertAdjacentHTML('beforeend', markupArr.join(''));
    })
  } catch (error) {
    console.error(error);
  }
}


