import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

refs.inputField.addEventListener('input', debounce(onSearch, 300));

function onSearch(event) {
  event.preventDefault();
  const trimmedInput = event.currentTarget.value.trim();

  onEmptyInput(trimmedInput);

  fetchCountries(trimmedInput)
    .then(countries => {
      if (countries.length >= 10) {
        onTooManyCountries();
      } else if (countries.length < 10 && countries.length >= 2) {
        onListRender(countries);
      } else {
        onCountryRender(countries);
      }
    })
    .catch(onFetchError)
}

function onCountryRender({
  flags,
  name,
  capital,
  population,
  languages
}) {
  refs.countryInfo.innerHTML =
    `<div class='country'>
  <img class='country__img' src='${flags.svg}' alt='${name.official}' />
  <p class='country__name'>${name.official}</p>
  <p class='country__capital'> Capital: ${capital}</p>
  <p class='country__pop'> Population: ${population}</p>
  <p class='country__lang'> Languages: ${Object.values(languages)}</p>
</div>`;
}

function onListRender(countryList) {
  const listMarkup = countryList.map(country => {
    `<li class="country__list"><img src="${country.flag.svg}"><p>${country.name.official}</p></li>`
  }).join('');
  refs.list.innerHTML = listMarkup;
};

function onEmptyInput(value) {
  if (value === '') {
    refs.list.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onTooManyCountries() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}