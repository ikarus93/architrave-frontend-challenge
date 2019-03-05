import { fetchData } from "./src/modules/requestFunctions.js";


test("Retrieves promise with data of all 807 pokemons from REST Api", () => {
    
    expect.assertions(2);
    
    return fetchData("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=807").then(data => {
        expect(data.count).toBe(807);
        expect(data.results[0].name).toBe('bulbasaur'); //Check for first pokemon
    })
})

test("Retrieves promise with data for specific pokemon from REST Api", () => {
    
    expect.assertions(2);
    
    return fetchData("https://pokeapi.co/api/v2/pokemon-species/1/").then(data => {
        expect(data.base_happiness).toBe(70);
        expect(data.evolution_chain.url).toBe("https://pokeapi.co/api/v2/evolution-chain/1/");
        
    })
})

test("Retrieves evolution chain for specific pokemon from REST Api", () => {
    
    expect.assertions(3);
    
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
          
           expect(evolutionChain).toContain('Squirtle');
           expect(evolutionChain).toContain('Wartortle');
           expect(evolutionChain).toContain('Blastoise');
        
    })
})