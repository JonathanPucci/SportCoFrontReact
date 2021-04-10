import axios from 'axios';

const DEV_URL = 'http://192.168.1.27:8080/';
const LIVE_URL = 'https://sportcoback.herokuapp.com/';

// export const CURRENT_URL = DEV_URL;
export const CURRENT_URL = LIVE_URL;

export default class SportCoApi {
  constructor() {
    this.apiUrl = CURRENT_URL + 'api/';
  }

  getEntities(name, body) {
    return axios
      .post(this.apiUrl + name, body)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  }

  getSingleEntity(name, id) {
    return axios.get(this.apiUrl + name + '/' + id).then(res => {
      return res.data;
    });
  }

  getAllEntities(name) {
    return axios.get(this.apiUrl + name + '/').then(res => {
      return res.data;
    });
  }

  deleteEntity(name, params) {
    return axios.delete(this.apiUrl + name + '/' + JSON.stringify(params));
  }

  editEntity(name, entity) {
    return axios.put(this.apiUrl + name + '/', entity);
  }

  addEntity(name, entity) {
    return axios.post(this.apiUrl + name + '/', entity);
  }

  compareEntity(property) {
    return function (a, b) {
      if (a[property] > b[property]) {
        return 1;
      } else if (a[property] < b[property]) {
        return -1;
      }
      return 0;
    };
  }
}
