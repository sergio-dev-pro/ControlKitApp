import {ListItem} from '@rneui/base';
import {Text} from '@rneui/themed';
import React, {useContext} from 'react';
import {FlatList, View} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import Button from '../components/Button';
import Loading from '../components/Loading';
import {AuthContext} from '../context/AuthContext';
import GStyles from '../style/global';

function EventSelectionScreen() {
  const {setSelectedEventId, events, isSearchingEventSettings} =
    useContext(AuthContext);
  const handleEventSelection = async eventId => {
    setSelectedEventId(eventId);
  };

  return (
    <>
      <View style={GStyles.view}>
        <AuthHeader />
        <View style={GStyles.container}>
          <Text h3 h3Style={{textAlign: 'center'}}>
            Selecione o evento
          </Text>
          <FlatList
            data={events}
            renderItem={({item}) => (
              <ListItem containerStyle={GStyles.maxWidth} key={item.id}>
                <Button
                  onPress={() => handleEventSelection(item.id)}
                  size="lg"
                  type="outline"
                  containerStyle={{width: '100%'}}
                  titleStyle={{fontWeight: 'bold', fontSize: 20}}>
                  {item.name}
                </Button>
              </ListItem>
            )}
          />
        </View>
      </View>
      <Loading isActive={isSearchingEventSettings} />
    </>
  );
}

export default EventSelectionScreen;
