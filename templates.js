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



function createPokemonPopup(pokemon) {
    let name = pokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    let weight = pokemon['weight'] / 10;
    let height = pokemon['height'] / 10;

    let typeIcons = `<img class="types" src="img/${pokemon['types'][0]['type']['name']}.png" alt="${pokemon['types'][0]['type']['name']}">`;
    if (pokemon['types'].length > 1) {
        typeIcons += `<img class="types" src="img/${pokemon['types'][1]['type']['name']}.png" alt="${pokemon['types'][1]['type']['name']}">`;
    }

    // Calculate the previous and next ID
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


function back(id) {
    if (id > 0) {
        showPopup(id);
    }
}

function forward(id) {
    // Assuming we have 1302 Pokémon in the current generation
    if (id <= 1302) {
        showPopup(id);
    }
}


function getChartTemplate() {
    return `
        <canvas id="myChart" style="display: block; box-sizing: border-box; height: 200px; width: 100%;"></canvas>
    `;
}

function getEvolutionImageTemplate(id) {
    return `
    <img class="evolutionImage" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png" alt="">
    `;
}

function getEvolutionArrowTemplate() {
    return `<div class="evolutionArrow">&#10148;</div>`;
}

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