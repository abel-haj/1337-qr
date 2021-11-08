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
} from 'react-native';
import { config } from '../config'

const { width, height } = Dimensions.get('screen');

const Auth = ({ navigation, route }) => {
  const [userData, setUserData] = useState({});
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const urlEvent = Linking.addEventListener("url", handleOpenUrl);
    Linking.getInitialURL().then(url => {
      if (url) handleRedirectUri(url);
    });
    return () => urlEvent.remove();
  }, []);

  const handleOpenUrl = (url) => {
    handleRedirectUri(url);
  }

  const handleRedirectUri = (urlString) => {
    const url = new URL(urlString, true);
    const { code } = url.query;

    console.log("App url: " + url);
    if (!code) return;

    return fetch(config.apiAuthorizationUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    }).then((resp) => resp.json())
      .then(({ access_token, data }) => {
        setAccessToken(access_token);
        setUserData(data);
      })
      .catch(err => {
        console.warn("Something went wrong", err);
      });
  }

  const openAuthSessionAsync = async () => {
    Linking.openURL(config.apiAuthenticationUrl);
  }

	return (
	<SafeAreaView>
		<ScrollView>
			<View style={styles.container}>
				{/* SCAN BUTTON */}
				<TouchableOpacity
					style={{
						marginVertical: 10,
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
					<Text style={{ color: 'white', fontSize: 20, }}>LOGIN</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						marginVertical: 10,
						paddingVertical: 10,
						paddingHorizontal: 20,
						backgroundColor: '#222',
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}
					onPress={
						navigation.navigate('Home')
					}
					activeOpacity={ 0.7 }
				>
					<Text style={{ color: 'white', fontSize: 20, }}>HOME</Text>
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
