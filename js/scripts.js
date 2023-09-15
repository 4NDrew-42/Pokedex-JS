// IIFE
let pokemonRepository = (function () {
  let pokemonList = [
    { name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison'] },
    { name: 'Charmander', height: 0.6, types: ['fire'] },
    { name: 'Squirtle', height: 0.5, types: ['water'] },
  ];

  function addListItem(pokemon) {
    const pokemonListElement = document.querySelector('.pokemon-list');
    const listItem = document.createElement('li');
    const button = document.createElement('button');

    button.addEventListener('click', function (event) {
      showDetails(pokemon);
      console.log(event.target.innerText);
    });
    button.innerText = pokemon.name;
    button.classList.add('button-class');

    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
  }

  function add(pokemon) {
    const validKeys = ['name', 'height', 'types'];

    if (
      typeof pokemon === 'object' &&
      Object.keys(pokemon).every(key => validKeys.includes(key)) &&
      Object.keys(pokemon).length === validKeys.length &&
      typeof pokemon.name === 'string' &&
      typeof pokemon.height === 'number' &&
      Array.isArray(pokemon.types) &&
      pokemon.types.every(type => typeof type === 'string')
    ) {
      pokemonList.push(pokemon);
    } else {
      console.error('Invalid data type or invalid keys. Please provide a valid Pokemon object.');
    }
  }

  function showDetails(pokemon) {
    const resultDiv = document.getElementById('pokemonResult');
    resultDiv.innerHTML = '';
  
    const pokemonElement = document.createElement('div');
    const nameElement = document.createElement('p');
    const heightElement = document.createElement('p');
    const typesElement = document.createElement('p');
  
    nameElement.textContent = `Name: ${pokemon.name}`;
    heightElement.textContent = `Height: ${pokemon.height}`;
    typesElement.textContent = `Types: ${pokemon.types.join(', ')}`;
  
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(heightElement);
    pokemonElement.appendChild(typesElement);
    resultDiv.appendChild(pokemonElement);
  }
  

  function getAll() {
    return pokemonList;
  }

  function findByName(name) {
    if (typeof name !== 'string') {
      console.error('Please provide a valid pokemon name.');
      return [];
    }

    return pokemonList.filter(pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
  }

  return {
    add: add,
    getAll: getAll,
    findByName: findByName,
    addListItem: addListItem,
  };

})();

document.getElementById('findPokemonButton').addEventListener('click', function () {
  const pokemonName = document.getElementById('pokemonName').value;
  const results = pokemonRepository.findByName(pokemonName);

  const resultDiv = document.getElementById('pokemonResult');
  resultDiv.innerHTML = '';  

  if (results.length > 0) {
    results.forEach(pokemon => {
      const pokemonElement = document.createElement('div');
      const nameElement = document.createElement('p');
      const heightElement = document.createElement('p');
      const typesElement = document.createElement('p');

      nameElement.textContent = `Name: ${pokemon.name}`;
      heightElement.textContent = `Height: ${pokemon.height}`;
      typesElement.textContent = `Types: ${pokemon.types.join(', ')}`;

      pokemonElement.appendChild(nameElement);
      pokemonElement.appendChild(heightElement);
      pokemonElement.appendChild(typesElement);
      resultDiv.appendChild(pokemonElement);
    });
  } else {
    resultDiv.textContent = 'No Pokémon found with that name.';
  }
});

// Displaying the pokemonList in the page
pokemonRepository.getAll().forEach(function (pokemon) {
  pokemonRepository.addListItem(pokemon);
});
