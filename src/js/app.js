const API_KEY = `nrfnBd_Ms3sre-VfpetB`;
const urlPokemon = `https://pokeapi.co/api/v2/pokemon`;
const pokemonsContainer = document.getElementById("container-with-pokemons");
let responsPokemonsAsJSON = "";
let urlNextPokemon = "";
pokemonsContainer.innerHTML = "";

init();

// console.log(await getJSONFromURL(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1281`));//suchen durch alle pokemon

async function init() {
    await loadPokemons(urlPokemon);
    document.getElementById("btn-load-next-pokemons").addEventListener("click", () => { loadPokemons(urlNextPokemon) });
}

async function loadPokemons(url) {
    await fetchDataFromAPI(url);
    showPokemons(responsPokemonsAsJSON);
}

async function fetchDataFromAPI(url) {
    let response = await fetch(url);
    let responseAsJSON = await response.json();
    responsPokemonsAsJSON = responseAsJSON;
    updateNextPokemonURL(responseAsJSON);
}

function updateNextPokemonURL(responseAsJSON) {
    if (responseAsJSON[`next`]) {
        urlNextPokemon = responseAsJSON[`next`];
    }
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
        addPokemonCard(id, pokemonsContainer, pokemonData, speciesColor);
    }
    animationHoloEfect();
}

function addPokemonCard(id, pokemonsContainer, pokemonData, speciesColor) {
    pokemonsContainer.innerHTML += generatePokemonCardsTemplate(pokemonData, id);
    includePokemonTypeSymbol(pokemonData, id);
    setColor(speciesColor, id);
}

async function getJSONFromURL(url) {
    const response = await fetch(url);
    const responseAsJSON = await response.json();
    return responseAsJSON;
}

function generatePokemonCardsTemplate(pokemonData, id) {
    const name = pokemonData[`name`];
    // const base_experience = pokemonData[`base_experience`];
    const height = pokemonData[`height`];
    const weight = pokemonData[`weight`];
    const imgURL = pokemonData[`sprites`][`other`][`dream_world`][`front_default`];
    return `
    <div id="pokemon-${id}" onclick="openPokemonCard(${id})" class="pokemon-card card">
        <div>
            <div class="card-id">
                <span id="id-nr-${id}">#${id}</span>
            </div>
        </div>
        <div class="card-details">
            <h2 class="card-headline">${name}</h2>
            <div class="pokemon-info">
                <div class="pokemon-height">
                    <span>height</span>
                    <span>${height}</span>
                </div>
                <div id="pokemon-type${id}" class="class-type">
                </div>
                <div class="class-weight">
                    <span>weight</span>
                    <span>${weight}</span>
                </div>
            </div>
        </div>
        <img src="${imgURL}">
    </div>`;
}

function openPokemonCard(id) {
    console.log(id, "test-open pokemon");
}

function includePokemonTypeSymbol(pokemonData, id) {
    const containerType = document.getElementById(`pokemon-type${id}`);
    containerType.innerHTML = ``;
    for (let i = 0; i < pokemonData[`types`].length; i++) {
        const typeName = pokemonData[`types`][i][`type`][`name`];
        containerType.innerHTML += `<img class="type-symbol-img" src="./src/img/type-symbol/type-${typeName}.png">`;
    }
}

function setColor(speciesColor, id) {
    document.getElementById(`pokemon-${id}`).classList.add(`border-${speciesColor}`);
    document.getElementById(`id-nr-${id}`).classList.add(`color-${speciesColor}`);
}

function animationHoloEfect() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("mouseover", handleMouseOver);
        card.addEventListener("mouseout", handleMouseOut);
    });
}

function handleMouseOver(e) {
    const card = this;
    card.classList.add("animated");
}

function handleMouseOut(e) {
    const card = this;
    card.classList.remove("animated");
    setTimeout(() => {
        card.classList.add("animated");
    }, 1000);
}