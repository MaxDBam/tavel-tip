import { utilService } from "./util-service.js";
import { weatherService } from "./weather-service.js";
import { mainService } from "./main-service.js";

var gMarkers = []
var gMap

var gSearchingLocation = false
var gSearchingMyLocation = false

const API_KEY = 'AIzaSyCyNkWu_YTdG3oFfbSkLa4euUbPhIR7LL4'

export const mapService = {
    getMap,
    getDefaultLocation,
    getLocationLatNLng,
    getLocationByLatNLng,
    isSearchingLocation,
    isSearchingMyLocation,
    searchingForMyLocation,
    getMarkers,
    removeMarker
}

function getMap() {
    return gMap
}

function getDefaultLocation() {
    return {
        location: 'Jerusalem, Israel',
        lat: 31.768319,
        lng: 35.21371
    }
}

function getLocationLatNLng(searchQuery) {
    gSearchingLocation = true
    gSearchingMyLocation = false
    
    console.log(searchQuery);
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${API_KEY}`)
        .then(res => {
            console.log(res.data.results[0])
            const location = {
                location: res.data.results[0].formatted_address,
                lat: res.data.results[0].geometry.location.lat,
                lng: res.data.results[0].geometry.location.lng
            }
            return location
        })
        .catch(error => console.log(error))
}

function getLocationByLatNLng(lat, lng) {
    gSearchingLocation = false

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
        .then(res => {
            console.log(res.data.results[0])
            const location = {
                location: res.data.results[0].formatted_address,
                lat: lat,
                lng: lng
            }
            return location
        })
        .catch(error => console.log(error))
}

function isSearchingLocation() {
    return gSearchingLocation
}

function isSearchingMyLocation() {
    return gSearchingMyLocation
}

function searchingForMyLocation() {
    gSearchingMyLocation = true
}

function getMarkers() {
    return gMarkers
}

function removeMarker(markerIdx) {
    gMarkers.splice(markerIdx, 1)
}
