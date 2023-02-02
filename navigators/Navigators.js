import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import LoginScreen from '../screens/LoginScreen';
import EventSelectionScreen from '../screens/EventSelectionScreen';
import {AuthContext} from '../context/AuthContext';
import KitsDrawerScreen from '../drawerScreens/KitsDrawerScreen';
import EventSelectionDrawerScreen from '../drawerScreens/EventSelectionDrawerScreen';
import ManualRegisterScreen from '../drawerScreens/ManualRegisterScreen';
import ItinerariesScreen from '../drawerScreens/ItinerariesScreen';
import NewTicket from '../drawerScreens/NewTicket';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function Navigators() {
  const {userToken, selectedEventId, events, canCreateTicket} =
    React.useContext(AuthContext);
  const hasOnlyOneEvent = events && events.length === 1;
  return (
    <>
      {userToken && selectedEventId ? (
        <Drawer.Navigator
          initialRouteName="Kits"
          screenOptions={{
            headerShown: false,
            drawerLabelStyle: {
              fontSize: 25,
            },
            drawerContentStyle: {
              marginTop: 16,
            },
          }}>
          <Drawer.Screen name="Kits" component={KitsDrawerScreen} />
          <Drawer.Screen
            name="Cadastro manual"
            component={ManualRegisterScreen}
          />
          <Drawer.Screen name="Itinerários" component={ItinerariesScreen} />
          {!hasOnlyOneEvent && (
            <Drawer.Screen
              name="Mudar evento"
              component={EventSelectionDrawerScreen}
            />
          )}
          {canCreateTicket && (
            <Drawer.Screen name="Novo ingresso" component={NewTicket} />
          )}
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Group screenOptions={{headerShown: false}}>
            {userToken ? (
              <Stack.Screen
                name="Mudar evento"
                component={EventSelectionScreen}
                options={{headerShown: false}}
              />
            ) : (
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />
            )}
          </Stack.Group>
        </Stack.Navigator>
      )}
    </>
  );
}

export default Navigators;
