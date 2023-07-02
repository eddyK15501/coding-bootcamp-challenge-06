const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
// const searchBtn = document.getElementById('search-btn')

let city = ''


// WRITTEN WITH .then()
const fetchData = () => {
    const requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=Raleigh&units=imperial&appid=6a6afa479f8aa91f91f6f65a77189b0f'

    fetch(requestURL)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
        })
}

// WRITTEN WITH async await
const fetchFiveDays = async () => {
    const requestURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Raleigh&appid=6a6afa479f8aa91f91f6f65a77189b0f'

    const response = await fetch(requestURL)

    const data = await response.json()

    console.log(data)
}


fetchData()
fetchFiveDays()

cityName.addEventListener('keypress', (event) => {
    city = event.target.value
})

searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(city)
})