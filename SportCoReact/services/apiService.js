import axios from 'axios';

export default class SportCoApi {
  constructor() {
    this.apiUrl = 'http://192.168.1.17:8080/api/';
    //this.apiUrl = 'https://sportcoback.herokuapp.com/api/';
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

  deleteEntity(name, id) {
    return axios.delete(this.apiUrl + name + '/' + id);
  }

  removeEntity(name, entity) {
    return axios.delete(this.apiUrl + name + '/', { data: entity });
  }

  editEntity(name, entity) {
    return axios.put(this.apiUrl + name + '/', entity);
  }

  addEntity(name, entity) {
    return axios.post(this.apiUrl + name + '/', entity);
  }

  compareEntity(property) {
    return function(a, b) {
      if (a[property] > b[property]) {
        return 1;
      } else if (a[property] < b[property]) {
        return -1;
      }
      return 0;
    };
  }
}
