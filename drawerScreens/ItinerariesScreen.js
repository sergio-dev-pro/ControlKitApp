import {StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import GStyles from '../style/global';
import Header from '../components/Header';
import Loading from '../components/Loading';
import {Button, Divider, Text} from '@rneui/themed';
import THEME from '../style/theme';
import SelectModal from '../components/SelectModal';
import {useAlert} from '../context/AlertContext';
import QrCodeReader from '../components/QrCodeReader';
import {getItineraries, registerItineraryAccess} from '../api/TransferApi';
import {AuthContext} from '../context/AuthContext';
import useNetinfo from './hooks/useNetinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as realmApi from '../api/realmApi';
import {getDeviceId} from 'react-native-device-info';
import {fetchTickets} from '../api/TicketApi';

export default function ItinerariesScreen({navigation}) {
  const [loading, setLoading] = useState();
  const [selectedItinerarie, setSelectedItinerarie] = useState();
  const [countEntryByReadingCode, setCountEntryByReadingCode] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const {selectedEventId, userToken} = useContext(AuthContext);
  const {isConnected, isLoadingConnectionStatus} = useNetinfo();
  const [syncronizingTicket, setSyncronizingTicket] = useState(false);

  const syncTickets = async () => {
    try {
      const getTickets = async () => {
        return new Promise(async (resolve, reject) => {
          try {
            let deviceId = getDeviceId() + 'aaa';
            const {data: tickets} = await fetchTickets(
              deviceId,
              selectedEventId,
              userToken,
            );
            resolve(tickets);
          } catch (error) {
            console.error(error);
            reject();
          }
        });
      };
      const tickets = await getTickets();
      tickets.length && (await realmApi.saveTickets(tickets));
      await realmApi.sendLocallySavedPendingRegisteredItineraries(userToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      console.log('itinerarios sincroonizando a cada 30 seg...');
      syncTickets();
    }, 30000);
  }, []);

  useEffect(() => {
    const getItinerariesList = async () => {
      const asyncStorageKey = 'itineraries';

      const formatToSelectOptions = itineraries =>
        itineraries.map(intinerary => ({
          key: intinerary.id,
          value: intinerary.originDestiny,
        }));

      if (isConnected) {
        try {
          setLoading(true);
          const itineraries = await getItineraries(selectedEventId, userToken);
          await AsyncStorage.setItem(
            asyncStorageKey,
            JSON.stringify(itineraries),
          );
          setItineraries(formatToSelectOptions(itineraries));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const itineraries = await AsyncStorage.getItem(asyncStorageKey);
        setItineraries(formatToSelectOptions(JSON.parse(itineraries)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoadingConnectionStatus) {
      getItinerariesList();
    }
  }, [isLoadingConnectionStatus]);

  const isFirstSyncRef = useRef(false);

  useEffect(() => {
    isFirstSyncRef.current = true;
    if (isFirstSyncRef.current) {
      isConnected &&
        (async () => {
          setSyncronizingTicket(true);
          await syncTickets();
          setSyncronizingTicket(false);
        })();
    } else isConnected && syncTickets();
  }, [isConnected]);

  const setAlertMessage = useAlert();

  const handleQRCodeRead = async ticketCode => {
    // #
    const isCodeWithHashtag = ticketCode.includes('#');
    const code = isCodeWithHashtag ? ticketCode.split('#')[0] : ticketCode;
    setCountEntryByReadingCode(false);
    if (!isConnected) {
      try {
        setLoading(true);
        await realmApi.registerItineraryOffline(code, selectedItinerarie);
        setAlertMessage(
          'Ingresso encontrado, registro de intinerário realizado.',
        );
      } catch (error) {
        console.error(error);
        setAlertMessage(error.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const wasSaved = await registerItineraryAccess(
        userToken,
        code,
        selectedItinerarie,
      );
      if (wasSaved) {
        setAlertMessage(
          'Usuário encontrado! Registro de acesso realizado com sucesso.',
        );
        await realmApi.registerItinerary(code, selectedItinerarie);
      }
    } catch (error) {
      console.log('error', error);
      console.log('error error.response.data', error.response.data);
      setAlertMessage(error.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{...GStyles.view}}>
      <Header
        style={{marginBottom: 0}}
        openDrawer={() => navigation.openDrawer()}
      />
      <View style={{width: '100%', backgroundColor: THEME.cor.whitesmoke}}>
        <Text h3 h3Style={{padding: 8, textAlign: 'center'}}>
          {syncronizingTicket
            ? 'Aguarde: sincronizando ingressos.'
            : 'Itinerários'}
        </Text>
        <Divider />
      </View>
      <View style={[{maxWidth: 600}, GStyles.container]}>
        <SelectModal
          label="Selecione o Itinerário"
          items={itineraries}
          setValue={setSelectedItinerarie}
          value={selectedItinerarie}
        />
        {selectedItinerarie && (
          <Button onPress={() => setCountEntryByReadingCode(true)}>
            Contabilizar entrada
          </Button>
        )}
      </View>
      <Loading
        isActive={loading || isLoadingConnectionStatus || syncronizingTicket}
      />
      {/* <Modal
        isVisible={countEntryByReadingCode}
        backdropOpacity={0.1}
        style={{alignItems: 'center'}}>
         */}
      {countEntryByReadingCode && (
        <QrCodeReader
          onRead={handleQRCodeRead}
          onClose={() => setCountEntryByReadingCode(false)}
        />
      )}
      {/* </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({});
