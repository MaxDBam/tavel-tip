import { LocationPreview } from "../component/LocationPreview.js"
import { mainService } from "./services/main-service.js"
import { mapService } from "./services/map-service.js"
import { weatherService } from "./services/weather-service.js"

window.addEventListener('load', onInit)

function onInit() {
  bindingEvents()
}

function initMap() {
  var defaultLoc
  var searchedLocation
  var marker
  var map = mapService.getMap()

  if (!getParameterByName('lat') && !getParameterByName('lng') && !mapService.isSearchingLocation() && !mapService.isSearchingMyLocation()) {
    mainService.getAllPrms(mapService.getDefaultLocation())
      .then(defaultLoc => {
        onGetSearchedLocation(defaultLoc)
        map = locationOnMap(searchedLocation, defaultLoc)
        marker = markerOnMap(map, searchedLocation, defaultLoc)
        renderLocations()
      })
      console.log('first cond')
    } else if (mapService.isSearchingLocation()) {
      searchedLocation = mainService.getLocations()[mainService.getLocations().length - 1]
      onGetSearchedLocation(searchedLocation)
      map = locationOnMap(searchedLocation, defaultLoc)
      marker = markerOnMap(map, searchedLocation, defaultLoc)
      console.log('second cond')
      renderLocations()
  } else if (mapService.isSearchingMyLocation()) {
    searchedLocation = mainService.getLocations()[mainService.getLocations().length - 1]
    onGetSearchedLocation(searchedLocation)
    map = locationOnMap(searchedLocation, defaultLoc)
    marker = markerOnMap(map, searchedLocation, defaultLoc)
    console.log('third cond')
    renderLocations()
  } else {
    mainService.getAllPrms(mapService.getLocationByLatNLng(parseInt(getParameterByName('lat')), parseInt(getParameterByName('lng'))))
      .then(defaultLoc => {
        defaultLoc = mainService.getLocations()[mainService.getLocations().length - 1]
        onGetSearchedLocation(defaultLoc)
        map = locationOnMap(searchedLocation, defaultLoc)
        marker = markerOnMap(map, searchedLocation, defaultLoc)
        renderLocations()     
      })
      .catch(error => console.log(error))
    console.log('fourth cond')
  }

  if (!mainService.getLocations().length || mainService.getLocations().length === 0) {
    return
  } else google.maps.event.addListener(map, 'click', function(event) {
    console.log(event.latLng);
    onMapClick(map, event.latLng)
  })
  
  console.log(searchedLocation);
}

function locationOnMap(searchLoc, defLoc) {
  const map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 4,
    center: (!searchLoc) ? {
      lat: defLoc.lat,
      lng: defLoc.lng
    } : 
     {
       lat: searchLoc.lat,
       lng: searchLoc.lng
     }
  })
  return map
}

function onMapClick(map, location) {
  let locOne
  let locTwo
  const marker = new google.maps.Marker({
    position: location,
    map: map
  })

  let locLat = location.lat()
  let locLng = location.lng()
  
  mainService.getAllPrms(mapService.getLocationByLatNLng(locLat, locLng))
    .then(res => {
      locOne = mainService.getLocations()[mainService.getLocations().length - 1]
      console.log(locOne);
      markerOnMap(map, locOne, locTwo)
      onGetSearchedLocation(res)
      renderLocations()
    })
  weatherService.getWeatherForLocation(locLat, locLng)
    .then(res => onShowModal(res))  
}

function markerOnMap(map, searchLoc, defLoc) {
  const marker = new google.maps.Marker({
      position: (!searchLoc) ? {
        lat: defLoc.lat,
        lng: defLoc.lng
      } : 
       {
         lat: searchLoc.lat,
         lng: searchLoc.lng
       },
      map: map
    })
    mapService.getMarkers().push(marker)
    console.log(mapService.getMarkers());
    showMarkers(map)
}

function showMarkers(map) {
  for (let i = 0; i < mapService.getMarkers().length; i++) {
    mapService.getMarkers()[i].setMap(map);
  }
}

function bindingEvents() {
  // document.querySelector('.body').addEventListener('load', initMap)
  document.querySelector('.find-btn').addEventListener('click', onSearchLocation)
  document.querySelector('body').addEventListener('keydown', (e) => {
    if(e.key === 'Enter') onSearchLocation()
  })
  document.querySelector('.my-location-btn').addEventListener('click', onFindMyLocation)
  document.querySelector('.copy-location-btn').addEventListener('click', onCopyLocationToClipboard)
  document.querySelector('.close-btn').addEventListener('click', onCloseModal)
}

