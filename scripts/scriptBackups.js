// -----------------------------------------------------------------------

// gain access to JSON file onload

window.onload = function() {
    accessJson();
};

// -------------------------------------------

// global scope variables

var parsedJSON;
var tempMonth;

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

// global table variable to display appropriate table

var myTable;

// select sort columns

var sort;

// menu toggle variables

const AVGCELSIUSMENU = document.getElementById("avgCelsiusTemp_menu");
const HIGHCELSIUSMENU =  document.getElementById("highCelsiusTemp_menu");
const LOWCELSIUSMENU =  document.getElementById("lowCelsiusTemp_menu");
const AVGFAHRENMENU = document.getElementById("avgFahrenTemp_menu");
const HIGHFAHRENMENU = document.getElementById("highFahrenTemp_menu");
const LOWFAHRENMENU = document.getElementById("lowFahrenTemp_menu");
var tempType = "celsius";
var tempSearch = "average";

// ------------------------------------------------------

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

// toggle celsius and fahren drop menu options

function tempToggle() {
    let checkBox = document.getElementById("tempCheckbox");
    if (checkBox.checked) {
        tempType = "fahren";
    } else {
        tempType = "celsius";
    }
    let avgPref = document.getElementById('average').checked;
    let hiPref = document.getElementById('high').checked;
    let loPref = document.getElementById('low').checked;
    if (avgPref === true) {
        tempSearch = "average";
    } else if (hiPref === true) {
        tempSearch = "high";
    } else if (loPref === true) {
        tempSearch = "low";
    }
    displayMenu();
}

// -------------------------------------------------------

// display appropriate menus from options selected

function displayMenu() {
    AVGCELSIUSMENU.style.display = "none";
    HIGHCELSIUSMENU.style.display = "none";
    LOWCELSIUSMENU.style.display = "none";
    AVGFAHRENMENU.style.display = "none";
    HIGHFAHRENMENU.style.display = "none";
    LOWFAHRENMENU.style.display = "none";
    // fahren menus
    if (tempType === "fahren" && tempSearch === "average") {
        AVGFAHRENMENU.style.display = "initial";
    } else if (tempType === "fahren" && tempSearch === "high") {
        HIGHFAHRENMENU.style.display = "initial";
    } else if (tempType === "fahren" && tempSearch === "low") {
        LOWFAHRENMENU.style.display = "initial";
    } else if (tempType === "celsius" && tempSearch === "average") {
        AVGCELSIUSMENU.style.display = "initial";
    } else if (tempType === "celsius" && tempSearch === "high") {
        HIGHCELSIUSMENU.style.display = "initial";
    } else if (tempType === "celsius" && tempSearch === "low") {
        LOWCELSIUSMENU.style.display = "initial";
    }
    else {
        AVGCELSIUSMENU.style.display = "none";
        HIGHCELSIUSMENU.style.display = "none";
        LOWCELSIUSMENU.style.display = "none";
        AVGFAHRENMENU.style.display = "none";
        HIGHFAHRENMENU.style.display = "none";
        LOWFAHRENMENU.style.display = "none";
    }
}

// ----------------------------------------------------------

// function to make custom table on call (6 column table)
// arguments were (iterator, celInt / fahrenInt, HiC, LoC)

function makeTable(iterate, col3, col4, col5) {
    myTable.style.display = "table";
    let newRow = myTable.insertRow();
    let cell1 = newRow.insertCell();
    let cell2 = newRow.insertCell();
    let cell3 = newRow.insertCell();
    let cell4 = newRow.insertCell();
    let cell5 = newRow.insertCell();
    let cell6 = newRow.insertCell();
    if (tempSearch === "average") {
    cell1.innerHTML = parsedJSON[iterate]["Country"];
    cell2.innerHTML = parsedJSON[iterate]["City"];
    cell3.innerHTML = col3;
    cell4.innerHTML = Math.round(parsedJSON[iterate][`${tempMonth}${col4}`]);
    cell5.innerHTML = Math.round(parsedJSON[iterate][`${tempMonth}${col5}`]);
    cell6.innerHTML = Math.round(parsedJSON[iterate][`${tempMonth}Rain`]);
    }
}

// ----------------------------------------------------------------

// combined function

function combinedWeatherTable() {
    tempMonth = document.getElementById("month_menu").value;
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
            if(tempSearch === "average" && fahrenInt >= fahrenAvgTemp && fahrenInt < fahrenLimit) {
                myTable = document.getElementById("t01");
                makeTable(f, fahrenInt, 'HiF', 'LoF');
                sort = document.getElementById("average_sort");
            } 
        }  
        // auto click appropriate column for sort
        sort.click();  
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
            if(tempSearch === "average" && celsiusInt >= avgMonthlyTemp && celsiusInt < limit) {
                myTable = document.getElementById("t01");
                makeTable(x, celsiusInt, 'HiC', 'LoC');
                sort = document.getElementById("average_sort");
            }  
        }   
        // auto click appropriate column for sort
        sort.click();  
    }   
}




