let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (typeof pokemon !== 'object') {
      console.error('Please provide a valid pokemon object.');
      return;
    } else if (!('name' in pokemon)) {
      console.error('Please provide a valid pokemon object with a name property.');
      return;
    } else if (!('detailsUrl' in pokemon)) {
      console.error('Please provide a valid pokemon object with a detailsUrl property.');
      return;
    }
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon) {
    const pokemonListElement = document.querySelector('.pokemon-list');
    const listItem = document.createElement('li');
    const button = document.createElement('button');
  
    button.addEventListener('click', function (event) {
      showDetails(pokemon);
    });
    
    button.innerText = pokemon.name;
    button.classList.add('button-class');
  
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);
  
    return listItem;
  }

  function loadList() {
    return fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
        json.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(e => {
        console.error(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(response => response.json())
      .then(details => {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map(type => type.type.name);
      })
      .catch(e => {
        console.error(e);
      });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
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
    });
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
    add,
    getAll,
    findByName,
    addListItem,
    loadList,
    loadDetails
  };
})();

document.getElementById('findPokemonButton').addEventListener('click', function () {
  const pokemonName = document.getElementById('pokemonName').value;
  const results = pokemonRepository.findByName(pokemonName);

  const resultDiv = document.getElementById('pokemonResult');
  resultDiv.innerHTML = '';  

  if (results.length > 0) {
    results.forEach(pokemon => {
      pokemonRepository.loadDetails(pokemon).then(() => {
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
    });
  } else {
    resultDiv.textContent = 'No Pokémon found with that name.';
  }
});

pokemonRepository.loadList().then(function () {
  let pokemonAll = pokemonRepository.getAll();
  const INITIAL_LOAD_COUNT = 31;
  let topIndex = 0;  
  let bottomIndex = INITIAL_LOAD_COUNT;  // Initialize bottomIndex to point to the item next to the last item loaded initially

  // Load initial set of items
  for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
    pokemonRepository.addListItem(pokemonAll[i]);
  }

  let pokemonListElement = document.querySelector('.pokemon-list');

  pokemonListElement.addEventListener('scroll', () => {
    let lastChild = pokemonListElement.lastChild;
    let firstChild = pokemonListElement.firstChild;
  
    // If close to the bottom, load more items at the bottom
    if (lastChild.getBoundingClientRect().bottom <= pokemonListElement.getBoundingClientRect().bottom + lastChild.clientHeight) {
      if (bottomIndex < pokemonAll.length) {
        pokemonRepository.addListItem(pokemonAll[bottomIndex]);
        bottomIndex++;
        if (pokemonListElement.children.length > INITIAL_LOAD_COUNT) {
          pokemonListElement.removeChild(firstChild);
          topIndex++;  // Adjust topIndex when removing an item at the top
        }
      }
    }
  
    // If close to the top, load more items at the top (and adjust the scroll position to prevent a jump)
    if (firstChild.getBoundingClientRect().top >= pokemonListElement.getBoundingClientRect().top) {
      if (topIndex > 0) {
        topIndex--;  // Adjust topIndex before adding a new item at the top
        const newFirstItem = pokemonRepository.addListItem(pokemonAll[topIndex]);
        pokemonListElement.insertBefore(newFirstItem, firstChild);
        if (pokemonListElement.children.length > INITIAL_LOAD_COUNT) {
          pokemonListElement.removeChild(lastChild);
          bottomIndex--;  // Adjust bottomIndex when removing an item at the bottom
        }
        pokemonListElement.scrollTop += newFirstItem.clientHeight;
      }
    }
  });
  
});



