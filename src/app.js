const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// path.join() è una funzione che ha lo scopo di unire più pezzi di path in un unico path
const publicDirectoryPath = path.join(__dirname, "../public");
// Per express (siccome abbiamo cambiato la cartella da View a Template) creiamo un percorso file personalizzato e glielo specifichiamo
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("views", viewsPath); /**Ecco come express capisce dov'è la nostra cartella con i template */
// Handlebar template - dopo questa riga di codice creiamo view directory e all'interno index.hbs
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);

// Questo è un modo per customize our server. express.static prende come parametro il path a cui vogliamo indirizzarci
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  // 'index' questo nome deve combaciare perfettamente con il nome che abbiamo dato al file index.hbs
  res.render("index", {
    title: "Weather",
    name: "Giuseppe",
  });
});

// App.get prende due parametri; il primo è la route radice (es. app.it -quindi nella home non va messo niente- ) e poi una funzione in cui definiamo ciò che vogliamo accada quando qualcuno visita il sito in questione
// Nella callback abbiamo due parametri req(request) e res(response)
// app.get("", (req, res) => {
//   res.send("<h1>Weather</h1>");
// });

app.get("/weather", (req, res) => {
  // re.query.address sono i dati, in questo caso l'indirizzo, fornito dall'url digitato dall'utente
  if (!req.query.address) {
    return res.send({
      error: "You must provide a valid address",
    });
  }

  // { latitude, longitude, location } => sta a significare che creiamo un oggetto che ha come latitude : latitude poi longitude: longitude etc... questo è un modo per abbreviare
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        res.send({ error });
      }

      return res.send({
        forecast: forecastData,
        location: location,
      });
    });
  });

  // res.send({
  //   forecast: "It is snowing",
  //   location: req.query.address,
  // });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Giuseppe",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help page",
    message: "Di cosa hai bisogno? Ci impegniamo ad aiutarti.",
    name: "Giuseppe Figliuolo",
  });
});

// Qui indirizziamo a qualunque url che cominci con /help/ es. localhost:3000/help/how_to_do_that
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help 404",
    message: "Help article not found",
    name: "Giuseppe Figliuolo",
  });
});

// L'asteristo per express significa "match everything that hasnt been match so far"
app.get("*", (req, res) => {
  res.render("404", {
    title: "Page 404",
    message: "Sorry, we can’t find the page you were looking for.",
    name: "Giuseppe Figliuolo",
  });
});

// Questo metodo inizializza un server, si usa solo una volta per progetto. Ascolta(listen) su una determinata porta (che mettiamo come suo parametro)
app.listen(3000, () => {
  console.log("Server is up on port 3000.");
});
