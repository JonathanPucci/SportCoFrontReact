import axios from 'axios';

export default class SportCoApi {
  constructor() {
    // this.apiUrl = 'http://127.0.0.1:3000/';
    this.apiUrl = 'https://sportcoback.herokuapp.com/';
  }

  getEntities(entities) {
    return axios
      .get(this.apiUrl + entities)
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
      let entities = res.data;
      return { entities: entities };
    });
  }

  getAllEntities(name) {
    return axios.get(this.apiUrl + name + '/').then(res => {
      return { entities: res.data };
    });
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
}
