import {View} from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import GStyles from '../style/global';
import Header from '../components/Header';
import {Button, Divider, Text} from '@rneui/themed';
import UserForm from './ManualRegisterScreen/UserForm';
import {getEventDays} from '../api/EventApi';
import {AuthContext} from '../context/AuthContext';
import Loading from '../components/Loading';
import RegisterForm from './ManualRegisterScreen/RegisterForm';
import {completeTicketRegister} from '../api/UserApi';
import CodeReaderForEachDay from './ManualRegisterScreen/CodeReaderForEachDay';
import {useAlert} from '../context/AlertContext';
import {formatDateAaaaMmDd} from '../helpers/format';
import {ScrollView} from 'react-native-gesture-handler';
import THEME from '../style/theme';

const NewTicket = ({navigation}) => {
  // TODO: setado tru temporariamente
  const [registerData, setRegisterData] = useState();
  // [
  //   '2022-11-11',
  //   '2022-11-12',
  //   '2022-12-15',
  //   '2022-12-16',
  //   '2030-08-25',
  //   '2030-08-26',
  // ]
  const [days, setDays] = useState([]);
  // TODO: setado temporariamente
  const [userData, setUserData] = useState();
  const [readyCode, setReadyCode] = useState();

  // TODO: setado true temporariamente
  const [selectedDays, setSelectedDays] = useState();
  const [loading, setLoading] = useState(true);
  const [dayCodes, setDayCodes] = useState();

  const authContext = useContext(AuthContext);

  const setAlertMessage = useAlert();

  useEffect(() => {
    (async () => {
      try {
        const {data: days} = await getEventDays(authContext.selectedEventId);
        setDays(days);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUserFormCompleted = data => {
    console.log(`@@@@@ data`, data);
    setUserData(data.user);
    setSelectedDays(data.eventDays);
  };

  const clearStates = () => {
    setUserData(undefined);
    setRegisterData(undefined);
    setDayCodes(undefined);
    setReadyCode(undefined);
    setSelectedDays(undefined);
  };

  const completeRegister = async () => {
    try {
      setLoading(true);
      const data = {
        ...registerData,
        birthDate: formatDateAaaaMmDd(registerData.birthDate),
        dayCodes,
        generatePdf: false,
      };
      await completeTicketRegister(data, authContext.userToken);
      clearStates();
      setAlertMessage('Ingresso cadastrado com sucesso!');
      console.log('Ingresso cadastrado com sucesso!');
    } catch (error) {
      console.error(error);
      console.log('error error.response.data', error.response.data);
      setAlertMessage('Erro ao cadastrar ingresso!');
    } finally {
      setLoading(false);
    }
  };

  const handleReadCodes = readCodes => {
    setReadyCode(undefined);
    let codes = {};
    readCodes.forEach(code => {
      codes = {...codes, ...code};
    });
    setDayCodes(codes);
  };

  const canFinishRegistration = !!userData && !!registerData && !!dayCodes;
  return (
    <View style={{...GStyles.view}}>
      <Header
        style={{marginBottom: 0}}
        openDrawer={() => navigation.openDrawer()}
      />
      <View style={{width: '100%', backgroundColor: THEME.cor.whitesmoke}}>
        <Text h3 h3Style={{padding: 8, textAlign: 'center'}}>
          Novo ingresso
        </Text>
        <Divider />
      </View>
      <View style={GStyles.container}>
        {/* <Text h3>Novo ingresso</Text> */}
        {days.length > 0 && (
          <>
            {!userData && (
              <UserForm
                onUserFormCompleted={handleUserFormCompleted}
                availableDays={days}
              />
            )}
            {!!userData && !registerData && (
              <RegisterForm
                requiredForms={authContext.requiredForms}
                newUserData={userData}
                onRegistered={setRegisterData}
                onCancel={() => setUserData(undefined)}
              />
            )}
          </>
        )}
        {!!userData && !!registerData && !dayCodes && (
          <View>
            <Text h4 h4Style={{marginVertical: 20}}>
              Leia o código do ingresso
            </Text>
            <Button
              containerStyle={{marginBottom: 10}}
              onPress={() => {
                setReadyCode('readBarCode');
              }}>
              Código de barras
            </Button>
            <Button
              containerStyle={{marginBottom: 10}}
              onPress={() => {
                setReadyCode('readQRcode');
              }}>
              QRcode
            </Button>
            <Button
              containerStyle={{marginBottom: 10}}
              type="outline"
              onPress={() => {
                setRegisterData(undefined);
              }}>
              Cancelar
            </Button>
          </View>
        )}
        {canFinishRegistration && (
          <>
            <Button
              type="solid"
              size="lg"
              containerStyle={{marginTop: 20}}
              onPress={completeRegister}>
              Finalizar cadastro
            </Button>
            <Button
              containerStyle={{marginTop: 10}}
              type="outline"
              onPress={() => {
                clearStates();
              }}>
              Cancelar
            </Button>
          </>
        )}
        <CodeReaderForEachDay
          isVisible={!!readyCode}
          onClose={() => setReadyCode(undefined)}
          daysInDate={selectedDays}
          type={readyCode}
          onReadCodes={handleReadCodes}
        />
      </View>
      <Loading isActive={loading} />
    </View>
  );
};

export default NewTicket;
