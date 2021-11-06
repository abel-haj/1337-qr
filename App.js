import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import HomeScreen from './screens/home';
import ScanScreen from './screens/scan';

const App = () => {
	return (
    <NavigationContainer>
      <Stack.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: true, tabBarVisible: false,}} >
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
	)
}

export default App;