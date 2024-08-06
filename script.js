'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

const countriesContainer = document.querySelector('.countriesContainer');
const countriesEl = document.querySelector('.countries');
const countryCard = document.querySelector('.card');
const continentsContainer = document.querySelector('.continentsContainer');
const allContinents = document.querySelectorAll('.continent');

const openModal = function () {
    console.log('Button clicked');
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden')
}

const getCountryByAlpha = async function (alpha) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${alpha}`);
        if (!res.ok) throw new Error(`Country not found (${res.status})`);
        const data = await res.json();
        console.log(data[0]);
        return data;
    } catch (err) {
        console.error(`${err}`);
        throw err;
    }
};

const getCountryByRegion = async function (region) {
    try {
        const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        if (!res.ok) throw new Error(`Region not found (${res.status})`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(`${err}`);
        throw err;
    }
};

const renderCountryList = async function (region) {
    try {
        const countries = await getCountryByRegion(region);
        countriesEl.innerHTML = '';
        for (let country of countries) {
            renderCountryBtn(country);
        }
    } catch (err) {
        console.log(err);
    }
};

const renderCountryBtn = function (country, className = '') {
    const html = `
        <button class='button--${country.cca2}'>${country.flag} ${country.name.common}</button>
    `;
    countriesEl.insertAdjacentHTML('beforeend', html);
    document.querySelector(`.button--${country.cca2}`).addEventListener('click', function () {
        renderCountryCard(country);
    });
};

const renderCountryCard = function (country, className = '') {
    countryCard.innerHTML = '';

    openModal();

    const currencies = country.currencies ?
        Object.values(country.currencies)
            .map(curr => `${curr.name} (${curr.symbol})`)
            .join(', ')
        : 'No currencies data available';

    const languages = country.languages ?
        Object.values(country.languages)
            .join(', ')
        : 'No languages data available';

    const capital = country.capital ? country.capital.join(' ') : 'No capital data available';

    const html = `
        <img src="${country.flags.png}"/>
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Currencies:</strong> ${currencies}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Population:</strong> ${country.population}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion}</p>
    `;
    countryCard.classList.remove('hidden');
    countryCard.insertAdjacentHTML('beforeend', html);
}

function selectContinent(event) {
    const clickedContinent = event.currentTarget.id;
    continentsContainer.classList.add('hidden');
    countriesContainer.classList.remove('hidden');
    renderCountryList(`${clickedContinent}`);
}

document.querySelectorAll('.continent').forEach(button => {
    button.addEventListener('click', selectContinent)
});

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);