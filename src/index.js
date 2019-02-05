"use strict";
import { createListView, clearListView } from "./modules/domManipulators";
import { fetchData } from "./modules/requestFunctions";


//On Page Load
let pokeList = null; //global storing list of pokemon to prevent multiple requests to load list of pokemons from api
fetchData("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=807").then(
  data => {
    createListView(data.results);
    pokeList = data;
  }
).catch(err => {
    console.log(err);
})

//Search bar filter functionality on change of input value
document.getElementById("search").addEventListener("input", function() {
  clearListView();
  createListView(pokeList.results, this.value.toLowerCase());
});
