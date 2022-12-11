import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const debounce = require('lodash.debounce');
const axios = require('axios').default;

const pictureInput = document.querySelector('input[name=searchQuery]');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

let pageNumber = 1;
let lightbox;

pictureInput.addEventListener('input', debounce(() => {
    cleanGallery();
    searchPictures();
}, 500, {
    'leading': false,
    'trailing': true
}));

function cleanGallery() {
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');
  pageNumber = 1;
}

function renderPictures(response, markupArr) {
  response.data.hits.forEach(image => {
    markupArr.push(`
    <a class="photo-card" href="${image.largeImageURL}">
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
    </a>
    `)
  })
  gallery.insertAdjacentHTML('beforeend', markupArr.join(''));
}

async function searchPictures() {
  if (pictureInput.value === "") return;
  try {
    const markupArr = [];
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
    if (pageNumber === 1) Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
    if (response.data.totalHits > 0) {
      renderPictures(response, markupArr);
      lightbox = new SimpleLightbox('.gallery a');
      const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();
      if (pageNumber === 1) {
        window.scrollBy({
          top: cardHeight / 6,
          behavior: "smooth",
        });
      } else {
        window.scrollBy({
          top: cardHeight * 2.33,
          behavior: "smooth",
        });
      }
      loadMoreBtn.classList.remove('hidden');
    } else {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    if (document.querySelectorAll('div.photo-card').length === response.data.totalHits) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

loadMoreBtn.addEventListener('click', () => {
  pageNumber++;
  lightbox.refresh();
  searchPictures();
});

document.querySelector('form.search-form').addEventListener('submit', (event) => {
  event.preventDefault();
})