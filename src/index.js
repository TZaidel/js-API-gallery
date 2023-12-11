import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery")
const form = document.querySelector('.search-form')
const guard = document.querySelector('.guard')
const BASE_URL ="https://pixabay.com/api/"
const API_KEY = "41139869-f8379f77ee410072fd9aeb531"
let page = 1
let searchItem = ''
let maxPages = 0

const options = {
    root: null,
    rootMargin: "250px",
    threshold: 0
}


let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

form.addEventListener('submit', onSubmit)

const observer = new IntersectionObserver(handlePagination, options)

async function onSubmit(event) {
    event.preventDefault()
    page = 1
    gallery.innerHTML = ""
    lightbox.refresh();
    searchItem = event.currentTarget.elements.searchQuery.value
    const data = await getArray(searchItem, page)
    maxPages = Math.ceil(data.totalHits / 40)
    if (data.totalHits === 0 || searchItem.trim() === '') {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits))
        
        if (page < maxPages) {
            observer.observe(guard);
        }
    }
    lightbox.refresh()
    form.reset()
}


async function getArray(category, page) {
    const response =  await axios(`${BASE_URL}?key=${API_KEY}&q=${category}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
    return response.data
}

function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
                <a href="${largeImageURL}"><img width=300 max-height=220 src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info">
                <p class="info-item">
                <b>Likes <br><span> ${likes}</span></b>
                </p>
                <p class="info-item">
                <b>Views <br> <span>${views}</span></b>
                </p>
                <p class="info-item">
                <b>Comments <br> <span>${comments}</span></b>
                </p>
                <p class="info-item">
                <b>Downloads <br> <span>${downloads}</span></b>
                </p>
                </div>
                </div>`
    }).join('')

}

function handlePagination(entries, observer) {
    page += 1
    if (page > maxPages) {
        observer.unobserve(guard)
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
    if (page <= maxPages && entries[0].isIntersecting) {
        getArray(searchItem, page)
            .then(data => {
                if (data.hits.length > 0) {
                    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits))
                    lightbox.refresh();
                } 
            })
            .catch(error=> console.log('Error message', error))
    }
}

