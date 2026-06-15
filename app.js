const express = require("express");
const session = require("express-session");
const path = require("path");
const { initDatabase } = require("./src/model/handlerData");
const pokemonRoutes = require("./src/routes/pokemonRoutes");
const battleRoutes = require("./src/routes/battleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(
  session({
    secret: "pokemon-secret",
    resave: false,
    saveUninitialized: true,
  })
);

initDatabase();

app.use("/", pokemonRoutes);
app.use("/", battleRoutes);

app.listen(PORT, () => {
  console.log(`Pokémon Battle running on http://localhost:${PORT}`);
});
