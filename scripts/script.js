// -----------------------------------------------------------------------

// gain access to JSON file onload

window.onload = function () {
    accessJson();
    // checkBox.checked = false;
    // checks value of global variable to toggle temp
    if (localStorage.checked === 'true') {
        tempType = 'fahren';
        checkBox.checked = true;
        AVGFAHRENMENU.style.display = "initial";
        AVGCELSIUSMENU.style.display = "none";
        // document.getElementById("intro-text").style.display = "none";
        } else {
            tempType = 'celsius';
            checkBox.checked = false;
            AVGFAHRENMENU.style.display = "none";
            AVGCELSIUSMENU.style.display = "initial";
            // document.getElementById("intro-text").style.display = "none";       
        }
        console.log(tempType, checkBox.checked, localStorage.checked);
        introDisplay();
};

// -------------------------------------------

// global scope variables

var parsedJSON;
var tempMonth;

// temp checkbox

var checkBox = document.getElementById("tempCheckbox");
var checkVal;

// celsius variables
const CELSIUS = /[^\n]*/;
var celsiusIndex;
var celsiusNum;
var celsiusInt;

// fahren variables
const FAHRENHEIT = /\(([^()]*)\)/;
var fahrenIndex;
var fahrenNum;
var fahrenInt;

// intro paragraph variable

const INTROPAR = document.getElementById("intro-text");

// global table variable to display appropriate table

var myTable;

// select sort columns

var sort;

// menu toggle variables

const AVGCELSIUSMENU = document.getElementById("avgCelsiusTemp_menu");
const AVGFAHRENMENU = document.getElementById("avgFahrenTemp_menu");
var tempType = "celsius";
var tempSearch = "average";

// Month dictionary

const MONTHDICT = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December"
}

// Temp symbols

var CELSYMBOL = '&#8451';
var FAHSYMBOL = '&#8457';

// Weather color variations

const TABLEHEADERCOLOR = document.getElementById("table-header");

const CELCOLORS = {
    "-10": "rgba(20, 110, 255, 0.8)",
    "-5": "rgba(20, 110, 255, 0.8)",
    "0": "rgba(96, 194, 255, 0.8)",
    "5": "rgba(96, 194, 255, 0.8)",
    "10": "rgba(173, 236, 252, 0.8)",
    "15": "rgba(244, 255, 45, 0.8)",
    "20": "rgba(255, 212, 0, 0.8)",
    "25": "rgba(255, 171, 15, 0.8)",
    "30": "rgba(255, 150, 45, 0.8)"
}

const FAHCOLORS = {
    "14": "rgba(20, 110, 255, 0.8)",
    "23": "rgba(20, 110, 255, 0.8)",
    "32": "rgba(96, 194, 255, 0.8)",
    "41": "rgba(96, 194, 255, 0.8)",
    "50": "rgba(173, 236, 252, 0.8)",
    "59": "rgba(244, 255, 45, 0.8)",
    "68": "rgba(255, 212, 0, 0.8)",
    "77": "rgba(255, 171, 15, 0.8)",
    "86": "rgba(255, 150, 45, 0.8)"
}

// intro display variable (displayed if true, else not displayed)

var paraDisplay;

// -------------------------------------------

// accesses local JSON file in data directory (called onload)

function accessJson() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "./data/worldWeather.json", true);
    xhr.send(null);
    xhr.onload = function () {
        var my_JSON_object = xhr.responseText;
        parsedJSON = JSON.parse(my_JSON_object);
        console.log(parsedJSON.length);
    }
}

// --------------------------------------------

// function backgroundImg() {
//     let bodyTag = document.body;
//     if (screen.height <= 1180) {
//         document.body.style.backgroundImage = "url('../images/maldives-1993704_1920.jpg');"
//     }
// }

// toggle celsius and fahren drop menu options

function tempToggle() {
    // document.getElementById("tempSlider").transition = "all 0.4s";
    // let checkBox = document.getElementById("tempCheckbox");
    if (checkBox.checked) {
        tempType = "fahren";
    } else {
        tempType = "celsius";
    }
    displayMenu();
}

