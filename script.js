API_KEY = "1f1a0b357b3859141a1f736da585facd";
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

if(localStorage.getItem("cities") === null) {
    localStorage.setItem("cities", JSON.stringify([]));
}

$(function () {
    $("#city-search").click(function () {
        console.log("submitCity");
        addCity();
    });
});

function addCity() {
    if(!getWeather()) {
        console.log("addCity failed");
        alert("City not found");
        return false;
    }
    var localCities = JSON.parse(localStorage.getItem("cities"));
    var city = $("#city-input").val();
    if (city != '') {
        localCities.push(city);
        localStorage.setItem("cities", JSON.stringify(localCities));
        addCityToHistory(city);
    }
    var searchHistory = $("#search-history");
    var cityElement = new $("<button>");
    cityElement.addClass("active-city");
    cityElement.text(city);
    cityElement.click(getWeather());
    searchHistory.append(cityElement);
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
            return response;
        }
      });
} 

