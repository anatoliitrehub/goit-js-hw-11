import './css/styles.css';
const debounce = require('lodash.debounce');
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inpCountry = document.querySelector('input#search-box');
inpCountry.addEventListener('input',debounce(inpEvent,DEBOUNCE_DELAY));
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function inpEvent(event){
    if (!event.target.value.trim()) {
        countryInfo.innerHTML ='';
        countryList.innerHTML = '';
        return};
    fetchCountries(event.target.value.trim()).then(data=>{
        if (data.length >=10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            countryList.innerHTML = '';
        }
        else if (data.length === 1){
            countryList.innerHTML = '';
            countryInfo.innerHTML = `
            <ul>
                <li class="info__item"><img src=${data[0].flags.svg} alt="${data[0].flags.alt}" class="info__image"><p class="info__title">${data[0].name.official}</p></li>
                <li class="info__item"><p class="info__text">Capital: <span class="info__text--span">${data[0].capital}</span></p></li>
                <li class="info__item"><p class="info__text">Population: <span class="info__text--span">${data[0].population}</span></p></li>
                <li class="info__item"><p class="info__text">Languages: <span class="info__text--span">${allLang(data[0].languages)}</span></p></li>
            </ul>`;
            
        }
        else{
            countryInfo.innerHTML = '';
            countryList.innerHTML = data.map(elem => {return(
                `<li class="list__item"><img src=${elem.flags.svg} alt="${elem.flags.alt}" class="list__image"><p class="list__text">${elem.name.official}</p></li>`
            )}).join('');

        }})
        .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
};

function allLang(arr){
    let adding = [];
    for (const key in arr){
        adding.push(arr[key]);
    }
    return adding.join(', ');
}
