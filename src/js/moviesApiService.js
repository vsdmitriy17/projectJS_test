import axios from "axios";
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

export default class MoviesApiService {
    constructor() {
        // путь к API - эндпоинт, базовый URL, точка входа в API.
        this.BASE_URL = 'https://api.themoviedb.org/3';
        // Ключ API
        this.API_KEY = '?api_key=0fd7f514ed7f6fbeb459b215007787ac';
        // параметры настроек (выборки) запроса
        this.popular = "/trending/movie/week";
        this.genre = "/genre/movie/list";
        this.lang = "language=en-US";
        this.imgLang = "include_image_language=en,null";
        // this.image_type = "image_type=photo";
        // this.orientation = "orientation=horizontal";
        // this.safesearch = "safesearch=true";
        this.page = 1;
        // this.per_page = 40;
        // this.searchQuery = '';
    }

    async fetchMoviesPopular() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.imgLang}&${this.page}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.popular}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        // console.log(data);
        this.page += 1; //увеличиваем номер стр. при каждом запросе
        Loading.remove(); // библ. Notiflix
        return data;
    }

    async fetchGenresList() {
        const searchParams = `${this.lang}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.genre}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        // console.log(data);
        return data;
    }
    
    // get query() {
    //     return this.searchQuery;
    // }
    
    // set query(newQuery) {
    //     this.searchQuery = newQuery;
    // }

    resetPage() {
        this.page = 1;
    }
};
