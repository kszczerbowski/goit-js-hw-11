import './css/styles.css';
import { searchPictures } from './js/searchPictures';

export const pictureInput = document.querySelector('input[name=searchQuery]');
pictureInput.addEventListener('input', () => {
    searchPictures();
});
