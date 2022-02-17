export class LocationPreview {
    constructor(location, onUpdateLocation, onDeleteLocation) {
        this.location = location,
        this.onUpdateLocation = onUpdateLocation,
        this.onDeleteLocation = onDeleteLocation
    }

    render() {
        const {location} = this

        var elLocationTRowDetails = document.createElement('tr')

        var elLocationIdCell = document.createElement('td')
        elLocationIdCell.innerText = location.id
        elLocationTRowDetails.appendChild(elLocationIdCell)

        var elLocationInfoCell = document.createElement('td')
        elLocationInfoCell.innerText = location.location
        elLocationTRowDetails.appendChild(elLocationInfoCell)

        var elLocationWeatherCell = document.createElement('td')
        elLocationWeatherCell.innerText = location.weather
        elLocationTRowDetails.appendChild(elLocationWeatherCell)

        var elLocationActionsCell = document.createElement('td')
        
        var elBtnUpdate = document.createElement('button')
        elBtnUpdate.classList.add('btn-update')
        elBtnUpdate.innerHTML = 'Update'
        elBtnUpdate.addEventListener('click', (ev) => {
            console.log(location.id)
            // this.onUpdateLocation(location.id, ev)
        })
        var elBtnDelete = document.createElement('button')
        elBtnDelete.classList.add('btn-delete')
        elBtnDelete.innerHTML = 'Delete'
        elBtnDelete.addEventListener('click', (ev) => {
            console.log(location.id);
            this.onDeleteLocation(location.id, ev)
        })
        
        elLocationActionsCell.appendChild(elBtnUpdate)
        elLocationActionsCell.appendChild(elBtnDelete)
        elLocationTRowDetails.appendChild(elLocationActionsCell)

        return elLocationTRowDetails
    }
}