// display appropriate menus from options selected

function displayMenu() {
    AVGCELSIUSMENU.style.display = "none";
    AVGFAHRENMENU.style.display = "none";
    // fahren menu
    if (tempType === "fahren" && tempSearch === "average") {
        AVGFAHRENMENU.style.display = "initial";
    }
    // celsius menu
    else if (tempType === "celsius" && tempSearch === "average") {
        AVGCELSIUSMENU.style.display = "initial";
    } else {
        AVGCELSIUSMENU.style.display = "none";
        AVGFAHRENMENU.style.display = "none";
    }
}

// Intro text display 

function introDisplay() {
    let paraDisplay = sessionStorage.getItem("open");
    if (paraDisplay === "false") {
        console.log("this is keeping it's value");
        INTROPAR.style.display = "none";
    } else {
        INTROPAR.style.display = "initial"; 
    }
}

function aboutLink() {
    if (INTROPAR.style.display === "initial") {
        INTROPAR.style.display = "none";
    } else {
        INTROPAR.style.display = "initial";
    }
} 

// function to make make smaller 4 column table

function smallerTable(iterate, col3) {
    myTable.style.display = "table";
    let newRow = myTable.insertRow();
    let cell1 = newRow.insertCell();
    let cell2 = newRow.insertCell();
    let cell3 = newRow.insertCell();
    let cell4 = newRow.insertCell();
    if (tempSearch === "average") {
        cell1.innerHTML = parsedJSON[iterate]["Country"];
        cell2.innerHTML = parsedJSON[iterate]["City"];
        cell3.innerHTML = col3;
        cell4.innerHTML = Math.round(parsedJSON[iterate][`${tempMonth}Rain`]);
    }
}

// reset the table before function creates new table and sets session variable

function resetTable() {
    document.getElementById("t01").remove();
    sessionStorage.setItem("open", "false");
 }

// combined function

function combinedWeatherTable() {
    if (typeof click === "undefined") {
        document.getElementById("error-text").style.display = "initial";
        document.getElementById("ogMenus").style.display = "none";
        document.getElementById("resetButton").style.display = "flex";
    }
    // working code
    INTROPAR.style.display = "none";
    tempMonth = document.getElementById("month_menu").value;
    let tableCaption = document.getElementById("table-caption");
    // fahren tables
    let fahrenAvgTemp = document.getElementById("avgFahrenTemp_menu").value;
    let farenIntTemp = parseInt(fahrenAvgTemp);
    let fahrenLimit = farenIntTemp + 9;
    if (tempType === "fahren") {
        for (let f in parsedJSON) {
            // seperates the celsius & fahrenheit numbers to compare to input
            fahrenIndex = parsedJSON[f][tempMonth].match(FAHRENHEIT);
            fahrenNum = parseFloat(fahrenIndex[1]);
            fahrenInt = Math.round(fahrenNum);
            // return object if greater or equal to input but less than next degree
            if (tempSearch === "average" && fahrenInt >= fahrenAvgTemp && fahrenInt < fahrenLimit) {
                myTable = document.getElementById("t01");
                smallerTable(f, fahrenInt);
                sort = document.getElementById("average_sort");
            }
        }
        // auto click appropriate column for sort
        sort.click();
        tableCaption.innerHTML = `Departures with an average temperature of ${fahrenAvgTemp}${FAHSYMBOL} to ${parseInt(fahrenAvgTemp) + 8}${FAHSYMBOL} in the month of ${MONTHDICT[tempMonth]}`;
        TABLEHEADERCOLOR.style.backgroundColor = `${FAHCOLORS[fahrenAvgTemp]}`;
        localStorage.checked = true;
        // tableCaption.style.background = `${FAHCOLORS[fahrenAvgTemp]}`;
        // document.getElementById("t01").style.backgroundColor = `${FAHCOLORS[fahrenAvgTemp]}`;
    }
    // celsius tables
    let avgMonthlyTemp = document.getElementById("avgCelsiusTemp_menu").value;
    let intTemp = parseInt(avgMonthlyTemp);
    let limit = intTemp + 5;
    if (tempType === "celsius") {
        for (let x in parsedJSON) {
            // seperates the celsius & fahrenheit numbers to compare to input
            celsiusIndex = parsedJSON[x][tempMonth].match(CELSIUS);
            celsiusNum = parseFloat(celsiusIndex[0]);
            celsiusInt = Math.round(celsiusNum);
            // return object if greater or equal to input but less than next degree
            if (tempSearch === "average" && celsiusInt >= avgMonthlyTemp && celsiusInt < limit) {
                myTable = document.getElementById("t01");
                smallerTable(x, celsiusInt);
                sort = document.getElementById("average_sort");
            }
        }
        // auto click appropriate column for sort
        sort.click();
        tableCaption.innerHTML = `Departures with an average temperature of ${avgMonthlyTemp}${CELSYMBOL} to ${parseInt(avgMonthlyTemp) + 4}${CELSYMBOL} in the month of ${MONTHDICT[tempMonth]}`;
        TABLEHEADERCOLOR.style.backgroundColor = `${CELCOLORS[avgMonthlyTemp]}`;
        localStorage.checked = false;
        // tableCaption.style.background = `${CELCOLORS[avgMonthlyTemp]}`;
    }
    // change table header color for contrast
    if (TABLEHEADERCOLOR.style.backgroundColor === "rgba(20, 110, 255, 0.8)") {
        TABLEHEADERCOLOR.style.color = "white";
    }  
    document.getElementById("error-text").style.display = "none";
    document.getElementById("ogMenus").style.display = "none";
    document.getElementById("resetButton").style.display = "flex";
}




