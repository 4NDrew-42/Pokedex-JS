let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function add(pokemon) {
    if (typeof pokemon !== "object") {
      console.error("Please provide a valid pokemon object.");
      return;
    } else if (!("name" in pokemon)) {
      console.error(
        "Please provide a valid pokemon object with a name property."
      );
      return;
    } else if (!("detailsUrl" in pokemon)) {
      console.error(
        "Please provide a valid pokemon object with a detailsUrl property."
      );
      return;
    }
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon) {
    const pokemonListElement = document.querySelector(".pokemon-list");
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    const img = document.createElement("img");
    const span = document.createElement("span"); // To hold the Pokémon name

    // Add the 'list-group-item' class to the 'li' element
    listItem.classList.add("list-group-item");

    // Add the Bootstrap button utility classes to the button element
    button.classList.add("btn", "btn-primary");

    // Add the data-target and data-toggle attributes to the button element
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#pokedexModal");

    // Initially, the image is hidden until we fetch its URL
    img.style.display = "none";

    loadDetails(pokemon).then(() => {
      img.src = pokemon.sprites;
      img.alt = `Image of ${pokemon.name}`;
      img.style.display = "block"; // Display the image after setting its source
    });

    span.textContent = pokemon.name;

    button.addEventListener("click", function (event) {
      showDetails(pokemon);
    });

    button.classList.add("button-class");

    button.appendChild(img);
    button.appendChild(span);
    listItem.appendChild(button);
    pokemonListElement.appendChild(listItem);

    return listItem;
  }


  function loadList() {
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then((response) => response.json())
      .then((details) => {
        item.sprites = details.sprites.front_default;
        item.imageUrl = details.sprites.other["official-artwork"].front_default;
        item.height = details.height;
        item.types = details.types.map((type) => type.type.name);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // Hide the result div
  function hideDetails() {
    const resultDiv = document.getElementById("pokemonResult");
    resultDiv.style.display = "none";
  }

  function displayPokemonDetails(pokemon) {
    const resultDiv = document.getElementById("pokemonResult");
    resultDiv.innerHTML = "";

    // Create two new div elements for the shadows
    const shadowElement1 = document.createElement("div");
    const shadowElement2 = document.createElement("div");

    // Add classes to the shadow elements for styling in CSS
    shadowElement1.classList.add("shadow1");
    shadowElement2.classList.add("shadow2");

    // Create the other elements
    const imageElement = document.createElement("img");
    const pokemonElement = document.createElement("div");
    const nameElement = document.createElement("p");
    const heightElement = document.createElement("p");
    const typesElement = document.createElement("p");

    imageElement.src = `${pokemon.imageUrl}`;
    nameElement.textContent = `${pokemon.name.toUpperCase()}`;
    heightElement.textContent = `Height: ${pokemon.height}`;
    typesElement.textContent = `Types: ${pokemon.types.join(", ")}`;

    // Append the shadow elements to the resultDiv first
    resultDiv.appendChild(shadowElement1);
    resultDiv.appendChild(shadowElement2);

    // Append the other elements to the resultDiv
    pokemonElement.appendChild(imageElement);
    pokemonElement.appendChild(nameElement);
    pokemonElement.appendChild(heightElement);
    pokemonElement.appendChild(typesElement);
    resultDiv.appendChild(pokemonElement);

    resultDiv.style.display = "block"; // Show the result div
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      const resultDiv = document.getElementById("pokemonResult");
      resultDiv.innerHTML = "";

      // Create two new div elements for the shadows
      const shadowElement1 = document.createElement("div");
      const shadowElement2 = document.createElement("div");

      // Add classes to the shadow elements for styling in CSS
      shadowElement1.classList.add("shadow1");
      shadowElement2.classList.add("shadow2");

      // Create the other elements
      const imageElement = document.createElement("img");
      const pokemonElement = document.createElement("div");
      const nameElement = document.createElement("p");
      const heightElement = document.createElement("p");
      const typesElement = document.createElement("p");

      imageElement.src = `${pokemon.imageUrl}`;
      nameElement.textContent = `${pokemon.name.toUpperCase()}`;
      heightElement.textContent = `Height: ${pokemon.height}`;
      typesElement.textContent = `Types: ${pokemon.types.join(", ")}`;

      // Append the shadow elements to the resultDiv first, so they appear below the other elements
      resultDiv.appendChild(shadowElement1);
      resultDiv.appendChild(shadowElement2);

      // Append the other elements to the resultDiv
      pokemonElement.appendChild(imageElement);
      pokemonElement.appendChild(nameElement);
      pokemonElement.appendChild(heightElement);
      pokemonElement.appendChild(typesElement);
      resultDiv.appendChild(pokemonElement);

      resultDiv.style.display = "block"; // Show the result div

      // Adding event listener to hide details on 'esc' key press
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && resultDiv.style.display === "block") {
          hideDetails();
        }
      });

      // Adding event listener to hide details when clicking outside of the element
      window.addEventListener("click", (e) => {
        if (e.target !== resultDiv && !resultDiv.contains(e.target)) {
          hideDetails();
        }
      });
    });
  }

  function getAll() {
    return pokemonList;
  }

  function findByName(name) {
    if (typeof name !== "string") {
      console.error("Please provide a valid pokemon name.");
      return [];
    }

    return pokemonList.filter(
      pokemon => pokemon.name.toLowerCase() === name.toLowerCase());
  }

  return {
    add,
    getAll,
    findByName,
    addListItem,
    loadList,
    loadDetails,
    showDetails: showDetails,
    displayPokemonDetails: displayPokemonDetails // Add this line
};

  
})();

