import axios from 'axios';
import BASE_URL from '../constants/api';

export const getEventRequiredFields = async eventId =>
  axios({
    url: BASE_URL + `/api/events/${eventId}/fields`,
    method: 'GET',
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json-patch+json',
    },
  });

export const getEventDays = async eventId =>
  axios({
    url: BASE_URL + `/api/events/${eventId}/days`,
    method: 'GET',
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json-patch+json',
    },
  });
