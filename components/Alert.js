import {Dialog} from '@rneui/themed';
import React from 'react';

function Alert({isVisible, message, onOk, textColor}) {
  return (
    <Dialog isVisible={isVisible} onBackdropPress={onOk}>
      <Dialog.Title
        titleStyle={{fontSize: 24, color: textColor || ''}}
        title={message}
      />
      <Dialog.Actions>
        <Dialog.Button size="lg" onPress={onOk}>
          Ok
        </Dialog.Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default Alert;
