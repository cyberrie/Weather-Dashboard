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
let cityHistory = document.querySelector("#history");

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
    .then((data) => {
      // the below is the data from return fetch (queryURL2)
      console.log(data);
    })

    // append buttons with city names searched, below search button

    .then((data) => {
      // create new button element for each city
      data.citiesFound.forEach((city) => {
        let cityButton = document.createElement("button");
        cityButton.innerHTML = city.name;
        // add a click event listener to the button to test it first
        cityButton.addEventListener("click", function (event) {
          console.log(`Button for city ${city.name} was clicked!`);
        });

        // prepend the button to the cityHistory element
        cityHistory.prepend(cityButton);
      });
    });
  // take searchButton click event
});
