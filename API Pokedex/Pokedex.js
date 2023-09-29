import { fetchJson, includes } from "./util.js";
import { pokedexURL } from "./constants.js";

// Clase que representa una Pokedex y permite interactuar con la API de Pokémon.
export class Pokedex {
    // Constructor que inicializa la Pokedex con una URL de la API y un tamaño de página opcional.
    constructor(apiUrl, pageSize = 27) {
        if (!apiUrl.length) {
            throw new Error("ApiURL must be filled!");
        }

        // Inicialización de propiedades de la Pokedex.
        this.nextPageUrl = `${apiUrl}?limit=${pageSize}&offset=0`;
        this.currentPageUrl = null;
        this.prevPageUrl = null;
        this.cache = {};
    }

    // Método para obtener la siguiente página de Pokémon.
    getNextPage() {
        if (!this.nextPageUrl) {
            console.warn("You're on the last page already.", this.nextPageUrl)
            return [];
        }
        return this.fetchPage(this.nextPageUrl);
    }

    // Método para obtener la página anterior de Pokémon.
    getPrevPage() {
        if (!this.prevPageUrl) {
            console.warn("You're on the first page already.")
            return [];
        }
        return this.fetchPage(this.prevPageUrl);
    }

    // Método para obtener la página actual de Pokémon.
    getCurrentPage() {
        if (!this.currentPageUrl) {
            console.warn("You haven't loaded any pages yet [hint: try calling `getNextPage` first].")
            return [];
        }
        return this.fetchPage(this.currentPageUrl);
    }

    // Método para obtener todos los Pokémon de la Pokédex.
    async getAllPokemons() {
        try {
            const allPokemons = await this.fetchPage(`${pokedexURL}?limit=1008`);
            return allPokemons;
        } catch (error) {
            console.error(error);
            throw new Error("Error fetching Pokémon data from API.");
        }
    }

    // Método para buscar Pokémon por nombre o palabra clave.
    async findPokemonsByName(keyword) {
        const allPokemons = await this.getAllPokemons();

        if (!keyword.length) {
            return allPokemons.slice(0, 27); // Devuelve los primeros 9 Pokémon si no hay una palabra clave
        }

        const matchingPokemons = allPokemons.filter(it => includes(it.name, keyword));
        return matchingPokemons.slice(0, 27); // Devuelve los primeros 9 Pokémon que coinciden con la palabra clave
    }

    // Método para cargar y almacenar una página de Pokémon desde la API.
    async fetchPage(url) {
        if (url in this.cache) {
            return this.cache[url]
        }

        const { results, next, previous } = await fetchJson(url);
        const pageWithDetails = await Promise.all(results.map(it => fetchJson(it.url)));

        this.currentPageUrl = url;
        this.nextPageUrl = next;
        this.prevPageUrl = previous;
        this.cache[url] = pageWithDetails;
        return pageWithDetails;
    }
}
