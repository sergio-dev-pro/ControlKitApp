import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import BASE_URL from '../constants/api';
import {useAlert} from './AlertContext';
import {getEventRequiredFields} from '../api/EventApi';

export const AuthContext = createContext();

const getRequiredForms = requiredFields => {
  const {
    addressIsRequired,
    birthDateIsRequired,
    genreIsRequired,
    blaceletSizeIsRequired,
    footSizeIsRequired,
    shirtSizeIsRequired,
    photoIsRequired,
  } = requiredFields;
  let requiredForms = [
    {
      id: 'details',
      name: 'Detalhes',
      validation: () => {
        console.log('validing form');
      },
      formConfig: {birthDateIsRequired, genreIsRequired},
    },
  ];
  const hasSizesForm =
    shirtSizeIsRequired || footSizeIsRequired || blaceletSizeIsRequired;
  if (hasSizesForm)
    requiredForms.push({
      id: 'accessories',
      name: 'Acessórios',
      validation: () => {
        console.log('validing form');
      },
      formConfig: {
        blaceletSizeIsRequired,
        footSizeIsRequired,
        shirtSizeIsRequired,
      },
    });
  if (addressIsRequired)
    requiredForms.push({
      id: 'address',
      name: 'Endereço',
      validation: () => {
        console.log('validing form');
      },
    });
  if (photoIsRequired)
    requiredForms.push({
      id: 'photo',
      name: 'Fotografia',
    });

  return requiredForms;
};

const initialState = {
  error: null,
  userToken: null,
  selectedEventId: null,
  isAuthenticated: false,
  events: null,
  requiredForms: null,
};

export function AuthProvider({children}) {
  const [authState, setAuthState] = useState(initialState);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isSearchingEventSettings, setIsSearchingEventSettings] =
    useState(false);
  const setAlertMessage = useAlert();

  useEffect(() => {
    getUserToken();
  }, []);

  const getUserToken = async () => {
    await AsyncStorage.getItem('userToken').then(async token => {
      if (token) {
        const eventInJsonFormat = await AsyncStorage.getItem('event');
        const event = JSON.parse(eventInJsonFormat);
        var decodedToken = jwt_decode(token);
        const events = JSON.parse(decodedToken.Events);
        setAuthState({
          userToken: token,
          canCreateTicket: decodedToken.CanCreateTicket,
          // // TODO: setado temporariamente para testar, excluir linha a baixo.
          // token: 'ZiU3aYBWAg1LPl+061DrVA==',
          isAuthenticated: true,
          selectedEventId: parseInt(event?.id),
          requiredForms: event?.requiredForms,
          events,
        });
      }
    });
    setIsAuthenticating(false);
  };

  const setSelectedEventId = async id => {
    try {
      setIsSearchingEventSettings(true);
      const {data: requiredFieldsForUserRegistration} =
        await getEventRequiredFields(id);

      await AsyncStorage.setItem(
        'event',
        JSON.stringify({
          id: id.toString(),
          requiredForms: getRequiredForms(requiredFieldsForUserRegistration),
        }),
      );
      setIsSearchingEventSettings(false);
      setAuthState(prevState => ({
        ...prevState,
        selectedEventId: id,
        requiredForms: getRequiredForms(requiredFieldsForUserRegistration),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const setUserToken = token => {
    setAuthState(prevState => ({
      ...prevState,
      token,
    }));
  };

  const authenticateUser = async loginData => {
    setIsAuthenticating(true);
    try {
      const url = BASE_URL + '/api/users/loginOperator';
      const {data: token} = await axios({
        url,
        method: 'POST',
        data: loginData,
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'application/json-patch+json',
        },
      });
      // save token in async storage.
      await AsyncStorage.setItem('userToken', token);
      // decode token to get events.
      var decodedToken = jwt_decode(token);
      const events = JSON.parse(decodedToken.Events);
      // Se tiver apenas um evento, nao precisa ir para tela de selecao.
      const selectedEventId =
        events.length === 1 ? events[0].id.toString() : null;
      selectedEventId &&
        (await AsyncStorage.setItem('eventId', selectedEventId));
      let authStateChanges = {
        userToken: token,
        isAuthenticated: true,
        events,
        selectedEventId,
        canCreateTicket: decodedToken.CanCreateTicket,
      };
      setAuthState(prevState => ({
        ...prevState,
        ...authStateChanges,
      }));
    } catch (error) {
      console.log(error);
      setAlertMessage(error.response.data.errors);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'eventId']);
      setAuthState(initialState);
    } catch (e) {
      console.error(e);
    }
  };

  const resetInitialState = () => {
    setAuthState(initialState);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthenticating,
        authenticateUser,
        resetInitialState,
        setAuthState,
        setIsAuthenticating,
        setSelectedEventId,
        logout,
        setUserToken,
        isSearchingEventSettings,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
