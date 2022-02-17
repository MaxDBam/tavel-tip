import { mapService } from "./map-service.js"

const API_KEY = '3d4af8168312c32fb2b5a217cd0abce7'

function getWeatherForLocation(lat, lon) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=3d4af8168312c32fb2b5a217cd0abce7`)
        .then(res => {
            // if (mapService.getLocations().find(location => location.lat === lat && location.lng === lon))
            const locWeatherInfo = { 
                img: res.data.weather[0].icon,
                temp: res.data.main.temp + '℃',
                tempFeelsLike: 'Feels like ' + res.data.main.feels_like + '℃' + '. ' + res.data.weather[0].description,
                wind: res.data.wind.speed + 'm/s',
                name: res.data.name + ', ' + res.data.sys.country, 
                weather: res.data.weather[0].main + ', ' + res.data.main.temp + '℃'
            }
            return locWeatherInfo
        }) 
        .catch(error => console.log(error))
}

function getWeatherForLocationByName(query) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=3d4af8168312c32fb2b5a217cd0abce7`)
        .then(res => res.data)
        .catch(error => console.log(error))
    }
    
    export const weatherService = {
    getWeatherForLocation,
    getWeatherForLocationByName
}