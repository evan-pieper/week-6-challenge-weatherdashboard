const API_KEY = "1f1a0b357b3859141a1f736da585facd"; // api key (would hide this if this was a real app)
const units = "imperial";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) { // if no cities in local storage
    localStorage.setItem("cities", JSON.stringify([])); // create empty array
}

if(localStorage.getItem("activeCity") === null) { // if no active city in local storage
    localStorage.setItem("activeCity", JSON.stringify("New York")); // set active city to New York
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
        const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + units + '&appid=' + API_KEY; // create url
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

$(document).ready(function () { // when document is ready
    console.log("document ready");

    /*async function testGetCoordinates() { // test getCoordinates function
        NewYorkCoord = await getCoordinates("New York"); // get coordinates for New York
        LondonCoord = await getCoordinates("London"); // get coordinates for London
        console.log("NY: " + NewYorkCoord); 
        console.log("London: " + LondonCoord);
    } */

    updateSearchHistory(); // update search history with cities from local storage when page loads

    var activeCityInit = JSON.parse(localStorage.getItem("activeCity")); // get active city from local storage
    console.log("active city init: " + activeCityInit);
    var activeCityButton = $("#search-history").children().filter(function () { // get active city button
        if ($(this).text() === activeCityInit) {
            return true;
        }
    });
    console.log(activeCityButton);
    updateActiveCity(activeCityButton[0]); // add active class to active city button (need to use [0] because filter returns an array)



    async function loadDefaultCities() { // load default cities into local storage
        console.log("loadDefaultCities called");
        var defaultCities = ["New York", "Los Angeles"]; // default cities
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
        console.log("default cities loaded, updating display");
        updateSearchHistory(); // update search history with default cities
        var firstDefault = $("#search-history").children()[0]; // get first city button
        updateActiveCity(firstDefault); // add active class to first city button (New York)
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
        loadDefaultCities(); // load default cities into local storage, then update display
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
            cityElement.text(localCities[i].name); // set text of new button to city name
            cityElement.click( function () {
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
        localStorage.setItem("activeCity", JSON.stringify(cityElement.textContent)); // save active city to local storage
    }

    async function updateWeatherDisplay() {  // TODO: finish this function to update weather display
        console.log("updateWeatherDisplay called");
        //console.log(response);
        var activeCityName = $(".active-city").text();
        console.log("active city name: " + activeCityName);
        var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
        var activeCity = localCities.find(city => city.name === activeCityName); // get active city from local storage
        var getWeatherResponse = await getWeather(activeCity.lat, activeCity.lon); // get weather for active city
        console.log(getWeatherResponse);

        var allDayElements = $(".day"); // get all day elements
        let dayTracker = 0;
        for (var i = 0; i < allDayElements.length; i++) { // for each day element
             
            var dayElement = allDayElements[i]; // get day element
            //console.log(dayElement);
            //$(dayElement).empty(); // empty day element (remove all children)
            var dayChildren = $(dayElement).children(); // get day element children
            //console.log(dayChildren);
            for (var j = 0; j < dayChildren.length; j++) { // for each day element child
                $(dayChildren[j]).remove(); // remove day element child
            }

            //console.log(dayChildren);
            console.log("day element cleared");

            if(i === 0) { // if first day element
                //TODO: 
                var cityNameResponse = getWeatherResponse.city.name; // get city name from getWeather response
                console.log("city name response: " + cityNameResponse);
                var cityNameElement = $("<h2>" + cityNameResponse + "</h2>"); // create city name element
                console.log(cityNameElement[0]);
                dayElement.append(cityNameElement[0]); // add city name element to day element
            }

            var dayForecast = getWeatherResponse.list[dayTracker]; // get day forecast from getWeather response

            var dayForecastDate = dayjs(dayForecast.dt_txt).format("MM/DD/YYYY"); // get date from day forecast
            var dayForecastDateElement = $("<h3>"); // create date element
            dayForecastDateElement.text(dayForecastDate); // set date element text to date
            dayElement.append(dayForecastDateElement[0]); // add date element to day element

            var dayForecastTemp = dayForecast.main.temp; // get temp from day forecast
            var dayForecastTempElement = $("<p> Temp: " + dayForecastTemp + "°F </p>"); // create temp element
            dayElement.append(dayForecastTempElement[0]); // add temp element to day element

            var dayForecastWindSpeed = dayForecast.wind.speed; // get wind speed from day forecast
            var dayForecastWindSpeedElement = $("<p>").text("Wind: " + dayForecastWindSpeed + " MPH"); // create wind speed element
            dayElement.append(dayForecastWindSpeedElement[0]); // add wind speed element to day element

            var dayForecastHumidity = dayForecast.main.humidity; // get humidity from day forecast
            var dayForecastHumidityElement = $("<p>").text("Humidity: " + dayForecastHumidity + "%"); // create humidity element
            dayElement.append(dayForecastHumidityElement[0]); // add humidity element to day element

            var dayForecastIcon = dayForecast.weather[0].icon; // get icon from day forecast
            var dayForecastIconURL = "http://openweathermap.org/img/w/" + dayForecastIcon + ".png"; // create icon url from icon
            var dayForecastIconElement = $("<img>"); // create icon element
            dayForecastIconElement.attr("src", dayForecastIconURL); // set icon element src to icon url
            dayElement.append(dayForecastIconElement[0]); // add icon element to day element

            dayTracker = dayTracker + 8;
            if(i === allDayElements.length-2)
            {
                dayTracker = dayTracker -1; // this is a hacky fix for the last day element not displaying the correct day (it falls off the end of the array otherwise)
            }
        }

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
        console.log("updateWeatherDisplay finished");
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
            
            const cityCoordinates = await getCoordinates(city);
    
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
            var searchHistory = $("#search-history"); // get number of cities in search history
            console.log(searchHistory.children());
            console.log(searchHistory.children().length);
            var newCityButton = searchHistory.children()[searchHistory.length-1]; // get new city button
            console.log(newCityButton); // for some reason this is always the last value in the default buttons, it never includes non default buttons
            updateActiveCity(newCityButton); // add active class to new button and remove from other buttons
            updateWeatherDisplay(); // update weather display with new city

        } catch (error) {
            console.log(error);
            return false;
        }
    }
});