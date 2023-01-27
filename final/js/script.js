// API Key
let apiKey = "9ed27dc20b6878421a84136c5fe9e945";

// create variables fo parameters
// city
//country
// different url for future forecast?

// URL Build
let queryURL1 =
  "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" +
  apiKey;

let queryURL2 =
  "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=" +
  apiKey;

fetch(queryURL1)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });

fetch(queryURL2)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
