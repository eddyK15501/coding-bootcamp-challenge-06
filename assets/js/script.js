// getElementById and querySelector
const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn')
const section = document.querySelector('section')
const nextFiveDays = document.querySelector('.next-five-days')
const searchedCities = document.querySelector('.searched-cities')

// my personal openweatherapi private key
const myAPIKey = '6a6afa479f8aa91f91f6f65a77189b0f'

// global variables
let cityList = []
let city = ''

// call openweatherapi for current weather. WRITTEN WITH .then()
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`

    fetch(requestURL)
        .then((res) => {
            // if the response gets an error, alert. if not, remove hide class, add city below the search form, and return the response in JSON format
            if (res.ok) {
                section.classList.remove('hide')
                addCityToList(cityName)
                return res.json()
            } else {
                alert('Please enter a valid city for the weather search')
            }
        })
        .then((data) => {
            // call openweatherapi for five day forcast
            fetchFiveDays(cityName)

            // add current weather data to the html
            document.getElementById('current-city').innerText = data.name
            document.getElementById('current-date').innerText = new Date().toLocaleDateString()
            document.getElementById('current-icon').innerHTML = `<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity}%`

            // console.log(data)
        })
    }

// call openweatherapi for five day/three hour weather data. WRITTEN WITH async await
const fetchFiveDays = async (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${myAPIKey}`

    const response = await fetch(requestURL)

    const data = await response.json()

    // clear previous search results for five day forcast
    nextFiveDays.innerHTML = ''

    // get unix timestamp, convert to milliseconds, then add one day in milliseconds (86400000 = 1 day) to each day
    // data.list[1 + (8 * i)] will bring back 12:00PM data for each of the following five day forcast; be it the temp, windspeed, humidity, etc.
    for (let i = 0; i < 5; i++) {
        const nextDayForecast = document.createElement('div')
        nextDayForecast.classList.add('day')
        nextDayForecast.innerHTML = `
                <h3>${new Date(((data.list[0].dt) * 1000) + ((i + 1) * 86400000)).toLocaleDateString()}</h3>
                <img id="day-icon" src='http://openweathermap.org/img/wn/${data.list[1 + (8 * i)].weather[0].icon}.png' />
                <p>Temp: ${data.list[1 + (8 * i)].main.temp}°F</p>
                <p>Wind: ${data.list[1 + (8 * i)].wind.speed} MPH</p>
                <p>Humidity: ${data.list[1 + (8 * i)].main.humidity}%</p>
            `

        // append onto the html
        nextFiveDays.appendChild(nextDayForecast)
        }
         
    // console.log(data)
}

// add city below the search form.
const addCityToList = (city) => {
    let newCity = caseSensitivity(city)
    
    let exist = false
    
    // if the searched city is in the array, boolean to true
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
    } 
    
    // if the list of cities is greater than 7, then remove the last child from the element
    if (cityList.length > 7) {
        let nodes = document.querySelectorAll('.city-btn')
        let last = nodes[nodes.length - 1]
        last.remove()
        cityList.pop()
    }

    // addeventlisteners to each button with the city that was searched
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.removeEventListener('click')
        btn.addEventListener('click', (e) => {
            fetchData(e.target.innerText)
        })
    })
    
    // console.log(cityList)
}

// add proper case sensitivity to city name added to the searched list, for when they are rendered
const caseSensitivity = (cityName) => {
    let updateCity = cityName.toLowerCase().split(" ");
    let returnCity = '';
    
    for (let i = 0; i < updateCity.length; i++) {
        updateCity[i] = updateCity[i][0].toUpperCase() + updateCity[i].slice(1);
        returnCity += " " + updateCity[i];
    }
    return returnCity;
}

// on initial search, fetch data from openweatherapi. clear the input box.
const onFormSubmit = (event) => {
    event.preventDefault()
    
    city = cityName.value
    
    cityName.value = ''
    
    fetchData(city)
}

// addEventListener on the search form
searchForm.addEventListener('submit', onFormSubmit)