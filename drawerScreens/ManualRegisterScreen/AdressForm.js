import React from 'react';
import {Input, Text} from '@rneui/themed';
import {View} from 'react-native';
import SelectModal from '../../components/SelectModal';
import {states} from '../../constants/states';
import {formatCEP} from '../../helpers/format';
import {useRegisterState} from './registerContext';

const IS_SMALL_SCREEN = true;

function AddressForm() {
  const {address, dispatch} = useRegisterState();
  return (
    <View style={{width: '100%'}}>
      <Text h4 style={{marginBottom: 20}}>
        Endereço
      </Text>
      <Input
        label="Rua"
        value={address.street}
        onChangeText={value =>
          dispatch({type: 'SET_ADDRESS', payload: {street: value}})
        }
        placeholder="Ex: Rua dos Pinheiros"
      />
      <View
        style={{
          // flexDirection: 'row',
          width: '100%',
        }}>
        <Input
          label="Número"
          value={address.number}
          onChangeText={value =>
            dispatch({type: 'SET_ADDRESS', payload: {number: value}})
          }
          keyboardType="numeric"
        />
        <Input
          label="CEP"
          keyboardType="numeric"
          placeholder="00000-000"
          onChangeText={value =>
            dispatch({
              type: 'SET_ADDRESS',
              payload: {zipcode: formatCEP(value)},
            })
          }
          value={address.zipcode}
          style={{width: 20}}
          // inputStyle={{width: 20}}
        />
      </View>
      <Input
        value={address.complement}
        onChangeText={value =>
          dispatch({
            type: 'SET_ADDRESS',
            payload: {complement: value},
          })
        }
        label="Complemento"
      />
      <View
        style={{
          flexDirection: IS_SMALL_SCREEN ? 'column' : 'row',
          flex: 1,
        }}>
        <SelectModal
          style={{
            flex: IS_SMALL_SCREEN ? 1 : 2,
            marginRight: IS_SMALL_SCREEN ? 0 : theme.size.sm,
          }}
          value={address.state}
          setValue={value =>
            dispatch({type: 'SET_ADDRESS', payload: {state: value}})
          }
          label="Estado"
          placeholder="o estado"
          items={states.map(state => ({key: state, value: state}))}
        />

        <Input
          style={{
            flex: IS_SMALL_SCREEN ? 1 : 3,
          }}
          label="Cidade"
          value={address.city}
          onChangeText={value =>
            dispatch({type: 'SET_ADDRESS', payload: {city: value}})
          }
        />
      </View>
      <Input
        value={address.neighborhood}
        onChangeText={value =>
          dispatch({
            type: 'SET_ADDRESS',
            payload: {neighborhood: value},
          })
        }
        label="Bairro"
      />
    </View>
  );
}

export default AddressForm;
