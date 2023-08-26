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

function addCity() {
    console.log("addCity called");
    var city = $("#city-input").val();
    console.log("city input: " + city);
    if (city === "") {
        console.log("city is empty, add city failed");
        alert("Please enter a city");
        return false;
    }
    else {
        if(!getWeather(city)) {
            console.log("bad getWeather response, add city failed (city not found)");
            alert("City not found");
            return false;
        }
        cityWeather = getWeather(city).then(data => {
            //console.log("cityWeather: " + data);
            if(!data.ok) {
                console.log("bad getWeather response, add city failed");
                alert("City not found");
                return false;
            }
            else {
                console.log("good cityWeather response, add city succeeded");
                //var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
                //localCities.push(city); // add city to array
                //localStorage.setItem("cities", JSON.stringify(localCities)); // save to local storage
                //var searchHistory = $("#search-history"); //city button container element
                //var cityElement = new $("<button>"); // create new button element
                //cityElement.addClass("active-city"); // add active class to new button
                //cityElement.text(city); // set text of new button to city name
                //cityElement.click(getWeather()); // add click event to new button to get weather
                //searchHistory.append(cityElement); // add new button to search history (city button container)
            }
        });
    }
}

async function getWeather(query) {
    try {
        console.log("getWeather called");
        const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + API_KEY + '&units=' + units;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.status);
            return false;
        }
        else {
            const data = await response.json();
            console.log("getWeather response: " + data);
            return data;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
//getWeather().then(data => {
//    console.log(data);
//});
