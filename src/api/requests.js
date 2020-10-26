import Axios from 'axios/index'


export const requests = Axios.create({
  baseURL: 'http://114.213.160.166:8080/incidents/',
  timeout: 3 * 60 * 1000
})
