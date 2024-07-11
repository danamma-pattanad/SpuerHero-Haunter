const apiKey = '4371dd86df0d56674f10c19482646775';
const privateKey = '584014450321c665fc4b0f4a4f3f5755fb9098db';
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';

async function fetchSuperheroById(id) {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + apiKey).toString();
    const url = `${baseUrl}/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data.results[0];
    } catch (error) {
        console.error('Error fetching superhero:', error);
    }
}

(async () => {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const favouriteSuperheroes = await Promise.all(favourites.map(id => fetchSuperheroById(id)));
    displayFavouriteSuperheroes(favouriteSuperheroes);
})();

function displayFavouriteSuperheroes(superheroes) {
    const favouritesDiv = document.getElementById('favourites-list');
    favouritesDiv.innerHTML = '';
    
    superheroes.forEach(superhero => {
        const card = document.createElement('div');
        card.className = 'superhero-card';
        card.innerHTML = `
            <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
            <h3>${superhero.name}</h3>
            <button onclick="viewSuperhero(${superhero.id})">View</button>
            <button onclick="removeFromFavourites(${superhero.id})">Remove from Favourites</button>
        `;
        favouritesDiv.appendChild(card);
    });
}

function viewSuperhero(id) {
    window.location.href = `superhero.html?id=${id}`;
}

function removeFromFavourites(id) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    favourites = favourites.filter(favId => favId !== id);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert('Superhero removed from favourites!');
    location.reload();
}
