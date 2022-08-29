const form = document.querySelector('form');
const input = document.querySelector('input');
const searchResults = document.querySelector('.results');
const resultsButton = document.querySelector('#resultsButton');
const favoritesButton = document.querySelector('#favoritesButton');

// TODO: get an API key from https://developers.themoviedb.org/3/getting-started/authentication
const apiKey = 'insert value here';

let state = localStorage.state ? JSON.parse(localStorage.state) : {
  search: '',
  movies: [],
  favorites: [],
  showFavorites: false,
};

function setState(updates) {
  state = {
    ...state,
    ...updates,
  };
  localStorage.state = JSON.stringify(state);
  renderMovies();
}

document.addEventListener('DOMContentLoaded', () => {
  renderMovies();
});

resultsButton.addEventListener('click', () => {
  setState({
    showFavorites: false,
  })
});

favoritesButton.addEventListener('click', () => {
  setState({
    showFavorites: true,
  })
});

input.addEventListener('input', (event) => {
  setState({
    search: event.target.value,
  });
});

async function getMovies(search) {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${search}`);
  const json = await response.json();
  console.log(json);
  setState({
    movies: json.results,
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (state.search) {
    getMovies(state.search);
  }
});

function renderMovies() {
  let html = '';
  let movies = state.showFavorites ? state.favorites : state.movies;
  // THIS IS WHERE THE VDOM COMES IN!
  movies.forEach((movie) => {
    html += `<article class="movie-card">
    <header>
      ${movie.title}
    </header>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
    ${state.favorites.find((fav) => fav.id === movie.id) ? `
      <button class="contrast" onclick='removeFromFavorites(${movie.id})'>Remove From Favorites</button>
    `: `
      <button onclick='addToFavorites(${movie.id})'>Add To Favorites</button>
    `}
    <footer>
      ${movie.release_date}
    </footer>
  </article>`
  });
  searchResults.innerHTML = html;
}

function addToFavorites(id) {
  const movie = state.movies.find((movie) => movie.id == id);
  setState({
    favorites: [...state.favorites, movie],
  });
}

function removeFromFavorites(id) {
  setState({
    favorites: state.favorites.filter((movie) => movie.id != id),
  });
}
