import {Button, Text} from '@rneui/themed';
import React, {useContext, useMemo, useReducer, useState} from 'react';
import {Modal, ScrollView, View} from 'react-native';
import {useAlert} from '../../context/AlertContext';
import {validateDate} from '../../helpers/validation';
import AccessoriesForm from './AccessoriesForm';
import AddressForm from './AdressForm';
import DetailsForm from './DetailsForm';
import {initialState, RegisterStateContext} from './registerContext';
import {useMultistepForm} from './useMultistepForm';
import TakePictureScreen from './TakePictureScreen';
import {AuthContext} from '../../context/AuthContext';
import {
  guestPreRegister,
  newUserPreRegister,
  saveUserPhoto,
} from '../../api/UserApi';
import Loading from '../../components/Loading';
import {formatDateAaaaMmDd} from '../../helpers/format';
import {Badge} from '@rneui/base';

const registerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PHONE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_GENRE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
      };
    case 'SET_CONFIRM_PASSWORD':
      return {
        ...state,
        confirmPassword: action.payload,
      };
    case 'SET_BIRTH':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_CEP':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_MEASUREMENTS_SHIRT':
      return {
        ...state,
        measurements: {...state.measurements, shirt: action.payload},
      };
    case 'SET_MEASUREMENTS_SHOE':
      return {
        ...state,
        measurements: {...state.measurements, shoe: action.payload},
      };
    case 'SET_MEASUREMENTS_BLACELET':
      return {
        ...state,
        measurements: {...state.measurements, blacelet: action.payload},
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: {...state.address, ...action.payload},
      };
    case 'SET_INVALID_FIELD':
      return {
        ...state,
        invalidFields: [...state.invalidFields, action.payload],
      };
    case 'REMOVE_INVALID_FIELD':
      return {
        ...state,
        invalidFields: state.invalidFields.filter(
          field => field !== action.payload,
        ),
      };
    case 'SET_RESET_PASSWORD':
      return {
        ...state,
        password: '',
        confirmPassword: '',
      };
  }
};
const FORMS = {
  /* @props formConfig */
  details: props => <DetailsForm {...props} />,
  /* @props formConfig */
  accessories: props => <AccessoriesForm {...props} />,
  address: () => <AddressForm />,
  photo: props => <TakePictureScreen />,
};

