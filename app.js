// DOM elements
const weatherform = document.querySelector(".weather-form");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const statusElement = document.getElementById("status");

// Function to fetch weather data
const getWeather = async (city) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (!data.results|| data.results.length === 0) {
      statusElement.textContent = "No results found.";
      return;
    }else{
        const location = data.results[0];
        const resolvedCity = location.name;
        const country = location.country_code;
        const lat = location.latitude;
        const lon = location.longitude;
        console.log('City:', resolvedCity);
        console.log('Country:', country);
        console.log('Latitude:', lat);
        console.log('Longitude:', lon);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// Event listener for form submission
weatherform.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    statusElement.textContent = "Please enter a city name.";
    return;
  }

  getWeather(city);
});
