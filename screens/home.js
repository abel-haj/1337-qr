import React, { useState, useEffect, useContext } from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Image,
	Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
// import { QRCode } from 'react-native-custom-qr-codes-expo';
import SvgQRCode from 'react-native-qrcode-svg';
import axios from 'axios';

import Images from '../assets/Images';
import { ScanedContext } from './ScanedContext';
import '../assets/global';
const {width, height} = Dimensions.get('screen');

const Home = ({ navigation, route }, props) => {
	const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sc, setSc] = useContext(ScanedContext);
	const [scanValue, setScanValue] = useState('null');
	const isFocused = useIsFocused();
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [points, setPoints] = useState(0);
	const [conns, setConns] = useState(0);
	const [ID, setID] = useState('null');
	const [intraID, setIntraID] = useState('');
	// const [, set] = useState(0);

  useEffect(() => {
		let timer = 0;
		let myId = null;
	
		SecureStore.getItemAsync('logged').then(logged => {

			if (logged == 'true') {
				
				console.log('TRUE USER');
				// GET DATA
				console.log('ID FIRST IS', ID);
				SecureStore.getItemAsync('id').then(result => {setID(result); setScanValue(result); myId = result; console.log('ID THEN IS', result);});
				console.log('ID FIRST NOW IS', ID);
				SecureStore.getItemAsync('name').then(result => setName(result));
				SecureStore.getItemAsync('image').then(result => setImage(result));
				
				// SecureStore.getItemAsync('points').then(result => setPoints(result));
				// SecureStore.getItemAsync('connections').then(result => setConns(result));
				// SecureStore.getItemAsync('intraid').then(result => setIntraID(result));
				
				loadData(myId);

				timer = setInterval(() => {
					console.log('fire again!', timer);
					loadData(myId);
				}, 5 * 1000);

			} else {
				
				navigation.navigate('Login');
				
			}

		});


		if (isFocused == false) {
			clearInterval(timer);
			console.log('DESTROYED', timer);
		}

		return () => {
			clearInterval(timer);
			console.log('DESTROYED', timer);
		}
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

	const loadData = (id) => {
		if (id && id != undefined && id != null && id != "null") {
			axios.post(host + '/students/fetch/byId/', {"id" :id})
			.then((response) => {
				console.log('PINGER LAUNCHED');

				if (response.data.success == true) {
					setConns(response.data.data.connections);
					SecureStore.setItemAsync('connections', response.data.data.connections.toString());
					console.log('CONS', response.data.data.connections);
					setPoints(response.data.data.points);
					SecureStore.setItemAsync('points', response.data.data.points.toString());
					console.log('POINTS', response.data.data.points);

				} else if (response.data.success == false) {
					Alert.alert(response.data.error, ID);
				}
			})
			.catch((error) => {
				// recursive
				// loadData();
				console.log('LOAD MESSAGES CATCH', error);
			});
		} else
			console.log('WHOOPS', id);
  }

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
						<Image resizeMode='cover' source={{ uri: image }}
							style={{ width: '100%', height: '100%', backgroundColor: 'lightblue', }} />
				</View>
				<Text style={{ marginTop: 5, marginBottom: 7.5, color: '#333', fontSize: 20, }}>{ name }</Text>

				{/* DEBUG BUTTON */}
				{/* <TouchableOpacity
					style={styles.blackButton}
					onPress={() => {
            SecureStore.getItemAsync('id').then(res => console.log('DEBUG', res));
					}}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >DEBUG</Text>
				</TouchableOpacity> */}

				{/* BARCODE */}
				{/* <QRCode
					size={200}
					content={''}
					padding={1.5}
				/> */}
				<View style={{
					marginVertical: 10,
				}}>
					<SvgQRCode
						size={200}
						value={scanValue}
						backgroundColor='#eee'
					/>
				</View>

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
						<Text style={{ color: '#000', fontSize: 35, }}> { conns } </Text>
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
						<Text style={{ color: '#000', fontSize: 35, }}> { points } </Text>
					</View>
				</View>

				{/* SCAN BUTTON */}
				<TouchableOpacity
					style={styles.blackButton}
					onPress={() => {
            setSc(false);
						navigation.navigate('Scan');
					}}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >SCAN QR CODE</Text>
				</TouchableOpacity>

				{/* LOGOUT BUTTON */}
				<TouchableOpacity
					style={styles.blackButton}
					onPress={async () => {
						await SecureStore.deleteItemAsync('logged');
						navigation.navigate('Login');
					}}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >LOGOUT</Text>
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
	blackButton: {
		marginVertical: 7.5,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: '#222',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
});