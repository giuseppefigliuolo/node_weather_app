const request = require("request");
// Goal: Create a reusable function for getting the forecast
//
// 1. Setup the "forecast" function in utils/forecast.js
// 2. Require the function in app.js and call it as shown below
// 3. The forecast function should have three potential calls to callback:
//    - Low level error, pass string for error
//    - Coordinate error, pass string for error
//    - Success, pass forecast string for data (same format as from before)

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=f033c244550a0aeb295b19fc0fb1f480&query=${latitude},${longitude}`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to forecast services", undefined);
    } else if (body.error) {
      callback("Unable to find location. Try another search", undefined);
    } else {
      callback(
        undefined,
        `It's currently ${body.current.weather_descriptions[0].toLowerCase()} with ${body.current.temperature} degrees in ${
          body.location.name
        } (feels like ${body.current.feelslike} degrees). There is ${body.current.humidity}% of humidity and a wind speed of ${
          body.current.wind_speed
        }km/h. UV index: ${body.current.uv_index}.`
      );
      //   console.log(`It's currently ${weatherDescription} with ${temperature} degrees in ${cityName}, even if it feels like ${feelsLike}.`);
    }
  });
};

module.exports = forecast;
