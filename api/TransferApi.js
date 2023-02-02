import axios from 'axios';
import BASE_URL from '../constants/api';

export const getItineraries = async (eventId, authorization) => {
  try {
    var response = await axios({
      url: BASE_URL + '/api/transfers/' + eventId + '/itineraries',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authorization,
      },
    });
    return response.data;
  } catch (error) {
    console.log('error', error);
    console.log('error error.response.data', error.response.data);
    alert(error.response.data.errors);
    return null;
  }
};

export const registerItineraryAccess = async (
  authorization,
  code,
  itineraryId,
) =>
  await axios({
    url: BASE_URL + '/api/transfers/accesses',
    method: 'POST',
    data: {code: code, itineraryId: itineraryId},
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authorization,
    },
  });
