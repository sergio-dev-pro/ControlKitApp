import React, {useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Input, Text} from '@rneui/themed';
import THEME from '../style/theme';
export default function SelectModal({
  label,
  errorMessage,
  value,
  setValue,
  items,
  style,
}) {
  const [isShowingItems, setIsShowingItems] = useState(false);

  const toggleShowingItems = () => setIsShowingItems(prevState => !prevState);

  const toggleShowSelectionModal = () => {
    toggleShowingItems();
  };

  const selectItem = selectedValue => {
    setValue(selectedValue);
    toggleShowSelectionModal();
  };

  return (
    <>
      <View style={[{marginVertical: Platform.OS == 'ios' ? 0 : 8}, style]}>
        <TouchableOpacity
          style={[
            {
              width: '100%',
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
          onPress={() => toggleShowSelectionModal()}>
          <Input
            label={label}
            containerStyle={{width: '93%'}}
            disabled
            value={value ? items.filter(item => item.key == value)[0].value : 'Selecione'}
          />
          <Icon
            name="select1"
            type="antdesign"
            iconStyle={{paddingTop: 16}}
            size={30}
            color={THEME.cor.grey}
          />
        </TouchableOpacity>

        {errorMessage && (
          <Text as="P2" style={{color: 'red'}}>
            {errorMessage}
          </Text>
        )}
      </View>
      <Modal
        isVisible={isShowingItems}
        backdropOpacity={0.1}
        onBackdropPress={() => toggleShowSelectionModal()}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 16,
            height: 'auto',
            maxHeight: '80%',
          }}>
          <FlatList
            data={items}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => selectItem(item.key)}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    paddingVertical: 16,
                    backgroundColor:
                      item.value === value ? 'rgba(240, 240, 240, 0.3)' : '',
                    textAlign: 'center',
                  }}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
