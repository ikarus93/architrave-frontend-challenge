"use strict";
import { fetchData } from "./requestFunctions";
let overlayOpen = false;  //module contained global to track state of overlay being shown

function createListView(data, filter = null) {
  /* Creates a ListView based on the data retrieved from the API-Call and appends it to the #content-list DOM element
     Parameters:
         data -> Array of Objects
         filter -> String to filter models, default is null
  */
  const ul = document.createElement("ul");
  ul.classList.add("wrapper");

  let unsortedEls = []; //temporary container to hold the list elements

  data.forEach(species => {
    const listEl = document.createElement("li");
    listEl.classList.add("model");

    const span = document.createElement("span");
    span.innerText = species.name;

    const btn = document.createElement("button");
    btn.innerText = "Show Evolution Chain";
    btn.addEventListener("click", function() {
        if (!overlayOpen) {
            loadSubList(species.url, species.name);
            overlayOpen = true;
        }
    });
    btn.classList.add("btn", "btn-warning"); //Bootstrap button classes

    [span, btn].map(el => listEl.appendChild(el));

    unsortedEls.push(listEl);
  });

  //Sort the elements alphabetically by name, filter them if parameter was given, then append them to list parent, element.firstChild refers to the li's span child
  let sortedEls = unsortedEls.sort((a, b) => {
    let [first, second] = [a.firstChild.innerText, b.firstChild.innerText];
    return first < second ? -1 : first > second ? 1 : 0;
  });

  //filter elements if parameter was given
  if (filter)
    sortedEls = sortedEls.filter(el =>
      el.firstChild.innerText.startsWith(filter)
    );

  sortedEls.map(el => ul.appendChild(el));

  document.getElementById("content-list").appendChild(ul);
}

function clearListView() {
  /* Clears the ListView by emptying #content-list */
  document.getElementById("content-list").innerHTML = "";
}

function createEvolutionChain(chain) {
  /* Creates and returns a list containing the pokemons that share the same evolution chain.
      Parameters:
          chain -> Array of Strings
  */

  const ul = document.createElement("ul");

  chain.forEach(member => {
    const li = document.createElement("li");
    li.innerText = member;

    ul.appendChild(li);
  });

  return ul;
}

function loadSubList(url, name) {
  /* Creates a new view overlay with fetched data, containing the evolution chain of specified pokemon.
     Appends the created overlay to the DOM as .main-wrappers first child.
      Parameters:
          url -> String
          name -> String
   */

  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  //Button to close the new view
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.classList.add("btn", "btn-danger");
  closeButton.addEventListener("click", function() {
    overlayOpen = false;
    document.querySelector(".overlay").remove();
  });
  overlay.appendChild(closeButton);

  //Create evolution chain
  const evolutionChain = [];
  fetchData(url).then(data => {
    const evolutionChainUrl = data.evolution_chain.url;
    fetchData(evolutionChainUrl).then(data => {
      let current = data.chain;

      do {
        let speciesName = current.species.name;
        evolutionChain.push(
          speciesName[0].toUpperCase() + speciesName.slice(1)
        );
        current = current.evolves_to[0];
      } while (current && current.hasOwnProperty("evolves_to"));

      // listContent div contains all list related elements like header
      const listContent = document.createElement("div");
      listContent.classList.add("list-content");

      const listHeader = document.createElement("h4");
      listHeader.innerText = `Evolution Chain for ${name[0].toUpperCase() +
        name.slice(1)}:`;

      listContent.appendChild(listHeader);

      const list = createEvolutionChain(evolutionChain);
      listContent.appendChild(list);

      overlay.appendChild(listContent);

      //Insert it as first child of the main-wrapper
      const pageWrapper = document.querySelector(".main-wrapper");
      pageWrapper.insertBefore(overlay, pageWrapper.firstChild);
    });
  }).catch(err => {
      console.log(err);
  })
}

export { createListView, clearListView }