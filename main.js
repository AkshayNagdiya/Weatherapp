document.addEventListener("DOMContentLoaded", () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const forecastInfo = document.getElementById('forecast-info');
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const localTime = document.getElementById('local-time');
    const weatherIcon = document.getElementById('weather-icon');
    const forecastDetails = document.getElementById('forecast-details');
    const loadingSpinner = document.getElementById('loading-spinner');
    const unitSwitch = document.getElementById('unit-switch');

    let isCelsius = true;

    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeather(city);
        }
    });

    unitSwitch.addEventListener('change', () => {
        isCelsius = !isCelsius;
        const city = cityName.textContent;
        if (city) {
            getWeather(city);
        }
    });

    async function getWeather(city) {
        const apiKey = '0df46e9b4f0043529bd105310242105'; // Replace with your WeatherAPI key
        const unit = isCelsius ? 'metric' : 'imperial';
        const unitSymbol = isCelsius ? '°C' : '°F';
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

        try {
            loadingSpinner.style.display = 'block';
            const response = await fetch(apiUrl);
            const data = await response.json();
            loadingSpinner.style.display = 'none';

            if (response.ok) {
                updateWeatherInfo(data, unitSymbol);
                updateForecastInfo(data, unitSymbol);
            } else {
                alert(data.error.message);
                weatherInfo.style.display = 'none';
                forecastInfo.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching the weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
            weatherInfo.style.display = 'none';
            forecastInfo.style.display = 'none';
            loadingSpinner.style.display = 'none';
        }
    }

    function updateWeatherInfo(data, unitSymbol) {
        const { location, current } = data;
        cityName.textContent = location.name;
        temperature.textContent = `Temperature: ${current.temp_c} ${unitSymbol}`;
        description.textContent = current.condition.text;
        weatherIcon.src = `https:${current.condition.icon}`;
        localTime.textContent = `Local Time: ${location.localtime}`;

        weatherInfo.style.display = 'block';
    }

    function updateForecastInfo(data, unitSymbol) {
        const { forecast } = data;
        forecastDetails.innerHTML = '';
        forecast.forecastday.forEach(day => {
            const date = day.date;
            const icon = day.day.condition.icon;
            const condition = day.day.condition.text;
            const maxTemp = isCelsius ? day.day.maxtemp_c : day.day.maxtemp_f;
            const minTemp = isCelsius ? day.day.mintemp_c : day.day.mintemp_f;

            const forecastElement = document.createElement('div');
            forecastElement.classList.add('forecast-day');
            forecastElement.innerHTML = `
                <h3>${date}</h3>
                <img src="https:${icon}" alt="Weather Icon">
                <p>${condition}</p>
                <p>Max: ${maxTemp} ${unitSymbol}</p>
                <p>Min: ${minTemp} ${unitSymbol}</p>
            `;
            forecastDetails.appendChild(forecastElement);
        });

        forecastInfo.style.display = 'block';
    }
});
