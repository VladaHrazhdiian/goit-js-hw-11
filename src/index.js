
import Notiflix from 'notiflix';
import axios from "axios";
import { searchImages } from './js/pixabayAPI';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const bodyEl = document.body;
bodyEl.style.backgroundColor = "lightblue";
loadMoreButton.style.display = "none";

let page = 1;
let currentSearchQuery = '';
const apiKey = '37798827-4b752ebc68c39b91b512cc08a'; 

function displayImages(images) {
  images.forEach((image) => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';
    

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}

function clearGallery() {
  gallery.innerHTML = '';
}


async function searchImagesByQuery(query) {
  clearGallery();
  page = 1;
  currentSearchQuery = query;

  try {
    const response = await searchImages(query, page, apiKey);
    const { hits, totalHits } = response;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    
    displayImages(hits);
    

    if (hits.length < totalHits) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error searching images:', error);
    Notiflix.Notify.failure('An error occurred while searching for images.');
  }
}

async function loadMoreImages() {
  page++;

  try {
    const response = await searchImages(currentSearchQuery, page, apiKey);
    const { hits, totalHits } = response;

    displayImages(hits);

    if (gallery.childElementCount >= totalHits) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error('Error loading more images:', error);
    Notiflix.Notify.failure('An error occurred while loading more images.');
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery !== '') {
    searchImagesByQuery(searchQuery);
  }
});

loadMoreButton.addEventListener('click', loadMoreImages);