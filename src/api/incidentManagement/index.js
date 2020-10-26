import {requests} from '../requests'

export const getIncidentRequest = data => {
  return requests.get('/retrieve-incident', {
    params: data
  })
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
