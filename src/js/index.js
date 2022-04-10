import '../sass/main.scss';
//Библиотеки Notiflix, SimpleLightbox
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
// элементы, классы, ф-ции
import { elems } from "./elems.js";
import { btnLoadNextAdd, btnLoadNextRemove, btnLoadPrevAdd, btnLoadPrevRemove } from "./btnLoadMore.js";
import MoviesApiService from "./moviesApiService.js";
import { errorCatch } from "./errorCatch.js";
import { galleryCollectionCreate, galleryClean } from "./galleryCreate.js";
import { toggleModal } from "./modal.js"
import { movieCardCreate, movieCardClean } from "./movieCardCreate.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";

const moviesApiService = new MoviesApiService();
popularMoviesLoad();

elems.formEl.addEventListener('submit', onSearchFormSubmit);
elems.btnLoadNextEl.addEventListener('click', onBtnLoadNextClick);
elems.btnLoadPrevEl.addEventListener('click', onBtnLoadPrevClick);
elems.divGalleryEl.addEventListener('click', onGalleryCardClick);
elems.closeModalBtn.addEventListener('click', toggleModal);

async function popularMoviesLoad() {
    galleryClean();
    try {
        const dataMoviesPopular = await moviesApiService.fetchMoviesPopular(); // данные из API по запросу "популярные фильмы" (объект - { page: 1, results: (20) […], total_pages: 33054, total_results: 661074 })
        const dataGenresList = await moviesApiService.fetchGenresList(); // данные из API по запросу "жанры" (объект - { genres: (19) […] })
        const dataGenres = dataGenresList.genres; // массив объектов [{ id: 28, name: "Action" } ..... { id: 76, name: "Horor" }]
        const dataMoviesPop = dataMoviesPopular.results; // массив объектов фильмов [{ adult: false, backdrop_path: "/x747ZvF0CcYYTTpPRCoUrxA2cYy.jpg", id: 406759, … } ...]
        // console.log(dataMoviesPopular);
        // console.log(dataGenresList);
        // console.log(dataGenres);

        if (dataMoviesPopular.total_pages < 2) {
            btnLoadNextRemove();
            btnLoadPrevRemove();
        } else if (dataMoviesPopular.page === 1 && dataMoviesPopular.page < dataMoviesPopular.total_pages) {
            btnLoadNextAdd();
            btnLoadPrevRemove();
        } else if (dataMoviesPopular.page !== 1 && dataMoviesPopular.page === dataMoviesPopular.total_pages) {
            btnLoadNextRemove();
            btnLoadPrevAdd();
        } else {
            btnLoadNextAdd();
            btnLoadPrevAdd();
        };

        galleryCollectionCreate(dataMoviesPop, dataGenres);

    } catch (error) {
        errorCatch(error);
    };
};

async function searchMoviesLoad() {
    
    galleryClean();

    try {
        const dataObj = await moviesApiService.fetchMoviesQuery();
        const dataMovies = dataObj.results;
        const dataGenresList = await moviesApiService.fetchGenresList(); // данные из API по запросу "жанры" (объект - { genres: (19) […] })
        const dataGenres = dataGenresList.genres;
        // console.log(dataObj);
        // console.log(dataMovies);

        if (dataObj.total_pages < 2) {
            btnLoadNextRemove();
            btnLoadPrevRemove();
        } else if (dataObj.page === 1 && dataObj.page < dataObj.total_pages) {
            btnLoadNextAdd();
            btnLoadPrevRemove();
        } else if (dataObj.page !== 1 && dataObj.page === dataObj.total_pages) {
            btnLoadNextRemove();
            btnLoadPrevAdd();
        } else {
            btnLoadNextAdd();
            btnLoadPrevAdd();
        };

        galleryCollectionCreate(dataMovies, dataGenres);

        if (dataMovies.length === 0) {
            return Notiflix.Notify.success('Sorry, there are no movies matching your search query. Please try again.');  
        };
        
    } catch (error) {
        errorCatch(error);
    };
}

async function idMovieLoad() {
    toggleModal();
    movieCardClean();

    try {
        const dataObj = await moviesApiService.fetchMovieId();
        console.log(dataObj);

        btnLoadPrevRemove();
        btnLoadNextRemove();

        movieCardCreate(dataObj);
        
    } catch (error) {
        errorCatch(error);
    };
}

async function onSearchFormSubmit(evt) {
    evt.preventDefault();
    const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
    if (name === "") {
        return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
    };
    evt.target.reset();
    moviesApiService.resetPage();
    elems.currentPageEl.textContent = moviesApiService.page;
    moviesApiService.searchQuery = name;
    try {
        await searchMoviesLoad();
        
    } catch (error) {
        errorCatch(error);
    };
};

async function onGalleryCardClick(evt) {
    if (!evt.target.classList.contains('photo-card')) {
        return;
    }
    
    moviesApiService.movie_id = evt.target.dataset.id;
    idMovieLoad();

    // console.log(evt.target.nodeName);
    console.log("ID=", moviesApiService.movie_id);

}

async function onBtnLoadNextClick(evt) {
    moviesApiService.nextPage();
    console.log(moviesApiService.page);
    moviesApiService.fetchMovies();
    elems.currentPageEl.textContent = moviesApiService.page;
}

async function onBtnLoadPrevClick(evt) {
    moviesApiService.prevPage();
    console.log(moviesApiService.page);
    moviesApiService.fetchMovies();
    elems.currentPageEl.textContent = moviesApiService.page;
}

export { moviesApiService, popularMoviesLoad, searchMoviesLoad };