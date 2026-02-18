import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/Splash.webp')}
                style={styles.background}
                resizeMode='cover'
            >

            </ImageBackground>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        height: "100%",
        width: "100%"
    }
})