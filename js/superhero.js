// Define the base URL and API keys
const apiKey = '4371dd86df0d56674f10c19482646775';
const privateKey = '584014450321c665fc4b0f4a4f3f5755fb9098db';
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';

// Function to generate MD5 hash
function generateHash(ts) {
  const hash = CryptoJS.MD5(ts + privateKey + apiKey).toString();
  return hash;
}

// Function to fetch superhero details by ID
async function fetchSuperheroDetails(id) {
  const ts = new Date().getTime();
  const hash = generateHash(ts);
  const url = `${baseUrl}/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results[0];
  } catch (error) {
    console.error('Error fetching superhero details:', error);
  }
}

// Function to display superhero details
async function displaySuperheroDetails(id) {
  const superhero = await fetchSuperheroDetails(id);
  
  if (!superhero) {
    console.error('No superhero found with ID:', id);
    return;
  }

  const detailsDiv = document.getElementById('superhero-details');
  detailsDiv.innerHTML = `
    <h2>${superhero.name}</h2>
    <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
    <p>${superhero.description}</p>
    <h3>Comics</h3>
    <ul>
      ${superhero.comics.items.map(comic => `<li>${comic.name}</li>`).join('')}
    </ul>
  `;
}

// Extract superhero ID from URL and display details
const urlParams = new URLSearchParams(window.location.search);
const superheroId = urlParams.get('id');
if (superheroId) {
  displaySuperheroDetails(superheroId);
}
