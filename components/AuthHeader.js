import {Header, Text} from '@rneui/themed';
import React from 'react';
import THEME from '../style/theme';

function AuthHeader() {
  return (
    <Header
      containerStyle={{
        backgroundColor: 'white',
        borderBottomWidth: 2,
        marginBottom: 16,
        paddingVertical: 20,
      }}
      centerComponent={
        <Text h3 style={{color: THEME.cor.primary}}>
          Controle Kit/Transfer
        </Text>
      }
    />
  );
}

export default AuthHeader;
