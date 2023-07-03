const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn')
const section = document.querySelector('section')
const nextFiveDays = document.querySelector('.next-five-days')

const myAPIKey = '6a6afa479f8aa91f91f6f65a77189b0f'

let city = ''

// WRITTEN WITH .then()
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${myAPIKey}`

    fetch(requestURL)
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                alert('Please enter a valid city')
            }
        })
        .then((data) => {
            console.log(data)
            fetchFiveDays(city)
            
            document.getElementById('current-city').innerText = data.name
            document.getElementById('current-date').innerText = new Date().toLocaleDateString()
            document.getElementById('current-icon').innerHTML = `<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />`
            document.getElementById('current-temp').innerText = `Temp: ${data.main.temp}°F`
            document.getElementById('current-wind').innerText = `Wind: ${data.wind.speed} MPH`
            document.getElementById('current-humidity').innerText = `Humidity: ${data.main.humidity} %`
        })
}

// WRITTEN WITH async await
const fetchFiveDays = async (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${myAPIKey}`

    const response = await fetch(requestURL)

    const data = await response.json()

    for (let i = 0; i < 5; i++) {
        const day = document.createElement('div')
        day.classList.add('day')
        day.innerHTML = `
                <h3>${new Date(((data.list[0].dt) * 1000) + ((i + 1) * 86400000)).toLocaleDateString()}</h3>
                <img id="day-icon" src='http://openweathermap.org/img/wn/${data.list[1 + (8 * i)].weather[0].icon}.png' />
                <p>Temp: ${data.list[1 + (8 * i)].main.temp}°F</p>
                <p>Wind: ${data.list[1 + (8 * i)].wind.speed} MPH</p>
                <p>Humidity: ${data.list[1 + (8 * i)].main.humidity}%</p>
            `
            nextFiveDays.appendChild(day)
        }
        
     
    
    console.log(data)
}




const onFormSubmit = (event) => {
    event.preventDefault()

    city = cityName.value

    nextFiveDays.innerHTML = ''
    
    fetchData(city)
    
    cityName.value = ''
    
    section.classList.remove('hide')
}








// cityName.addEventListener('keypress', (event) => {
//     city = event.target.value
// })

// searchBtn.addEventListener('click', onFormSubmit)

searchForm.addEventListener('submit', onFormSubmit)