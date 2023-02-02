import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import FaceDetection, {
  FaceDetectorContourMode,
  FaceDetectorLandmarkMode,
} from 'react-native-face-detection';
import Loading from '../../components/Loading';
import {useRegisterState} from './registerContext';
import {Button, Icon} from '@rneui/themed';
import ReactNativeModal from 'react-native-modal';
import THEME from '../../style/theme';
import {useAlert} from '../../context/AlertContext';

async function processFaces(imagePath) {
  const options = {
    landmarkMode: FaceDetectorLandmarkMode.ALL,
    contourMode: FaceDetectorContourMode.ALL,
  };

  const faces = await FaceDetection.processImage(imagePath, options);
  console.log('face results is: ' + JSON.stringify(faces));
  return faces.length;
}

export default function TakePictureScreen() {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState('');
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isInitializedCamera, setIsInitializedCamera] = useState(false);
  const camera = useRef(null);
  const {cancelPhoto, savePhoto, isSavingPhoto} = useRegisterState();
  const setAlertMessage = useAlert();

  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    device && checkCameraPermission();
  }, [device]);

  useEffect(() => {
    console.log('cameraPermissionStatus', cameraPermissionStatus);
    if (cameraPermissionStatus) {
      cameraPermissionStatus !== 'authorized' &&
        Alert.alert(
          '',
          'Precisamos do acesso a camera para finalizar o cadastro.',
          [{text: 'Ok', onPress: askCameraPermission}],
        );
    }
  }, [cameraPermissionStatus]);

  useEffect(() => {
    picture && setIsInitializedCamera(false);
  }, [picture]);

  const toggleLoading = () => setLoading(prevState => !prevState);

  const checkCameraPermission = async () => {
    toggleLoading();
    const cameraPermission = await Camera.getCameraPermissionStatus();
    toggleLoading();
    if (cameraPermission !== 'authorized') return askCameraPermission();
    setCameraPermissionStatus(cameraPermission);
  };

  const askCameraPermission = async () => {
    try {
      toggleLoading();
      const cameraPermission = await Camera.requestCameraPermission();
      console.log('cameraPermission', cameraPermission);
      setCameraPermissionStatus(cameraPermission);
    } catch (error) {
      console.error(error);
    } finally {
      toggleLoading();
    }
  };

  const pictureValidation = async path => {
    if (Platform.OS == 'android') path = 'file://' + path;
    else {
      //todo: check how to work in ios face detectors
      return true;
    }
    console.log('Path saved image=' + path);
    const numberFacesDetected = await processFaces(path);
    if (numberFacesDetected === 0) {
      setAlertMessage(
        'Foto inválida: seu rosto não foi detectado, tente novamente.',
      );
      return false;
    } else if (numberFacesDetected > 1) {
      setAlertMessage(
        'Foto inválida: mais de um rosto detectado, tente novamente.',
      );
      return false;
    }
    return true;
  };

  const takePicture = async () => {
    if (cameraPermissionStatus !== 'authorized') return askCameraPermission();
    setIsTakingPhoto(true);
    try {
      if (Platform.OS === 'android') {
        const snapshot = await camera.current.takeSnapshot({
          quality: 85,
          skipMetadata: true,
        });
        setPicture(snapshot);
        const isValidPicture = await pictureValidation(snapshot.path);
        !isValidPicture && setPicture(null);
        setIsTakingPhoto(false);
      } else {
        const photo = await camera.current.takePhoto({
          flash: 'off',
        });
        setPicture(photo);

        const isValidPicture = await pictureValidation(photo.path);
        !isValidPicture && setPicture(null);
        setIsTakingPhoto(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!device || loading) return <Loading isActive />;

  const picturePath =
    Platform.OS === 'android' ? 'file://' + picture?.path : picture?.path;
  return (
    <ReactNativeModal isVisible>
      <View style={[styles.container, StyleSheet.absoluteFill]}>
        {picture ? (
          <>
            <Image
              style={[styles.cam, StyleSheet.absoluteFill]}
              source={{
                uri: picturePath,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => {
                  setPicture(null);
                  cancelPhoto();
                }}
                type="clear"
                style={[styles.camButton, {width: '40%'}]}>
                Voltar
              </Button>
              <Button
                type="solid"
                loading={isSavingPhoto}
                onPress={() => savePhoto(picturePath)}
                style={[styles.camButton, {width: '40%'}]}>
                Salvar
              </Button>
            </View>
          </>
        ) : (
          <>
            <Camera
              style={[styles.cam, StyleSheet.absoluteFill]}
              device={device}
              ref={camera}
              onInitialized={() => setIsInitializedCamera(true)}
              photo
              isActive
            />
            {isTakingPhoto ? (
              <Loading size="large" />
            ) : (
              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{width: '100%', justifyContent: 'flex-start'}}>
                  <Button
                    onPress={cancelPhoto}
                    type="clear"
                    size="lg"
                    containerStyle={[styles.camButton, {width: 50}]}>
                    <Icon
                      type="antdesign"
                      name="arrowleft"
                      color={THEME.cor.primary}
                      size={40}
                    />
                  </Button>
                </View>
                <Button
                  size="lg"
                  disabled={!isInitializedCamera}
                  onPress={takePicture}
                  style={styles.camButton}>
                  {!isInitializedCamera ? 'Iniciando camera' : 'Tirar foto'}
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
  },
  cam: {
    zIndex: 0,
  },
  camButton: {
    zIndex: 2,
  },
});
