// Importa las constantes y la clase Pokedex desde otros archivos.
import { colors, colors2, pokedexURL } from "./constants.js";
import { Pokedex } from "./Pokedex.js";

// Selecciona elementos del DOM.
const pokeContainer = document.querySelector(".poke-container");
const searchInput = document.querySelector("#search-input");
const pokedex = new Pokedex(pokedexURL);

// Agrega un evento de carga y un evento de clic al botón "Load New Pokemons".
window.addEventListener('load', loadNextPageAndRender);
document.querySelector("#load-button").addEventListener("click", loadNextPageAndRender);

// Selecciona el contenedor de errores en el DOM.
const errorContainer = document.getElementById('error-container');

// Función para mostrar un mensaje de error.
function showError(pokemonName) {
    pokeContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      No se encontró ningún Pokémon llamado "${pokemonName}"
    </div>`;
}

// Función para limpiar el mensaje de error.
function clearError() {
    errorContainer.innerHTML = "";
}

// Escucha el evento "input" en el campo de búsqueda.
searchInput.addEventListener("input", async () => {
  pokeContainer.innerHTML = ""; // Limpia el contenido del contenedor de Pokémon.
  clearError(); // Limpia el mensaje de error al comenzar a buscar.

  try {
    const pokemons = await pokedex.findPokemonsByName(searchInput.value);
    
    if (pokemons.length == 0) {
      showError(searchInput.value); // Muestra un mensaje de error si no se encontraron Pokémon.
    } else {
      pokemons.forEach(createPokemonBox); // Crea y muestra las cajas de Pokémon.
    }
  } catch (error) {
    console.error(error);
    showError("Ha ocurrido un error al buscar Pokémon."); // Muestra un mensaje de error genérico.
  }
});

// Función para cargar la siguiente página de Pokémon y renderizarla.
async function loadNextPageAndRender() {
  const pokemons = await pokedex.getNextPage();
  pokemons.forEach(createPokemonBox); // Crea y muestra las cajas de Pokémon.
}

// Función para crear una caja de Pokémon y agregarla al contenedor.
function createPokemonBox(pokemon) {
  const { name, weight, height, stats } = pokemon;
  const id = pokemon.id.toString().padStart(3, "0");
  const type = pokemon.types[0].type.name;

  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("poke-box");
  pokemonEl.style.backgroundColor = colors[type];
  pokemonEl.innerHTML = buildHtmlOfPokemon(id, name, weight, height, stats, type);
  pokeContainer.appendChild(pokemonEl);
}

// Función para construir el HTML de un Pokémon.
function buildHtmlOfPokemon(id, name, weight, height, stats, type) {
  const typeColor = colors2[type]; // Obtiene el color del tipo de Pokémon del objeto colors

  const statsHtml = stats.map(stat => {
    const statPercentage = (stat.base_stat / 255) * 100; // Calcula el porcentaje para la barra de progreso
    return `
      <li>
        <strong style="font-size: 1rem;">${stat.stat.name}:</strong> ${stat.base_stat}
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: ${statPercentage}%; background-color: ${typeColor};">
            ${stat.base_stat}
          </div>
        </div>
      </li>`;
  }).join('');

  return `
    <img
      class="poke-img"
      loading="lazy"
      src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png"
      alt="${name} Pokemon"
    />
    <h3 class="poke-name">${name}</h3>
    <p class="poke-id"><strong>#</strong>${id}</p>
    <p class="poke-weight" style="color: ${typeColor};"><strong>Weight:</strong> ${weight / 10} kg</p>
    <p class="poke-height" style="color: ${typeColor};"><strong>Height:</strong> ${height / 10} m</p>
    <p class="poke-type" style="color: ${typeColor};"><strong>Type :</strong> ${type}</p>
    <p class="poke-stats-title" style="color: ${typeColor}; text-align: left; font-size: 1.2rem; margin-top: 20px;"><strong>Base Stats :</strong></p>
    <ul class="poke-stats" style="list-style: none; padding: 0; text-align: left; font-size: 1rem;">
      ${statsHtml}
    </ul>
  `;
}
