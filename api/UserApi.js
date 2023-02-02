import axios from 'axios';
import BASE_URL from '../constants/api';

export const getUserByCpf = async (cpf, eventId) =>
  axios({
    url:
      BASE_URL +
      '/api/users/manual/byDocument?document=' +
      cpf +
      '&eventId=' +
      eventId,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

export const getUserByEmail = async (email, eventId) =>
  axios({
    url:
      BASE_URL +
      '/api/users/manual/byEmail?email=' +
      email +
      '&eventId=' +
      eventId,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

export const saveUserPhoto = async formData => {
  try {
    var response = await axios({
      url: BASE_URL + '/api/files/self',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
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

export const guestPreRegister = async formData => {
  try {
    var response = await axios({
      url: BASE_URL + '/api/files/guest/self',
      method: 'POST',
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error) {
    console.log('error', error);
    console.log('error error.response.data', error.response.data);
    alert(error.response.data.errors);
    return null;
  }
};
export const newUserPreRegister = async (formData, token) =>
  await axios({
    url: BASE_URL + '/api/files/new/self',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
  });

export const completeManualRegister = async (data, userToken) =>
  axios({
    url: BASE_URL + '/api/users/manual',
    method: 'PUT',
    data: data,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });
  
export const completeTicketRegister = async (data, userToken) => {
  console.log(BASE_URL + '/api/users/new');
  return axios({
    url: BASE_URL + '/api/users/new',
    method: 'POST',
    data: data,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + userToken,
    },
  });
};
