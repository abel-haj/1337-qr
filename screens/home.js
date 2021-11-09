import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Image,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 
import axios from 'axios';
// import QRCode from 'react-native-qrcode-svg';
import { QRCode } from 'react-native-custom-qr-codes-expo';

import Images from '../assets/Images';
const {width, height} = Dimensions.get('screen');

const Home = ({ navigation, route }) => {
	const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
	const isFocused = useIsFocused();
	const name = '';
	const image = '';

  useEffect(() => {
		(async () => {
			let logged = await SecureStore.getItemAsync('logged');
			if (logged == 'true') {
				// GET DATA
				name = await SecureStore.getItemAsync('name');
				image = await SecureStore.getItemAsync('image');
			} else {
				// LOG SCREEN
				// navigation.navigate('Login');
			}
		})();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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
				{/* PROFILE */}
				<View
					style={{
						width: 100,
						height: 100,
						marginTop: 7.5,
						marginBottom: 5,
						backgroundColor: 'grey',
						borderRadius: 200,
						overflow: 'hidden',
					}}
					>
						<Image resizeMode='contain' source={{}}
							style={{ width: '100%', height: '100%', backgroundColor: 'lightblue', }} />
				</View>
				<Text style={{ marginTop: 5, marginBottom: 7.5, color: '#333', fontSize: 20, }}>{ name }</Text>

				{/* BARCODE */}
				<QRCode
					size={200}
					content='{id: "striasdfasdfasdfasdfng"}'
					padding={1.5}
				// <View
					// style={{
					// 	width: 500,
					// 	height: 500,
					// }}
				// >
					// <Image style={{ width: '100%', height: '100%', }}
						// resizeMode='contain' source={ Images.qr_placeholder_png }/>
				// </View>
				/>

				{/* POINTS */}
				<View
					style={{
						marginVertical: 7.5,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<View
						style={[styles.points, {
							marginLeft: 10,
							marginRight: 7.5,
						}]}
					>
						<Image style={{ width: '50%', height: '50%', }}
							resizeMode='contain' source={ Images.connections_png } />
						<Text style={{ color: '#000', fontSize: 15, }}> Connections </Text>
						<Text style={{ color: '#000', fontSize: 35, }}> { '0' } </Text>
					</View>

					<View
						style={[styles.points, {
							marginLeft: 7.5,
							marginRight: 10,
						}]}
					>
						<Image style={{ width: '50%', height: '50%', }}
							resizeMode='contain' source={ Images.points_png } />
						<Text style={{ color: '#000', fontSize: 15, }}> Points </Text>
						<Text style={{ color: '#000', fontSize: 35, }}> { '0' } </Text>
					</View>
				</View>

				{/* SCAN BUTTON */}
				<TouchableOpacity
					style={{
						marginVertical: 7.5,
						paddingVertical: 10,
						paddingHorizontal: 20,
						backgroundColor: '#222',
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onPress={() => {
						navigation.navigate('Scan');
					}}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >SCAN QR CODE</Text>
				</TouchableOpacity>

				{/* LOGOUT BUTTON */}
				<TouchableOpacity
					style={{
						marginVertical: 7.5,
						paddingVertical: 10,
						paddingHorizontal: 20,
						backgroundColor: '#222',
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onPress={() => {
						SecureStore.deleteItemAsync('logged');
						navigation.navigate('Login');
					}}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >SCAN QR CODE</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	</SafeAreaView>
	)
}

export default Home;

const styles = StyleSheet.create({
  container: {
		flex: 1,
		flexDirection: 'column',
		padding: 10,
		// margin: 10,
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
  },
	points: {
		width: width / 2 - 17.5,
		height: width / 2 - 17.5,
		paddingTop: 5,
		marginHorizontal: 10,
		borderRadius: 5,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',

		shadowColor: "#000", elevation: 4,
		shadowOffset: { width: 0, height: 2, },
		shadowOpacity: 0.23, shadowRadius: 2.62,
	},
});