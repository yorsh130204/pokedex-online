// Función para obtener datos JSON desde una URL
export async function fetchJson(url) {
    const response = await fetch(url);
    return await response.json();
}

// Función para buscar una cadena en otra sin distinción entre mayúsculas y minúsculas
export function includes(searchIn, searchFor) {
    return searchIn.toLowerCase().includes(searchFor.toLowerCase());
}
