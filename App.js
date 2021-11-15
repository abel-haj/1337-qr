import React, { useState } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ScanedContext } from './screens/ScanedContext';
const Stack = createNativeStackNavigator();

import LoginScreen from './screens/auth';
import HomeScreen from './screens/home';
import ScanScreen from './screens/scan';

const App = ({route}) => {
  const [sc, setSc] = useState(false);

  return (
    <ScanedContext.Provider value={[sc, setSc]}>
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
    </ScanedContext.Provider>
  );
}

export default App;