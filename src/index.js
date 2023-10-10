
// import { BASE_URL, API_KEY, options } from './api.js'; 
import { renderGallery } from './render.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './api.js';
import { elements } from './refs.js';




let totalHits = 0;
let isLoadingMore = false;
let reachedEnd = false;
let searchQuery;
let page = 1;

const lightbox = new SimpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
  showCounter: false,
  scrollZoom: false,
  close: false,
});

elements.searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('DOMContentLoaded', hideLoader);

async function onFormSubmit(e) {
  e.preventDefault();
  elements.galleryEl.innerHTML = '';
  page = 1;
  searchQuery = elements.searchInput.value.trim();
  if (searchQuery === '') {
    Notify.info('Please enter a search query.');
    return;
  }
  // options.params.q = searchQuery;
  // options.params.page = 1;
  
  // reachedEnd = false;

  try {
    showLoader();
    const response = await getImages(searchQuery, page)
    // const response = await axios.get(BASE_URL, options);
    totalHits = response.data.totalHits;
    const hits = response.data.hits;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      renderGallery (hits);
    }
    elements.searchInput.value = '';
    hideLoader();
  } catch (err) {
    console.log(err);
    Notify.failure(err);
    hideLoader();
  }
}

function showLoader() {
  elements.loaderEl.style.display = 'block';
}

function hideLoader() {
  elements.loaderEl.style.display = 'none';
}

async function loadMore() {
  isLoadingMore = true;
  page += 1;
  try {
    showLoader();
    const response = await getImages (searchQuery, page);
    const hits = response.data.hits;
    renderGallery(hits);
    if (options.params.page * options.params.per_page >= totalHits) {
      if (!reachedEnd) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        reachedEnd = true;
      }
    }
    lightbox.refresh();
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









