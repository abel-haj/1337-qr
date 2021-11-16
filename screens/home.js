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
	Modal,
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
  const [modalVisible, setModalVisible] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
  const [sc, setSc] = useContext(ScanedContext);
	const [scanValue, setScanValue] = useState('null');
	const [priority, setPriority] = useState('');
	const [hintText, setHintText] = useState('');
	const [hintType, setHintType] = useState(true);
	const isFocused = useIsFocused();
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [points, setPoints] = useState(0);
	const [conns, setConns] = useState(0);
	const [ID, setID] = useState('null');

  useEffect(() => {
		let timer = 0;
		let myId = null;
	
		SecureStore.getItemAsync('logged').then(logged => {

			if (logged == 'true') {

				console.log('TRUE USER');
				// GET DATA
				SecureStore.getItemAsync('id').then(result => {setID(result); setScanValue(result); myId = result;});
				SecureStore.getItemAsync('name').then(result => setName(result));
				SecureStore.getItemAsync('image').then(result => setImage(result));

				loadScore(myId);

				timer = setInterval(() => {
					console.log('fire again!', timer);
					loadScore(myId);
				}, 5 * 1000 * 2.5);

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

	const loadScore = (id) => {
		if (id && id != undefined && id != null && id != "null") {
			axios.post(host + '/students/fetch/byId/', {"id" :id})
			.then((response) => {
				console.log('PINGER LAUNCHED', response.data);

				if (response.data.success == true) {

					setConns(response.data.data.connections);
					SecureStore.setItemAsync('connections', response.data.data.connections.toString());
					console.log('CONS', response.data.data.connections);

					let total = 0;
					if (response.data.data.team) {

						total = parseInt(response.data.data.points) + parseInt(response.data.data.team.points);
						setPriority(response.data.data.team.priority);
					} else {

						total = response.data.data.points;
					}

					setPoints(total);
					SecureStore.setItemAsync('points', total.toString());
					console.log('POINTS', total);
				} else if (response.data.success == false) {

					Alert.alert(response.data.error, ID);
				}
			})
			.catch((error) => {
				// recursive
				// loadScore();
				console.log('LOAD SCORE CATCH', error);
			});
		} else
			console.log('WHOOPS SCORE', id);
  }

	const loadHint = (p) => {
		// if (p && p != undefined && p != null) {
			axios.post(host + '/huntFlag/getByPriority/', {"priority" :p})
			.then((response) => {

				console.log('PINGER LAUNCHED', response.data);

				if (response.data.success == true) {

					setHintText(response.data.data.next_place);
					let type = response.data.data.next_place.split('.');
					if (type[type.length - 1] == 'jpg') {

						setHintType(false);
					} else
						setHintType(true);
					setModalVisible(true);
				} else if (response.data.success == false) {

					Alert.alert(response.data.error);
				}
			})
			.catch((error) => {
				// recursive
				// loadScore();
				console.log('LOAD HINTS CATCH', error);
			});
		// } else
		// 	console.log('WHOOPS HINT', p);
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
				{/* INFO MODAL */}
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							{
								hintType ?
								<Text style={styles.modalText}>
									{ hintText }
								</Text> : 
								<Image
									resizeMode='contain' source={{ uri:hintText }}
									style={{ width: '100%', height: 200, backgroundColor: 'transparent', }}
								/>
							}
							<TouchableOpacity
								style={[styles.button, styles.buttonClose]}
								onPress={() => setModalVisible(!modalVisible)}>
								<Text style={styles.textStyle}>CLOSE</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

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

				{/* PERSONAL QR */}
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

				{/* ACTION BUTTONS */}
				<View style={{ flexDirection: 'row', }}>
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

					{/* HINT BUTTON */}
					<TouchableOpacity
						style={styles.blackButton}
						onPress={() => {
							loadHint(priority);
							// setModalVisible(!modalVisible);
						}}
						activeOpacity={ 0.7 }
						>
						<Text style={{ color: 'white', fontSize: 20, }} >CURRENT FLAG</Text>
					</TouchableOpacity>
				</View>

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
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#eee',
		position: 'relative',
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
		marginHorizontal: 5,
		paddingVertical: 7.5,
		paddingHorizontal: 10,
		backgroundColor: '#222',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	// modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
		// width: '80%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
		lineHeight: 25,
		fontSize: 17,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#0f0f0f',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});