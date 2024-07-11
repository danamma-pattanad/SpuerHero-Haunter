const apiKey = '4371dd86df0d56674f10c19482646775';
const privateKey = '584014450321c665fc4b0f4a4f3f5755fb9098db';
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';

async function fetchSuperheroes(query) {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + apiKey).toString();
    const url = `${baseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${apiKey}&hash=${hash}`;
    
    console.log(url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results;
    } catch (error) {
        console.error('Error fetching superheroes:', error);
    }
}

document.getElementById('search-bar').addEventListener('input', async (event) => {
    const query = event.target.value;
    const results = await fetchSuperheroes(query);
    displayResults(results);
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    results.forEach(superhero => {
        const card = document.createElement('div');
        card.className = 'superhero-card';
        card.innerHTML = `
            <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h3>${superhero.name}</h3>
            <button onclick="viewSuperhero(${superhero.id})">View</button>
            <button onclick="addToFavourites(${superhero.id})">Add to Favourites</button>
        `;
        resultsDiv.appendChild(card);
    });
    updateFavoritesCount();
}

function viewSuperhero(id) {
    window.location.href = `superhero.html?id=${id}`;
}

function addToFavourites(id) {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    if (!favourites.includes(id)) {
        favourites.push(id);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        updateFavoritesCount();
        alert('Superhero added to favourites!');
    } else {
        alert('Superhero is already in favourites!');
    }
}

function updateFavoritesCount() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  document.getElementById('favorites-count').textContent = favourites.length;
}
