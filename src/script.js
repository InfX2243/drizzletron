const togglebtn = document.getElementById("theme-toggle");
const searchbtn = document.getElementById("search-btn");


// toggles dark and light theme
function toggleTheme(){
    const darktheme = document.documentElement.classList.toggle("dark");
    togglebtn.innerHTML = 
    darktheme ? 
    '<span id="theme-toggle" class="btn btn-light rounded-circle p-3"><i class="fas fa-sun"></i></span>'
    :
    '<span id="theme-toggle" class="btn btn-dark rounded-circle p-3"><i class="fas fa-moon"></i></span>';
}


// translate icon in API to assets name
function fetchImage(icon){
    const dict = {
        '01d':'clear-sky-day',
        '01n':'clear-sky-night',
        '02d':'few-clouds-day',
        '02n':'few-clouds-night',
        '03d':'scattered-clouds-day',
        '03n':'scattered-clouds-night',
        '04d':'broken-clouds-day',
        '04n':'broken-clouds-night',
        '09d':'shower-rain-day',
        '09n':'shower-rain-night',
        '10d':'rain-day',
        '10n':'rain-night',
        '11d':'thunderstorm-day',
        '11n':'thunderstorm-night',
        '13d':'snow-day',
        '13n':'snow-night',
        '50d':'mist-day',
        '50n':'mist-night',
    };

    return `${dict[icon]}.png`;
}

// Function to call API to fetch weather data
async function callWeatherAPI(city, units){
    const baseURL = "https://api.openweathermap.org/data/2.5/forecast";
    const API_KEY = "2009c1339ba843e37b41f2aeb7e22a51";

    const res = await fetch(`${baseURL}?appid=${API_KEY}&q=${city}&units=${units}`);
    const data = await res.json();
    return data;
}


// Update GUI using fetched data from API 
async function fetchWeather(){
    const units = "metric"; // units can be changed by passing another parameter (default units of data fetched from API is standard)
    const city = document.getElementById("city").value; // city name 

    let res = await callWeatherAPI(city, units);

    
    // elements to update 
    const updateCity = document.getElementById("src-city")
    const updateTimezone = document.getElementById("src-timezone")
    const updateTemp = document.getElementById("src-temp")
    const updateWind = document.getElementById("src-wind")
    const updateHumidity = document.getElementById("src-humidity")
    const updateLat = document.getElementById("src-lat")
    const updateLon = document.getElementById("src-lon")
    const updateDatetime = document.getElementById("src-datetime")
    const updateImage = document.getElementById("current-weather-image")

    // update elements with real-time weather data
    updateCity.innerHTML = res.city.name
    updateTimezone.innerHTML = res.city.timezone/3600 > 0 ? `+${res.city.timezone/3600}` : `${res.city.timezone/3600}`
    updateTemp.innerHTML = res.list[0].main.temp
    updateWind.innerHTML = res.list[0].wind.speed
    updateHumidity.innerHTML = res.list[0].main.humidity
    updateLat.innerHTML = res.city.coord.lat
    updateLon.innerHTML = res.city.coord.lon
    updateDatetime.innerHTML = res.list[0].dt_txt

    // update image icon based on weather data
    imagePath = `assets/${fetchImage(res.list[0].weather[0].icon)}`;
    updateImage.src = imagePath;

    //Update Forecast weather
    document.getElementsByClassName("forecasts-container")[0].innerHTML = ""

    for(let i=1; i<9;i++){
        let node = `<div class="day-forecast rounded-4">
                    <div>
                        <img src="assets/${fetchImage(res.list[i*5].weather[0].icon)}" alt="" class="rounded-circle">
                        <div class="city-datetime${i}"><span id="src-datetime${i}">${res.list[i*5].dt_txt}</span></div>
                        <div><i class="fa-solid fa-temperature-high"></i><span> ${res.list[i*5].main.temp}</span></div>
                        <div><i class="fa-solid fa-wind"></i> ${res.list[i*5].wind.speed}</div>
                        <div><i class="fa-solid fa-droplet"></i> ${res.list[i*5].main.humidity}</div>
                    </div>
                </div>`;
        document.getElementsByClassName("forecasts-container")[0].innerHTML += node;
    }
}

// Associate functions to respective event listeners & elements
togglebtn.addEventListener("click", toggleTheme);
searchbtn.addEventListener("click", fetchWeather);