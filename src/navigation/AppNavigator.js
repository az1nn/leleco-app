import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InboxScreen from '../screens/InboxScreen';
import DrawingScreen from '../screens/DrawingScreen';
import AlarmScreen from '../screens/AlarmScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator screenOptions={{ 
      tabBarLabelPosition: 'beside-icon',
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 10 }
    }}>
      <Tab.Screen name="Triagem" component={InboxScreen} />
      <Tab.Screen name="Rabiscos" component={DrawingScreen} />
      <Tab.Screen name="Alarmes" component={AlarmScreen} />
    </Tab.Navigator>
  );
}
