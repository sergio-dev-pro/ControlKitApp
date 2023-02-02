import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {View} from 'react-native';
function CustomDrawer(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props}></DrawerItemList>
    </DrawerContentScrollView>
  );
}

export default CustomDrawer;
