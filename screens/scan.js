import React, { Component, useState, useEffect } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Button,
} from 'react-native';
// import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const Scan = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
	
	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
  }, []);

	useEffect(() => {
		console.log('focused');
		if (isFocused == true) {
			setScanned(false);
			console.log('turned off');
		}
  }, [isFocused]);

  const handleBarCodeScanned = ({ type, data }) => {
		// console.log('FIRED');
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
		console.log('SCAN', 'type', type, 'data', data);

    navigation.navigate('Home', { barcodeData: data })
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

	return (
	<SafeAreaView>
		<ScrollView>
			<View style={styles.container}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={{
						width: width,
						height: height,
						padding: 20,
						backgroundColor: '#444',
					}}
					/>
			</View>
		</ScrollView>
	</SafeAreaView>
	)
}

export default Scan;

const styles = StyleSheet.create({
  container: {
		flex: 1,
		flexDirection: 'column',
		// padding: 10,
		// margin: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});