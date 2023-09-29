// Selecciona el botón "Back to Top" y el formulario de búsqueda del DOM.
const toTopBtn = document.querySelector(".back-to-top-button");
const pokeSearchForm = document.querySelector("#poke-search-form");

// Agrega un evento de desplazamiento para mostrar/ocultar el botón "Back to Top".
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        toTopBtn.classList.add("show");
    } else {
        toTopBtn.classList.remove("show");
    }
});

// Agrega un evento de clic al botón "Back to Top" para volver suavemente al principio de la página.
toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Agrega un evento de envío de formulario para prevenir el envío cuando se presiona Enter.
pokeSearchForm.addEventListener("submit", (e) => e.preventDefault());
