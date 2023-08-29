const API_KEY = "1f1a0b357b3859141a1f736da585facd";
const units = "imperial";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) { // if no cities in local storage
    localStorage.setItem("cities", JSON.stringify([])); // create empty array
}

//getWeather();

$("#city-search").click(function () { // when search button is clicked
    console.log("search button clicked");
    addCity(); // run addCity function
});

async function addCity() {
    try {
        console.log("addCity called");
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

        if (localCities.includes(city)) { // if city is already in local storage
            console.log("city already in local storage, add city aborted"); // log error
            return false; // exit function
        }
        //console.log("city not in local storage, adding city");
        localCities.push(city); // add city to array
        localStorage.setItem("cities", JSON.stringify(localCities)); // save to local storage

        var searchHistory = $("#search-history"); //city button container element
        var cityElement = new $("<button>"); // create new button element
        updateActiveCity(cityElement) // add active class to new button and remove from other buttons
        cityElement.text(city); // set text of new button to city name
        cityElement.aaaaaaa = "aaaaaabbbbbb";
        cityElement.click( async function () {
            updateActiveCity(this); // add active class to new button and remove from other buttons
            var response = await getWeather() // get weather for new city
        });

        searchHistory.append(cityElement); // add new button to search history (city button container)
    } catch (error) {
        console.log(error);
        return false;
    }
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
            console.log("getWeather response: " + data);
            return data; // return data
        }
    } catch (error) { // if error contacting api
        console.log(error);
        return false; // return false so dependent functions know it failed
    }
}

function updateActiveCity (cityElement) {
    console.log("updateActiveCity called");
    var currentActive = $(".active-city"); // get current active button
    if (currentActive) { // if there is an active button
        currentActive.removeClass("active-city"); // remove active class from current button
    }
    cityElement.addClass("active-city"); // add active class to clicked button
    console.log("active city updated");
    console.log(cityElement);
}
