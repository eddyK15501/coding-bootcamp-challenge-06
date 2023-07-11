// getElementById and querySelector
const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn')
const section = document.querySelector('section')
const nextFiveDays = document.querySelector('.next-five-days')
const searchedCities = document.querySelector('.searched-cities')

// my personal OpenWeatherMap API private key
const myAPIKey = '6a6afa479f8aa91f91f6f65a77189b0f'

// global variables
let cityList = []
let city = ''

// call OpenWeatherMap API for current weather. WRITTEN WITH .then()
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`

    fetch(requestURL)
        .then((res) => {
            if (res.ok) {
                section.classList.remove('hide')
                addCityToList(cityName)
                return res.json()
            } else {
                return
            }
        })
        .then((data) => {
            // call OpenWeatherMap API for five day forcast
            fetchFiveDays(cityName)

            // add current weather data to the html
            document.getElementById('current-city').innerText = data.name
            document.getElementById('current-date').innerText = `(${new Date().toLocaleDateString()})`
            document.getElementById('current-icon').innerHTML = `<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity}%`

            console.log(data)
        })
    }

// call OpenWeatherMap API for five day/three hour weather data. WRITTEN WITH async await
const fetchFiveDays = async (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${myAPIKey}`

    const response = await fetch(requestURL)

    const data = await response.json()

    // clear previous search results for five day forcast
    nextFiveDays.innerHTML = ''

    // get unix timestamp, convert to milliseconds, then add one day in milliseconds (86400000 = 1 day), to get the dates of the next five days.
    // data.list[7 + (8 * i)] will bring back 3:00PM data for each of the following five day forcast; be it the temp, windspeed, humidity, etc.
    for (let i = 0; i < 5; i++) {
        const nextDayForecast = document.createElement('div')
        nextDayForecast.classList.add('day')
        nextDayForecast.innerHTML = `
            <h3>${new Date(((data.list[0].dt) * 1000) + ((i + 1) * 86400000)).toLocaleDateString()}</h3>
            <img id="day-icon" src='http://openweathermap.org/img/wn/${data.list[7 + (8 * i)].weather[0].icon}.png' />
            <p>Temp: ${data.list[7 + (8 * i)].main.temp}°F</p>
            <p>Wind: ${data.list[7 + (8 * i)].wind.speed} MPH</p>
            <p>Humidity: ${data.list[7 + (8 * i)].main.humidity}%</p>
        `

        nextFiveDays.appendChild(nextDayForecast)
        }
         
    console.log(data)
}

// add proper case sensitivity to city name added to the searched list; Capitalize the first letter of the city
const caseSensitivity = (cityName) => {
    let updateCity = cityName.toLowerCase().split(" ");
    let returnCity = '';
    
    for (let i = 0; i < updateCity.length; i++) {
        updateCity[i] = updateCity[i][0].toUpperCase() + updateCity[i].slice(1);
        returnCity += " " + updateCity[i];
    }
    // trim extra space, within the string being returned
    return returnCity.trim();
}

// add city to the search history.
const addCityToList = (city) => {
    let newCity = caseSensitivity(city)

    let exist = false
    
    // if the searched city is already within the cityList array, exist is equal to true
    for (let c of cityList) {
        if (c === newCity) {
            exist = true
        }
    }

    // if the city has not been searched before
    if (!exist) {
        // add city to the front of the array
        cityList.unshift(newCity)

        // create a button with the city searched, and prepend it to the top
        const cityBtn = document.createElement('button')
        cityBtn.classList.add('city-btn')
        cityBtn.innerText = `${cityList[0]}`
        searchedCities.prepend(cityBtn) 
    } else {
        return
    }
    
    // if the list of cities is greater than 8, then remove the last child from the element.
    if (cityList.length > 8) {
        let nodes = document.querySelectorAll('.city-btn')
        let last = nodes[nodes.length - 1]
        last.remove()

        // remove the last city from within the array
        cityList.pop()
    }
    
    // set local storage with the cityList array
    localStorage.setItem('cities', JSON.stringify(cityList))

    // addeventlisteners to each button with the city that was searched
    document.querySelectorAll('.city-btn').forEach(btn => {
        // removeEventListener first, for each button. Or else, addEventListeners will stack on the button
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (e) => {
            fetchData(e.target.innerText)
        })
    })
}

// get local storage array of previous searched cities
const getLocalStorage = () => {
    const storageList = JSON.parse(localStorage.getItem('cities'))

    // if local storage array is empty, this function will return a boolean of false
    if (!storageList) {
        return false
    }

    // local storage cities, saved back int the initial cityList array
    cityList = storageList

    addStorageList()
}

// add cities to the search list history, on initial render
const addStorageList = () => {
    if (cityList.length > 0) {
        cityList.forEach(city => {
            const cityBtn = document.createElement('button')
            cityBtn.classList.add('city-btn')
            cityBtn.innerText = `${city}`
            searchedCities.append(cityBtn) 
        })
    } else if (cityList.length > 8) {
        let nodes = document.querySelectorAll('.city-btn')
        let last = nodes[nodes.length - 1]
        last.remove()
        cityList.pop()
    } else {
        return
    }

    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.removeEventListener('click', fetchData)
        btn.addEventListener('click', (e) => {
            fetchData(e.target.innerText)
        })
    })   
}

// on initial search, fetch data from OpenWeatherMap. clear the input box after searching.
const onFormSubmit = (event) => {
    event.preventDefault()
    
    city = cityName.value
    
    cityName.value = ''
    
    // if a city is searched, then call fetchData. else, alert and stop function
    if (city) {
        fetchData(city)
    } else {
        alert("Please enter a city")
        return
    }
}

// addEventListener on the search form
searchForm.addEventListener('submit', onFormSubmit)

// get local storage from the start
getLocalStorage()