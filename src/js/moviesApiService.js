import axios from "axios";
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { popularMoviesLoad, searchMoviesLoad, storageMoviesLoad } from './index.js'

export default class MoviesApiService {
    constructor() {
        // путь к API - эндпоинт, базовый URL, точка входа в API.
        this.BASE_URL = 'https://api.themoviedb.org/3';
        // Ключ API
        this.API_KEY = '?api_key=0fd7f514ed7f6fbeb459b215007787ac';
        // параметры настроек (выборки) запроса
        this.popular = "/trending/movie/week";
        this.query = "/search/movie"
        this.movieId = '/movie/';
        this.findId = '/find/';
        this.genre = "/genre/movie/list";
        this.lang = "language=en-US";
        this.imgLang = "include_image_language=en,null";
        this.searchQuery = '';
        this.movie_id = '';
        // this.image_type = "image_type=photo";
        // this.orientation = "orientation=horizontal";
        // this.safesearch = "safesearch=true";
        this.page = 1;
        this.totalPages = 10;
        this.fetchMovies;
        // this.per_page = 40;
        // this.searchQuery = '';
    }

    async fetchMoviesPopular() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.imgLang}&page=${this.page}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.popular}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        this.totalPages = dataObject.data.total_pages;
        this.fetchMovies = popularMoviesLoad;
        // console.log(data);
        Loading.remove(); // библ. Notiflix
        return data;
    }

    async fetchMoviesQuery() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.imgLang}&query=${this.searchQuery}&page=${this.page}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.query}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        this.totalPages = dataObject.data.total_pages;
        this.fetchMovies = searchMoviesLoad;
        // console.log(data);
        Loading.remove(); // библ. Notiflix
        return data;
    }

    async fetchMovieId() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.imgLang}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.movieId}${this.movie_id}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        this.totalPages = dataObject.data.total_pages;
        // this.fetchMovies = fetchMovieId;
        // console.log(data);
        Loading.remove(); // библ. Notiflix
        return data;
    }

    async fetchMoviesStorage() {
        Loading.circle({onSearchFormSubmit: true, svgSize: '80px',}); // библ. Notiflix
        const searchParams = `${this.lang}&${this.imgLang}&id=${this.movie_id}&page=${this.page}`;
        const dataObject = await axios.get(`${this.BASE_URL}${this.query}${this.API_KEY}&${searchParams}`); // запрос через библ. axios
        const { data } = dataObject;
        this.totalPages = dataObject.data.total_pages;
        this.fetchMovies = storageMoviesLoad;
        // console.log(data);
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

    nextPage() {
        if (this.page === this.totalPages) {
            return;
        };
        this.page += 1;
    }

    prevPage() {
        if (this.page === 1) {
            return;
        };
        this.page -= 1;
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
