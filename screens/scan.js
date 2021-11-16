import React, { useState, useEffect } from 'react';
import {
	Alert,
	Dimensions,
	Text,
	View,
	StyleSheet,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Camera } from 'expo-camera';
import axios from 'axios';

import '../assets/global';

const Scan = ({ navigation }, props) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);
	const isFocused = useIsFocused();
	
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	useEffect(() => {
		if (isFocused == true)
			setScanned(false);
		if (isFocused == true)
			console.log('CAN SCAN', !scanned);
	}, [isFocused]);

	function delay(time) {
		return new Promise(function(resolve, reject) {
			setTimeout(() => resolve(), time);
		});
	}
	
	const handleBarCodeScanned = async ( scanObj) => {
		console.log('SCANNED!', scanObj.type, scanObj.data);
		let data = {};
		
		await delay(200);
		
		if (scanned == true)
			return;

		console.log('SCANNED 2!', scanObj.type, scanObj.data);
		
		setScanned(true);
		let myId = await SecureStore.getItemAsync('id');

		data.user_id = myId;
		data.value = scanObj.data;

		let response = await axios.post(host + '/student/scan/qrcode/', data)
		// .then(response => {
			console.log('RESPONSE', response.data);
			if (response.data.success == false)
				Alert.alert(response.data.error);
			else if (response.data.success == true)
				Alert.alert(';)');
		// })
		// .catch(err => {
		// 	console.log('EXCEPTION OCURRED', err);
		// 	Alert.alert('An error ocurred!');
		// });

		// console.log('SCAN DATA IS ', data);

		navigation.pop(props.componentId);

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
				<Camera
          style={{
            // flex: 1,
            width: '100%',
						height: '75%',
          }}
          onBarCodeScanned={handleBarCodeScanned}
        >
					{/*<Button title={'Tap to Scan Again'} onPress={() => {
						// alert('something');
						setScanned(false);
						// shouldScan = false;
						// console.log('STATE IS', scanned);
						// console.log('GLoBAL IS', shouldScan);
						setSc(false);
					}} />
					<Button title={'true'} onPress={() => {
						// alert('something');
						setScanned(true);
						// shouldScan = true;
						// console.log('STATE IS', scanned);
						// console.log('GLoBAL IS', shouldScan);
						setSc(true);
					}} /> */}
        </Camera>
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
		justifyContent: 'center',
		// padding: 10,
		// margin: 10,
	},
});