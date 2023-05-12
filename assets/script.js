var searchButton = $('#searchBtn');
var zipEntry = document.querySelector("#location");
var lat = '0';
var lon = '0';
var cityName;

var searchHistory = JSON.parse(localStorage.getItem('search-history'));

if (searchHistory == null){
    searchHistory = [];
}

var weatherContainer = document.querySelector('#weatherContainer');

var historyList = document.querySelectorAll(".histItem");

// pull localStorage for search history
function setHistory(){
    if (localStorage.getItem('search-history')){
        for (var i = 0; i < historyList.length; i++){
            var updateTo = JSON.parse(localStorage.getItem('search-history'));
            if (updateTo[i]){
                historyList[i].innerHTML = updateTo[i];
            }
        }
    }
}

setHistory();
searchButton.on('click', getCoord);
searchButton.on('click', saveSearch);

// Function to get latitude and longitude of entered zip code
function getCoord(){
    var coordApi = 'https://api.openweathermap.org/geo/1.0/zip?zip=' + zipEntry.value.trim() + '&appid=27f7efbf24b166de6282d4fd04f6501d';
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
    var weatherApi = 'https://api.openweathermap.org/data/2.5/forecast/?lat='+ latitude + '&lon=' + longitude + '&appid=27f7efbf24b166de6282d4fd04f6501d&units=imperial'
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
    $('.weatherBox').each(function(index){
        $(this).children('ul').children().children('.dayDate').text(dayjs.unix(forecast[index*8].dt).format('ddd, MMMM DD,  YYYY'));
        $(this).children('ul').children().children('.dayTemp').text(Math.floor(forecast[index*8].main.temp) + ' F');
        $(this).children('ul').children().children('.dayHum').text(Math.floor(forecast[index*8].main.humidity) + '%');
        $(this).children('ul').children().children('.dayWind').text(Math.floor(forecast[index*8].wind.speed) + ' mph');
        $(this).children('img').attr('src', 'https://openweathermap.org/img/wn/' + forecast[index*8].weather[0].icon + '@2x.png');
    })
    
    weatherContainer.style.display = 'block';
}

// save search in localStorage for search history
function saveSearch() {
    if (searchHistory.length >= 3 ) {
        searchHistory.pop()
    }
    console.log(searchHistory);
    searchHistory.unshift(zipEntry.value.trim());
    console.log(searchHistory);
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    setHistory();
}
