import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from './screens/auth';
import HomeScreen from './screens/home';
import ScanScreen from './screens/scan';

const App = ({route}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: true, tabBarVisible: false, }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;