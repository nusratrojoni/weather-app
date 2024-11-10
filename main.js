const apiURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "923d3d7ec9bd11958195b278313d2a2e";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const locationOptions = document.querySelectorAll('input[name="location"]');
const searchContainer = document.querySelector(".search");

async function fetchWeatherData(url) {
    const response = await fetch(url);
    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        updateWeather(data);
    }
}

function updateWeather(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector(".sunrise").innerHTML = sunriseTime;
    document.querySelector(".sunset").innerHTML = sunsetTime;

    switch (data.weather[0].main) {
        case "Clouds":
            weatherIcon.src = "assests/clouds.png";
            break;
        case "Clear":
            weatherIcon.src = "assests/clear.png";
            break;
        case "Rain":
            weatherIcon.src = "assests/rain.png";
            break;
        case "Drizzle":
            weatherIcon.src = "assests/drizzle.png";
            break;
        case "Mist":
            weatherIcon.src = "assests/mist.png";
            break;
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `${apiURL}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            fetchWeatherData(locationUrl);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getWeatherByCity(city) {
    const cityUrl = `${apiURL}?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeatherData(cityUrl);
}

searchBtn.addEventListener("click", () => getWeatherByCity(searchBox.value));

locationOptions.forEach(option => {
    option.addEventListener("change", (event) => {
        if (event.target.value === "current") {
            searchContainer.style.display = "none";  
            getWeatherByCurrentLocation();           
        } else {
            searchContainer.style.display = "flex";  
            document.querySelector(".weather").style.display = "none"; 
        }
    });
});

if (document.querySelector('input[name="location"]:checked').value === "current") {
    getWeatherByCurrentLocation();
} else {
    searchContainer.style.display = "flex";
}
