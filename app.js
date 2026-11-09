// DOM elements
const weatherform = document.querySelector('.weather-form');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const statusElement = document.getElementById('status');

// Function to fetch weather data


// Event listener for form submission
weatherform.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusElement.textContent = 'Please enter a city name.';
        return;
    }

    console.log(city);
});