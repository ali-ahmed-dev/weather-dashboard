
/* DOM elements */
const weatherform = document.querySelector(".weather-form");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const statusElement = document.getElementById("status");

/* Function to fetch weather data */
const getWeather = async (city) => {
  try {
    const params = new URLSearchParams({
      name: city,
      count: "1",
    });

    const url = `https://geocoding-api.open-meteo.com/v1/search?${params}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusElement.textContent = "No results found.";
      return;
    }

    statusElement.textContent = "";

    const location = data.results[0];
    const resolvedCity = location.name;
    const country = location.country_code;
    const lat = location.latitude;
    const lon = location.longitude;

    console.log("City:", resolvedCity);
    console.log("Country:", country);
    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    const params2 = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m",
    });

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?${params2}`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error("Weather response was not ok");
    }

    const weatherData = await weatherResponse.json();

    const currentWeather = weatherData.current;
    const temperatureValue = currentWeather.temperature_2m;
    const humidityValue = currentWeather.relative_humidity_2m;
    const windSpeedValue = currentWeather.wind_speed_10m;

    console.log("Temperature:", temperatureValue);
    console.log("Humidity:", humidityValue);
    console.log("Wind Speed:", windSpeedValue);

    cityName.textContent = `${resolvedCity}, ${country}`;
    temperature.textContent = `Temperature: ${temperatureValue} °C`;
    humidity.textContent = `Humidity: ${humidityValue} %`;
    windSpeed.textContent = `Wind Speed: ${windSpeedValue} km/h`;

  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

/* Event listener for form submission */
weatherform.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    statusElement.textContent = "Please enter a city name.";
    return;
  }

  getWeather(city);
});
