import {View} from 'react-native';
import React from 'react';
import {Text} from '@rneui/themed';
import SelectModal from '../../components/SelectModal';
import {useRegisterState} from './registerContext';

const AccessoriesForm = ({formConfig}) => {
  const {measurements, dispatch} = useRegisterState();
  return (
    <View>
      <Text h4 style={{marginBottom: 20}}>
        Acessórios
      </Text>

      {formConfig?.shirtSizeIsRequired && (
        <SelectModal
          label="Camisa"
          value={measurements.shirt}
          setValue={value =>
            dispatch({
              type: 'SET_MEASUREMENTS_SHIRT',
              payload: value,
            })
          }
          placeholder="Tamanho da camisa"
          items={[
            {key: 'P', value: 'P'},
            {key: 'M', value: 'M'},
            {key: 'G', value: 'G'},
            {key: 'GG', value: 'GG'},
            {key: 'EG1', value: 'EG1'},
            {key: 'EG2', value: 'EG2'},
          ]}
        />
      )}
      {formConfig?.blaceletSizeIsRequired && (
        <SelectModal
          label="Pulseira"
          placeholder="Tamanho da pulseira"
          value={measurements.blacelet}
          setValue={value =>
            dispatch({
              type: 'SET_MEASUREMENTS_BLACELET',
              payload: value,
            })
          }
          items={[
            {key: 'P', value: 'P'},
            {key: 'M', value: 'M'},
            {key: 'G', value: 'G'},
          ]}
        />
      )}
      {formConfig?.footSizeIsRequired && (
        <SelectModal
          label="Calçado"
          value={measurements.shoe}
          setValue={value =>
            dispatch({type: 'SET_MEASUREMENTS_SHOE', payload: value})
          }
          placeholder="Tamanho do calçado"
          items={[
            {key: '33', value: '33'},
            {key: '34', value: '34'},
            {key: '35', value: '35'},
            {key: '36', value: '36'},
            {key: '37', value: '37'},
            {key: '38', value: '38'},
            {key: '39', value: '39'},
            {key: '40', value: '40'},
            {key: '41', value: '41'},
            {key: '42', value: '42'},
            {key: '43', value: '43'},
            {key: '44', value: '44'},
            {key: '45', value: '45'},
            {key: '46', value: '46'},
          ]}
        />
      )}
    </View>
  );
};

export default AccessoriesForm;
