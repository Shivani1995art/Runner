// import { ImageBackground, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// const SplashScreen = () => {
//     return (
//         <View style={styles.container}>
//             <ImageBackground
//                 source={require('../../assets/images/Splash.webp')}
//                 style={styles.background}
//                 resizeMode='cover'
//             >

//             </ImageBackground>
//         </View>
//     )
// }

// export default SplashScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//     background: {
//         height: "100%",
//         width: "100%"
//     }
// })

import { ImageBackground, StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { splashScreenManager } from '../../services/splash/splashScreenManager'

const SplashScreen = () => {
    const [fadeAnim, setFadeAnim] = useState(0)

    // Fade in animation on mount
    useEffect(() => {
        setFadeAnim(1)
    }, [])

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/images/Splash.webp')}
                style={styles.background}
                resizeMode='cover'
            >
                {/* Optional: Loading indicator overlay */}
                <View style={[styles.overlay, { opacity: fadeAnim }]}>
                    {/* You can add loader here if needed */}
                    {/* <ActivityIndicator size="large" color="#FFFFFF" /> */}
                </View>
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
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)' // Optional: subtle dark overlay
    }
})