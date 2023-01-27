// API Key
let apiKey = "9ed27dc20b6878421a84136c5fe9e945";

// DOM elements
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let cityList = document.querySelector(".city-list");
let weatherToday = document.querySelector("#today");

// Empty array to store cities in localStorage
let cities = [];

// Runs when the page loads
init();

// check the local storage
function init() {
  // check if there are any stored cities
  let storedCities = JSON.parse(localStorage.getItem("cities"));

  // If cities are stored, update the cities array to it
  if (storedCities) {
    cities = storedCities;
  }

  // Function to render cities on the left
  renderCities(cities);
}

function renderCities(cities) {
  // Empty cityList
  cityList.innerHTML = "";

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Create elements for every city searched
    let cityButton = document.createElement("li");

    // Assign text value
    cityButton.innerHTML = city;

    // Prepend every city
    cityList.prepend(cityButton);
  }
}

// if any data there, render on the left

// render data function, get sfromv localstorage

// addEventListener on search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault();

  let city = searchInput.value;

  weatherSearch(city);

  // Push cities searched into this array, check - if not there push, otherwise do not push
  if (!cities.includes(city)) {
    cities.push(city);
    storeCitites();
  }
  // Function to save cities to localStorage
  function storeCitites() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
  }

  // Function to retrieve cities from localStorage
  renderCities(cities);
});

// event delegation for city buttons
cityList.addEventListener("click", function (event) {
  if (event.target.matches("li")) {
    console.log(event.target);
    let cityName = event.target.textContent;
    console.log(cityName);
    weatherSearch(cityName);
  }
});

function weatherSearch(cityName) {
  // let city = "London";

  // URL 1 build
  let queryURL1 =
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=` +
    apiKey;

  // We need this data first in order to make the 2nd request
  fetch(queryURL1)
    .then((response) => response.json())
    .then((citiesFound) => {
      let firstCity = citiesFound[0];
      console.log(firstCity);
      console.log(firstCity.lat);
      console.log(firstCity.lon);

      // 2nd URL data request chained onto 1st URL data request
      let queryURL2 =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${firstCity.lat}&lon=${firstCity.lon}&appid=` +
        apiKey;

      return fetch(queryURL2);
    })

    .then((response) => response.json())
    .then((cityData) => {
      // the below is the data from return fetch (queryURL2)
      console.log(cityData);
      renderWeather(cityData);
    });
}

function renderWeather(weatherData) {
  // city title
  let cityTitle = weatherData.city.name;
  let iconCode = weatherData.list[0].weather[0].icon;
  let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  console.log(cityTitle);
  let html = ` <h1>${cityTitle} (${moment(weatherData.dt).format(
    "DD/MM/YYYY"
  )}) <img src='${iconURL}'></h1>
  <p>Temp</p>
  <p>Wind</p>
  <p>Humidity</p>`;

  weatherToday.innerHTML = html;
}
