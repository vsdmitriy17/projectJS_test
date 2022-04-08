import { elems } from "./elems.js";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { lightbox } from "./openLightbox.js";

function galleryCollectionCreate(data,dataGen) {
    elems.divGalleryEl.insertAdjacentHTML('beforeend',
        (data.map(({ genre_ids, id, poster_path, release_date, title }) => {
            let ganresArrey = [];
            genre_ids.map((genre_id) => {
                ganresArrey.push(dataGen.find(genere => genere.id === genre_id).name);
                return ganresArrey;
            });
            const genres = ganresArrey.join(', ');
            return `
                
                    <div class="photo-card">
                        <a href="https://image.tmdb.org/t/p/w500/${poster_path}" id="${id}">
                            <img class="card" src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="${title}" loading="lazy" />
                        </a>
                        <div>
                            <h3 class="movieTitle">
                                ${title}
                            </h3>
                            <div class="info">
                                <p class="info-item">
                                    ${genres}
                                </p>
                                <span class="info-item"> | </span>
                                <p class="info-item">
                                    ${release_date.slice(0, 4)}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
        }).join('')));
    lightbox.refresh();
};

function galleryClean() {
    elems.divGalleryEl.innerHTML = '';
};

export { galleryCollectionCreate, galleryClean };