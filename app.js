// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

export default function App() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    const injectedJavaScript = `
        window.postMessage(JSON.stringify({
            lat: ${location ? location.coords.latitude : 0},
            lon: ${location ? location.coords.longitude : 0}
        }));
    `;

    return (
        <WebView
            source={{ uri: 'https://your-hosted-url.com/map.html' }} // Replace with your hosted HTML file URL
            injectedJavaScript={injectedJavaScript}
            style={styles.webview}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webview: {
        flex: 1,
        width: '100%',
    },
});
