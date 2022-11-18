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

refs.inputField.addEventListener('input', debounce(onInputFill, 300));

function onInputFill(event) {
  event.preventDefault();
  const trimmedInput = event.target.value.trim();

  if (trimmedInput === '') {
    onInputClear();
    return;
  }

  fetchCountries(trimmedInput).then(array => {

      if (array.length >= 10) {
        onTooManyCountries();
      } else if (array.length < 10 && array.length >= 2) {
        onInputClear();
        onListRender(array)
      } else {
        onInputClear();
        onCountryRender(array[0])
      }
    })
    .catch(onFetchError);
}

function onListRender(countryList) {
  const listMarkup = countryList.map(({
    flags,
    name
  }) => {
    return `<li class="country__list"><img class="country__list-img"src="${flags.svg}"><p class="country__list-name">${name.official}</p></li>`
  }).join('');
  refs.list.innerHTML = listMarkup;
};

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

function onTooManyCountries() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onInputClear() {
  refs.list.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}