document
  .getElementById("findPokemonButton")
  .addEventListener("click", function () {
    const pokemonNameInput = document.getElementById("pokemonName");
    const results = pokemonRepository.findByName(pokemonNameInput.value);

    if (results.length > 0) {
      // Clear any error messages from previous searches
      pokemonNameInput.classList.remove("error");
      pokemonNameInput.placeholder = "Find a Pokémon";

      results.forEach((pokemon) => {
        pokemonRepository.loadDetails(pokemon).then(() => {
          pokemonRepository.displayPokemonDetails(pokemon);
        });
      });
    } else {
      // Display the error in the input field
      pokemonNameInput.value = "";
      pokemonNameInput.placeholder = "No Pokémon found with that name.";
      pokemonNameInput.classList.add("error");

      // Clear the error message when the user focuses on the input field
      pokemonNameInput.addEventListener("focus", function () {
        this.placeholder = "Find a Pokémon";
        this.classList.remove("error");
      });
    }
  });


pokemonRepository.loadList().then(function () {
  let pokemonAll = pokemonRepository.getAll();
  const INITIAL_LOAD_COUNT = 31;
  let topIndex = 0;
  let bottomIndex = INITIAL_LOAD_COUNT;

  for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
    pokemonRepository.addListItem(pokemonAll[i]);
  }

  let pokemonListElement = document.querySelector(".pokemon-list");

  pokemonListElement.addEventListener("scroll", () => {
    let lastChild = pokemonListElement.lastChild;
    let firstChild = pokemonListElement.firstChild;

    if (
      lastChild.getBoundingClientRect().bottom <=
      pokemonListElement.getBoundingClientRect().bottom + lastChild.clientHeight
    ) {
      if (bottomIndex < pokemonAll.length) {
        pokemonRepository.addListItem(pokemonAll[bottomIndex]);
        bottomIndex++;
        if (pokemonListElement.children.length > INITIAL_LOAD_COUNT) {
          pokemonListElement.removeChild(firstChild);
          topIndex++;
        }
      }
    }

    if (
      firstChild.getBoundingClientRect().top >=
      pokemonListElement.getBoundingClientRect().top
    ) {
      if (topIndex > 0) {
        topIndex--;
        const newFirstItem = pokemonRepository.addListItem(
          pokemonAll[topIndex]
        );
        pokemonListElement.insertBefore(newFirstItem, firstChild);
        if (pokemonListElement.children.length > INITIAL_LOAD_COUNT) {
          pokemonListElement.removeChild(lastChild);
          bottomIndex--;
        }
        pokemonListElement.scrollTop += newFirstItem.clientHeight;
      }
    }
  });
});


