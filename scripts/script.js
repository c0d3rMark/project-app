// ---------------------------------------------

// gain access to JSON file onload

window.onload = function () {
    accessJson();
    if (localStorage.checked === 'true') {
        tempType = 'fahren';
        checkBox.checked = true;
        AVGFAHRENMENU.style.display = "initial";
        AVGCELSIUSMENU.style.display = "none";
    } else {
        tempType = 'celsius';
        checkBox.checked = false;
        AVGFAHRENMENU.style.display = "none";
        AVGCELSIUSMENU.style.display = "initial";
    }
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
const MOBILEHEADERCOLOR = document.getElementById("mobile-header");

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
    }
}

// toggle celsius and fahren drop menu options

function tempToggle() {
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

    INTROPAR.style.display = "none";
    tempMonth = document.getElementById("month_menu").value;
    let tableCaption = document.getElementById("table-caption");

    // fahren tables

    let fahrenAvgTemp = document.getElementById("avgFahrenTemp_menu").value;
    let farenIntTemp = parseInt(fahrenAvgTemp);
    let fahrenLimit = farenIntTemp + 9;
    if (tempType === "fahren") {
        for (let f in parsedJSON) {

            // seperates the fahrenheit numbers to compare to input

            fahrenIndex = parsedJSON[f][tempMonth].match(FAHRENHEIT);
            fahrenNum = parseFloat(fahrenIndex[1]);
            fahrenInt = Math.round(fahrenNum);

            // return object if greater or equal to input but less than next degree

            if (tempSearch === "average" && fahrenInt >= fahrenAvgTemp && fahrenInt < fahrenLimit) {
                myTable = document.getElementById("t01");
                smallerTable(f, fahrenInt);
                sort = document.getElementById("average_sort");
                tableCaption.innerHTML = `Destinations with an average temperature of ${fahrenAvgTemp}${FAHSYMBOL} to ${parseInt(fahrenAvgTemp) + 8}${FAHSYMBOL} in the month of ${MONTHDICT[tempMonth]}`;
                TABLEHEADERCOLOR.style.backgroundColor = `${FAHCOLORS[fahrenAvgTemp]}`;
            }
        }

        // auto click appropriate column for sort

        sort.click();
        localStorage.checked = true;
    }

    // celsius tables

    let avgMonthlyTemp = document.getElementById("avgCelsiusTemp_menu").value;
    let intTemp = parseInt(avgMonthlyTemp);
    let limit = intTemp + 5;
    if (tempType === "celsius") {
        for (let x in parsedJSON) {

            // seperates the celsius numbers to compare to input

            celsiusIndex = parsedJSON[x][tempMonth].match(CELSIUS);
            celsiusNum = parseFloat(celsiusIndex[0]);
            celsiusInt = Math.round(celsiusNum);

            // return object if greater or equal to input but less than next degree

            if (tempSearch === "average" && celsiusInt >= avgMonthlyTemp && celsiusInt < limit) {
                myTable = document.getElementById("t01");
                smallerTable(x, celsiusInt);
                sort = document.getElementById("average_sort");
                tableCaption.innerHTML = `Destinations with an average temperature of ${avgMonthlyTemp}${CELSYMBOL} to ${parseInt(avgMonthlyTemp) + 4}${CELSYMBOL} in the month of ${MONTHDICT[tempMonth]}`;
                TABLEHEADERCOLOR.style.backgroundColor = `${CELCOLORS[avgMonthlyTemp]}`;
            }
        }

        // auto click appropriate column for sort

        sort.click();
        localStorage.checked = false;
    }

    // change table header color for contrast

    if (TABLEHEADERCOLOR.style.backgroundColor === "rgba(20, 110, 255, 0.8)") {
        TABLEHEADERCOLOR.style.color = "white";
    }

    document.getElementById("error-text").style.display = "none";
    document.getElementById("ogMenus").style.display = "none";
    document.getElementById("resetButton").style.display = "flex";
}