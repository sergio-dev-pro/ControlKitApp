import {Button, Divider, Icon, Image, Input, Text} from '@rneui/themed';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import Header from '../components/Header';
import QrCodeReader from '../components/QrCodeReader';
import {useAlert} from '../context/AlertContext';
import {AuthContext} from '../context/AuthContext';
import {getDeviceId} from 'react-native-device-info';
import GStyles from '../style/global';
import {fetchTickets, registerTicket} from '../api/TicketApi';
import * as realmApi from '../api/realmApi';
import useNetinfo from './hooks/useNetinfo';
import THEME from '../style/theme';
import Signature from '../components/Signature';
import TakePictureModal from '../components/TakePictureModal';
import {
  ticketOwnerDocumentRegistration,
  ticketOwnerSignatureRegistration,
} from '../api/FilesApi';

function KitsDrawerScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const [showQrCodeReader, setShowQrcodereader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncronizingTicket, setSyncronizingTicket] = useState(false);
  const [qrCodeReader, setQrcodereader] = useState();
  const [ticketFound, setTicketFound] = useState();
  const [isShowInputError, setIsShowInputError] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [documentImg, setDocumentImg] = useState(false);
  const [name, setName] = useState('');
  const setAlertMessage = useAlert();
  const {isConnected} = useNetinfo();
  const [signature, setSignature] = useState();
  const [isVisible, setIsVisible] = useState();
  const [ticketCode, setTicketCode] = useState();
  const [isLoading, setIsLoading] = useState();

  const syncTickets = async () => {
    try {
      const getTickets = async () => {
        return new Promise(async (resolve, reject) => {
          try {
            let deviceId = getDeviceId();
            const {data: tickets} = await fetchTickets(
              deviceId,
              authContext.selectedEventId,
              authContext.userToken,
            );
            resolve(tickets);
          } catch (error) {
            console.error(JSON.stringify(error));
            reject();
          }
        });
      };
      const tickets = await getTickets();
      tickets.length && (await realmApi.saveTickets(tickets));
      await realmApi.sendLocallySavedPendingRegisteredTickets(
        authContext.userToken,
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      7;
      console.log('Kits sincroonizando a cada 30 seg...');
      syncTickets();
    }, 30000);
  }, []);

  const isFirstSyncRef = useRef(false);
  useEffect(() => {
    if (isConnected !== null) {
      isFirstSyncRef.current = true;
      if (isFirstSyncRef.current) {
        isConnected &&
          (async () => {
            setSyncronizingTicket(true);
            await syncTickets();
            setSyncronizingTicket(false);
          })();
      } else isConnected && syncTickets();
    }
  }, [isConnected]);

  const handleQRCodeRead = async ticketCode => {
    // #
    const isCodeWithHashtag = ticketCode.includes('#');
    const code = isCodeWithHashtag ? ticketCode.split('#')[0] : ticketCode;
    setTicketCode(code);
    setShowQrcodereader(false);
    if (!isConnected) {
      try {
        setLoading(false);
        const response = await realmApi.registerTicketOffline(code);
        setTicketFound(response);
        // setAlertMessage('Registro de entrega de kit realizado.');
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
      const {data: ticket} = await registerTicket(code, authContext.userToken);

      setTicketFound(ticket);
    } catch (error) {
      console.error(error);
      setAlertMessage('Ingresso não econtrado.', '#dc143c');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const cancel = () => {
    setSignature(undefined);
    setName('');
    setTicketFound(undefined);
    setDocumentImg(undefined);
  };
  const RegisterDelivery = async () => {
    try {
      setIsLoading(true);
      try {
        const formData = new FormData();

        formData.append('code', ticketCode);

        formData.append('file', {
          uri: documentImg,
          type: 'image/jpg',
          name: 'documentImage.jpg',
        });
        await ticketOwnerDocumentRegistration(authContext.userToken, formData);
      } catch (error) {
        throw `Chamada para registrar documento, payload = ${JSON.stringify({
          token: authContext.userToken,
          formData,
        })} ${ticketOwnerDocumentRegistration}${error}`;
      }
      const formData = new FormData();

      formData.append('code', ticketCode);
      formData.append('file', {
        uri: 'data:image/png;base64,' + signature?.encoded + ';',
        type: 'image/png',
        name: 'signatureImage.png',
      });
      await ticketOwnerSignatureRegistration(authContext.userToken, formData);
      setAlertMessage('Entrega de kit registrada.', '#32cd32');
    } catch (error) {
      console.error(error);
      setAlertMessage('Entrega não registrada, não entregar o kit.');
    } finally {
      cancel();
      setIsLoading(false);
    }
  };

  // console.log(realmApi.getAllTickets());
  // console.log(
  //   '@@@signature',
  //   signature,
  //   signature?.pathName,
  //   'documentImg',
  //   documentImg,
  // );
  const inputNameErrorMsg =
    (name.length === 0 && 'Campo de nome deve ser preenchido') ||
    (name.length < 3 && 'Campo de nome deve ter no minímo 3 caracteres') ||
    undefined;
  const requestSubscription = () => {
    setIsShow(true);
  };
  return (
    <View style={{...GStyles.view}}>
      <Header
        style={{marginBottom: 0}}
        openDrawer={() => navigation.openDrawer()}
      />
      <View style={{width: '100%', backgroundColor: THEME.cor.whitesmoke}}>
        <Text h3 h3Style={{padding: 8, textAlign: 'center'}}>
          {!syncronizingTicket
            ? 'Entrega de kits'
            : 'Aguarde: sincronizando ingressos.'}
        </Text>
        <Divider />
      </View>
      <View style={GStyles.container}>
        {ticketFound ? (
          <View>
            {!ticketFound.kitDelivered ? (
              <Text h4 style={{textAlign: 'center', marginBottom: 16}}>
                Ingresso encontrado
              </Text>
            ) : (
              <View style={{alignItems: 'center', marginBottom: 16}}>
                <Icon
                  size={45}
                  color="#dc143c"
                  type="antdesign"
                  name="exclamationcircleo"
                />
                <Text h4 style={{color: '#dc143c', marginTop: 8}}>
                  kit já entregue
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text h4>Dia</Text>
              <Text h4>
                {(() => {
                  var d = new Date(ticketFound?.day),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                  if (month.length < 2) month = '0' + month;
                  if (day.length < 2) day = '0' + day;

                  return [day, month, year].join('/');
                })()}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <Text h4>Documento</Text>
              <Text h4>
                {(() => {
                  const {document} = ticketFound;
                  if (document.length === 11) {
                    return document.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      '$1.$2.$3-$4',
                    );
                  } else if (document.length === 9) {
                    return document;
                  } else {
                    return 'Formato inválido';
                  }
                })()}
              </Text>
            </View>
            {ticketFound.kitDelivered ? (
              <Button type="outline" onPress={() => setTicketFound(undefined)}>
                Voltar
              </Button>
            ) : (
              <>
                {!!documentImg ? (
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Image
                      style={{height: 120, width: 120, marginRight: 8}}
                      source={{
                        uri:
                          Platform.OS === 'android'
                            ? 'file://' + documentImg
                            : documentImg,
                      }}
                    />
                    {!!signature && (
                      <View>
                        <Image
                          style={{height: 120, width: 120, marginRight: 8}}
                          source={{
                            uri:
                              Platform.OS === 'android'
                                ? 'data:image/png;base64,' +
                                  signature?.encoded +
                                  ';'
                                : signature.pathName,
                          }}
                        />
                        <Text
                          h5
                          style={{
                            color: THEME.cor.primary,
                            width: '100%',
                            textAlign: 'center',
                          }}>
                          Assinado
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <>
                    <TakePictureModal
                      isVisible={isVisible}
                      cancelPhoto={() => {
                        setIsVisible(false);
                      }}
                      savePhoto={picture => {
                        setIsVisible(false);
                        setDocumentImg(picture);
                      }}
                    />
                    <Button
                      type="outline"
                      onPress={() => {
                        setIsVisible(true);
                      }}>
                      Tire uma foto do documento
                    </Button>
                  </>
                )}
                {!!signature ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        // backgroundColor: THEME.cor.whitesmoke,
                        padding: 8,
                        marginTop: 20,
                      }}>
                      <Button type="outline" onPress={cancel}>
                        Cancelar
                      </Button>
                      <Button
                        containerStyle={{flex: 1}}
                        onPress={RegisterDelivery}
                        loading={isLoading}>
                        Entregar kit
                      </Button>
                    </View>
                  </>
                ) : (
                  !!documentImg && (
                    <>
                      <Text h4 h4Style={{fontSize: 22, marginBottom: 8}}>
                        Pegue a assinatura do proprietário do ingresso
                      </Text>
                      <Button
                        type="outline"
                        onPress={() => {
                          requestSubscription();
                        }}>
                        Assinar
                      </Button>
                    </>
                  )
                )}
                <Signature
                  show={isShow}
                  onNotShow={() => setIsShow(false)}
                  onSigned={data => {
                    setIsShow(false);
                    setSignature(data);
                  }}
                />
              </>
            )}
          </View>
        ) : (
          <Button
            loading={loading || syncronizingTicket}
            onPress={() => {
              setQrcodereader(null);
              setShowQrcodereader(true);
            }}>
            Ler código do ingresso
          </Button>
        )}
      </View>
      {showQrCodeReader && (
        <QrCodeReader
          onRead={handleQRCodeRead}
          onClose={() => setShowQrcodereader(false)}
        />
      )}
      {qrCodeReader && (
        <Text style={{color: 'black'}}>codigo do qr code: {qrCodeReader}</Text>
      )}
    </View>
  );
}

export default KitsDrawerScreen;
