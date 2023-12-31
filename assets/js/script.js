var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-search');
var searchBtn = document.querySelector('.search-btn');

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    getGeocode(city)
    displayHistory(city)
    var savedCities = JSON.parse(localStorage.getItem("pastCities")) || [];
    savedCities.push(city)
    localStorage.setItem("pastCities", JSON.stringify(savedCities))
}

var displayHistory = function(city) {
    var historyBtn = document.createElement("button")
    var historyBtns = document.querySelector(".history-btns")
    historyBtns.appendChild(historyBtn)
    historyBtn.textContent = city

    historyBtn.addEventListener('click', function(){
        getGeocode(city)
    })
}

var getGeocode = function(city) {
    var geocodeUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=8ab147a2ce61d167a2957cd01bcc016b'

    fetch(geocodeUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        var latitude = data[0].lat
        var longitude = data[0].lon
        getWeather(latitude, longitude)
        getCurrentWeather(latitude, longitude)
    })
}

var getWeather = function(latitude, longitude) {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=8ab147a2ce61d167a2957cd01bcc016b&units=imperial'

        console.log(weatherUrl)

        fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var selectedData = [
                data.list[5],
                data.list[13],
                data.list[20],
                data.list[27],
                data.list[34],
            ]
            renderForecastData(selectedData);
        })
}

var renderForecastData = function(selectedData) {
    var weatherDiv = document.querySelectorAll('.forecast')
    for(var i = 0; i < selectedData.length; i++) {
        selectedData[i].dt_txt = dayjs(selectedData[i].dt_txt).format("MMMM D, YYYY") + "\n"
        weatherDiv[i].textContent = "Date: " + selectedData[i].dt_txt + "\n"
        var icon = document.createElement("img")
        icon.src = 'https://openweathermap.org/img/wn/' + selectedData[i].weather[0].icon + '@2x.png'
        weatherDiv[i].textContent += "Temp: " + selectedData[i].main.temp + "°F\n"
        weatherDiv[i].textContent += "Wind: " + selectedData[i].wind.speed + "mph\n"
        weatherDiv[i].textContent += "Humidity: " + selectedData[i].main.humidity + "%\n"
        weatherDiv[i].appendChild(icon)
    }
}

var getCurrentWeather = function(latitude, longitude) {
    var getCurrentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=8ab147a2ce61d167a2957cd01bcc016b&units=imperial'
    
    fetch(getCurrentWeatherUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        renderCurrentData(data)
    })
}

var renderCurrentData = function(data) {
    var cityName = document.querySelector('#city')
    cityName.textContent = data.name
    var icon = document.createElement("img")
    icon.src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    cityName.append(icon)
    var todaysDate = document.querySelector('#date')
    todaysDate.textContent = dayjs().format("MMMM D, YYYY")
    var currentTemp = document.querySelector('#temp')
    currentTemp.textContent = "Temp: " + data.main.temp + "°F"
    var currentWind = document.querySelector('#wind')
    currentWind.textContent = "Wind: " + data.wind.speed + "mph"
    var currentHum = document.querySelector('#humidity')
    currentHum.textContent = "Humidity: " + data.main.humidity + "%"
}

cityFormEl.addEventListener("submit", formSubmitHandler)

var savedCities = JSON.parse(localStorage.getItem("pastCities")) || []
for(var i = 0; i < savedCities.length; i++) {
    displayHistory(savedCities[i])
}