const API_KEY = "YOUR_API_KEY";

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Location not found");
    }

    const data = await response.json();

    console.log("Location:", data.name);
    console.log("Temperature:", data.main.temp + "°C");
    console.log("Feels Like:", data.main.feels_like + "°C");
    console.log("Humidity:", data.main.humidity + "%");
    console.log("Weather:", data.weather[0].description);
    console.log("Wind:", data.wind.speed + " m/s");

    return data;
  } catch (error) {
    console.error(error.message);
  }
}

// Example locations
getWeather("Kolkata");
getWeather("Delhi");
getWeather("Mumbai");
getWeather("Bengaluru");
