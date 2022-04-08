import '../sass/main.scss';
//Библиотеки Notiflix, SimpleLightbox
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// элементы, классы, ф-ции
import { elems } from "./elems.js";
import { bgImageRemove, bgImageAdd } from "./bgImage.js"
import { btnLoadMoreAdd, btnLoadMoreRemove, btnLoadPrevAdd, btnLoadPrevRemove } from "./btnLoadMore.js";
import ImgApiService from "./ImgApiService.js";
import { errorCatch } from "./errorCatch.js";
import { lightbox } from "./openLightbox.js";
import { galleryCollectionCreate, galleryClean } from "./galleryCreate.js";
import { notiflixOptions, notiflixReportOptions } from "./notiflixOptions.js";

// elems.formEl.addEventListener('submit', onSearchFormSubmit);
// elems.btnLoadMoreEl.addEventListener('click', onBtnLoadMoreClick);
// elems.btnLoadPrevEl.addEventListener('click', onBtnLoadPrevClick);
// elems.divGalleryEl.addEventListener('click', onGalleryCardClick);

const imgApiService = new ImgApiService();
onPageStart();

async function onPageStart() {
    galleryClean();
    try {
        const dataMoviesPopular = await imgApiService.fetchMoviesPopular(); // данные из API по запросу "популярные фильмы" (объект - { page: 1, results: (20) […], total_pages: 33054, total_results: 661074 })
        const dataGenresList = await imgApiService.fetchGenresList(); // данные из API по запросу "жанры" (объект - { genres: (19) […] })
        const dataGenres = dataGenresList.genres; // массив объектов [{ id: 28, name: "Action" } ..... { id: 76, name: "Horor" }]
        const dataMoviesPop = dataMoviesPopular.results; // массив объектов фильмов [{ adult: false, backdrop_path: "/x747ZvF0CcYYTTpPRCoUrxA2cYy.jpg", id: 406759, … } ...]
        console.log(dataMoviesPopular);
        console.log(dataGenresList);
        console.log(dataGenres);

        if (dataMoviesPopular.total_pages < 2) {
            btnLoadMoreRemove();
            btnLoadPrevRemove();
        } else if (dataMoviesPopular.page === 1 && dataMoviesPopular.page < dataMoviesPopular.total_pages) {
            btnLoadMoreAdd();
            btnLoadPrevRemove();
        } else if (dataMoviesPopular.page !== 1 && dataMoviesPopular.page === dataMoviesPopular.total_pages) {
            btnLoadMoreRemove();
            btnLoadPrevAdd();
        } else {
            btnLoadMoreAdd();
            btnLoadPrevAdd();
        };

        galleryCollectionCreate(dataMoviesPop, dataGenres);

    } catch (error) {
        errorCatch(error);
    };
};





// Ф-ция события 'submit' на элементе formEl:
//     1) выключает кнопку btnLoadMore (если она включена)
//     2) проверяет если текущее значение поля input (name):
//          - пустая строка, то выводит на экран сообщение "WORNING!', 'Please enter request.";
//          - иначе:
//                 1. присваивает значение "name" параметру "searchQuery" объекта imgApiService;
//                 2. очищает поле input;
//                 3. возвращает дефолтное занчение параметра "рage" объекта imgApiService
//                 4. отправляет запрос на API, по "searchQuery" и получает объект данных "dataObj", выводит в консоль "dataObj"
//                 5. выбирает массив данных для отрисовки "dataImg", выводит в консоль "dataImg"
//                 6. проверяет если "dataImg":
//                      - пуст, то выводит на экран сообщение 'Sorry, there are no images matching your search query. Please try again.',
//                        возвращает стартовое изображение и текст (если их не было)
//                      - иначе, убирает стартовое изображение и текст (если они были),
//                        выводит на экран сообщение `Hooray! We found ${кол-во найденных изображений} images.`,
//                        включает кнопку btnLoadMore (если она выключена),
//                        отрисовывает галерею изображений.
//     3) если во время запроса произошла ошибка - выводит сообщение в консоль и на экран
// async function onSearchFormSubmit(evt) {
//     evt.preventDefault();
//     btnLoadMoreRemove();

//     const name = elems.inputEl.value.trim(); // текущее значение inputEl (текст введенный в inputEl), с игнорированием пробелов (trim())
//     if (name === "") {
//         return Notiflix.Report.warning('WORNING!', 'Please enter request.', 'Ok');
//     };
//     evt.target.reset();
//     galleryClean();
//     imgApiService.resetPage();
//     imgApiService.searchQuery = name;

//     try {
//         const dataObj = await imgApiService.fetchImages();
//         const dataImg = dataObj.data.hits;

//         if (dataImg.length === 0) {
//             bgImageAdd();
//             return Notiflix.Notify.success('Sorry, there are no images matching your search query. Please try again.');  
//         };

//         bgImageRemove();
//         Notiflix.Notify.success(`Hooray! We found ${dataObj.data.totalHits} images.`);
//         btnLoadMoreAdd();
//         galleryCollectionCreate(dataImg);
        
//     } catch (error) {
//         errorCatch(error);
//     };
// };

// Колбек ф-ция события 'submit' на элементе formEl:
//     1. деактивирует кнопку btnLoadMoreEl;
//     2. отправляет запрос на API, по "searchQuery" и получает объект данных "dataObj", выводит в консоль "dataObj"
//     3. выбирает массив данных для отрисовки "dataImg", выводит в консоль "dataImg"
//     4. активирует кнопку btnLoadMoreEl;
//     5. отрисовывает галерею изображений.
//     6. скролит экран на высоту в две карточки галереи
//     7. если номер текущего запроса больше отношения колва всех стр. в API, к кол-ву элементов в одном запросе, то:
//        - выключает кнопку btnLoadMoreEl
//        - выводит на экран сообщение 'We are sorry, but you have reached the end of search results.'
//     8. если во время запроса произошла ошибка - выводит сообщение в консоль и на экран
// async function onBtnLoadMoreClick(evt) {
//     try {
//         elems.btnLoadMoreEl.disabled = true;
//         const dataObj = await imgApiService.fetchImages();
//         const dataImg = dataObj.data.hits;
//         galleryCollectionCreate(dataImg);
//         elems.btnLoadMoreEl.disabled = false;

//         if (imgApiService.page > (dataObj.data.totalHits / imgApiService.per_page)) {
//             btnLoadMoreRemove();
//             return Notiflix.Notify.success('We are sorry, but you have reached the end of search results.');  
//         };
//     } catch (error) {
//         errorCatch(error);
//     };
// };

// Колбек ф-ция события 'click' на элементе btnLoadMoreEl:
//     отменяет действия браузера по умолчанию;
//     проверяет условие клика по элементу img (не реагирует на клик на др элементы);
//     открывает слайдер (lightbox)    
// function onGalleryCardClick(evt) {
//     evt.preventDefault();
//     if(!evt.currentTarget.classList.contains('card')) {
//         return;
//     }
//     lightbox.open();
// };

export { imgApiService };