import {Button} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import SignatureCapture from 'react-native-signature-capture';
import THEME from '../style/theme';

const Signature = ({show, onNotShow, onSigned}) => {
  const [signature, setSignature] = useState();
  const signatureRef = useRef(null);
  const saveSign = () => {
    signatureRef.current.saveImage();
  };

  const onSaveEvent = () => {
    onSigned(signature);
  };

  const resetSign = () => {
    signatureRef.current.resetImage();
  };
  const handleReset = () => {
    onNotShow();
  };

  const onDragEvent = () => {
    console.log('dragged');
    saveSign();
  };
  if (!show) return null;
 
  return (
    <ReactNativeModal isVisible={show}>
      <View style={styles.container}>
        <SignatureCapture
          ref={signatureRef}
          style={[{flex: 1}, styles.signature]}
          onSaveEvent={setSignature}
          onDragEvent={onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          backgroundColor="white"
          strokeColor={'black'}
          minStrokeWidth={4}
          maxStrokeWidth={4}
          viewMode="portrait"
        />

        <View style={styles.buttonsContainer}>
          <Button type="light" onPress={handleReset}>
            Voltar
          </Button>
          <Button
            containerStyle={{flex: 1, marginHorizontal: 4}}
            onPress={onSaveEvent}>
            Salvar
          </Button>
          <Button type="outline" onPress={resetSign}>
            Limpar
          </Button>
        </View>
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10,
  },
});

export default Signature;
