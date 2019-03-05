import { createEvolutionChain } from "../src/modules/domManipulators.js";
import { fetchData } from "../src/modules/requestFunctions.js";

test("Creates UL element containing the evolution chain for squirtle from fetched data", () => {
    
    expect.assertions(5);
    
       
    return fetchData("https://pokeapi.co/api/v2/evolution-chain/3/").then(data => {
        let current = data.chain;
        
        const evolutionChain = [];
        
          do {
            let speciesName = current.species.name;
            evolutionChain.push(
              speciesName[0].toUpperCase() + speciesName.slice(1)
            );
            current = current.evolves_to[0];
          } while (current && current.hasOwnProperty("evolves_to"));
           
           let ulNode = createEvolutionChain(evolutionChain);

           expect(ulNode instanceof HTMLElement).toBeTruthy();
           expect(ulNode.innerHTML).toBe("<li></li><li></li><li></li>") //squirtle has 3 pokemons in evolution chain, hence 3 list items shall be created
           expect(ulNode.firstChild.innerText).toBe("Squirtle");
           expect(ulNode.children[1].innerText).toBe("Wartortle");
           expect(ulNode.children[2].innerText).toBe("Blastoise");
    })
})