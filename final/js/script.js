// API Key
let apiKey = "9ed27dc20b6878421a84136c5fe9e945";

// create variables for parameters
// city
//country
// different url for future forecast?

/// put the below in the eventListener for search button
/// add a new button below for each city from the search
/// grab the text of the city from search button

// DOM elements
let searchButton = document.querySelector("#search-button");
let searchInput = document.querySelector("#search-input");
let cityList = document.querySelector(".city-list");

// addEventListener on search button
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  // store searchInput into variable
  let city = searchInput.value;
  console.log(city);

  // let city = "London";

  // URL 1 build
  let queryURL1 =
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=` +
    apiKey;

  // We need this data first in order to make the 2nd request
  fetch(queryURL1)
    .then((response) => response.json())
    .then((citiesFound) => {
      let firstCity = citiesFound[0];
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
    });

  // Create elements for every city searched
  let cityButton = document.createElement("li");

  // Assign text value
  cityButton.innerHTML = city;

  // Prepend every city
  cityList.prepend(cityButton);
});
