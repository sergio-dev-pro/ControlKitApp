import axios from 'axios';
import BASE_URL from '../constants/api';

export const fetchTickets = async (deviceId, eventId, userToken) =>
  axios({
    url: BASE_URL + '/api/tickets/sync',
    method: 'POST',
    data: {deviceId, eventId},
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });

export const registerTicket = async (code, token) =>
  await axios({
    url: BASE_URL + `/api/tickets/${code}/kitDelivery`,
    method: 'PATCH',
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json-patch+json',
      Authorization: 'Bearer ' + token,
    },
  });
