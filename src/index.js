import Notiflix from 'notiflix';
import PixabayAPI from './js/pixabayAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');


const pixabayApi = new PixabayAPI();

const renderData = arrData => {
  const currentData = arrData
    .map(el => {
      return ` <div class="photo-card">
                <a href="${el.largeImageURL}"><img src="${el.largeImageURL}" alt="${pixabayApi.query}" loading="lazy" width="350" height="250"/></a>
                <div class="info">
                    <p class="info-item">
                        <span class="info-text">Likes</span>
                        <b> ${el.likes}</b>
                    </p>
                    <p class="info-item">
                        <span class="info-text">Views</span>
                        <b>${el.views}</b>
                    </p>
                    <p class="info-item">
                        <span class="info-text">Comments</span>
                        <b>${el.comments}</b>
                    </p>
                    <p class="info-item">
                        <span class="info-text">Downloads</span>
                        <b>${el.downloads}</b>
                    </p>
                </div>
            </div>`;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', currentData);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  lightbox.on('show.simplelightbox', () => {
    console.log('simple');
  });
};

const handleSubmitButton = async event => {
  event.preventDefault();
  loadMoreButton.classList.add('is-hidden');
  pixabayApi.query = event.target.firstElementChild.value;

  if (!event.target.firstElementChild.value.trim()) {
    Notiflix.Notify.failure('Input is empty');
    return;
  }

  galleryEl.innerHTML = '';

 
  if (!event.target.firstElementChild.value) {
    Notiflix.Notify.failure('Input is empty');
    return;
  }

  try {
    const carts = await pixabayApi.fetchPhotos();
    const cartsArray = carts.data.hits;
    pixabayApi.total_hits = carts.data.totalHits;

 
    if (carts && carts.data.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${carts.data.totalHits} images.`
      );
    }

    if (cartsArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderData(cartsArray);
    loadMoreButton.classList.remove('is-hidden');
  } catch (err) {
    Notiflix.Notify.failure('Error 404');
  }
};

const handleLoadMoreButton = async () => {
  try {
    const currentTotalHits = pixabayApi.total_hits;

    pixabayApi.page += 1;

    const carts = await pixabayApi.fetchPhotos();
    const cartsArray = carts.data.hits;

    if (cartsArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.classList.add('is-hidden');
      return;
    }

    renderData(cartsArray);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (currentTotalHits !== null && pixabayApi.page * pixabayApi.per_page >= currentTotalHits) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      loadMoreButton.classList.add('is-hidden');
      return;
    }

    if (currentTotalHits === null && carts.data.totalHits > 0) {
      pixabayApi.total_hits = carts.data.totalHits;
    }
  } catch (err) {
    Notiflix.Notify.failure('Error 404');
  }
};

formEl.addEventListener('submit', handleSubmitButton);
loadMoreButton.addEventListener('click', handleLoadMoreButton);