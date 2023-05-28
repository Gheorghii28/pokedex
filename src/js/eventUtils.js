import { loadPokemons, urlNextPokemon } from "./script.js";

export function loadEvents() {
    addLoadNextPokemonsBtnEvent();
}

export function addLoadNextPokemonsBtnEvent() {
    document.getElementById("btn-load-next-pokemons").addEventListener("click", () => { loadPokemons(urlNextPokemon) });
}

export function addPokemonCardEvent(id) {
    document.getElementById(`pokemon-${id}`).addEventListener("click", () => { console.log(id) });
}