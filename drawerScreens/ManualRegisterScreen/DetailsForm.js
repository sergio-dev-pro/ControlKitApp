import {View} from 'react-native';
import React, {useState} from 'react';
import {Input, Text} from '@rneui/themed';
import {formatBirthDate, formatPhone} from '../../helpers/format';
import {validateDate} from '../../helpers/validation';
import SelectModal from '../../components/SelectModal';
import {useRegisterState} from './registerContext';

const DetailsForm = ({formConfig}) => {
  const {phone, birthDate, genre, dispatch, invalidFields} = useRegisterState();
  const [isBirthDateValid, setIsBirthDateValid] = useState(true);
  return (
    <View>
      <Text h4 style={{marginBottom: 20}}>
        Detalhes
      </Text>
      <Input
        label="Telefone"
        placeholder="(99) 99999-9999"
        value={phone}
        onChangeText={text => {
          if (text === '') return null;
          dispatch({
            type: 'SET_PHONE',
            payload: {phone: text.replace(/[(-)--- a-zA-Z ,.]/g, '')},
          });
        }}
        keyboardType="numeric"
      />
      {formConfig?.birthDateIsRequired && (
        <Input
          label="Data de nascimento"
          placeholder="01/01/2022"
          onChangeText={text => {
            dispatch({
              type: 'SET_BIRTH',
              payload: {birthDate: formatBirthDate(text)},
            });
            !text && setIsBirthDateValid(false);
            formatBirthDate(text)?.length === 10 &&
              setIsBirthDateValid(validateDate(formatBirthDate(text)));
          }}
          onBlur={() => {
            birthDate && setIsBirthDateValid(validateDate(birthDate));
          }}
          value={birthDate}
          errorMessage={!isBirthDateValid && 'Data de nascimento inválida'}
          keyboardType="numeric"
        />
      )}
      {formConfig?.genreIsRequired && (
        <SelectModal
          label="Gênero"
          placeholder="Gênero"
          items={[
            {key: 'Masculino', value: 'Masculino'},
            {key: 'Feminino', value: 'Feminino'},
            {key: 'Outro', value: 'Outro'},
          ]}
          value={genre}
          setValue={value => {
            dispatch({type: 'SET_GENRE', payload: {genre: value}});
          }}
        />
      )}
    </View>
  );
};

export default DetailsForm;
