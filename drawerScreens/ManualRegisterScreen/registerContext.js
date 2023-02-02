import React, {createContext, useContext} from 'react';

export const initialState = {
  phone: '+55',
  birthDate: '',
  genre: null,
  measurements: {
    shirt: null,
    blacelet: null,
    shoe: null,
  },
  address: {
    street: '',
    zipcode: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
  invalidFields: [],
};

export const RegisterStateContext = createContext(initialState);

export const useRegisterState = () => {
  const context = useContext(RegisterStateContext);
  return context;
};

export const initialGuestUserRegisterState = {
  name: '',
  cpf: '',
  email: '',
  ...initialState,
};
export const GuestUserRegisterContext = createContext();

export const useGuestUserRegisterState = () => {
  const context = useContext(GuestUserRegisterContext);
  return context;
};
