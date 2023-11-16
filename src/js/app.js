const urlPokemon = `https://pokeapi.co/api/v2/pokemon`;
const pokemonsContainer = document.getElementById("container-with-pokemons");
const searchInput = document.getElementById('search-input');
const pokemonNameList = [];
let isLoading = false;
let indexPkemon;
let urlNextPokemon = "";
pokemonsContainer.innerHTML = '<span id="not-pokemon" class="d-none"></span>';


init();

async function init() {
    showLoading();
    await loadPokemons(urlPokemon);
    document.getElementById("btn-load-next-pokemons").addEventListener("click", () => {
        if (!isLoading) {
            loadPokemons(urlNextPokemon);
        }
    });
    closeSlideShowEvent();
    btnNextPokemonEvent();
    btnAbilitiesEvent();
    btnMovesEvent();
}

async function loadPokemons(url) {
    isLoading = true;
    const responseAsJSON = await fetchDataFromAPI(url);
    await showPokemons(responseAsJSON);
    isLoading = false;
}

async function fetchDataFromAPI(url) {
    const response = await fetch(url);
    const responseAsJSON = await response.json();
    updateNextPokemonURL(responseAsJSON);
    return responseAsJSON;
}

function updateNextPokemonURL(responseAsJSON) {
    if (responseAsJSON.next) {
        urlNextPokemon = responseAsJSON.next;
    }
}

async function showPokemons(res) {
    const allPokemons = res.results;
    const promises = allPokemons.map(pokemon => getJSONFromURL(pokemon.url));
    const pokemonsData = await Promise.all(promises);
    for (let i = 0; i < allPokemons.length; i++) {
        const pokemonData = pokemonsData[i];
        const id = pokemonData.id;
        const speciesData = await getJSONFromURL(pokemonData.species.url);
        const speciesColor = speciesData.color.name;
        addPokemonCard(id, pokemonsContainer, pokemonData, speciesColor);
    }
    animationHoloEfect();
    hideLoading();
}

function showLoading() {
    document.getElementById("loading-container").classList.remove("d-none");
}

