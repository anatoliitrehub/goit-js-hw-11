// INTRO:
// impEvent - listener to search click
// fetchPhotos - fetch request the photos
// showPhotos - add photos to page

import './css/styles.css';
import showPhotos from './showphotos';
import Notiflix from 'notiflix';
import axios from 'axios';
const baseUrl = "https://pixabay.com/api/";
const apiKey = '34290470-a2b94d46dcf87b0f2ce65c820';

const inpForm = document.querySelector('form#search-form');
inpForm.addEventListener('submit',inpEvent);
const galleryList = document.querySelector('div.gallery');
const loadMore = document.querySelector('button.load-more');
loadMore.addEventListener('click',pageIncrement);
let page=1;
let searchWord ='';

async function inpEvent(event){
    event.preventDefault();
    galleryList.innerHTML = '';
    page = 1;
    searchWord = event.currentTarget.elements.searchQuery.value.trim();
    if (!searchWord) {
        Notiflix.Notify.info('There are nothing to search.');
        return;
    };

    const fetchData = await fetchPhotos(searchWord,page);
    fetchData.data.hits.forEach(el => {
        galleryList.insertAdjacentHTML('afterbegin',showPhotos(el))
    });
            
    loadMore.textContent=`Show ${galleryList.children.length} of ${fetchData.data.totalHits} Show more`;
};
    
async function fetchPhotos(searchWord,page){
    const params = new URLSearchParams({
                key:apiKey,
                q:searchWord,
                image_type:'photo',
                orientation:'horizontal',
                safesearch:true,
                page:page,
                per_page:40
    });
    try{
        const resp = await axios.get(`${baseUrl}?${params}`)
        if(resp.data.total == 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            loadMore.classList.add('is-hidden');
        }
        if(page == 1 && resp.data.total !== 0) Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);

        if(page*40 < resp.data.totalHits && loadMore.classList.contains('is-hidden')) loadMore.classList.remove('is-hidden');
            
        if(page*40 >= resp.data.totalHits && resp.data.total !== 0) {
            loadMore.classList.add('is-hidden');
            Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        }
        return resp;
        }
        catch{(error) => {
            console.log(error);
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        }};
}

async function pageIncrement(){
    page++;
    const fetchData = await fetchPhotos(searchWord,page);
    
    fetchData.data.hits.forEach(el => {
        galleryList.insertAdjacentHTML('beforeend',showPhotos(el))
    });
        loadMore.textContent=`Show ${galleryList.children.length} of ${fetchData.data.totalHits} Show more`;
};