// --------------------------------------------------------------------

// Old unused code from original experiments (includes geolocation and API calls)

// document. body. style. backgroundColor = 'blue';

// get longitude an latitude with javascript inbuilt function
// window.addEventListener('load', () => {
//     let lon;
//     let lat;
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//             position => { 
//                 lon = position.coords.longitude;
//                 lat = position.coords.latitude;
//                 // const api = `23537723b8b304240a2ab81e79b9c777`;
//                 const url = 'api.openweathermap.org/data/2.5/weather?APPID=23537723b8b304240a2ab81e79b9c777&units=metric&lat='+lat+'&lon='+lon;
//                 fetch(url)
//                 .then(response => {
//                     return response.json();
//                 })
//                 .then(data => {
//                     console.log(data)
//                 })
//             });
//     } 
// });

// window.onload waits for everything to load. document.onload will run once the DOM has loaded
// window.onload = function() {
//     // getAverage;
//     // getLocation();
//     // getWeather;
//     accessJson();
// };

// function hideTable() {
//     document.getElementById("t01").style.display = "none";
// }

// // get coords from city name entered
// function getLocation() {
//     // locationiq = https://eu1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json
//     // API = cd342c8a6a5c97
//     let cityEntry = document.getElementById("city").value;
//     const address = `https://eu1.locationiq.com/v1/search.php?key=cd342c8a6a5c97&q=${cityEntry}&format=json`;

//     let xhr = new XMLHttpRequest;
//     //Call the open function, GET-type of request, url, true-asynchronous
//     xhr.open('GET', address, true)

//     //call send
//     xhr.send();

//     xhr.onload = function () {
//         //check if the status is 200(means everything is okay)
//         if (this.status === 200 && this.status < 300) {
//             // server response
//             let loc = this.responseText;
//             // parsed to JSON
//             let cityCoords = JSON.parse(loc);
//             lat = cityCoords[0]["lat"];
//             lon = cityCoords[0]["lon"];
//             console.log(lat, lon);
//             //return server response as an object with JSON.parse
//         } else {
//             console.log(`Sorry we couldn't find that city!`);
//         } getWeather();      
//     } 
// };

// function getWeather() {
//     let tempDescription = document.getElementById("temp-description");
//     let tempDegree = document.getElementById("temp-degree");
//     let timeZone = document.getElementById("location-timezone");
//     let iconText = document.getElementById('icon');
//     // Stores city in variable
//     // let city = document.getElementById("city").value;
//     // console.log(city);

