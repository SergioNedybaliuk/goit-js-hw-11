import axios from 'axios';
import { BASE_URL, API_KEY, options } from './api.js';
import { renderGallery } from './render.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


 const elements = {
  galleryEl: document.querySelector('.gallery'),
  searchInput: document.querySelector('input[name="searchQuery"'),
  searchForm: document.getElementById('search-form'),
  loaderEl: document.querySelector('.loader'),
};

let totalHits = 0;
let isLoadingMore = false;
let reachedEnd = false;

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
  showCounter: false,
  scrollZoom: false,
  close: false,
});

elements.searchForm.addEventListener('submit', onFormSybmit);
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('DOMContentLoaded', hideLoader);

function showLoader() {
  elements.loaderEl.style.display = 'block';
}

function hideLoader() {
  elements.loaderEl.style.display = 'none';
}



async function loadMore() {
  isLoadingMore = true;
  options.params.page += 1;
  try {
    showLoader();
    const response = await axios.get(BASE_URL, options);
    const hits = response.data.hits;
    renderGallery(hits);
  } catch (err) {
    Notify.failure(err);
  } finally {
    hideLoader();
    isLoadingMore = false;
  }
}

function onScrollHandler() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const scrollThreshold = 300;
  if (
    scrollTop + clientHeight >= scrollHeight - scrollThreshold &&
    !isLoadingMore &&
    !reachedEnd
  ) {
    loadMore();
  }
}

async function onFormSybmit(e) {
  e.preventDefault();
  const searchQuery = elements.searchInput.value.trim();
  if (searchQuery === '') {
    Notify.info('Please enter a search query.');
    return;
  }
  options.params.q = searchQuery;
  options.params.page = 1;
  elements.galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    showLoader();
    const response = await axios.get(BASE_URL, options);
    totalHits = response.data.totalHits;
    const hits = response.data.hits;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery(hits);
    }
    elements.searchInput.value = '';
    hideLoader();
  } catch (err) {
    console.log(err);
    Notify.failure(err);
    hideLoader();
  }
}
