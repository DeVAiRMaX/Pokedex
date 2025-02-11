let showNumberPokemons = 20;
let pokemons = [];

function render() {
    loadPokemons();
    hidePopup();
}

async function loadPokemons() {
    // Display the loading screen
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

    // Hide the loading screen when the data is loaded
    document.getElementById('loadingScreen').style.display = 'none';
}

function renderPokemons() {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';
    pokemons.forEach(pokemon => {
        contentContainer.innerHTML += createPokemonCard(pokemon);
    });
}

function renderNewPokemons(startIndex) {
    const contentContainer = document.getElementById('content');
    for (let i = startIndex; i < pokemons.length; i++) {
        contentContainer.innerHTML += createPokemonCard(pokemons[i]);
    }
}

async function loadMore() {
    // Display the loading screen
    document.getElementById('loadingScreen').style.display = 'block';

    // Determine the current index to render only the new Pokémon later
    const currentLength = pokemons.length;

    // Load 10 more Pokémon
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${currentLength}`;
    const response = await fetch(BASE_URL);
    const data = await response.json();

    for (const { url } of data.results) {
        const response = await fetch(url);
        const pokemon = await response.json();
        pokemons.push(pokemon);
    }

    // Render only the newly added Pokémon
    renderNewPokemons(currentLength);

    console.log(showNumberPokemons);

    // Hide the loading screen when the data is loaded
    document.getElementById('loadingScreen').style.display = 'none';
}

async function showPopup(i) {
    let popup = document.getElementById('popup');
    popup.classList.remove('d-none');
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let pokemon = await response.json();
    let infoCardContainer = document.getElementById('infoCard');
    infoCardContainer.innerHTML = createPokemonPopup(pokemon);
}

function hidePopup() {
    let popup = document.getElementById('popup');
    popup.classList.add('d-none');
}

function closePopup() {
    let popup = document.getElementById('popup');
    popup.classList.add('d-none');
}

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
                    max: 200, // Assuming the maximum stat value is 255
                    ticks: {
                        color: '#2591c7' // X-axis tick labels color
                    },
                    grid: {
                        color: '#494949' // X-axis grid lines color
                    }
                },
                y: {
                    ticks: {
                        color: '#2591c7' // Y-axis tick labels color
                    },
                    grid: {
                        color: '#494949' // Y-axis grid lines color
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#2591c7' // Legend labels color
                    }
                }
            }
        }
    });
}

async function showEvolution(pokemonId) {
    const infoCardContent = document.getElementById('infoCardContent');
    infoCardContent.innerHTML = '';

    // Get the species information to find the evolution chain URL
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain data
    const responseEvolution = await fetch(evolutionChainUrl);
    const evolutionData = await responseEvolution.json();

    // Function to get the Pokémon ID from the URL
    function getIdFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    // Recursive function to get up to three evolutions with arrows
    function getEvolutions(chain, count = 0) {
        const evolutions = [];
        const id = getIdFromUrl(chain.species.url);
        evolutions.push(getEvolutionImageTemplate(id));

        if (count < 2 && chain.evolves_to.length > 0) { // Stop after the third evolution
            evolutions.push(getEvolutionArrowTemplate());
            chain.evolves_to.forEach(evolution => {
                evolutions.push(...getEvolutions(evolution, count + 1));
            });
        }

        return evolutions;
    }

    // Get up to three evolutions
    const firstThreeEvolutions = getEvolutions(evolutionData.chain).slice(0, 5).join('');
    infoCardContent.innerHTML = firstThreeEvolutions;
}



async function showPokemonInfo(pokemonid) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonid}`;
    const responseInformation = await fetch(url);
    const information = await responseInformation.json();
    const weight = information['weight'] / 10;
    const height = information['height'] / 10;

    const infoCardContent = document.getElementById('infoCardContent');
    infoCardContent.innerHTML = getInfoTableTemplate(weight, height);
}

async function filterNames() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${showNumberPokemons}`; // Limit set to 1000 to fetch all Pokémon names
    const response = await fetch(url);
    const data = await response.json();

    let search = document.getElementById('searchPokemon').value;
    search = search.toLowerCase();

    let contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';

    // Get the list of Pokémon names
    let pokemons = data.results;

    for (let i = 0; i < pokemons.length; i++) {
        let pokemonName = pokemons[i].name;
        if (pokemonName.toLowerCase().includes(search)) {
            // Fetch detailed Pokémon data to create a Pokémon card
            let pokemonDetailResponse = await fetch(pokemons[i].url);
            let pokemon = await pokemonDetailResponse.json();
            contentContainer.innerHTML += createPokemonCard(pokemon);
        }
    }
}