const RegisterForm = React.memo(
  ({requiredForms, onRegistered, guestInfos, newUserData, onCancel}) => {
    const [registerState, dispatch] = useReducer(registerReducer, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const steps = useMemo(
      () =>
        requiredForms.map(({id, formConfig}) => {
          return FORMS[id]({
            formConfig,
          });
        }),
      [requiredForms],
    );
    const setAlertMessage = useAlert();

    const authContext = useContext(AuthContext);

    const preGuestRegistration = async picturePath => {
      if (picturePath) {
        const formData = new FormData();
        formData.append('token', authContext.token);
        formData.append('guest', JSON.stringify(guestInfos));
        formData.append('file', {
          uri: picturePath,
          type: 'image/jpeg',
          name: 'userImage.jpg',
        });
        console.log('preGuestRegistration', formData);
        setIsLoading(true);
        var guestRegisterToken = await guestPreRegister(formData);
        setIsLoading(false);
        if (guestRegisterToken) {
          setAlertMessage('Foto salva com sucesso!');
          onRegistered({token: guestRegisterToken, ...registerState});
        } else {
          setAlertMessage('Erro ao enviar imagem, tente novamente');
        }
      }
    };

    const preNewUserRegistration = async picturePath => {
      if (picturePath) {
        console.log('preNewUserRegistration');
        const formData = new FormData();
        formData.append('eventId', authContext.selectedEventId);
        formData.append('guest', JSON.stringify(newUserData));
        formData.append('file', {
          uri: picturePath,
          type: 'image/jpeg',
          name: 'userImage.jpg',
        });
        setIsLoading(true);
        try {
          var {data: newUserToken} = await newUserPreRegister(
            formData,
            authContext.userToken,
          );
          setAlertMessage('Foto salva com sucesso!');
          onRegistered({token: newUserToken, ...registerState});
        } catch (error) {
          console.log('error', error);
          console.log('error error.response.data', error.response.data);
          setAlertMessage(error.response.data.errors);
        }
        setIsLoading(false);
      }
    };

    const savePhoto = async picturePath => {
      console.log('savePhoto');
      const isGuestRegister = !!guestInfos;
      const isNewUserRegister = !!newUserData;
      if (isGuestRegister) return preGuestRegistration(picturePath);
      else if (isNewUserRegister) return preNewUserRegistration(picturePath);
      console.log('savePhoto');

      if (picturePath) {
        const formData = new FormData();
        formData.append('token', authContext.token);
        formData.append('file', {
          uri: picturePath,
          type: 'image/jpeg',
          name: 'userImage.jpg',
        });
        console.log('@@@@ formData', formData);
        try {
          setIsLoading(true);
          var response = await saveUserPhoto(formData);
          if (response) {
            setAlertMessage('Foto salva com sucesso!');
            onRegistered(registerState);
          } else {
            setAlertMessage('Erro ao enviar imagem, tente novamente.');
          }
        } catch (error) {
          console.error(error);
          setAlertMessage('Erro ao enviar imagem, tente novamente.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    const {phone, birthDate, genre, measurements, address} = registerState;

    const {step, next, back, currentStepIndex} = useMultistepForm(steps);

    const {formConfig, id: currentFormId} = requiredForms[currentStepIndex];
    const emptyFields = 'Todos os campos devem ser preenchidos.';
    const validation = {
      details: () => {
        if (!phone) {
          setAlertMessage(emptyFields);
          return false;
        }
        const isValidPhone = phone.length >= 11;
        if (!isValidPhone) {
          setAlertMessage('Campo de telefone inválido.');
          return false;
          // return setInvalidField('phone');
        }
        if (formConfig?.birthDateIsRequired) {
          if (!birthDate) {
            setAlertMessage(emptyFields);
            return false;
          }
          function isValidBirthdate(date) {
            var birthdate = new Date(date);
            var currentDate = new Date();
            if (birthdate > currentDate) return false;
            return !isNaN(birthdate.getTime());
          }
          if (
            !validateDate(birthDate) ||
            !isValidBirthdate(formatDateAaaaMmDd(birthDate))
          ) {
            setAlertMessage('Campo de data de nascimento inválido.');
            return false;
          }
        }
        if (formConfig?.genreIsRequired) {
          if (!genre) {
            setAlertMessage(emptyFields);
            return false;
          }
        }
        return true;
      },
      accessories: () => {
        const {
          blaceletSizeIsRequired,
          footSizeIsRequired,
          shirtSizeIsRequired,
        } = requiredForms[currentStepIndex].formConfig;

        const {shirt, blacelet, shoe} = measurements;
        if (shirtSizeIsRequired && !shirt) {
          setAlertMessage(emptyFields);
          return false;
        }
        if (blaceletSizeIsRequired && !blacelet) {
          setAlertMessage(emptyFields);
          return false;
        }
        if (footSizeIsRequired && !shoe) {
          setAlertMessage(emptyFields);
          return false;
        }
        return true;
      },
      address: () => {
        const fieldKeys = Object.keys(address);
        let isValid = true;
        fieldKeys.every(field => {
          if (!address[field]) {
            isValid = false;
            return false;
          }
          return true;
        });
        !isValid && setAlertMessage('Todos os campos devem ser preenchidos.');
        return isValid;
      },
    };

    const handleNext = () => {
      if (validation[currentFormId] && !validation[currentFormId]())
        return null;
      next();
    };

    return (
      <RegisterStateContext.Provider
        value={{
          ...registerState,
          dispatch,
          cancelPhoto: () => {
            back();
          },
          savePhoto,
          isSavingPhoto: isLoading,
        }}>
        <ScrollView
          style={{
            height: 'auto',
            marginTop: 16,
            // TODO: COLOQUEI ESSA MARGEM PARA TESTAR NO MOBILE A Cam
            marginBottom: 200,
            borderRadius: 20,
          }}>
          {step}
          <View
            style={{
              width: '100%',
              justifyContent: onCancel
                ? 'space-between'
                : currentStepIndex === 0
                ? 'flex-end'
                : 'space-between',
              flexDirection: 'row',
            }}>
            {currentStepIndex !== 0 && (
              <Button type="clear" size="lg" onPress={back}>
                Voltar
              </Button>
            )}
            {onCancel && currentStepIndex === 0 && (
              <Button type="clear" size="lg" onPress={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="solid" size="lg" onPress={handleNext}>
              Próximo
            </Button>
          </View>
        </ScrollView>
        <Loading isActive={isLoading} />
      </RegisterStateContext.Provider>
    );
  },
);

export default RegisterForm;
