import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const debounce = require('lodash.debounce');
const axios = require('axios').default;

const pictureInput = document.querySelector('input[name=searchQuery]');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');
const scrollUpArrow = document.querySelector('img.scroll-up-arrow');
const dragon = document.querySelector('img.dragon');

let pageNumber = 1;
let lightbox;
let infiniteScrollMode = false;

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
    if (response.data.totalHits > 0) {
      if (pageNumber === 1) Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
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
      scrollUpArrow.classList.remove('hidden');
      if (!infiniteScrollMode) loadMoreBtn.classList.remove('hidden');
    } else {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    if (document.querySelectorAll('a.photo-card').length === response.data.totalHits && response.data.totalHits !== 0) {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
      loadMoreBtn.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

loadMoreBtn.addEventListener('click', () => {
  if (pageNumber === 1) Notiflix.Notify.info('No love for the load more button? Press ctrl+I to enter the Infinity Scroll Mode!')
  pageNumber++;
  lightbox.refresh();
  searchPictures();
});

window.addEventListener('scroll',()=>{
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight && infiniteScrollMode){
    pageNumber++;
    lightbox.refresh();
    searchPictures();
  }
})

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.code === "KeyI") {
    loadMoreBtn.classList.add('hidden');
    infiniteScrollMode = true;
  }
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.code === "KeyD") {
    event.preventDefault();
    dragon.classList.toggle('go-left');
    dragon.classList.toggle('go-right');
    setTimeout(() => {
      dragon.classList.toggle('rotated')
    }, 2000)
  }
});

document.querySelector('form.search-form').addEventListener('submit', (event) => {
  event.preventDefault();
})

scrollUpArrow.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  scrollUpArrow.classList.add('hidden');
})

document.addEventListener("mousewheel", (event) => {
  if(event.wheelDelta < 0 && document.querySelectorAll('.photo-card').length !== 0) scrollUpArrow.classList.remove('hidden');
})

