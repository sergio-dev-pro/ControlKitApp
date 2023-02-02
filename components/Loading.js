import React from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {useWindowDimensions} from 'react-native';

import THEME from '../style/theme';

export default function Loading({isActive}) {
  const {width} = useWindowDimensions();

  if (!isActive) return null;
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(241, 242, 243, 0.5)',
        position: 'absolute',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={THEME.cor.primary} />
    </View>
  );
}
