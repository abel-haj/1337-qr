import React, { useState, useEffect, useRef } from 'react';
import {
	Alert,
	Dimensions,
	Text,
	View,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Button,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

const {width, height} = Dimensions.get('screen');
import '../assets/global';

const Scan = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);
	const canScan = useRef(true);
	const isFocused = useIsFocused();
	
	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	// useEffect(() => {
	// 	if (isFocused == true)
	// 		canScan.current = true;
	// 		// setCanScan(true);
	// 	console.log('STATE IS', canScan);
	// }, [isFocused]);

	console.log('STATE IS', scanned);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
	// <SafeAreaView>
	// 	<ScrollView>
			<View style={styles.container}>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={StyleSheet.absoluteFillObject}
				/>
				<Button title={'Tap to Scan Again'} onPress={() => {
					alert('something');
					setScanned(false);
				}} />
				<Button title={'true'} onPress={() => {
					alert('something');
					setScanned(true);
				}} />
			</View>
	// 	</ScrollView>
	// </SafeAreaView>
	)
}

export default Scan;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// flexDirection: 'column',
		// justifyContent: 'center',
		// padding: 10,
		// margin: 10,
	},
});