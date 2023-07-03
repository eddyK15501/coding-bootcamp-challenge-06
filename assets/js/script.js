const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn')
const section = document.querySelector('section')
const nextFiveDays = document.querySelector('.next-five-days')
const searchedCities = document.querySelector('.searched-cities')

const myAPIKey = '6a6afa479f8aa91f91f6f65a77189b0f'

let cityList = []
let city = ''

// WRITTEN WITH .then()
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`

    fetch(requestURL)
        .then((res) => {
            if (res.ok) {
                section.classList.remove('hide')
                addCityToList(cityName)
                return res.json()
            } else {
                alert('Please enter a valid city for the weather search')
            }
        })
        .then((data) => {
            fetchFiveDays(cityName)

            document.getElementById('current-city').innerText = data.name
            document.getElementById('current-date').innerText = new Date().toLocaleDateString()
            document.getElementById('current-icon').innerHTML = `<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity}%`

            // console.log(data)
        })
    }

// WRITTEN WITH async await
const fetchFiveDays = async (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${myAPIKey}`

    const response = await fetch(requestURL)

    const data = await response.json()

    nextFiveDays.innerHTML = ''

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

        nextFiveDays.appendChild(nextDayForecast)
        }
         
    // console.log(data)
}

const addCityToList = (city) => {
    let newCity = caseSensitivity(city)
    
    let exist = false
    
    for (let c of cityList) {
        if (c === newCity) {
            exist = true
        }
    }
    
    if (!exist) {
        cityList.unshift(newCity)
        
        const cityBtn = document.createElement('button')
        cityBtn.classList.add('city-btn')
        cityBtn.innerText = `${cityList[0]}`
        searchedCities.prepend(cityBtn) 

        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                fetchData(e.target.innerText)
            })
        })
    } 
    
    if (cityList.length > 8) {
        searchedCities.removeChild(searchedCities.lastElementChild)
        exist = false
    }
    
    // console.log(cityList)
}

// add proper case sensitivity to city name added to the searched list
const caseSensitivity = (cityName) => {
    let updateCity = cityName.toLowerCase().split(" ");
    let returnCity = '';
    
    for (let i = 0; i < updateCity.length; i++) {
        updateCity[i] = updateCity[i][0].toUpperCase() + updateCity[i].slice(1);
        returnCity += " " + updateCity[i];
    }
    return returnCity;
}

const onFormSubmit = (event) => {
    event.preventDefault()
    
    city = cityName.value
    
    cityName.value = ''
    
    fetchData(city)
}

// addEventListeners
searchForm.addEventListener('submit', onFormSubmit)