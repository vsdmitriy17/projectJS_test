
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// элементы, классы, ф-ции
import { elems } from "./elems.js";
import { bgImageRemove, bgImageAdd } from "./bgImage.js"
import { btnLoadMoreAdd, btnLoadMoreRemove } from "./btnLoadMore.js";
import ImgApiService from "./ImgApiService.js";
import { errorCatch } from "./errorCatch.js";
import { lightbox } from "./openLightbox.js";
import { galleryCollectionCreate, galleryClean } from "./galleryCreate.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";
import { imgApiService } from "./index.js"

function galleryStartScroll() {
    const { height: cardHeight } = elems.divGalleryEl.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight*2,
        behavior: 'smooth',
    });
};

export { galleryStartScroll };