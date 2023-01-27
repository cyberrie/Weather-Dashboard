// API Key
let apiKey = "9ed27dc20b6878421a84136c5fe9e945";

// create variables for parameters
// city
//country
// different url for future forecast?

// URL Build
let queryURL1 =
  "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" +
  apiKey;

// we need this data in order to make the 2nd request
fetch(queryURL1)
  .then((response) => response.json())
  .then((citiesFound) => {
    let firstCity = citiesFound[0];
    console.log(firstCity.lat);
    console.log(firstCity.lon);

    let queryURL2 =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${firstCity.lat}&lon=${firstCity.lon}&appid=` +
      apiKey;

    return fetch(queryURL2);
  })

  .then((response) => response.json())
  .then((data) => {
    // the below is the data from return fetch
    console.log(data);
  });
