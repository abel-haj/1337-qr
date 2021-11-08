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
// import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';

const {width, height} = Dimensions.get('screen');

const Home = ({ navigation, route }) => {
	const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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

	// if (route.params) {
	// 	if (route.params.barcodeData) {
	// 		console.log('HOME 1', route.params.barcodeData);
	// 	}
	// 	else
	// 		console.log('HOME 2', route.params);
	// 	// alert('found some data! check the log');
	// 	// console.log('HOME', JSON.parse(route.params.barcodeData, null, 2));
	// }

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
					}}
					>
						{/* <Image /> */}
				</View>
				<Text style={{ marginTop: 5, marginBottom: 7.5, color: '#333', fontSize: 20, }}>{ 'John Doe' }</Text>

				{/* BARCODE */}
				<View
					style={{
						width: 200,
						height: 200,
						marginVertical: 7.5,
						backgroundColor: 'grey',
					}}
					>
				</View>

				{/* POINTS */}
				<View
					style={{
						marginVertical: 7.5,
						flexDirection: 'row',
						justifyContent: 'space-between',
						// backgroundColor: 'blue',
					}}
				>
					<View
						style={[styles.points, {
							marginLeft: 10,
							marginRight: 7.5,
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
						}]}
					>
						{/* <Image source={} /> */}
						<Text style={{ color: '#000', fontSize: 15, }}> Connections </Text>
						<Text style={{ color: '#000', fontSize: 35, }}> { '0' } </Text>
					</View>
					<View
						style={[styles.points, {
							marginLeft: 7.5,
							marginRight: 10,
						}]}
					></View>
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