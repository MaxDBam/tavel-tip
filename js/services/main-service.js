import { utilService } from "services/util-service.js"
import { mapService } from "services/map-service.js"
import { weatherService } from "services/weather-service.js"

var gLocations = []

function getAllPrms(getLocation) {
    var searchedLocation
    
    
    return Promise.resolve(getLocation)
    .then(res => res)
    .then(res => {
            if (gLocations.some(loc => loc.lat === res.lat && loc.lng === res.lng || loc.location === res.location)) return
            searchedLocation = res
            console.log(searchedLocation)
            return Promise.resolve(weatherService.getWeatherForLocation(res.lat, res.lng))
        })
        .then(data => {
            console.log(data);
            searchedLocation.weather = data.weather
            addLocation(searchedLocation.location, searchedLocation.lat, searchedLocation.lng, searchedLocation.weather)
            console.log(searchedLocation);
            return searchedLocation
        })
        .catch(error => console.log(error))
}

function createLocation(location, lat, lng, weather) {
    return {
        id: utilService.makeId(),
        location,
        lat,
        lng,
        weather
    }
}

function addLocation(location, lat, lng, weather) {
    gLocations.push(createLocation(location, lat, lng, weather))
}

function getLocations() {
    return gLocations
}

function deleteLocation(locationId) {
    const locationIdx = gLocations.findIndex(loc => loc.id === locationId)
    gLocations.splice(locationIdx, 1)
}

function getLocationIdxForMarker(locationId) {
    const locationIdx = gLocations.findIndex(loc => loc.id === locationId)
    return locationIdx
}

export const mainService = {
    getAllPrms,
    getLocations,
    deleteLocation,
    getLocationIdxForMarker
} 
