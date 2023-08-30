const API_KEY = "1f1a0b357b3859141a1f736da585facd"; // api key (would hide this if this was a real app)
const units = "imperial";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) { // if no cities in local storage
    localStorage.setItem("cities", JSON.stringify([])); // create empty array
}

async function getCoordinates(query) {
    try {
        console.log("getCoordinates called");
        const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + API_KEY + '&units=' + units; // create url
        const response = await fetch(url); // fetch data from url
        if (!response.ok) { // if response is not ok
            throw new Error(response.status); // throw error
        }
        else { // if response is ok
            const data = await response.json(); // get data from response
            const lat = data.city.coord.lat; // get lat and lon from data
            const lon = data.city.coord.lon;
            console.log("lat: " + lat + "lon: " + lon);

            return [lat,lon]; // return lat and lon as array
        }
    } catch (error) { // if error contacting api
        console.log(error);
        return false; // return false so dependent functions know it failed
    }
}

async function getWeather(lat, lon) { // get weather for city from lat and lon (call after getting lat and lon from getCoordinates)
    try {
        console.log("getWeather called");
        const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY; // create url
        const response = await fetch(url); // fetch data from url
        if (!response.ok) { // if response is not ok
            throw new Error(response.status); // throw error
        }
        else { // if response is ok
            const data = await response.json(); // get data from response
            console.log("getWeather response: ");
            console.log(data);
            return data; // return data
        }
    } catch (error) { // if error contacting api
        console.log(error);
        return false; // return false so dependent functions know it failed
    }
}

const LondonCoord = getCoordinates("London"); // get weather for London
console.log(LondonCoord); // log weather response (should be a promise)

$(document).ready(function () { // when document is ready
    console.log("document ready");

    updateSearchHistory(); // update search history with cities from local storage when page loads

    async function loadDefaultCities() { // load default cities into local storage
        console.log("loadDefaultCities called");
        var defaultCities = ["London", "New-York", "Tokyo", "Sydney", "Paris"]; // default cities
        for (var i = 0; i < defaultCities.length; i++) { // for each default city
            var cityCoordinates = await getCoordinates(defaultCities[i]); // get coordinates for city
            var cityLat = cityCoordinates[0]; // get lat and lon from getCoordinates response
            var cityLon = cityCoordinates[1];
            var city = { // create city object
                name: defaultCities[i],
                lat: cityLat,
                lon: cityLon
            }
            defaultCities[i] = city; // replace city name with city object
        }
        localStorage.setItem("cities", JSON.stringify(defaultCities)); // save default cities to local storage
        console.log("default cities loaded");
    }

    if (localStorage.getItem("cities").length === 0) { // if no cities in local storage
        loadDefaultCities(); // load default cities into local storage
    }

    if ($(".active-city")) { // if there is an active city
        updateWeatherDisplay(); // update weather display with active city when page loads
    }

    var clearHistoryButton = $("#clear-history"); // when clear history button is clicked, run clearHistory function
    clearHistoryButton.click(function () {
        clearHistory();
    });

    function clearHistory() {
        console.log("clearHistory called");
        localStorage.setItem("cities", JSON.stringify([])); // clear local storage
        loadDefaultCities(); // load default cities into local storage
        updateSearchHistory(); // update search history
        console.log("history cleared");
    }

    $("#city-search").click(function () { // when search button is clicked (city search button is hardcoded so don't need to use document.ready)
        console.log("search button clicked");
        addCity(); // run addCity function
    });

    function updateSearchHistory() {
        var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
        var searchHistory = $("#search-history"); //city button container element
        var searchHistoryButtons = searchHistory.children(); // get city buttons from city button container
        for (var i = 0; i < searchHistoryButtons.length; i++) { // for each city button
            searchHistoryButtons[i].remove(); // remove city button
        }
        for (var i = 0; i < localCities.length; i++) { // for each city in local storage
            var cityElement = new $("<button>"); // create new button element
            cityElement.text(localCities[i]); // set text of new button to city name
    
            cityElement.click( async function () {
                updateActiveCity(this); // add active class to new button and remove from other buttons
                updateWeatherDisplay(); // update weather display with new city
            });
    
            searchHistory.append(cityElement); // add new button to search history (city button container)
        }
    
    }

    function updateActiveCity (cityElement) {
        console.log("updateActiveCity called");
        var currentActive = $(".active-city"); // get current active button
        if (currentActive) { // if there is an active button
            currentActive.removeClass("active-city"); // remove active class from current button
        }
        cityElement.classList.add("active-city"); // add active class to clicked button
        console.log("active city updated");
        console.log(cityElement);
    }

    function updateWeatherDisplay() {  // TODO: finish this function to update weather display
        console.log("updateWeatherDisplay called");
        //console.log(response);
        var activeCityName = $(".active-city").text();
        console.log(activeCityName);
        var activeCity = JSON.parse(localStorage.getItem("cities")).find(city => city.name === activeCityName); // get active city from local storage
        var getWeatherResponse = getWeather(activeCity.lat, activeCity.lon);
        console.log(getWeatherResponse);

        //var currentWeather = $("#current-weather");
        //var forecast = $("#forecast");
        //currentWeather.children() = [];
        //forecast.children() = [];
        //var currentWeatherElement = new $("<div>");
        //var forecastElement = new $("<div>");
        //currentWeatherElement.text(response.city.name);
        //forecastElement.text(response.city.name);
        //currentWeather.append(currentWeatherElement);
        //forecast.append(forecastElement);
        //console.log("updateWeatherDisplay finished");
    }

    async function addCity() {
        console.log("addCity called");
        try {
            var city = $("#city-input").val();
            console.log("city input: " + city);
    
            if (city === "") { // if city is empty
                console.log("city is empty, add city failed"); // log error
                alert("Please enter a city"); // alert user
                return false; // exit function
            }

            let cityString = city.replace(/\s/g, ''); // remove spaces from city name
            
            const cityCoordinates = await getCoordinates(cityString);
    
            if(!cityCoordinates) { // if city not found
                console.log("bad getCoordinates response, add city failed (city not found)"); // log error
                alert("City not found"); // alert user
                return false; // exit function
            }
    
            console.log("no bad weather response detected");
    
            var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
    
            let cityObject = { // create city object
                name: city,
                lat: cityCoordinates[0],
                lon: cityCoordinates[1]
            }

            if (localCities.includes(cityObject)) { // if city is already in local storage
                console.log("city already in local storage, add city aborted"); // log error
                return false; // exit function
            }
            //console.log("city not in local storage, adding city");
            localCities.push(cityObject); // add city to array
            localStorage.setItem("cities", JSON.stringify(localCities)); // save to local storage
            console.log("city added to local storage");

            updateSearchHistory(); // update search history with new city
            updateActiveCity(city); // add active class to new button and remove from other buttons
            updateWeatherDisplay(); // update weather display with new city

        } catch (error) {
            console.log(error);
            return false;
        }
    }
});