//     // can manually add https to the start of url but have used proxy site to get around localhost API issue
//     const proxy = 'https://cors-anywhere.herokuapp.com/';
//     // Dark sky API = 8f81ff561716f0527e1c8210964e1f64
//     const url = `${proxy}https://api.darksky.net/forecast/8f81ff561716f0527e1c8210964e1f64/${lat},${lon}?units=si`
//     // manually added HTTPS to get info back while using localhost
//     // const url = `https://api.openweathermap.org/data/2.5/weather?APPID=23537723b8b304240a2ab81e79b9c777&units=metric&q=${city}`;
//     //Create the XHR Object
//     let xhr = new XMLHttpRequest;
//     //Call the open function, GET-type of request, url, true-asynchronous
//     xhr.open('GET', url, true)

//     //call send
//     xhr.send();
//     //Common Types of HTTP Statuses
//     // 200: OK
//     // 404: ERROR
//     // 403: FORBIDDEN
//     // 429: too many requests
//     // call the onload 
//     xhr.onload = function () {
//         //check if the status is 200(means everything is okay)
//         if (this.status === 200 && this.status < 300) {
//             // server response
//             let data = this.responseText;
//             // parsed to JSON
//             let weatherObj = JSON.parse(data);
//             // extracted  temp from JSON object

//             let temp = weatherObj["currently"]["temperature"];
//             let description = weatherObj["hourly"]["summary"];
//             let time = weatherObj["timezone"];
//             let icon = weatherObj["hourly"]["icon"];
//             // icon url
//             // const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

//             //return server response as an object with JSON.parse
//             console.log(weatherObj, temp);
//             // console.log(icon);
//             tempDescription.textContent = description;
//             tempDegree.textContent = temp;
//             timeZone.textContent = time;
//             iconText.textContent = icon;
//         } else {
//             console.log('error retrieving info')
//         }  accessJson();
//         jsonLookup();            
//     }

//     // icons funtion
//     // function setIcons (icon, iconID) {
//     //     const skyCons = new skyCons({color: "white"});
//     // } 
// };


// not currently in use
// function getAverage() {
//     let avgTemp = document.getElementById("avgWeather").value;
//     console.log(avgTemp);
//     const url = `https://history.openweathermap.org/data/2.5/aggregated/month?month=${avgTemp}&units=metric&q=melbourne&appid=23537723b8b304240a2ab81e79b9c777`;
//     // https://history.openweathermap.org/data/2.5/aggregated/year?lat=35&lon=139&appid={YOUR API KEY}
//     let xhr = new XMLHttpRequest;
//     //Call the open function, GET-type of request, url, true-asynchronous
//     xhr.open('GET', url, true)
//     //call send
//     xhr.send();

//     xhr.onload = function () {
//         //check if the status is 200(means everything is okay)
//         if (this.status === 200 && this.status < 300) {
//             // server response
//             let info = this.responseText;
//             // parsed to JSON
//             let weatherAvg = JSON.parse(info);
//             // extracted  temp from JSON object
//             //return server response as an object with JSON.parse
//             console.log(weatherAvg);
//         } else {
//             console.log('error retrieving info')
//         }    
// }
// };

// Loop through JSON object from input from user

// function jsonLookup() {
//     let place = document.getElementById("avgWeather").value;
//     let month = document.getElementById("avgWeatherMonth").value;
//     let avgDegree = document.getElementById("avg-degree");
//     console.log(month);
//     // console.log(Object.is(parsedJSON["city"], place));
//     for (let i in parsedJSON) {
//         for (let j in parsedJSON[i]) {
//             if (parsedJSON[i][j] === place) {
//                 console.log(parsedJSON[i], parsedJSON[i][month]);
//                 avgDegree.textContent = parsedJSON[i][month];
//             }
//         }
//     }
// }

// Original celsius function

