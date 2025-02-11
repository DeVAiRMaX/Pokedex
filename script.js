let showNumberPokemons = 20;
let pokemons = [];

/**
 * Loads the first 20 pokemons and renders them as cards in the content 
 * container. Also hides the popup if it is currently visible.
 */
function render() {
    loadPokemons();
    hidePopup();
}

/**
 * Loads the first {showNumberPokemons} pokemons from the PokeAPI and renders
 * them as cards in the content container. Also shows the loading screen until
 * all pokemons are loaded.
 */
async function loadPokemons() {
    document.getElementById('loadingScreen').style.display = 'block';


    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${showNumberPokemons}&offset=0`;
    const response = await fetch(BASE_URL);
    const data = await response.json();
    
    for (const { url } of data.results) {
        const response = await fetch(url);
        const pokemon = await response.json();
        pokemons.push(pokemon);
    }

    renderPokemons();

    document.getElementById('loadingScreen').style.display = 'none';
}

/**
 * Renders all pokemons in the content container.
 */
function renderPokemons() {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';
    pokemons.forEach(pokemon => {
        contentContainer.innerHTML += createPokemonCard(pokemon);
    });
}

/**
 * Renders the pokemons in the content container starting from the given index.
 * @param {number} startIndex The index from which the pokemons should be rendered.
 */
function renderNewPokemons(startIndex) {
    const contentContainer = document.getElementById('content');
    for (let i = startIndex; i < pokemons.length; i++) {
        contentContainer.innerHTML += createPokemonCard(pokemons[i]);
    }
}

/**
 * Loads the next set of 10 pokemons from the PokeAPI and appends them to the
 * existing list of pokemons. Updates the content container to display the new
 * pokemons, and shows the loading screen while the data is being fetched.
 */
async function loadMore() {

    document.getElementById('loadingScreen').style.display = 'block';

    const currentLength = pokemons.length;

    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentLength}`;
    const response = await fetch(BASE_URL);
    const data = await response.json();

    for (const { url } of data.results) {
        const response = await fetch(url);
        const pokemon = await response.json();
        pokemons.push(pokemon);
    }

    renderNewPokemons(currentLength);

    console.log(showNumberPokemons);

    document.getElementById('loadingScreen').style.display = 'none';
}

/**
 * Shows the popup with the detailed information of the pokemon with the given id.
 * The information is fetched from the PokeAPI and the popup is populated with
 * the received data.
 * @param {number} i The id of the pokemon to show the information for.
 */
async function showPopup(i) {
    let popup = document.getElementById('popup');
    popup.classList.remove('d-none');
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let pokemon = await response.json();
    let infoCardContainer = document.getElementById('infoCard');
    infoCardContainer.innerHTML = createPokemonPopup(pokemon);
}

/**
 * Hides the popup by adding the 'd-none' class to the popup element.
 */
function hidePopup() {
    let popup = document.getElementById('popup');
    popup.classList.add('d-none');
}

/**
 * Hides the popup by adding the 'd-none' class to the popup element.
 * This can be used to close the popup when the user clicks outside the
 * popup or presses the escape key.
 */
function closePopup() {
    let popup = document.getElementById('popup');
    popup.classList.add('d-none');
}

/**
 * Shows a bar chart of the given pokemon's stats in the info card.
 * The chart shows the HP, Attack and Defense stats of the pokemon.
 * @param {number} pokemon The id of the pokemon to show the stats for.
 */
async function showStats(pokemon) {
    const infoCardContent = document.getElementById('infoCardContent');
    infoCardContent.innerHTML = getChartTemplate();

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const responseStats = await fetch(url);
    const stats = await responseStats.json();

    const { base_stat: hp } = stats['stats'][0];
    const { base_stat: attack } = stats['stats'][1];
    const { base_stat: defense } = stats['stats'][2];

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defense'],
            datasets: [{
                label: 'Wert',
                data: [hp, attack, defense],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 200,
                    ticks: {
                        color: '#2591c7'
                    },
                    grid: {
                        color: '#494949'
                    }
                },
                y: {
                    ticks: {
                        color: '#2591c7'
                    },
                    grid: {
                        color: '#494949' 
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#2591c7' 
                    }
                }
            }
        }
    });
}

/**
 * Shows the first three evolutions of the given pokemon in the info card.
 * The evolutions are fetched from the PokeAPI and the popup is populated
 * with the received data.
 * @param {number} pokemonId The id of the pokemon to show the evolutions for.
 */
async function showEvolution(pokemonId) {
    const infoCardContent = document.getElementById('infoCardContent');
    infoCardContent.innerHTML = '';

    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    const responseEvolution = await fetch(evolutionChainUrl);
    const evolutionData = await responseEvolution.json();

    function getIdFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }
    
    function getEvolutions(chain, count = 0) {
        const evolutions = [];
        const id = getIdFromUrl(chain.species.url);
        evolutions.push(getEvolutionImageTemplate(id));

        if (count < 2 && chain.evolves_to.length > 0) {
            evolutions.push(getEvolutionArrowTemplate());
            chain.evolves_to.forEach(evolution => {
                evolutions.push(...getEvolutions(evolution, count + 1));
            });
        }

        return evolutions;
    }

    const firstThreeEvolutions = getEvolutions(evolutionData.chain).slice(0, 5).join('');
    infoCardContent.innerHTML = firstThreeEvolutions;
}



/**
 * Shows the info of the pokemon with the given id.
 * The information is fetched from the PokeAPI and the popup is populated with
 * the received data.
 * @param {number} pokemonid The id of the pokemon to show the information for.
 */

async function showPokemonInfo(pokemonid) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonid}`;
    const responseInformation = await fetch(url);
    const information = await responseInformation.json();
    const weight = information['weight'] / 10;
    const height = information['height'] / 10;

    const infoCardContent = document.getElementById('infoCardContent');
    infoCardContent.innerHTML = getInfoTableTemplate(weight, height);
}

/**
 * Filters the list of pokemons based on the user's search input and displays
 * the matching pokemons as cards in the content container.
 * The search is case-insensitive and matches any occurrence of the input
 * string within a pokemon's name.
 */

async function filterNames() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${showNumberPokemons}`;
    const response = await fetch(url);
    const data = await response.json();

    let search = document.getElementById('searchPokemon').value;
    search = search.toLowerCase();

    let contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';


    let pokemons = data.results;

    for (let i = 0; i < pokemons.length; i++) {
        let pokemonName = pokemons[i].name;
        if (pokemonName.toLowerCase().includes(search)) {

            let pokemonDetailResponse = await fetch(pokemons[i].url);
            let pokemon = await pokemonDetailResponse.json();
            contentContainer.innerHTML += createPokemonCard(pokemon);
        }
    }
}