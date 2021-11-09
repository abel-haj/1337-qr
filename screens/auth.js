import React, { useState, useEffect } from 'react';
import {
  Linking,
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
	SafeAreaView,
	ScrollView,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	Modal,
	Alert,
	Pressable,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; 
import axios from 'axios';

const { width, height } = Dimensions.get('screen');
import '../assets/global';

const Auth = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
	const [wait, setWait] = useState(false);
	const [pass, setPass] = useState('');
	const isFocused =  useIsFocused();

	// REDIRECT TO HOME IF LOGGED
	useEffect(() => {
		(async () => {
			let result = await SecureStore.getItemAsync(key);
			if (result == 'true') {
				navigation.navigate('Home');
			}
		})();
	}, [isFocused])

/*
_id : 6189c94e4a0aea581a39f729
login : "mel-omar"
name : "Mohamed El Omary"
image_url : "https://cdn.intra.42.fr/users/mel-omar.jpg"
intra_id : 63284
pass : "1ycP6hWcNSM_uEK"
connections : 0
flag_priority : 1
points : 0
coalition : 6189c94e4a0aea581a39f727
*/
	async function log_user() {
		let data = {password: pass};
		console.log('PASSWORD', pass);

		if (pass == "") {
			Alert.alert("Enter password!");
			return;
		}
		
		try {
			setWait(true);
			
			const response = await axios.post(host + 'students/fetch/password/', data);
			// LOG
			console.log('RESULT IS HERE')
			console.log(response);
			
			// LOGIN
			if (response.success == true) {
				console.log('SUCCESS', response);
				await SecureStore.setItemAsync('logged', 'true');
				await SecureStore.setItemAsync('id', response.data._id);
				await SecureStore.setItemAsync('intraid', response.data.intra_id);
				await SecureStore.setItemAsync('login', response.data.login);
				await SecureStore.setItemAsync('name', response.data.name);
				await SecureStore.setItemAsync('image', response.data.image_url);
				await SecureStore.setItemAsync('coalition', response.data.coalition);
				await SecureStore.setItemAsync('connections', response.data.connections);
				await SecureStore.setItemAsync('points', response.data.points);
				
				navigation.navigate('Home');
			} else if (response.success == false) {
				console.log('FALURE', response);
				Alert.alert(response.error)
			}

			// FEEDBACK
			setPass('');
			setWait(false);
		}
		catch(err) {
			console.log('EXCEPTION');
			console.log(err);
		}
		Alert.alert(pass);
	}

	return (
	// <SafeAreaView>
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<View style={styles.container}>
				<View style={styles.centerizedView}>
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
								<Text style={{}}>
									Register first on
								</Text>
								<TouchableOpacity
									onPress={() => {
										Linking.canOpenURL(global.host)
										.then((yes) => {
											if (yes) {
												console.log('OPENING', global.host);
												Linking.openURL(global.host);
											}
											else
												Alert.alert(`Cannot open this url! ${global.host}`);
										});
									}}
								>
									<Text style={[{}, {textDecorationLine: "underline",}]}>here</Text>
								</TouchableOpacity>
								<Text style={styles.modalText}>
									using your intra email to get your password
								</Text>
								<TouchableOpacity
									style={[styles.button, styles.buttonClose]}
									onPress={() => setModalVisible(!modalVisible)}>
									<Text style={styles.textStyle}>CLOSE</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>

					<View style={styles.authBox}>
						<View style={styles.logoBox}>
							<Icon
								color='#fff'
								name='user-circle'
								type='font-awesome-5'
								solid={true}
								size={50}
							/>
						</View>
						<View style={styles.inputBox}>
							<Text style={styles.inputLabel}>Password</Text>
							<TextInput
								style={styles.input}
								autoCapitalize='none'
								secureTextEntry={true}
								textContentType='password'
								selectionColor='grey'
								onChangeText={text => setPass(text)}
							/>
						</View>

						{/* LOGIN BUTTON */}
						<TouchableOpacity style={styles.loginButton}
							onPress={() => {
								!wait && log_user()
								console.log(wait);
							}}
						>
							<Text style={styles.loginButtonText}>Login</Text>
						</TouchableOpacity>

						{/* MODAL BUTTON */}
						<TouchableOpacity
							onLongPress={() => {
								navigation.navigate('Home');
							}}
							onPress={() => {
								setModalVisible(true);
							}}
						>
							<Text style={styles.registerText}>
								How do I get my password?
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	// </SafeAreaView>
	)
}

export default Auth;

const styles = StyleSheet.create({
  // container: {
	// 	flex: 1,
	// 	flexDirection: 'column',
	// 	padding: 10,
	// 	// margin: 10,
  // },
  container: {
    flex: 1,
    position: 'relative',
  },
  centerizedView: {
    width: '100%',
    top: '15%',
  },
  authBox: {
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: '#0f0f0f',
    borderRadius: 1000,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: -50,
    marginBottom: -50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dfe4ea',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#0f0f0f',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },

	// modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
