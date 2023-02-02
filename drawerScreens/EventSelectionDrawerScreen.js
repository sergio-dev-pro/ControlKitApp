import {Text} from '@rneui/themed';
import React, {useContext} from 'react';
import GStyles from '../style/global';
import {Divider, ListItem} from '@rneui/base';
import {FlatList, View} from 'react-native';
import Button from '../components/Button';
import {AuthContext} from '../context/AuthContext';
import Header from '../components/Header';
import Loading from '../components/Loading';
import THEME from '../style/theme';

function EventSelectionDrawerScreen({navigation}) {
  const {
    setSelectedEventId,
    selectedEventId,
    events,
    isSearchingEventSettings,
  } = useContext(AuthContext);
  const handleEventSelection = async eventId => {
    eventId !== selectedEventId && (await setSelectedEventId(eventId));
    navigation.navigate('Kits');
  };

  return (
    <>
      <View style={{...GStyles.view}}>
        <Header
          style={{marginBottom: 0}}
          openDrawer={() => navigation.openDrawer()}
        />
        <View style={{width: '100%', backgroundColor: THEME.cor.whitesmoke}}>
          <Text h3 h3Style={{padding: 8, textAlign: 'center'}}>
            Eventos
          </Text>
          <Divider />
        </View>
        <View style={GStyles.container}>
          <FlatList
            data={events}
            renderItem={({item}) => (
              <ListItem containerStyle={GStyles.maxWidth} key={item.id}>
                <Button
                  onPress={() => handleEventSelection(item.id)}
                  type={selectedEventId === item.id ? 'solid' : 'outline'}
                  size="lg"
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

export default EventSelectionDrawerScreen;
