const API_KEY = 'db7dae93ffa8eeec970f0c408aba34e5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';


const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('results');

async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  data.genres.forEach((genre) => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}

async function fetchMovies(query = '', genre = '', year = '') {
  let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&include_adult=false&page=1`;
  if (year) url += `&year=${year}`;

  const res = await fetch(url);
  const data = await res.json();

  let movies = data.results;
  if (genre) {
    movies = movies.filter(movie => movie.genre_ids.includes(parseInt(genre)));
  }

  renderMovies(movies);
}

function renderMovies(movies) {
  resultsContainer.innerHTML = '';
  if (movies.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
    card.appendChild(img);

    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = movie.title;
    content.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `${movie.release_date || 'Unknown'} | Rating: ${movie.vote_average || 'N/A'}`;
    content.appendChild(meta);

    card.appendChild(content);
    resultsContainer.appendChild(card);
  });
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value;
  const genre = genreFilter.value;
  const year = yearFilter.value;
  fetchMovies(query, genre, year);
});

// Initialize
fetchGenres();
fetchMovies();
