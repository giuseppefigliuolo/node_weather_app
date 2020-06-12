const request = require("request");

const geocode = (adress, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    adress
  )}.json?access_token=pk.eyJ1IjoiYW1pY29kZWxtdWxpbm85NiIsImEiOiJja2E4OWx2MHEwYjJoMnRta3E4cHk1eTFqIn0.6Rp9FhcDj0eypFqdIb1krg&limit=1`;
  request({ url: url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to location services!");
    } else if (body.features.length === 0) {
      callback("Unable to find location. Try another search");
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
