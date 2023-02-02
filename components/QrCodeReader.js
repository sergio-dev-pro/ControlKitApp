import {View, StyleSheet} from 'react-native';
import React from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {Text, Icon, Button} from '@rneui/themed';

const QrCodeReader = ({onRead, onClose}) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128],
    {
      checkInverted: true,
    },
  );

  // Alternatively you can use the underlying function:
  //
  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], { checkInverted: true });
  //   runOnJS(setBarcodes)(detectedBarcodes);
  // }, []);

  const hasQRCode = barcodes.length > 0;
  React.useEffect(() => {
    if (hasQRCode) onRead(barcodes[0].displayValue);
  }, [barcodes]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  console.log(barcodes);
  return (
    device != null &&
    hasPermission && (
      <View style={[styles.container, StyleSheet.absoluteFill]}>
        <Camera
          style={[styles.cam, StyleSheet.absoluteFill]}
          device={device}
          isActive
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        <View
          style={{
            flex: 0,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '50%',
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Button
              type="solid"
              size="lg"
              color="warning"
              style={{flex: 0}}
              onPress={onClose}>
              <Icon name="arrowleft" color="white" size={32} type="antdesign" />
              Voltar
            </Button>
            <Icon name="qrcode" color="white" size={56} type="antdesign" />
          </View>
        </View>
      </View>
    )
  );
};

export default QrCodeReader;

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
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
