import Notiflix from 'notiflix';
import PixibayAPI from './js/pixabayAPI';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

// instance of pixibayAPI
const pixiInstance = new PixibayAPI();

// render UI
const renderData = arrData => {
  const currentData = arrData
    .map(el => {
      return ` <div class="photo-card">
                <a href="${el.largeImageURL}"><img src="${el.largeImageURL}" alt="${pixiInstance.query}" loading="lazy" width="350" height="250"/></a>
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

  // simple lightbox
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
  pixiInstance.query = event.target.firstElementChild.value;

  // clear gallary before new request
  galleryEl.innerHTML = '';

  // check input value
  if (!event.target.firstElementChild.value) {
    Notiflix.Notify.failure('Input is empty');
    return;
  }

  try {
    const carts = await pixiInstance.fetchPhotos();
    const cartsArray = carts.data.hits;
    pixiInstance.total_hits = carts.data.totalHits;

    //   show total hits
    if (carts && carts.data.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${carts.data.totalHits} images.`
      );
    }

    // check data was'n be not empty array
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
    const carts = await pixiInstance.fetchPhotos();
    const cartsArray = carts.data.hits;
    renderData(cartsArray);

    // check total hits
    if (pixiInstance.total_hits <= pixiInstance.page * pixiInstance.per_page) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreButton.classList.add('is-hidden');
    }

    // scroll by 2 cart height
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    Notiflix.Notify.failure('Error 404');
  }
};

// add event listener
formEl.addEventListener('submit', handleSubmitButton);
loadMoreButton.addEventListener('click', handleLoadMoreButton);