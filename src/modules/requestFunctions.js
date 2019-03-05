"use strict";
const fetch = require("node-fetch");
 export function fetchData(url) {
  /* Gets a list of species via the https://pokeapi.co/api/v2/pokemon-species/ endpoint.
     Gets species specific data via https://pokeapi.co/api/v2/pokemon-species/id/ endpoint.
     Returns a Promise that resolves with the captured species names or species specific data depending on url passed in */

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}


