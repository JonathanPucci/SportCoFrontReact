import axios from 'axios';

export default class LocationIqService {
    constructor() {
        this.apiUrl = 'https://eu1.locationiq.com/v1/search.php?key=41ae722aaf6c61&q=';
        this.apiUrlSuffix = '&format=json';
    }

    getLocationFromAddress(address) {
        return axios
            .get(this.apiUrl + address + this.apiUrlSuffix)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error);
                return null;
            });
    }

}
