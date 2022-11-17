export default function fetchCountries(country) {
  return fetch(`https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,flags,languages`)
    .then(response => response.json())
    .then(data => data);
};