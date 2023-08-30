const API_KEY = "1f1a0b357b3859141a1f736da585facd"; // api key (would hide this if this was a real app)
const units = "imperial";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) { // if no cities in local storage
    localStorage.setItem("cities", JSON.stringify([])); // create empty array
}

async function getWeather(query) {
    try {
        console.log("getWeather called");
        const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + API_KEY + '&units=' + units; // create url
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

const weatherResponse = getWeather("London"); // get weather for London
console.log(weatherResponse); // log weather response (should be a promise)

$(document).ready(function () { // when document is ready
    console.log("document ready");

    updateSearchHistory(); // update search history with cities from local storage when page loads

    var clearHistoryButton = $("#clear-history"); // when clear history button is clicked, run clearHistory function
    clearHistoryButton.click(function () {
        clearHistory();
    });

    function clearHistory() {
    console.log("clearHistory called");
    localStorage.setItem("cities", JSON.stringify([])); // clear local storage
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
                var response = await getWeather() // get weather for new city
                updateWeatherDisplay(response); // update weather
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

    function updateWeatherDisplay(response) {  // TODO: finish this function to update weather display
        console.log("updateWeatherDisplay called");
        //console.log(response);
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
            
            const weatherResponse = await getWeather(city);
    
            console.log("weatherResponse: " + weatherResponse);
            if(!weatherResponse) { // if city not found
                console.log("bad getWeather response, add city failed (city not found)"); // log error
                alert("City not found"); // alert user
                return false; // exit function
            }
    
            console.log("no bad weather response detected");
    
            var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
    
            const cityLat = weatherResponse.city.coord.lat; // get city lat and lon from weather response
            const cityLon = weatherResponse.city.coord.lon;

            city.lat = cityLat; // add lat and lon to city object
            city.lon = cityLon;
            
            if (localCities.includes(city)) { // if city is already in local storage
                console.log("city already in local storage, add city aborted"); // log error
                return false; // exit function
            }
            //console.log("city not in local storage, adding city");
            localCities.push(city); // add city to array
            localStorage.setItem("cities", JSON.stringify(localCities)); // save to local storage
            console.log("city added to local storage");
            updateSearchHistory(); // update search history with new city
        } catch (error) {
            console.log(error);
            return false;
        }
    }
});