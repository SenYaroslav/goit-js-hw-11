import { fetchImages } from './js/fetch-api';
import { createMarkupCard } from './js/create-murkup';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let userSearchInput = null;
let previousSearchInput = null;
let page = 1;

function handleFormSubmit(e) {
  e.preventDefault();

  userSearchInput = e.currentTarget['searchQuery'].value;
  if (previousSearchInput !== userSearchInput) {
    refs.gallery.innerHTML = '';
    page = 1;
  }

  fetchImages(userSearchInput, page)
    .then(res => {
      if (res.data.totalHits === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      const newObj = res.data.hits;
      newObj.forEach(function (img) {
        createMarkupCard(img);
      });
      lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 600,
      });
      Notiflix.Notify.info(`Hooray! We found ${res.data.totalHits} images.`);

      if (newObj.length === 40) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }

      const { height: cardHeight } =
        refs.gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 0.35,
        behavior: 'smooth',
      });
    })
    .catch(console.log);

  previousSearchInput = userSearchInput;
  e.currentTarget.reset();
}

function handleLoadMoreBtnClick(e) {
  e.preventDefault();

  page += 1;
  fetchImages(userSearchInput, page)
    .then(res => {
      const newObj = res.data.hits;

      newObj.forEach(function (img) {
        createMarkupCard(img);
      });
      lightbox.refresh();
      if (newObj.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }

      const { height: cardHeight } =
        refs.gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2.5,
        behavior: 'smooth',
      });
    })
    .catch(console.log);
}

refs.form.addEventListener('submit', handleFormSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