function onSearchLocation() {
  let elLocationToSearch = document.querySelector('input[type="search"]')
  let searchedLocationQuery = elLocationToSearch.value
  // const searchQuery = searchedLocationQuery
  mainService.getAllPrms(mapService.getLocationLatNLng(searchedLocationQuery))
    .then(initMap)
    .catch(error => console.log(error))
  console.log(mainService.getLocations())
  elLocationToSearch.value = ''
}

function onCopyLocationToClipboard() {

  let timerInterval
  Swal.fire({
  title: 'Copied location lat and lng to the clipboard.',
  html: 'I will close in <b></b> milliseconds.',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
})

  const qMarkIdx = window.location.href.indexOf('ml')
  console.log(qMarkIdx);
  navigator.clipboard.writeText(window.location.href.slice(0, qMarkIdx + 2) + '?lat=' + mainService.getLocations()[mainService.getLocations().length - 1].lat + '&lng=' + mainService.getLocations()[mainService.getLocations().length - 1].lng)
}

function onFindMyLocation(event) {
  const status = document.querySelector('.user-location')
  mapService.searchingForMyLocation()
  function success(position) {
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    status.innerText = ''
    mainService.getAllPrms(mapService.getLocationByLatNLng(lat, lng))
    .then(initMap)
    .catch(error => console.log(error))
  }
  
  function error() {
    status.innerText = 'Unable to retrieve your location'
  }
  
  if (!navigator.geolocation) {
    status.innerText = 'Geolocation is not supported by your broweser'
  } else {
    status.innerText = 'Locating...'
    navigator.geolocation.getCurrentPosition(success, error)
  }
}

function onGetSearchedLocation(searchLoc) {
  if (!searchLoc) {
    document.querySelector('h2 span').innerText = ''
  } else document.querySelector('h2 span').innerText = searchLoc.location
}

function renderLocations() {
  const elTableBody = document.querySelector('tbody')
  elTableBody.innerHTML = ''
  var locations = mainService.getLocations()
  locations.forEach(function (location) {
    const locationPreview = new LocationPreview(location, onUpdateLocation, onDeleteLocation)
    const elLocation = locationPreview.render()
    elTableBody.appendChild(elLocation)
  })
}

function onUpdateLocation(locationId) {
  
}

function onDeleteLocation(locationId) {
  var markerIdx = mainService.getLocationIdxForMarker(locationId)
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      onRemoveMarker(markerIdx)
      mainService.deleteLocation(locationId)
      renderLocations()
      showMarkers(mapService.getMap())
      // initMap()
      Swal.fire(
        'Deleted!',
        'The location has been deleted from the table',
        'success'
      )
    }
  })
}

function onRemoveMarker(markerIdx) {
  mapService.getMarkers()[markerIdx].setMap(null)
  mapService.removeMarker(markerIdx)
}

function onShowModal(results) {
  console.log(results)
  console.log(results.desc)
  let elModal = document.querySelector('.modal')
  let elH2 = document.querySelector('.modal h2')
  let elImg = document.querySelector('.modal img')
  let elH1 = document.querySelector('.modal h1')
  let elP = document.querySelector('.modal p')
  let elSmall = document.querySelector('.modal small')
  
  elModal.style.display = 'flex'
  elH2.innerText = results.name
  elImg.src = 'http://openweathermap.org/img/wn/' + results.img + '.png'
  elH1.innerText = results.temp
  elP.innerText = results.tempFeelsLike
  elSmall.innerText = 'Wind: ' + results.wind
}

function onCloseModal() {
  const elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export  {
  onInit,
  initMap,
  locationOnMap,
  onMapClick,
  markerOnMap,
  showMarkers,
  bindingEvents,
  onSearchLocation,
  onCopyLocationToClipboard,
  onFindMyLocation,
  onGetSearchedLocation,
  renderLocations,
  onUpdateLocation,
  onDeleteLocation,
  onRemoveMarker,
  onShowModal,
  onCloseModal,
  getParameterByName
}

google.maps.event.addDomListener(window, 'load', initMap)
