let pokemonList = [
    {name: 'Bulbasaur', height: 0.7, types: ['grass', 'poison']},
    {name: 'Charmander', height: 0.6, types: ['fire']},
    {name: 'Squirtle', height: 0.5, types: ['water']},
] 


// Displaying the pokemonList in the page

for (let i = 0; i < pokemonList.length; i++) {
    if (pokemonList[i].height > 0.6) {
        document.write('<p>' + pokemonList[i].name + ' (height: ' + pokemonList[i].height + ')' + ' - Wow, that\'s big!' + '</p>');
    } else {
        document.write('<p>' + pokemonList[i].name + ' (height: ' + pokemonList[i].height + ')' + '</p>');
    }
}