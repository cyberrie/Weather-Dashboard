// API Key
let apiKey = "9ed27dc20b6878421a84136c5fe9e945";

// DOM elements
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let cityList = document.querySelector(".city-list");
let weatherToday = document.querySelector("#today");
let weatherForecast = document.querySelector("#forecast");

// Empty array to store cities in localStorage
let cities = [];

// Runs when the page loads
init();

// Function to check the local storage when the page loads
function init() {
  // check if there are any stored cities
  let storedCities = JSON.parse(localStorage.getItem("cities"));

  // If cities are stored, update the cities array to it
  if (storedCities) {
    cities = storedCities;
  }

  // Function to render cities on the left
  renderCities(cities);

  // Retrieve weather today if any stored
  let storedWeatherToday = JSON.parse(localStorage.getItem("weatherToday"));
  if (storedWeatherToday) {
    // if stored render them on the page
    renderWeather(storedWeatherToday);
  }

  // Retrieve forecast
  let forecast = (weatherForecast.innerHTML =
    localStorage.getItem("forecastHTML"));
  // check if anything saved and render if so
  if (forecast) {
    forecastHTML = forecast;
  }
}

// Function to render cities on the left
function renderCities(cities) {
  // Empty cityList
  cityList.innerHTML = "";

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Create elements for every city searched
    let cityButton = document.createElement("button");

    // Assign text value
    cityButton.innerHTML = city;

    // Prepend every city
    cityList.prepend(cityButton);
  }
}

// addEventListener on search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  //Empty forecast div here
  weatherForecast.innerHTML = "";

  // Assigned variable to input value
  let city = searchInput.value;

  // weatherSearch function with API data fetch
  weatherSearch(city);

  // Push cities searched into this array, if already in don't push
  // if no value in the input don't push
  if (city !== "" && !cities.includes(city)) {
    cities.push(city);
    storeCities();
  }

  // Function to save cities to localStorage
  function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
  }

  // Function to retrieve cities from localStorage
  renderCities(cities);
});

// event delegation for city buttons
cityList.addEventListener("click", function (event) {
  //Empty forecast div here
  weatherForecast.innerHTML = "";
  if (event.target.matches("button")) {
    console.log(event.target);
    let cityName = event.target.textContent;
    console.log(cityName);
    weatherSearch(cityName);
  }
});

// API fetch for current forecast
function weatherSearch(cityName) {
  // let city = "London";

  // URL 1 build
  let queryURL1 =
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=` +
    apiKey;

  // We need this data first in order to make the 2nd request
  fetch(queryURL1)
    .then((response) => response.json())
    // returns JS object with the city info only
    .then((citiesFound) => {
      let firstCity = citiesFound[0];
      console.log(firstCity);
      console.log(firstCity.lat);
      console.log(firstCity.lon);

      // 2nd URL data request chained onto 1st URL data request
      let queryURL2 =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${firstCity.lat}&lon=${firstCity.lon}&units=metric&appid=` +
        apiKey;

      // Chained promise - return on line 112
      return fetch(queryURL2);
    })

    .then((response) => response.json())
    // returns JS object with the weather info on the searched city
    .then((cityData) => {
      console.log(cityData);

      // Render weather information on the page with the cityData as argument

      renderWeather(cityData);

      // Store current weather
      storeWeatherToday(cityData);
    });

  // API for 5-day forecast
  let queryURL3 =
    `https://api.openweathermap.org/data/2.5/forecast?q=` +
    cityName +
    `&units=metric&appid=` +
    apiKey;

  fetch(queryURL3)
    .then((response) => response.json())
    .then(function (response5Day) {
      // Filter through the list array to only include forecast data for noon
      const filteredList = response5Day.list.filter(function (item) {
        return item.dt_txt.endsWith("12:00:00");
      });

      // loop through the first 5 elements of the filtered array - 5 days forecast for noon
      for (let i = 0; i < 5; i++) {
        console.log(
          moment(filteredList[i].dt, "X").format("DD/MM/YYYY, HH:mm:ss")
        );

        // Render icon
        let iconCode = response5Day.list[i].weather[0].icon;
        console.log(iconCode);

        // iconUL obtained from API docs
        let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        console.log(iconURL);

        let forecastCard = `<div class="card" style="width: 10rem">
        <div class="card-body">
          <h5 class="card-title">${moment(filteredList[i].dt, "X").format(
            "DD/MM/YYYY"
          )}</h5>
          <h6 class="card-subtitle mb-2 text-muted"> <img src='${iconURL}'></h6>
          <p class="card-text">Temp: ${Math.floor(
            filteredList[i].main.temp
          )} &#8451</p>
          <p class="card-text">Wind: ${filteredList[i].wind.speed} KPH</p>
          <p class="card-text">Humidity: ${filteredList[i].main.humidity} %</p>
        </div>`;

        weatherForecast.innerHTML += forecastCard;
      }
      localStorage.setItem("forecastHTML", weatherForecast.innerHTML);
    });
}

// Render current weather data
function renderWeather(weatherData) {
  // city title
  let cityTitle = weatherData.city.name;
  // weather icon
  let iconCode = weatherData.list[0].weather[0].icon;
  // iconUL obtained from API docs
  let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  console.log(cityTitle);
  // render data on the page
  let htmlWeatherToday = ` <h2 style="text-align: left">${cityTitle} (${moment(
    weatherData.dt
  ).format("DD/MM/YYYY")}) <img src='${iconURL}'></h2>
  <p style="text-align: left">Temp: ${Math.floor(
    weatherData.list[0].main.temp
  )} &#8451</p>
  <p style="text-align: left">Wind: ${weatherData.list[0].wind.speed} KPH</p>
  <p style="text-align: left">Humidity: ${
    weatherData.list[0].main.humidity
  } %</p>`;

  weatherToday.innerHTML = htmlWeatherToday;
}

// Function to store current weather data to localStorage
function storeWeatherToday(cityData) {
  localStorage.setItem("weatherToday", JSON.stringify(cityData));
}
