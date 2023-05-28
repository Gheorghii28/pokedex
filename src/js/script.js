import { addPokemonCardEvent, loadEvents } from "./eventUtils.js";
import { generatePokemonCardsTemplate, includePokemonTypeSymbol } from "./templates.js";

const API_KEY = `nrfnBd_Ms3sre-VfpetB`;
// const urlPokemon = `https://pokeapi.co/api/v2/pokemon`;
const urlPokemon = `https://pokeapi.co/api/v2/pokemon`;
const pokemonsContainer = document.getElementById("container-with-pokemons");
let responsPokemonsAsJSON = "";
export let urlNextPokemon = "";
pokemonsContainer.innerHTML = "";

init();

// console.log(await getJSONFromURL(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1281`));//suchen durch alle pokemon

async function init() {
    await loadPokemons(urlPokemon);
    loadEvents();
}

async function fetchDataFromAPI(url) {
    let response = await fetch(url);
    let responseAsJSON = await response.json();
    responsPokemonsAsJSON = responseAsJSON;
    updateNextPokemonURL(responseAsJSON);
}


export async function getJSONFromURL(url) {
    let response = await fetch(url);
    let responseAsJSON = await response.json();
    return responseAsJSON;
}

export async function loadPokemons(url) {
    await fetchDataFromAPI(url);
    showPokemons(responsPokemonsAsJSON);
}

async function showPokemons(res) {
    const allPokemons = res[`results`];
    for (let i = 0; i < allPokemons.length; i++) {
        const pokemon = allPokemons[i];
        const pokemonUrl = pokemon[`url`];
        const pokemonData = await getJSONFromURL(pokemonUrl);
        const id = pokemonData[`id`];
        const speciesURL = pokemonData[`species`][`url`];
        const speciesData = await getJSONFromURL(speciesURL);
        const speciesColor = speciesData[`color`][`name`];
        pokemonsContainer.innerHTML += generatePokemonCardsTemplate(pokemonData, id);
        includePokemonTypeSymbol(pokemonData, id);
        setColor(speciesColor, id);
        addPokemonCardEvent(id);
    }
}

function updateNextPokemonURL(responseAsJSON) {
    if (responseAsJSON[`next`]) {
        urlNextPokemon = responseAsJSON[`next`];
    }
}

function setColor(speciesColor, id) {
    document.getElementById(`pokemon-${id}`).classList.add(`border-${speciesColor}`);
    document.getElementById(`id-nr-${id}`).classList.add(`color-${speciesColor}`);
}