// function celsiusWeatherTable() {
//     // document.location.reload()
//     let tempMonth = document.getElementById("month_menu").value;
//     let avgMonthlyTemp = document.getElementById("avgCelsiusTemp_menu").value;
//     let intTemp = parseInt(avgMonthlyTemp);
//     let limit = intTemp + 5;  
//     let myTable = document.getElementById("t01");
//     for (let x in parsedJSON) {
//     // seperates the celsius & fahrenheit numbers to compare to input
//         let celsius = /[^\n]*/;
//         let fahrenheit = /\(([^()]*)\)/;
//         let fahrenIndex = parsedJSON[x][tempMonth].match(fahrenheit);
//         let fahrenNum = parseFloat(fahrenIndex[1]);
//         let fahrenInt = Math.round(fahrenNum);
//         // console.log(typeof fahrenInt);
//         let celsiusIndex = parsedJSON[x][tempMonth].match(celsius);
//         let celsiusNum = parseFloat(celsiusIndex[0]);
//         let celsiusInt = Math.round(celsiusNum);
//     // return object if greater or equal to input but less than next degree
//         if(celsiusInt >= avgMonthlyTemp && celsiusInt < limit) {
//             document.getElementById("t01").style.display = "table";
//     // console.log(parsedJSON[x][tempMonth], limit);
//             let newRow = myTable.insertRow();
//             let cell1 = newRow.insertCell();
//             let cell2 = newRow.insertCell();
//             let cell3 = newRow.insertCell();
//             let cell4 = newRow.insertCell();
//             let cell5 = newRow.insertCell();
//             let cell6 = newRow.insertCell();
//     // myTable.insertRow();
//             cell1.innerHTML = parsedJSON[x]["Country"];
//             cell2.innerHTML = parsedJSON[x]["City"];
//             cell3.innerHTML = celsiusInt;
//             cell4.innerHTML = Math.round(parsedJSON[x][`${tempMonth}HiC`]);
//             cell5.innerHTML = Math.round(parsedJSON[x][`${tempMonth}LoC`]);
//             cell6.innerHTML = Math.round(parsedJSON[x][`${tempMonth}Rain`]);
//         } 
//     }   
// }

// Original fahren table

// function fahrenWeatherTable() {
//     // document.location.reload()
//     let tempMonth = document.getElementById("month_menu").value;
//     let fahrenAvgTemp = document.getElementById("avgFahrenTemp_menu").value;
//     let farenIntTemp = parseInt(fahrenAvgTemp);
//     let fahrenLimit = farenIntTemp + 9;  
//     let fahrenTable = document.getElementById("t01");
//     for (let f in parsedJSON) {
//     // seperates the celsius & fahrenheit numbers to compare to input
//         let celsius = /[^\n]*/;
//         let fahrenheit = /\(([^()]*)\)/;
//         let fahrenIndex = parsedJSON[f][tempMonth].match(fahrenheit);
//         let fahrenNum = parseFloat(fahrenIndex[1]);
//         let fahrenInt = Math.round(fahrenNum);
//         console.log(fahrenInt);
//         let celsiusIndex = parsedJSON[f][tempMonth].match(celsius);
//         let celsiusNum = parseFloat(celsiusIndex[0]);
//         let celsiusInt = Math.round(celsiusNum);
//     // return object if greater or equal to input but less than next degree
//         if(fahrenInt >= fahrenAvgTemp && fahrenInt < fahrenLimit) {
//             document.getElementById("t01").style.display = "table";
//     // console.log(parsedJSON[f][tempMonth], limit);
//             let newRow = myTable.insertRow();
//             let cell1 = newRow.insertCell();
//             let cell2 = newRow.insertCell();
//             let cell3 = newRow.insertCell();
//             let cell4 = newRow.insertCell();
//             let cell5 = newRow.insertCell();
//             let cell6 = newRow.insertCell();
//     // myTable.insertRow();
//             cell1.innerHTML = parsedJSON[f]["Country"];
//             cell2.innerHTML = parsedJSON[f]["City"];
//             cell3.innerHTML = fahrenInt;
//             cell4.innerHTML = Math.round(parsedJSON[f][`${tempMonth}HiF`]);
//             cell5.innerHTML = Math.round(parsedJSON[f][`${tempMonth}LoF`]);
//             cell6.innerHTML = Math.round(parsedJSON[f][`${tempMonth}Rain`]);
//         } 
//     }   
// }