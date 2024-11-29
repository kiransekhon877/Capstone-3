// DOM Elements
const pokemonList = document.getElementById('pokemon-list');
const loadMoreButton = document.getElementById('load-more');
const pokemonDetailModal = document.getElementById('pokemon-detail-modal');
const closeModalButton = document.querySelector('.close');
const backButton = document.querySelector('.back-button');
const pokemonName = document.getElementById('pokemon-name');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonDescription = document.getElementById('pokemon-description');
const catchButton = document.getElementById('catch-button');

let offset = 0;
const limit = 20;

// Fetch Pokémon data from API
async function fetchPokemon(offset, limit) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        data.results.forEach(async (pokemon) => {
            const pokemonData = await fetch(pokemon.url);
            const details = await pokemonData.json();
            displayPokemon(details);
        });
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// Display Pokémon in a card format
function displayPokemon(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img class="pokemon-thumbnail" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p class="pokemon-name">${pokemon.name}</p>
    `;
    card.addEventListener('click', () => showPokemonDetails(pokemon));
    pokemonList.appendChild(card);
}

// Show Pokémon details in modal
function showPokemonDetails(pokemon) {
    pokemonName.textContent = pokemon.name;
    pokemonImage.src = pokemon.sprites.other["official-artwork"].front_default;
    pokemonDescription.textContent = `Height: ${pokemon.height}, Weight: ${pokemon.weight}`;
    pokemonDetailModal.style.display = 'flex';
}

// Close the modal
function closeModal() {
    pokemonDetailModal.style.display = 'none';
}

// Handle catching Pokémon
catchButton.addEventListener('click', () => {
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];
    if (!caughtPokemon.some((p) => p.name === pokemonName.textContent)) {
        caughtPokemon.push({
            name: pokemonName.textContent,
            image: pokemonImage.src,
        });
        localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
        alert(`${pokemonName.textContent} caught!`);
    } else {
        alert(`${pokemonName.textContent} is already caught!`);
    }
});

// Back button functionality
backButton.addEventListener('click', closeModal);

// Close modal when clicking on the close button
closeModalButton.addEventListener('click', closeModal);

// Load more Pokémon
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    fetchPokemon(offset, limit);
});

// Initialize the app
fetchPokemon(offset, limit);
