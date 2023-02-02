import {Badge, Button, Icon, Text} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import QrCodeReader from '../../components/QrCodeReader';
import {useAlert} from '../../context/AlertContext';
import {formatDate} from '../../helpers/format';
import THEME from '../../style/theme';

const CodeReaderForEachDay = ({
  isVisible,
  onClose,
  daysInDate = [],
  type,
  onReadCodes,
}) => {
  const [readCodes, setReadCodes] = useState([]);
  const [readDayCode, setReadDayCode] = useState();
  const setAlertMessage = useAlert();

  const handleQRCodeRead = code => {
    // TODO: Validar se os codigos dos dias sao diferentes
    const isValid =
      readCodes.filter(
        (readCode, index) => readCode[daysInDate[index]] === code,
      ).length === 0;
    if (!isValid) {
      setReadDayCode(undefined);
      return setAlertMessage('Código inválido: Esse código já foi lido.');
    }

    readCodes.push({[readDayCode]: code});
    setReadDayCode(undefined);
  };

  
  const handleClose = () => {
    setReadCodes([]);
    onClose();
    clearState();
  };

  const handleReadCodes = () => {
    onReadCodes(readCodes);
    clearState();
  };

  const clearState = () => {
    setReadCodes([]);
    setReadDayCode(undefined);
  };
  const selectReadDayCode = day => setReadDayCode(day);
  const unselectReadDayCode = day => setReadDayCode(undefined);

  const hasReadThePreviousDay = indexOfDaysInDate =>
    readCodes.length === indexOfDaysInDate;
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.1}
      style={{alignItems: 'center'}}>
      {readDayCode ? (
        <QrCodeReader onRead={handleQRCodeRead} onClose={unselectReadDayCode} />
      ) : (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            height: 'auto',
            width: 500,
          }}>
          <Text h4 h4Style={{marginBottom: 10, textAlign: 'center'}}>
            Leia o {type === 'readQRcode' ? 'QRcode' : 'código de barras'} de
            cada dia
          </Text>
          <View style={{padding: 16, alignItems: 'flex-start'}}>
            {daysInDate.map((day, index) => (
              <Button
                key={day}
                containerStyle={{
                  width: '100%',
                  marginBottom: 10,
                }}
                type="outline"
                size="lg"
                onPress={() => selectReadDayCode(day)}
                disabled={!hasReadThePreviousDay(index)}>
                Dia {formatDate(day)}
                {readCodes[index] ? (
                  <Badge value={readCodes[index][day]} status="success" />
                ) : (
                  <Icon
                    size={32}
                    style={{marginLeft: 20}}
                    color={
                      !hasReadThePreviousDay(index)
                        ? THEME.cor.grey
                        : THEME.cor.primary
                    }
                    type="materialicons"
                    name="qr-code-scanner"
                  />
                )}
              </Button>
            ))}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Button
              title="Voltar"
              size="lg"
              type="clear"
              onPress={handleClose}
            />
            <Button
              type="solid"
              size="lg"
              containerStyle={{marginLeft: 16}}
              title="Pronto"
              onPress={handleReadCodes}
            />
          </View>
        </View>
      )}
    </Modal>
  );
};

export default CodeReaderForEachDay;
