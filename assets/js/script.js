const searchForm = document.querySelector('.search-form')
const cityName = document.getElementById('city-name');
const searchBtn = document.getElementById('search-btn')
const section = document.querySelector('section')

let city = ''

// WRITTEN WITH .then()
const fetchData = (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=6a6afa479f8aa91f91f6f65a77189b0f`

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
        })
}

// WRITTEN WITH async await
const fetchFiveDays = async (cityName) => {
    const requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=6a6afa479f8aa91f91f6f65a77189b0f`

    const response = await fetch(requestURL)

    const data = await response.json()

    console.log(data)
}




const onFormSubmit = (event) => {
    event.preventDefault()

    city = cityName.value

    console.log(city)

    fetchData(city)
    fetchFiveDays(city)

    cityName.value = ''

    section.classList.remove('hide')
}








// cityName.addEventListener('keypress', (event) => {
//     city = event.target.value
// })

// searchBtn.addEventListener('click', onFormSubmit)

searchForm.addEventListener('submit', onFormSubmit)