function hideLoading() {
    document.getElementById("loading-container").classList.add("d-none");
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
    const height = pokemonData[`height`];
    const weight = pokemonData[`weight`];
    const imgURL = pokemonData[`sprites`][`other`][`dream_world`][`front_default`];
    pokemonNameList.push(name);
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
    document.getElementById("app-container").classList.add("opacity-01");
    document.getElementById("slideshow-container").classList.remove("d-none");
    renderPokemonScreen(id);
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

function createChart(specialDefence, attack, defense, specialAttack, hp, speed, speciesColor) {
    const previousChart = Chart.getChart("my-chart");
    if (previousChart) {
        previousChart.destroy();
    }
    const ctx = document.getElementById('my-chart');
    new Chart(ctx, {
        type: 'radar',
        data: dataInfoChart(specialAttack, attack, defense, specialDefence, hp, speed, speciesColor),
        options: chartOptions
    });
}

function closeSlideShowEvent() {
    document.getElementById("slideshow-container").addEventListener("click", el => {
        if (el.target.id === "slideshow-container") {
            hideSlideshow();
        }
    });
    document.getElementById("close").addEventListener("click", () => {
        hideSlideshow();
    });
}

function hideSlideshow() {
    document.getElementById("app-container").classList.remove("opacity-01");
    document.getElementById("slideshow-container").classList.add("d-none");
}

async function renderPokemonScreen(id) {
    updateBackButtonVisibility(id)
    const pokemonData = await getJSONFromURL(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    displayPokemonInfo(pokemonData);
    displayPokemonImage(id);
    displayPokemonTypes(pokemonData);
    displayPokemonStats(pokemonData);
    displayAbilities(pokemonData);
    displayMoves(pokemonData);
    indexPkemon = id;
}

function updateBackButtonVisibility(id) {
    const backButton = document.getElementById("back");
    backButton.classList.toggle("d-none", id === 1);
}

function displayPokemonInfo(pokemonData) {
    const pokemonId = pokemonData.id;
    const pokemonName = pokemonData.name;
    const pokemonExp = pokemonData.base_experience;
    const pokemonWeight = pokemonData.weight;
    const pokemonHeight = pokemonData.height;
    document.getElementById("pokemon-name").innerHTML = pokemonName;
    document.getElementById("info-1-id").innerHTML = `ID No.  ${pokemonId}`;
    document.getElementById("info-1-exp").innerHTML = `Exp  ${pokemonExp}`;
    document.getElementById("info-2-weight").innerHTML = `weight:  ${pokemonWeight}`;
    document.getElementById("info-2-height").innerHTML = `height:  ${pokemonHeight}`;
}

function displayPokemonImage(id) {
    document.getElementById("pokemon-img").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
}

function displayPokemonTypes(pokemonData) {
    const types = pokemonData.types;
    const typeArea = document.getElementById("bottom-right-area");
    typeArea.innerHTML = "";
    for (let i = 0; i < types.length; i++) {
        const typeName = types[i].type.name;
        typeArea.innerHTML += `
            <div class="pokemon-type">
                <span>${typeName}</span>
                <img src="./src/img/type-symbol/type-${typeName}.png" alt="">
            </div>`;
    }
}

async function displayPokemonStats(pokemonData) {
    const stats = pokemonData.stats;
    const specialDefence = stats[4].base_stat;
    const attack = stats[1].base_stat;
    const defense = stats[2].base_stat;
    const specialAttack = stats[3].base_stat;
    const hp = stats[0].base_stat;
    const speed = stats[5].base_stat;
    const speciesURL = pokemonData.species.url;
    const speciesData = await getJSONFromURL(speciesURL);
    const speciesColor = speciesData.color.name;
    document.getElementById("pokemon-screen").style.borderColor = speciesColor;
    createChart(specialDefence, attack, defense, specialAttack, hp, speed, speciesColor);
}

async function displayAbilities(pokemonData) {
    const abilities = pokemonData.abilities;
    const allAbilitiesContainer = document.getElementById("all-abilities");
    allAbilitiesContainer.innerHTML = "";
    for (let i = 0; i < abilities.length; i++) {
        const abilityName = abilities[i].ability.name;
        allAbilitiesContainer.innerHTML += `<div class="abilities-text">${abilityName}</div>`;
    }
}

async function displayMoves(pokemonData) {
    const moves = pokemonData.moves;
    const allMovesContainer = document.getElementById("all-moves");
    allMovesContainer.innerHTML = "";
    for (let i = 0; i < moves.length; i++) {
        const moveName = moves[i].move.name;
        allMovesContainer.innerHTML += `<div class="moves-text">${moveName}</div>`;
    }
}

function btnNextPokemonEvent() {
    document.getElementById("back").addEventListener("click", () => {
        const idBackPokemon = indexPkemon - 1;
        renderPokemonScreen(idBackPokemon);
    });
    document.getElementById("next").addEventListener("click", () => {
        const idNextPokemon = indexPkemon + 1;
        renderPokemonScreen(idNextPokemon);
    });
}

function btnAbilitiesEvent() {
    const btnAbilities = document.getElementById("btn-abilities");
    const allAbilities = document.getElementById("all-abilities");
    btnAbilities.addEventListener("click", () => { toggleAbilitiesVisibility(allAbilities) });
}

function toggleAbilitiesVisibility(allAbilities) {
    if (allAbilities.classList.contains("d-none")) {
        showAbilities(allAbilities);
    } else {
        hideAbilities(allAbilities);
    }
}

function showAbilities(allAbilities) {
    allAbilities.classList.remove("d-none");
    allAbilities.classList.add("rubberBandAnimation");
}

function hideAbilities(allAbilities) {
    allAbilities.classList.add("d-none");
    allAbilities.classList.remove("rubberBandAnimation");
}


function btnMovesEvent() {
    const btnMoves = document.getElementById("btn-moves");
    const allMoves = document.getElementById("all-moves");
    btnMoves.addEventListener("click", () => { toggleMovesVisibility(allMoves); });
}

function toggleMovesVisibility(allMoves) {
    if (allMoves.classList.contains("d-none")) {
        showMoves(allMoves);
    } else {
        hideMoves(allMoves);
    }
}

function showMoves(allMoves) {
    allMoves.classList.add("visible", "moves-animation-open");
    allMoves.classList.remove("d-none", "hidden", "moves-animation-close");
}

function hideMoves(allMoves) {
    allMoves.classList.add("moves-animation-close");
    allMoves.classList.remove("moves-animation-open", "visible");
    setTimeout(() => {
        allMoves.classList.add("d-none", "hidden");
    }, 400);
}

function filterPokemons(searchTerm) {
    const filteredPokemons = pokemonNameList.filter((pokemon) =>
        pokemon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayResults(filteredPokemons, searchTerm);
};

function displayResults(results, searchTerm) {
    const matchingIds = findMatchingIds(results);
    hideAllPokemons();
    showMatchingPokemons(matchingIds, searchTerm);
}

function findMatchingIds(results) {
    return results.reduce((ids, value) => {
        const index = pokemonNameList.indexOf(value);
        if (index !== -1) {
            ids.push(index);
        }
        return ids;
    }, []);
}

function hideAllPokemons() {
    const allPokemonsCard = document.querySelectorAll(".pokemon-card");
    allPokemonsCard.forEach((pokemonCard) => {
        pokemonCard.classList.add("d-none");
    });
}

function showMatchingPokemons(matchingIds, searchTerm) {
    const allPokemonsCard = document.querySelectorAll(".pokemon-card");
    const notPokemon = document.getElementById('not-pokemon');
    if (matchingIds.length == 0) {
        notPokemon.classList.remove('d-none');
        notPokemon.innerHTML = `Unfortunately, there is no Pokémon with the name: <span style="color: white;">${searchTerm}</span>` ;
        return;
    } else {
        notPokemon.classList.add('d-none');   
    }
    matchingIds.forEach((id) => {
        allPokemonsCard[id].classList.remove("d-none");
    });
}


searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    filterPokemons(searchTerm);
});

searchInput.addEventListener('focus', () => {
    searchInput.classList.add('expanded');
    searchInput.classList.remove('search-input-icon');
    searchInput.placeholder = 'Search Pokémon...';
});

searchInput.addEventListener('blur', () => {
    searchInput.classList.remove('expanded');
    searchInput.classList.add('search-input-icon');
    searchInput.value = "";
    searchInput.placeholder = '';
});

searchInput.addEventListener("click", () => {
    const allPokemonsCard = document.querySelectorAll(".pokemon-card");
    for (let i = 0; i < allPokemonsCard.length; i++) {
        allPokemonsCard[i].classList.remove("d-none");
    }
});