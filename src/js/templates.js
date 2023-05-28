export function generatePokemonCardsTemplate(pokemonData, id) {
    // const id = pokemonData[`id`];
    const name = pokemonData[`name`];
    const base_experience = pokemonData[`base_experience`];
    const height = pokemonData[`height`];
    const weight = pokemonData[`weight`];
    const imgURL = pokemonData[`sprites`][`other`][`dream_world`][`front_default`];
    return `
    <div id="pokemon-${id}" class="pokemon-card">
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
        <img id="img-${id}" src="${imgURL}">
    </div>`;
}

export function includePokemonTypeSymbol(pokemonData, id) {
    const containerType = document.getElementById(`pokemon-type${id}`);
    containerType.innerHTML = ``;
    for(let i = 0; i < pokemonData[`types`].length; i++) {
        const typeName = pokemonData[`types`][i][`type`][`name`];
        containerType.innerHTML += `<img class="type-symbol-img" src="./src/img/type-symbol/type-${typeName}.png">`;
    }
}

{/* <div>
    <span class="pokemon-exp">base_experience: ${base_experience}</span>
    <span class="pokemon-height">height: ${height}</span>
    <span class="class-weight">weight: ${weight}</span>
</div> */}




// <table>
//     <tr>
//         <th class="pokemon-exp">exp:</th>
//         <th class="pokemon-height">height:</th>
//         <th class="class-weight">weight:</th>
//     </tr>
//     <tr>
//         <td>${base_experience}</td>
//         <td>${height}</td>
//         <td>${weight}</td>
//     </tr>
// </table>


