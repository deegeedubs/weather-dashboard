var searchButton = $('#searchBtn');
var zipEntry = document.querySelector("#location");
var lat = '0';
var lon = '0';
var cityName;

var weatherContainer = document.querySelector('#weatherContainer');

searchButton.on('click', getCoord);

// Function to get latitude and longitude of entered zip code
function getCoord(){
    var coordApi = 'http://api.openweathermap.org/geo/1.0/zip?zip=' + zipEntry.value.trim() + '&appid=27f7efbf24b166de6282d4fd04f6501d';
    fetch(coordApi)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data){
                    lat = data.lat;
                    lon = data.lon;
                    cityName = data.name;
                    console.log(lat, lon, cityName);
                    pullWeatherData(lat, lon);
                })
            }
        })
}

// Function to pull up weather data of 
function pullWeatherData(latitude, longitude){
    var weatherApi = 'http://api.openweathermap.org/data/2.5/forecast?lat='+ latitude + '&lon=' + longitude + '&appid=27f7efbf24b166de6282d4fd04f6501d'
    fetch(weatherApi)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data){
                    displayWeatherData(data.list);
                })
            }
            else{
                console.log('error');
            }    
        })
}

// Function to take pulled weather data and send it to HTML
function displayWeatherData(forecast) {
    $('#weatherLocation').text(cityName);
    // Today
    var fiveDay = {
        0: forecast[0],
        1: forecast.slice(1,9),
        2: forecast.slice(9,17),
        3: forecast.slice(17,25),
        4: forecast.slice(25,33),
        5: forecast.slice(33)
    }
    console.log(fiveDay);
    for (var i = 0; i < fiveDay.length; i++) {
        console.log($('#day'+i+'Date'));
    }
    
    weatherContainer.style.display = 'block';
}