
/* DOM elements */
const weatherform = document.querySelector(".weather-form");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const statusElement = document.getElementById("status");
const weatherIcon = document.getElementById("weather-icon");
const weatherDescription = document.getElementById("weather-description");
const searchBtn = document.getElementById("searchBtn");

let weatherController = null;

/* Function to get weather information */
const getWeatherInfo = (weatherCode, isDay) => {
  switch (weatherCode) {
    case 0:
      return {
        description: "Clear sky",
        icon: isDay ? "sun" : "moon",
      };

    case 1:
      return {
        description: "Mainly clear",
        icon: isDay ? "sun" : "moon",
      };

    case 2:
      return {
        description: "Partly cloudy",
        icon: isDay ? "cloud-sun" : "cloud-moon",
      };

    case 3:
      return {
        description: "Overcast",
        icon: "cloud",
      };

    case 45:
    case 48:
      return {
        description: "Fog",
        icon: "cloud-fog",
      };

    case 51:
    case 53:
    case 55:
      return {
        description: "Drizzle",
        icon: "cloud-drizzle",
      };

    case 56:
    case 57:
      return {
        description: "Freezing drizzle",
        icon: "cloud-snow",
      };

    case 61:
    case 63:
    case 65:
      return {
        description: "Rain",
        icon: "cloud-rain",
      };

    case 66:
    case 67:
      return {
        description: "Freezing rain",
        icon: "cloud-rain",
      };

    case 71:
    case 73:
    case 75:
    case 77:
      return {
        description: "Snow",
        icon: "cloud-snow",
      };

    case 80:
    case 81:
    case 82:
      return {
        description: "Rain showers",
        icon: "cloud-rain",
      };

    case 85:
    case 86:
      return {
        description: "Snow showers",
        icon: "cloud-snow",
      };

    case 95:
    case 96:
    case 99:
      return {
        description: "Thunderstorm",
        icon: "cloud-lightning",
      };

    default:
      return {
        description: "Unknown weather condition",
        icon: "cloud",
      };
  }
};

/* Function to fetch weather data */
const getWeather = async (city) => {
  let currentController = null;

  try {
    // Cancel previous request
    if (weatherController) {
      weatherController.abort();
    }

    weatherController = new AbortController();
    currentController = weatherController;

    // Loading state
    statusElement.textContent = "Loading weather data...";
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";

    // Clear previous weather data
    cityName.textContent = "—";
    temperature.textContent = "Temperature: —";
    humidity.textContent = "Humidity: —";
    windSpeed.textContent = "Wind Speed: —";

    weatherDescription.textContent = "";
    weatherIcon.innerHTML = "";

    const params = new URLSearchParams({
      name: city,
      count: "1",
    });

    const url = `https://geocoding-api.open-meteo.com/v1/search?${params}`;

    const response = await fetch(url, {
      signal: currentController.signal,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      statusElement.textContent = "No results found.";
      return;
    }

    const location = data.results[0];
    const resolvedCity = location.name;
    const country = location.country_code;
    const lat = location.latitude;
    const lon = location.longitude;

    const params2 = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    });

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?${params2}`;

    const weatherResponse = await fetch(weatherUrl, {
      signal: currentController.signal,
    });

    if (!weatherResponse.ok) {
      throw new Error("Weather response was not ok");
    }

    const weatherData = await weatherResponse.json();

statusElement.textContent = "";

    const currentWeather = weatherData.current;
    const temperatureValue = currentWeather.temperature_2m;
    const humidityValue = currentWeather.relative_humidity_2m;
    const windSpeedValue = currentWeather.wind_speed_10m;
    const weatherCode = currentWeather.weather_code;
    const isDay = currentWeather.is_day;

    // Get weather description and icon
    const weatherInfo = getWeatherInfo(weatherCode, isDay);

    // Update the interface
    cityName.textContent = `${resolvedCity}, ${country}`;
    temperature.textContent = `Temperature: ${temperatureValue} °C`;
    humidity.textContent = `Humidity: ${humidityValue} %`;
    windSpeed.textContent = `Wind Speed: ${windSpeedValue} km/h`;

    weatherDescription.textContent = weatherInfo.description;
    weatherIcon.innerHTML = `<i data-lucide="${weatherInfo.icon}"></i>`;

    lucide.createIcons();

  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error("There was a problem with the fetch operation:", error);

    statusElement.textContent =
      "Unable to retrieve weather data. Please try again.";

  } finally {
    // Reset button only for the latest request
    if (weatherController === currentController) {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
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
