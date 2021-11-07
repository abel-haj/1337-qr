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
	Image,
} from 'react-native';
import { WebBrowser } from 'expo';
// import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import OAuthManager from 'react-native-oauth';

const {width, height} = Dimensions.get('screen');

const Auth = ({ navigation, route }) => {

  useEffect(() => {
  }, []);

	openAuthSessionAsync = async () => {
    // const redirect = await Linking.getInitialURL('/');
    // const result = await WebBrowser.openAuthSessionAsync(
    //   `https://api.intra.42.fr/oauth/authorize?client_id=a4a8147ef5789c8e043553950ae9927beb1d50d5f2186f1ce774448ad631fb18&redirect_uri=exp%3A%2F%2Fgx-jb9.anonymous.schoolqr.exp.direct&response_type=code`
		// );
		// //Now if the user authorized the app result will store the code you can perform the handshake with to get an access token for that user. I have a simple check to see if the user already exists in my backend and then send info to the store with a helper function
		// console.log('REDIRECT', redirect);
		// console.log('RESULT', result);

		const manager = new OAuthManager('firestackexample');
		console.log('HERE ', manager);

		manager.addProvider({
			'intra42': {
				auth_version: '2.0',
				authorize_url: 'https://api.intra.42.fr/oauth/authorize',
				access_token_url: 'https://api.intra.42.fr/oauth/token',
				callback_url: ({app_name}) => `${app_name}://oauth`,
			}
		});

		manager.authorize('intra42', {scopes: 'public'})
			.then(resp => console.log(resp))
			.catch(err => console.log('There was an error', err));
	}

	return (
	<SafeAreaView>
		<ScrollView>
			<View style={styles.container}>
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
					onPress={
						openAuthSessionAsync
						// navigation.navigate('Scan');
					}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }} >LOGIN</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	</SafeAreaView>
	)
}

export default Auth;

const styles = StyleSheet.create({
  container: {
		flex: 1,
		flexDirection: 'column',
		padding: 10,
		// margin: 10,
		// justifyContent: 'center',
		alignItems: 'center',
  },
	points: {
		width: width / 2 - 17.5,
		height: width / 2 - 17.5,
		marginHorizontal: 10,
		borderRadius: 5,
		alignItems: 'center',
		backgroundColor: '#fff',

		shadowColor: "#000", elevation: 4,
		shadowOffset: { width: 0, height: 2, },
		shadowOpacity: 0.23, shadowRadius: 2.62,
	},
});