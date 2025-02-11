
/**
 * Returns a HTML string representing a pokemon card.
 * The card includes the name, the first two types and an image of the pokemon.
 * @param {Object} pokemon A pokemon object from the PokeAPI.
 * @returns {String} A HTML string representing the pokemon card.
 */
function createPokemonCard(pokemon) {
    let name = pokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    let typeIcons = `<img class="types" src="img/${pokemon['types'][0]['type']['name']}.png" alt="${pokemon['types'][0]['type']['name']}">`;
    if (pokemon['types'].length > 1) {
        typeIcons += `<img class="types" src="img/${pokemon['types'][1]['type']['name']}.png" alt="${pokemon['types'][1]['type']['name']}">`;
    }

    return /*html*/`
    <div class="card" onclick="showPopup(${pokemon['id']})">
        <div class="cardTitle">${formattedName}</div>
        <div class="cardImage ${pokemon['types'][0]['type']['name']}">
            <img class="pokeImgsmall" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon['id']}.png" alt="Bild">
        </div>
        <div class="cardInfo">${typeIcons}</div>
    </div>
    `;
}



/**
 * Returns a HTML string representing a pokemon popup.
 * The popup includes the name, the first two types, an image of the pokemon, a navigation to the previous and next pokemon
 * and a table with the weight and height of the pokemon.
 * @param {Object} pokemon A pokemon object from the PokeAPI.
 * @returns {String} A HTML string representing the pokemon popup.
 */
function createPokemonPopup(pokemon) {
    let name = pokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    let weight = pokemon['weight'] / 10;
    let height = pokemon['height'] / 10;

    let typeIcons = `<img class="types" src="img/${pokemon['types'][0]['type']['name']}.png" alt="${pokemon['types'][0]['type']['name']}">`;
    if (pokemon['types'].length > 1) {
        typeIcons += `<img class="types" src="img/${pokemon['types'][1]['type']['name']}.png" alt="${pokemon['types'][1]['type']['name']}">`;
    }

    let previousId = pokemon['id'] - 1;
    let nextId = pokemon['id'] + 1;

    return /*html*/`
    <div class="infoCardTitle">
        <p>#${pokemon['id']}</p>
        <p>${formattedName}</p>
        <p class="closebtn" onclick="closePopup()">X</p>
    </div>
    <div class="infoCardImage">
        <a onclick="back(${previousId})" href="#"><span class="arrow left"></span></a>
        <img class="pokeImage" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon['id']}.png" alt="">
        <a onclick="forward(${nextId})" href="#"><span class="arrow right"></span></a>
    </div>
    <div class="infoCardElement">${typeIcons}</div>
    <div class="infoCardNavigation">
        <ul>
            <li onclick="showPokemonInfo(${pokemon['id']})">Info</li>
            <li onclick="showStats(${pokemon['id']})">Statistik</li>
            <li onclick="showEvolution(${pokemon['id']})">Verwandlungen</li>
        </ul>
    </div>
    <div class="infoCardContent" id="infoCardContent">
    ${getInfoTableTemplate(weight, height)}
    </div>
    `;
}


/**
 * Shows the popup of the pokemon with the given id if it is greater than 0.
 * @param {number} id The id of the pokemon to show the popup for.
 */
function back(id) {
    if (id > 0) {
        showPopup(id);
    }
}

/**
 * Shows the popup of the pokemon with the given id if it is less than or equal
 * to the number of Pokémon in the current generation.
 * @param {number} id The id of the pokemon to show the popup for.
 */
function forward(id) {
    if (id <= 1302) {
        showPopup(id);
    }
}


/**
 * Returns a HTML string containing a canvas element for displaying a chart.
 * The canvas is styled to be displayed as a block element with a specific height
 * and width, and is intended to be used with Chart.js for rendering.
 * @returns {String} A HTML string with a canvas element.
 */

function getChartTemplate() {
    return `
        <canvas id="myChart" style="display: block; box-sizing: border-box; height: 200px; width: 100%;"></canvas>
    `;
}

/**
 * Returns a HTML string containing an image element for a pokemon evolution.
 * The image is fetched from a URL using the given pokemon ID.
 * @param {number} id The ID of the pokemon for which the evolution image is to be displayed.
 * @returns {String} A HTML string with an image element for the evolution.
 */

function getEvolutionImageTemplate(id) {
    return `
    <img class="evolutionImage" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png" alt="">
    `;
}

/**
 * Returns a HTML string containing a span element that displays a right-pointing
 * arrow, intended to be used to indicate a pokemon evolution.
 * @returns {String} A HTML string with a span element for the evolution arrow.
 */
function getEvolutionArrowTemplate() {
    return `<div class="evolutionArrow">&#10148;</div>`;
}

/**
 * Returns a HTML string containing a table element for displaying information
 * about a pokemon, specifically the weight and height of the pokemon.
 * @param {number} weight The weight of the pokemon in kilograms.
 * @param {number} height The height of the pokemon in meters.
 * @returns {String} A HTML string with a table element for the pokemon information.
 */

function getInfoTableTemplate(weight, height) {
    return /*html*/`
    <div class="infoCardContainer">
        <table class="infoTable">
            <tr>
                <th>Gewicht:</th>
                <td>${weight} kg</td>
            </tr>
            <tr>
                <th>Größe:</th>
                <td>${height} m</td>
            </tr>
        </table>
        </div>
    `;
}