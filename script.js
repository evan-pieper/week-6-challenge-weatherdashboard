API_KEY = "1f1a0b357b3859141a1f736da585facd";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) { // if no cities in local storage
    localStorage.setItem("cities", JSON.stringify([])); // create empty array
}

$(function () {
    $("#city-search").click(function () { // when search button is clicked
        console.log("submitCity");
        addCity(); // run addCity function
    });
});

function addCity() {
    if(getWeather() === false) { // if getWeather returns false (bad response) then return false and don't add city
        console.log("addCity failed");
        alert("City not found");
        return false;
    }
    var localCities = JSON.parse(localStorage.getItem("cities")); // get cities from local storage
    var city = $("#city-input").val(); // get city from input
    localCities.push(city); // add city to array
    localStorage.setItem("cities", JSON.stringify(localCities)); // save to local storage
    var searchHistory = $("#search-history"); //city button container element
    var cityElement = new $("<button>"); // create new button element
    cityElement.addClass("active-city"); // add active class to new button
    cityElement.text(city); // set text of new button to city name
    cityElement.click(getWeather()); // add click event to new button to get weather
    searchHistory.append(cityElement); // add new button to search history (city button container)
}

function getWeather() {
    var activeCity = $(".active-city");
    if(activeCity != null) {
        activeCity.removeClass("active-city"); // remove active class from previous city
    }
    console.log("getWeather");
    var city = $("#city-input").val();

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + API_KEY).then(function (response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(data);
                return data;
             });
        }
        else {
            $("#error").html("<div class='alert alert-danger' id='errorCity'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>City Not Found</div>");
            return false;
        }
      });
} 

